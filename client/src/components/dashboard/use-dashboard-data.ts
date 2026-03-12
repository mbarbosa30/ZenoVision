import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Project, MetricsSnapshot } from "@/lib/types";
import type { GrowthTimeframe } from "./data-utils";
import { processHistoricalSnapshots, calculateGrowthRates } from "./data-utils";

const APP_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444'];

export function useDashboardData() {
  const queryClient = useQueryClient();
  const [fetching, setFetching] = useState(false);
  const [fetchProgress, setFetchProgress] = useState<Record<string, 'pending' | 'fetching' | 'done' | 'error'>>({});
  const [expandedApps, setExpandedApps] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [growthTimeframe, setGrowthTimeframe] = useState<GrowthTimeframe>('daily');
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [trendRange, setTrendRange] = useState<'7d' | '30d' | 'all'>('7d');

  const { data: projectsData } = useQuery<{ success: boolean; projects: Project[] }>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const { data: latestMetrics, isLoading: metricsLoading } = useQuery<{ success: boolean; snapshots: MetricsSnapshot[] }>({
    queryKey: ["/api/metrics/latest"],
    queryFn: async () => {
      const res = await fetch("/api/metrics/latest");
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return res.json();
    },
  });

  const { data: historicalMetrics } = useQuery<{ success: boolean; snapshots: MetricsSnapshot[] }>({
    queryKey: ["/api/metrics/history"],
    queryFn: async () => {
      const res = await fetch("/api/metrics/history?limit=30", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    },
  });

  const allProjects = projectsData?.projects || [];
  const connectedProjects = allProjects.filter(p => p.metricsEndpoint);
  const projects = connectedProjects;
  const snapshots = (latestMetrics?.snapshots || []).filter(s =>
    connectedProjects.some(p => p.id === s.projectId)
  );

  useEffect(() => {
    if (latestMetrics?.success && !initialLoadDone) {
      setLastRefreshTime(new Date());
      setInitialLoadDone(true);
    }
  }, [latestMetrics?.success, initialLoadDone]);

  const historicalSnapshots = historicalMetrics?.snapshots || [];

  const metricVisibility = useMemo(() => {
    if (projects.length === 0) {
      return { users: true, engagement: true, revenue: true, onchain: true };
    }
    return {
      users: projects.some(p => p.showUsersMetrics !== false),
      engagement: projects.some(p => p.showEngagementMetrics !== false),
      revenue: projects.some(p => p.showRevenueMetrics !== false),
      onchain: projects.some(p => p.showOnchainMetrics !== false),
    };
  }, [projects]);

  const fetchAllMetrics = async () => {
    const appsToFetch = connectedProjects.filter(p => p.metricsEndpoint);
    if (appsToFetch.length === 0) return;

    setFetching(true);
    const progress: Record<string, 'pending' | 'fetching' | 'done' | 'error'> = {};
    appsToFetch.forEach(p => { progress[p.id] = 'pending'; });
    setFetchProgress({ ...progress });

    try {
      for (const project of appsToFetch) {
        progress[project.id] = 'fetching';
        setFetchProgress({ ...progress });
        try {
          const res = await fetch(`/api/metrics/fetch/${project.id}`, { method: "POST", credentials: "include" });
          const result = await res.json();
          progress[project.id] = result.success ? 'done' : 'error';
        } catch {
          progress[project.id] = 'error';
        }
        setFetchProgress({ ...progress });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/metrics/latest"] });
      queryClient.invalidateQueries({ queryKey: ["/api/metrics/history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setLastRefreshTime(new Date());
    } finally {
      setFetching(false);
      setTimeout(() => setFetchProgress({}), 3000);
    }
  };

  const aggregatedStats = useMemo(() => {
    if (snapshots.length === 0) {
      return {
        totalUsers: 0, dau: 0, wau: 0, mau: 0, payingUsers: 0,
        totalRevenue: 0, totalPayments: 0, totalTransactions: 0, totalVolume: 0,
        keyActions: 0, sessions: 0, connectedApps: 0,
      };
    }

    const stats = snapshots.reduce((acc, s) => ({
      totalUsers: acc.totalUsers + s.metrics.users.total,
      dau: acc.dau + s.metrics.users.daily_active,
      wau: acc.wau + s.metrics.users.weekly_active,
      mau: acc.mau + s.metrics.users.monthly_active,
      payingUsers: acc.payingUsers + s.metrics.users.paying,
      totalRevenue: acc.totalRevenue + s.metrics.revenue.net_income,
      totalPayments: acc.totalPayments + s.metrics.revenue.total_payments,
      totalTransactions: acc.totalTransactions + s.metrics.onchain.transactions,
      totalVolume: acc.totalVolume + s.metrics.onchain.volume,
      keyActions: acc.keyActions + s.metrics.engagement.key_actions,
      sessions: acc.sessions + s.metrics.engagement.sessions_today,
    }), {
      totalUsers: 0, dau: 0, wau: 0, mau: 0, payingUsers: 0,
      totalRevenue: 0, totalPayments: 0, totalTransactions: 0, totalVolume: 0,
      keyActions: 0, sessions: 0,
    });

    return { ...stats, connectedApps: snapshots.length };
  }, [snapshots]);

  const historicalData = useMemo(() =>
    processHistoricalSnapshots(historicalSnapshots, projects),
    [historicalSnapshots, projects]
  );

  const appComparisonData = useMemo(() => {
    if (snapshots.length === 0) return [];

    return snapshots.map(s => {
      const project = projects.find(p => p.id === s.projectId);
      return {
        name: project?.name.split('.')[0] || 'Unknown',
        DAU: s.metrics.users.daily_active,
        WAU: s.metrics.users.weekly_active,
        MAU: s.metrics.users.monthly_active,
        Revenue: s.metrics.revenue.net_income,
        Transfers: s.metrics.onchain.transactions,
        Volume: s.metrics.onchain.volume,
        KeyActions: s.metrics.engagement.key_actions,
        Sessions: s.metrics.engagement.sessions_today,
      };
    });
  }, [snapshots, projects]);

  const radarData = useMemo(() => {
    if (snapshots.length === 0) return [];

    const maxValues = snapshots.reduce((acc, s) => ({
      DAU: Math.max(acc.DAU, s.metrics.users.daily_active || 1),
      WAU: Math.max(acc.WAU, s.metrics.users.weekly_active || 1),
      MAU: Math.max(acc.MAU, s.metrics.users.monthly_active || 1),
      Revenue: Math.max(acc.Revenue, s.metrics.revenue.net_income || 1),
      Transfers: Math.max(acc.Transfers, s.metrics.onchain.transactions || 1),
      Volume: Math.max(acc.Volume, s.metrics.onchain.volume || 1),
    }), { DAU: 1, WAU: 1, MAU: 1, Revenue: 1, Transfers: 1, Volume: 1 });

    return ['DAU', 'WAU', 'MAU', 'Revenue', 'Transfers', 'Volume'].map(metric => {
      const result: any = { metric };
      snapshots.forEach(s => {
        const project = projects.find(p => p.id === s.projectId);
        const name = project?.name.split('.')[0] || 'Unknown';
        const value = metric === 'DAU' ? s.metrics.users.daily_active :
                      metric === 'WAU' ? s.metrics.users.weekly_active :
                      metric === 'MAU' ? s.metrics.users.monthly_active :
                      metric === 'Revenue' ? s.metrics.revenue.net_income :
                      metric === 'Transfers' ? s.metrics.onchain.transactions :
                      s.metrics.onchain.volume;
        result[name] = Math.round((value / (maxValues as any)[metric]) * 100);
      });
      return result;
    });
  }, [snapshots, projects]);

  const perAppTimeSeries = useMemo(() => {
    if (historicalData.length === 0 || projects.length === 0) return { data: historicalData, apps: [], hasPerAppData: false };

    const appKeys = new Set<string>();
    historicalData.forEach(point => {
      Object.keys(point).forEach(key => {
        if (key.endsWith('_DAU')) {
          appKeys.add(key.replace('_DAU', ''));
        }
      });
    });

    const apps = Array.from(appKeys).map(key => {
      const project = projects.find(p => p.id.slice(0, 8) === key);
      return {
        key,
        name: project?.name.split('.')[0] || key,
        dauKey: `${key}_DAU`,
        mauKey: `${key}_MAU`,
        revenueKey: `${key}_Revenue`,
        payingKey: `${key}_Paying`,
        txnsKey: `${key}_Txns`,
        volumeKey: `${key}_Volume`,
        showUsers: project?.showUsersMetrics !== false,
        showEngagement: project?.showEngagementMetrics !== false,
        showRevenue: project?.showRevenueMetrics !== false,
        showOnchain: project?.showOnchainMetrics !== false,
      };
    }).filter(app => app.name !== app.key || appKeys.size > 0);

    return { data: historicalData, apps, hasPerAppData: apps.length > 0 };
  }, [historicalData, projects]);

  const appColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    const sortedProjects = [...projects].sort((a, b) => a.name.localeCompare(b.name));
    sortedProjects.forEach((p, i) => {
      const key = p.id.slice(0, 8);
      map[key] = p.chartColor || APP_COLORS[i % APP_COLORS.length];
    });
    return map;
  }, [projects]);

  const estimatedDailyRevenueData = useMemo(() => {
    if (historicalData.length < 2 || !perAppTimeSeries.hasPerAppData) {
      return { data: [], apps: [], hasData: false };
    }

    const first = historicalData[0];
    const rateData: any[] = [];
    const appsWithData = new Set<string>();

    for (let i = 1; i < historicalData.length; i++) {
      const curr = historicalData[i];
      const hoursFromStart = (curr.timestamp - first.timestamp) / (1000 * 60 * 60);

      if (hoursFromStart < 1) continue;

      const point: any = { timestamp: curr.timestamp };

      for (const app of perAppTimeSeries.apps) {
        const firstRev = first[app.revenueKey] ?? 0;
        const currRev = curr[app.revenueKey] ?? 0;

        if (firstRev < 0 || currRev < 0) continue;

        const revChange = currRev - firstRev;
        const dailyRate = (revChange / hoursFromStart) * 24;

        point[`${app.key}_DailyRate`] = Math.max(0, dailyRate);
        appsWithData.add(app.key);
      }

      const firstTotal = first.totalRevenue ?? 0;
      const currTotal = curr.totalRevenue ?? 0;
      if (firstTotal >= 0 && currTotal >= 0 && hoursFromStart > 0) {
        const totalChange = currTotal - firstTotal;
        point.totalDailyRate = Math.max(0, (totalChange / hoursFromStart) * 24);
      }

      if (Object.keys(point).length > 1) {
        rateData.push(point);
      }
    }

    const validApps = perAppTimeSeries.apps.filter(app => appsWithData.has(app.key));

    return {
      data: rateData,
      apps: validApps,
      hasData: rateData.length > 0 && validApps.length > 0
    };
  }, [historicalData, perAppTimeSeries]);

  const estimatedDailyActivityData = useMemo(() => {
    if (historicalData.length < 2) return [];

    const first = historicalData[0];
    const result: any[] = [];

    for (let i = 1; i < historicalData.length; i++) {
      const curr = historicalData[i];
      const hoursFromStart = (curr.timestamp - first.timestamp) / (1000 * 60 * 60);

      if (hoursFromStart < 1) continue;

      const txChange = (curr.totalTransactions ?? 0) - (first.totalTransactions ?? 0);
      const volChange = (curr.totalVolume ?? 0) - (first.totalVolume ?? 0);

      result.push({
        timestamp: curr.timestamp,
        dailyTransactions: Math.max(0, (txChange / hoursFromStart) * 24),
        dailyVolume: Math.max(0, (volChange / hoursFromStart) * 24),
        totalPaying: curr.totalPaying ?? 0,
      });
    }

    return result;
  }, [historicalData]);

  const trendCutoff = useMemo(() => {
    if (trendRange === 'all') return 0;
    const days = trendRange === '7d' ? 7 : 30;
    return Date.now() - days * 24 * 60 * 60 * 1000;
  }, [trendRange]);

  const filteredTrendData = useMemo(() => perAppTimeSeries.data.filter(d => d.timestamp >= trendCutoff), [perAppTimeSeries.data, trendCutoff]);
  const filteredRevenueRateData = useMemo(() => estimatedDailyRevenueData.data.filter(d => d.timestamp >= trendCutoff), [estimatedDailyRevenueData.data, trendCutoff]);
  const filteredActivityData = useMemo(() => estimatedDailyActivityData.filter(d => d.timestamp >= trendCutoff), [estimatedDailyActivityData, trendCutoff]);

  const dailyPayersEstimate = useMemo(() => {
    if (historicalData.length < 2) {
      return { value: 0, hasData: false, isEstimate: true };
    }

    const now = historicalData[historicalData.length - 1].timestamp;
    const windowStart = now - (24 * 60 * 60 * 1000);
    const pointsInWindow = historicalData.filter(
      h => h.timestamp >= windowStart && h.timestamp <= now
    );

    if (pointsInWindow.length < 2) {
      const first = historicalData[0];
      const last = historicalData[historicalData.length - 1];
      const hoursElapsed = (last.timestamp - first.timestamp) / (1000 * 60 * 60);

      if (hoursElapsed <= 0) {
        return { value: 0, hasData: false, isEstimate: true };
      }

      const payersChange = (last.totalPaying ?? 0) - (first.totalPaying ?? 0);
      const dailyPayers = Math.max(0, (payersChange / hoursElapsed) * 24);
      return { value: Math.round(dailyPayers), hasData: true, isEstimate: true };
    }

    const first = pointsInWindow[0];
    const last = pointsInWindow[pointsInWindow.length - 1];
    const hoursElapsed = (last.timestamp - first.timestamp) / (1000 * 60 * 60);

    if (hoursElapsed <= 0) {
      return { value: 0, hasData: false, isEstimate: true };
    }

    const payersChange = (last.totalPaying ?? 0) - (first.totalPaying ?? 0);
    const dailyPayers = Math.max(0, (payersChange / hoursElapsed) * 24);
    const has24hData = hoursElapsed >= 20;

    return {
      value: Math.round(dailyPayers),
      hasData: true,
      isEstimate: !has24hData
    };
  }, [historicalData]);

  const financialMetrics = useMemo(() => {
    const stats = aggregatedStats;
    const historical = historicalData;

    const mrr = stats.totalRevenue;
    const arr = mrr * 12;

    const arpu = stats.payingUsers > 0 ? stats.totalRevenue / stats.payingUsers : 0;
    const arpuAll = stats.totalUsers > 0 ? stats.totalRevenue / stats.totalUsers : 0;

    const conversionRate = stats.totalUsers > 0 ? (stats.payingUsers / stats.totalUsers) * 100 : 0;

    const stickiness = stats.mau > 0 ? (stats.dau / stats.mau) * 100 : 0;

    const avgLifetimeMonths = Math.max(6, Math.min(24, 12 * (1 + stickiness / 100)));
    const ltv = arpu * avgLifetimeMonths;

    const estimatedCac = arpu * 3;
    const ltvCacRatio = estimatedCac > 0 ? ltv / estimatedCac : 0;
    const paybackMonths = arpu > 0 ? estimatedCac / arpu : 0;

    const timeWeightedGrowth = calculateGrowthRates(historical, growthTimeframe);
    const {
      userGrowthRate, dauGrowthRate, wauGrowthRate, mauGrowthRate, payingGrowthRate,
      revenueGrowthRate, paymentsGrowthRate, txGrowthRate, volumeGrowthRate,
      actionsGrowthRate, sessionsGrowthRate, hoursElapsed, daysElapsed,
      dataPoints
    } = timeWeightedGrowth;

    const monthlyGrowthRate = growthTimeframe === 'daily'
      ? (revenueGrowthRate / 100) * 30
      : growthTimeframe === 'weekly'
        ? (revenueGrowthRate / 100) * (30/7)
        : revenueGrowthRate / 100;

    const revenuePerUser = stats.totalUsers > 0 ? stats.totalRevenue / stats.totalUsers : 0;
    const transactionsPerUser = stats.totalUsers > 0 ? stats.totalTransactions / stats.totalUsers : 0;
    const engagementPerUser = stats.totalUsers > 0 ? stats.keyActions / stats.totalUsers : 0;

    const monthlyRevenueGrowth = growthTimeframe === 'daily'
      ? revenueGrowthRate * 30
      : growthTimeframe === 'weekly'
        ? revenueGrowthRate * (30/7)
        : revenueGrowthRate;
    const nrr = Math.max(50, Math.min(200, 100 + monthlyRevenueGrowth));

    const annualizedVolume = stats.totalVolume * 12;
    const annualizedRevenue = arr;

    const web3Valuation = {
      revenueMultiple: {
        low: annualizedRevenue * 10,
        mid: annualizedRevenue * 25,
        high: annualizedRevenue * 50,
      },
      volumeMultiple: {
        low: annualizedVolume * 0.01,
        mid: annualizedVolume * 0.05,
        high: annualizedVolume * 0.1,
      },
      dauBased: {
        low: stats.dau * 50,
        mid: stats.dau * 150,
        high: stats.dau * 300,
      },
      mauBased: {
        low: stats.mau * 10,
        mid: stats.mau * 30,
        high: stats.mau * 75,
      },
      walletBased: {
        low: stats.payingUsers * 100,
        mid: stats.payingUsers * 500,
        high: stats.payingUsers * 1500,
      },
    };

    const valuationWeights = {
      revenue: stats.totalRevenue > 0 ? 1.0 : 0.1,
      volume: stats.totalVolume > 0 ? 1.0 : 0.1,
      dau: stats.dau > 100 ? 1.0 : (stats.dau > 0 ? 0.5 : 0.1),
      mau: stats.mau > 100 ? 1.0 : (stats.mau > 0 ? 0.5 : 0.1),
      wallet: stats.payingUsers > 10 ? 1.0 : (stats.payingUsers > 0 ? 0.5 : 0.1),
    };

    const totalWeight = Object.values(valuationWeights).reduce((a, b) => a + b, 0);

    const blendedValuation = {
      low: Math.round(
        (web3Valuation.revenueMultiple.low * valuationWeights.revenue +
         web3Valuation.volumeMultiple.low * valuationWeights.volume +
         web3Valuation.dauBased.low * valuationWeights.dau +
         web3Valuation.mauBased.low * valuationWeights.mau +
         web3Valuation.walletBased.low * valuationWeights.wallet) / totalWeight
      ),
      mid: Math.round(
        (web3Valuation.revenueMultiple.mid * valuationWeights.revenue +
         web3Valuation.volumeMultiple.mid * valuationWeights.volume +
         web3Valuation.dauBased.mid * valuationWeights.dau +
         web3Valuation.mauBased.mid * valuationWeights.mau +
         web3Valuation.walletBased.mid * valuationWeights.wallet) / totalWeight
      ),
      high: Math.round(
        (web3Valuation.revenueMultiple.high * valuationWeights.revenue +
         web3Valuation.volumeMultiple.high * valuationWeights.volume +
         web3Valuation.dauBased.high * valuationWeights.dau +
         web3Valuation.mauBased.high * valuationWeights.mau +
         web3Valuation.walletBased.high * valuationWeights.wallet) / totalWeight
      ),
    };

    const arppu = stats.payingUsers > 0 ? stats.totalRevenue / stats.payingUsers : 0;
    const revenuePerTx = stats.totalTransactions > 0 ? stats.totalRevenue / stats.totalTransactions : 0;
    const avgTxSize = stats.totalTransactions > 0 ? stats.totalVolume / stats.totalTransactions : 0;

    const dauWauRatio = stats.wau > 0 ? (stats.dau / stats.wau) * 100 : 0;
    const wauMauRatio = stats.mau > 0 ? (stats.wau / stats.mau) * 100 : 0;
    const payingMauRatio = stats.mau > 0 ? (stats.payingUsers / stats.mau) * 100 : 0;

    const actionsPerSession = stats.sessions > 0 ? stats.keyActions / stats.sessions : 0;
    const actionsPerDAU = stats.dau > 0 ? stats.keyActions / stats.dau : 0;
    const sessionsPerDAU = stats.dau > 0 ? stats.sessions / stats.dau : 0;

    const txPerUser = stats.totalUsers > 0 ? stats.totalTransactions / stats.totalUsers : 0;
    const volumePerTx = stats.totalTransactions > 0 ? stats.totalVolume / stats.totalTransactions : 0;
    const volumePerActiveUser = stats.dau > 0 ? stats.totalVolume / stats.dau : 0;

    const mauToTotal = stats.totalUsers > 0 ? (stats.mau / stats.totalUsers) * 100 : 0;
    const wauToMau = stats.mau > 0 ? (stats.wau / stats.mau) * 100 : 0;
    const dauToWau = stats.wau > 0 ? (stats.dau / stats.wau) * 100 : 0;
    const payingToDau = stats.dau > 0 ? (stats.payingUsers / stats.dau) * 100 : 0;

    return {
      mrr, arr,
      arpu, arpuAll, arppu,
      conversionRate,
      stickiness,
      ltv, estimatedCac, ltvCacRatio, paybackMonths,
      userGrowthRate, dauGrowthRate, wauGrowthRate, mauGrowthRate, payingGrowthRate,
      revenueGrowthRate, paymentsGrowthRate, txGrowthRate, volumeGrowthRate,
      actionsGrowthRate, sessionsGrowthRate,
      web3Valuation,
      blendedValuation,
      valuationWeights,
      revenuePerUser, transactionsPerUser, engagementPerUser,
      revenuePerTx, avgTxSize,
      dauWauRatio, wauMauRatio, payingMauRatio,
      actionsPerSession, actionsPerDAU, sessionsPerDAU,
      txPerUser, volumePerTx, volumePerActiveUser,
      mauToTotal, wauToMau, dauToWau, payingToDau,
      nrr,
      monthlyGrowthRate,
      annualizedVolume,
      hoursElapsed: hoursElapsed || 0,
      daysElapsed: daysElapsed || 0,
      dataPoints: dataPoints || 0,
      confidence: timeWeightedGrowth.confidence,
      confidenceReason: timeWeightedGrowth.confidenceReason,
      timeframeCoverage: timeWeightedGrowth.timeframeCoverage,
    };
  }, [aggregatedStats, historicalData, growthTimeframe]);

  const projections = useMemo(() => {
    const current = aggregatedStats;
    const decayFactor = 0.85;

    const toMonthlyRate = (rate: number): number => {
      if (growthTimeframe === 'daily') return (rate * 30) / 100;
      if (growthTimeframe === 'weekly') return (rate * (30 / 7)) / 100;
      return rate / 100;
    };

    const clampRate = (rate: number): number => Math.max(-0.5, Math.min(1.0, rate));

    const userMonthlyRate = clampRate(toMonthlyRate(financialMetrics.mauGrowthRate));
    const revenueMonthlyRate = clampRate(toMonthlyRate(financialMetrics.revenueGrowthRate));
    const txMonthlyRate = clampRate(toMonthlyRate(financialMetrics.txGrowthRate));

    const projectWithDecay = (current: number, monthlyRate: number, months: number, decay: number = decayFactor): number => {
      let value = current;
      for (let m = 0; m < months; m++) {
        const effectiveRate = monthlyRate * Math.pow(decay, m);
        value *= (1 + effectiveRate);
      }
      return Math.round(value);
    };

    return {
      day30: {
        users: projectWithDecay(current.mau, userMonthlyRate, 1),
        revenue: projectWithDecay(current.totalRevenue, revenueMonthlyRate, 1),
        transactions: projectWithDecay(current.totalTransactions, txMonthlyRate, 1),
        arr: projectWithDecay(financialMetrics.arr, revenueMonthlyRate, 1),
      },
      day60: {
        users: projectWithDecay(current.mau, userMonthlyRate, 2),
        revenue: projectWithDecay(current.totalRevenue, revenueMonthlyRate, 2),
        transactions: projectWithDecay(current.totalTransactions, txMonthlyRate, 2),
        arr: projectWithDecay(financialMetrics.arr, revenueMonthlyRate, 2),
      },
      day90: {
        users: projectWithDecay(current.mau, userMonthlyRate, 3),
        revenue: projectWithDecay(current.totalRevenue, revenueMonthlyRate, 3),
        transactions: projectWithDecay(current.totalTransactions, txMonthlyRate, 3),
        arr: projectWithDecay(financialMetrics.arr, revenueMonthlyRate, 3),
      },
      userGrowthRate: userMonthlyRate * 100,
      revenueGrowthRate: revenueMonthlyRate * 100,
      txGrowthRate: txMonthlyRate * 100,
      decayFactor,
    };
  }, [aggregatedStats, financialMetrics, growthTimeframe]);

  const sortedTableData = useMemo(() => {
    const data = snapshots.map(s => {
      const project = projects.find(p => p.id === s.projectId);
      return { project, snapshot: s };
    }).filter(d => d.project);

    return data.sort((a, b) => {
      let aVal: any, bVal: any;
      switch (sortField) {
        case "name": aVal = a.project!.name; bVal = b.project!.name; break;
        case "dau": aVal = a.snapshot.metrics.users.daily_active; bVal = b.snapshot.metrics.users.daily_active; break;
        case "mau": aVal = a.snapshot.metrics.users.monthly_active; bVal = b.snapshot.metrics.users.monthly_active; break;
        case "revenue": aVal = a.snapshot.metrics.revenue.net_income; bVal = b.snapshot.metrics.revenue.net_income; break;
        case "transactions": aVal = a.snapshot.metrics.onchain.transactions; bVal = b.snapshot.metrics.onchain.transactions; break;
        default: aVal = a.project!.name; bVal = b.project!.name;
      }
      if (typeof aVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [snapshots, projects, sortField, sortDir]);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedApps);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedApps(newSet);
  };

  const showCategories = metricVisibility;

  return {
    fetching,
    fetchProgress,
    expandedApps,
    sortField,
    sortDir,
    growthTimeframe,
    setGrowthTimeframe,
    lastRefreshTime,
    trendRange,
    setTrendRange,
    metricsLoading,
    connectedProjects,
    projects,
    snapshots,
    historicalSnapshots,
    metricVisibility,
    showCategories,
    fetchAllMetrics,
    aggregatedStats,
    historicalData,
    appComparisonData,
    radarData,
    perAppTimeSeries,
    appColorMap,
    estimatedDailyRevenueData,
    estimatedDailyActivityData,
    filteredTrendData,
    filteredRevenueRateData,
    filteredActivityData,
    dailyPayersEstimate,
    financialMetrics,
    projections,
    sortedTableData,
    toggleSort,
    toggleExpand,
  };
}
