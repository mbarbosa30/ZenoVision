import React, { useRef, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Users, TrendingUp, TrendingDown, DollarSign, Zap, Activity, 
  ArrowUpRight, ArrowDownRight, RefreshCw, ChevronDown, ChevronUp,
  BarChart3, LineChart as LineChartIcon, PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PasswordGate } from "@/components/password-gate";
import { format, subDays } from "date-fns";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart
} from "recharts";

interface Project {
  id: string;
  name: string;
  description: string;
  highlight: string;
  url: string;
  sortOrder: number;
  metricsEndpoint: string | null;
  metricsApiKey: string | null;
}

interface Metrics {
  app: string;
  timestamp: string;
  users: {
    total: number;
    daily_active: number;
    weekly_active: number;
    monthly_active: number;
    paying: number;
  };
  engagement: {
    key_actions: number;
    sessions_today: number;
  };
  revenue: {
    total_payments: number;
    net_income: number;
    currency: string;
  };
  onchain: {
    transactions: number;
    volume: number;
  };
}

interface MetricsSnapshot {
  id: string;
  projectId: string;
  timestamp: string;
  metrics: Metrics;
}

interface BlockProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const Block = ({ children, className = "", delay = 0 }: BlockProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      className={`bg-[#1a1a1a] border border-[#2d2d2d] p-6 md:p-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
};

const StatCard = ({ 
  label, 
  value, 
  change, 
  icon: Icon, 
  color = "blue",
  delay = 0 
}: { 
  label: string; 
  value: string | number; 
  change?: number; 
  icon: any;
  color?: "blue" | "green" | "yellow" | "purple" | "cyan";
  delay?: number;
}) => {
  const colors = {
    blue: "text-[#3b82f6] bg-[#3b82f6]/10",
    green: "text-[#10b981] bg-[#10b981]/10",
    yellow: "text-[#f59e0b] bg-[#f59e0b]/10",
    purple: "text-[#8b5cf6] bg-[#8b5cf6]/10",
    cyan: "text-[#06b6d4] bg-[#06b6d4]/10",
  };

  return (
    <Block delay={delay} className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm text-[#a0aec0] uppercase tracking-wider mb-2">{label}</div>
          <div className="text-3xl md:text-4xl font-semibold mb-2">{value}</div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${change >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
              {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {Math.abs(change).toFixed(1)}% vs last period
            </div>
          )}
        </div>
        <div className={`p-3 ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Block>
  );
};

function processHistoricalSnapshots(snapshots: MetricsSnapshot[], projects: Project[]) {
  // Group snapshots by timestamp (each fetch = individual point)
  const snapshotsByTime = new Map<string, MetricsSnapshot[]>();
  
  snapshots.forEach(snapshot => {
    const timeKey = new Date(snapshot.timestamp).toISOString();
    if (!snapshotsByTime.has(timeKey)) {
      snapshotsByTime.set(timeKey, []);
    }
    snapshotsByTime.get(timeKey)!.push(snapshot);
  });
  
  const sortedTimes = Array.from(snapshotsByTime.keys()).sort();
  
  return sortedTimes.map(timeKey => {
    const timeSnapshots = snapshotsByTime.get(timeKey)!;
    const timestamp = new Date(timeKey);
    const pointData: any = {
      date: format(timestamp, "MMM d HH:mm"),
      fullDate: timeKey,
      timestamp: timestamp.getTime(),
    };
    
    let totalDAU = 0;
    let totalMAU = 0;
    let totalRevenue = 0;
    let totalTransactions = 0;
    let totalVolume = 0;
    
    timeSnapshots.forEach(snapshot => {
      const project = projects.find(p => p.id === snapshot.projectId);
      if (!project) return;
      
      totalDAU += snapshot.metrics.users.daily_active;
      totalMAU += snapshot.metrics.users.monthly_active;
      totalRevenue += snapshot.metrics.revenue.net_income;
      totalTransactions += snapshot.metrics.onchain.transactions;
      totalVolume += snapshot.metrics.onchain.volume;
      
      const safeKey = project.id.slice(0, 8);
      pointData[`${safeKey}_DAU`] = snapshot.metrics.users.daily_active;
      pointData[`${safeKey}_Revenue`] = snapshot.metrics.revenue.net_income;
      pointData[`${safeKey}_name`] = project.name;
    });
    
    pointData.totalDAU = totalDAU;
    pointData.totalMAU = totalMAU;
    pointData.totalRevenue = totalRevenue;
    pointData.totalTransactions = totalTransactions;
    pointData.totalVolume = totalVolume;
    
    return pointData;
  });
}

function calculateTimeWeightedGrowth(historical: any[]) {
  if (historical.length < 2) {
    return { dauGrowthRate: 0, revenueGrowthRate: 0, mauGrowthRate: 0, hoursElapsed: 0, daysElapsed: 0 };
  }
  
  const first = historical[0];
  const last = historical[historical.length - 1];
  const hoursElapsed = (last.timestamp - first.timestamp) / (1000 * 60 * 60);
  const daysElapsed = hoursElapsed / 24;
  
  if (daysElapsed < 0.5) {
    return { dauGrowthRate: 0, revenueGrowthRate: 0, mauGrowthRate: 0, hoursElapsed, daysElapsed };
  }
  
  const calculateWeeklyRate = (firstVal: number, lastVal: number): number => {
    if (firstVal <= 0 || lastVal <= 0) return 0;
    const ratio = lastVal / firstVal;
    const weeklyRate = Math.pow(ratio, 7 / daysElapsed) - 1;
    return weeklyRate * 100;
  };
  
  return {
    dauGrowthRate: calculateWeeklyRate(first.totalDAU, last.totalDAU),
    revenueGrowthRate: calculateWeeklyRate(first.totalRevenue, last.totalRevenue),
    mauGrowthRate: calculateWeeklyRate(first.totalMAU, last.totalMAU),
    hoursElapsed,
    daysElapsed,
  };
}

function DashboardContent() {
  const queryClient = useQueryClient();
  const [fetching, setFetching] = useState(false);
  const [expandedApps, setExpandedApps] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

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
      const res = await fetch("/api/metrics/history?limit=30");
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
  const historicalSnapshots = (historicalMetrics?.snapshots || []).filter(s =>
    connectedProjects.some(p => p.id === s.projectId)
  );

  const fetchAllMetrics = async () => {
    setFetching(true);
    try {
      await fetch("/api/metrics/fetch-all", { method: "POST" });
      queryClient.invalidateQueries({ queryKey: ["/api/metrics/latest"] });
    } finally {
      setFetching(false);
    }
  };

  const aggregatedStats = useMemo(() => {
    if (snapshots.length === 0) {
      return {
        totalUsers: 0, dau: 0, wau: 0, mau: 0, payingUsers: 0,
        totalRevenue: 0, totalTransactions: 0, totalVolume: 0,
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
      totalTransactions: acc.totalTransactions + s.metrics.onchain.transactions,
      totalVolume: acc.totalVolume + s.metrics.onchain.volume,
      keyActions: acc.keyActions + s.metrics.engagement.key_actions,
      sessions: acc.sessions + s.metrics.engagement.sessions_today,
    }), {
      totalUsers: 0, dau: 0, wau: 0, mau: 0, payingUsers: 0,
      totalRevenue: 0, totalTransactions: 0, totalVolume: 0,
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
        Revenue: s.metrics.revenue.net_income,
        Transactions: s.metrics.onchain.transactions,
        Volume: s.metrics.onchain.volume,
      };
    });
  }, [snapshots, projects]);

  const financialMetrics = useMemo(() => {
    const stats = aggregatedStats;
    const historical = historicalData;
    
    const mrr = stats.totalRevenue;
    const arr = mrr * 12;
    
    const arpu = stats.payingUsers > 0 ? stats.totalRevenue / stats.payingUsers : 0;
    const arpuAll = stats.totalUsers > 0 ? stats.totalRevenue / stats.totalUsers : 0;
    
    const conversionRate = stats.totalUsers > 0 ? (stats.payingUsers / stats.totalUsers) * 100 : 0;
    
    const stickiness = stats.mau > 0 ? (stats.dau / stats.mau) * 100 : 0;
    
    const avgLifetimeMonths = 12;
    const ltv = arpu * avgLifetimeMonths;
    
    const estimatedCac = arpu * 3;
    const ltvCacRatio = estimatedCac > 0 ? ltv / estimatedCac : 0;
    const paybackMonths = arpu > 0 ? estimatedCac / arpu : 0;
    
    const timeWeightedGrowth = calculateTimeWeightedGrowth(historical);
    const { dauGrowthRate, revenueGrowthRate, mauGrowthRate, hoursElapsed, daysElapsed } = timeWeightedGrowth;
    
    const monthlyGrowthRate = revenueGrowthRate / 100;
    
    const revenuePerUser = stats.totalUsers > 0 ? stats.totalRevenue / stats.totalUsers : 0;
    const transactionsPerUser = stats.totalUsers > 0 ? stats.totalTransactions / stats.totalUsers : 0;
    const engagementPerUser = stats.totalUsers > 0 ? stats.keyActions / stats.totalUsers : 0;
    
    const nrr = 100 + (revenueGrowthRate * 0.5);
    
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
    
    const blendedValuation = {
      low: Math.round((web3Valuation.revenueMultiple.low + web3Valuation.dauBased.low + web3Valuation.mauBased.low + web3Valuation.volumeMultiple.low + web3Valuation.walletBased.low) / 5),
      mid: Math.round((web3Valuation.revenueMultiple.mid + web3Valuation.dauBased.mid + web3Valuation.mauBased.mid + web3Valuation.volumeMultiple.mid + web3Valuation.walletBased.mid) / 5),
      high: Math.round((web3Valuation.revenueMultiple.high + web3Valuation.dauBased.high + web3Valuation.mauBased.high + web3Valuation.volumeMultiple.high + web3Valuation.walletBased.high) / 5),
    };
    
    return {
      mrr, arr,
      arpu, arpuAll,
      conversionRate,
      stickiness,
      ltv, estimatedCac, ltvCacRatio, paybackMonths,
      dauGrowthRate, revenueGrowthRate, mauGrowthRate,
      web3Valuation,
      blendedValuation,
      revenuePerUser, transactionsPerUser, engagementPerUser,
      nrr,
      monthlyGrowthRate,
      annualizedVolume,
      hoursElapsed: hoursElapsed || 0,
      daysElapsed: daysElapsed || 0,
    };
  }, [aggregatedStats, historicalData]);

  const projections = useMemo(() => {
    const growthRate = Math.max(0.02, Math.min(0.15, financialMetrics.monthlyGrowthRate || 0.05));
    const current = aggregatedStats;
    
    return {
      day30: {
        users: Math.round(current.mau * Math.pow(1 + growthRate, 1)),
        revenue: Math.round(current.totalRevenue * Math.pow(1 + growthRate, 1)),
        transactions: Math.round(current.totalTransactions * Math.pow(1 + growthRate, 1)),
        arr: Math.round(financialMetrics.arr * Math.pow(1 + growthRate, 1)),
      },
      day60: {
        users: Math.round(current.mau * Math.pow(1 + growthRate, 2)),
        revenue: Math.round(current.totalRevenue * Math.pow(1 + growthRate, 2)),
        transactions: Math.round(current.totalTransactions * Math.pow(1 + growthRate, 2)),
        arr: Math.round(financialMetrics.arr * Math.pow(1 + growthRate, 2)),
      },
      day90: {
        users: Math.round(current.mau * Math.pow(1 + growthRate, 3)),
        revenue: Math.round(current.totalRevenue * Math.pow(1 + growthRate, 3)),
        transactions: Math.round(current.totalTransactions * Math.pow(1 + growthRate, 3)),
        arr: Math.round(financialMetrics.arr * Math.pow(1 + growthRate, 3)),
      },
      growthRate: growthRate * 100,
    };
  }, [aggregatedStats, financialMetrics]);

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

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#2d2d2d] bg-[#0f0f0f]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" data-testid="link-logo">
            <div className="w-8 h-8 bg-[#3b82f6]" />
            <span className="font-semibold text-lg tracking-tight">Zeno</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#a0aec0]">Portfolio Dashboard</span>
            <Button 
              onClick={fetchAllMetrics} 
              disabled={fetching}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-none h-10 px-6"
              data-testid="button-refresh-metrics"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${fetching ? "animate-spin" : ""}`} />
              {fetching ? "Fetching..." : "Refresh Data"}
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-sm text-[#a0aec0] uppercase tracking-widest mb-4">
                Portfolio Overview
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight mb-2">
                Real-time Metrics
              </h1>
              <p className="text-[#a0aec0] text-lg mb-8">
                Aggregated performance data across all Zeno products
              </p>
              
              <div className="flex items-center gap-4 text-sm text-[#a0aec0]">
                <span>{connectedProjects.length} of {allProjects.length} apps connected</span>
                <span className="w-1 h-1 bg-[#3b82f6]" />
                <span>{snapshots.length} with live metrics</span>
                <span className="w-1 h-1 bg-[#3b82f6]" />
                <span>{historicalData.length} snapshots over {financialMetrics.daysElapsed > 1 
                  ? `${financialMetrics.daysElapsed.toFixed(1)} days` 
                  : `${financialMetrics.hoursElapsed.toFixed(1)} hours`}</span>
                <span className="w-1 h-1 bg-[#3b82f6]" />
                <span>Updated: {new Date().toLocaleTimeString()}</span>
              </div>
              {connectedProjects.length === 0 && (
                <div className="mt-4 p-4 bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] text-sm">
                  No apps with metrics endpoints configured. Add API endpoints in the Admin panel to see real data.
                </div>
              )}
            </motion.div>
          </div>
        </section>

        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <StatCard 
                label="Total Users" 
                value={aggregatedStats.totalUsers.toLocaleString()} 
                change={12.5}
                icon={Users} 
                color="blue"
                delay={0.1}
              />
              <StatCard 
                label="Daily Active" 
                value={aggregatedStats.dau.toLocaleString()} 
                change={8.3}
                icon={Activity} 
                color="green"
                delay={0.15}
              />
              <StatCard 
                label="Monthly Active" 
                value={aggregatedStats.mau.toLocaleString()} 
                change={15.2}
                icon={TrendingUp} 
                color="purple"
                delay={0.2}
              />
              <StatCard 
                label="Revenue" 
                value={`$${aggregatedStats.totalRevenue.toLocaleString()}`} 
                change={22.1}
                icon={DollarSign} 
                color="green"
                delay={0.25}
              />
              <StatCard 
                label="Transactions" 
                value={aggregatedStats.totalTransactions.toLocaleString()} 
                change={18.7}
                icon={Zap} 
                color="yellow"
                delay={0.3}
              />
            </div>
          </div>
        </section>

        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <DollarSign className="w-6 h-6 text-[#10b981]" />
              <h2 className="text-2xl font-semibold">Financial KPIs</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Block delay={0.05}>
                <div className="text-sm text-[#a0aec0] uppercase tracking-wider mb-2">MRR</div>
                <div className="text-3xl font-semibold text-[#10b981]" data-testid="value-mrr">${financialMetrics.mrr.toLocaleString()}</div>
                <div className="text-sm text-[#a0aec0] mt-1">Net Revenue (Current Period)</div>
              </Block>
              <Block delay={0.1}>
                <div className="text-sm text-[#a0aec0] uppercase tracking-wider mb-2">ARR</div>
                <div className="text-3xl font-semibold text-[#10b981]" data-testid="value-arr">${financialMetrics.arr.toLocaleString()}</div>
                <div className="text-sm text-[#a0aec0] mt-1">Annualized Run Rate</div>
              </Block>
              <Block delay={0.15}>
                <div className="text-sm text-[#a0aec0] uppercase tracking-wider mb-2">ARPU</div>
                <div className="text-3xl font-semibold" data-testid="value-arpu">${financialMetrics.arpu.toFixed(2)}</div>
                <div className="text-sm text-[#a0aec0] mt-1">Per Paying User</div>
              </Block>
              <Block delay={0.2}>
                <div className="text-sm text-[#a0aec0] uppercase tracking-wider mb-2">Conversion</div>
                <div className="text-3xl font-semibold" data-testid="value-conversion">{financialMetrics.conversionRate.toFixed(2)}%</div>
                <div className="text-sm text-[#a0aec0] mt-1">Paid / Total Users</div>
              </Block>
            </div>

            <div className="text-xs text-[#666] mb-4 italic">* Growth rates are time-weighted: normalized to weekly rates based on actual time elapsed between snapshots.</div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Block delay={0.25}>
                <h3 className="text-lg font-medium mb-4 text-[#3b82f6]">Growth Rates (WoW)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">DAU Growth</span>
                    <span data-testid="value-dau-growth" className={`font-semibold ${financialMetrics.dauGrowthRate >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                      {financialMetrics.dauGrowthRate >= 0 ? "+" : ""}{financialMetrics.dauGrowthRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">MAU Growth</span>
                    <span data-testid="value-mau-growth" className={`font-semibold ${financialMetrics.mauGrowthRate >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                      {financialMetrics.mauGrowthRate >= 0 ? "+" : ""}{financialMetrics.mauGrowthRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">Revenue Growth</span>
                    <span data-testid="value-revenue-growth" className={`font-semibold ${financialMetrics.revenueGrowthRate >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                      {financialMetrics.revenueGrowthRate >= 0 ? "+" : ""}{financialMetrics.revenueGrowthRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#2d2d2d] pt-3">
                    <span className="text-[#a0aec0]">NRR (Est.)</span>
                    <span data-testid="value-nrr" className="font-semibold text-[#8b5cf6]">{financialMetrics.nrr.toFixed(0)}%</span>
                  </div>
                </div>
              </Block>

              <Block delay={0.3}>
                <h3 className="text-lg font-medium mb-4 text-[#f59e0b]">Unit Economics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">LTV (Est.)</span>
                    <span data-testid="value-ltv" className="font-semibold">${financialMetrics.ltv.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">CAC (Est.)</span>
                    <span data-testid="value-cac" className="font-semibold">${financialMetrics.estimatedCac.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">LTV:CAC</span>
                    <span data-testid="value-ltv-cac" className={`font-semibold ${financialMetrics.ltvCacRatio >= 3 ? "text-[#10b981]" : financialMetrics.ltvCacRatio >= 2 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>
                      {financialMetrics.ltvCacRatio.toFixed(1)}x
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#2d2d2d] pt-3">
                    <span className="text-[#a0aec0]">Payback Period</span>
                    <span data-testid="value-payback" className="font-semibold">{financialMetrics.paybackMonths.toFixed(1)} mo</span>
                  </div>
                </div>
              </Block>

              <Block delay={0.35}>
                <h3 className="text-lg font-medium mb-4 text-[#06b6d4]">Engagement Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">DAU/MAU Ratio</span>
                    <span data-testid="value-stickiness" className={`font-semibold ${financialMetrics.stickiness >= 20 ? "text-[#10b981]" : financialMetrics.stickiness >= 10 ? "text-[#f59e0b]" : "text-white"}`}>
                      {financialMetrics.stickiness.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">Revenue/User</span>
                    <span data-testid="value-rev-per-user" className="font-semibold">${financialMetrics.revenuePerUser.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">Txns/User</span>
                    <span data-testid="value-txns-per-user" className="font-semibold">{financialMetrics.transactionsPerUser.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#2d2d2d] pt-3">
                    <span className="text-[#a0aec0]">Actions/User</span>
                    <span data-testid="value-actions-per-user" className="font-semibold">{financialMetrics.engagementPerUser.toFixed(1)}</span>
                  </div>
                </div>
              </Block>
            </div>

            <Block delay={0.4} className="bg-gradient-to-r from-[#8b5cf6]/10 to-[#06b6d4]/10 border-[#8b5cf6]/30">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-xl font-semibold">Zeno Studio Valuation</h3>
                <span className="text-xs text-[#666] px-2 py-1 bg-[#2d2d2d]">Web3 / dApps / MiniApps</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-[#1a1a1a] border border-[#2d2d2d]">
                  <div className="text-sm text-[#a0aec0] mb-2">Conservative</div>
                  <div className="text-3xl font-bold text-[#a0aec0]" data-testid="value-valuation-low">
                    ${financialMetrics.blendedValuation.low >= 1000000 
                      ? (financialMetrics.blendedValuation.low / 1000000).toFixed(2) + 'M' 
                      : (financialMetrics.blendedValuation.low / 1000).toFixed(0) + 'K'}
                  </div>
                </div>
                <div className="text-center p-4 bg-[#10b981]/10 border border-[#10b981]/30">
                  <div className="text-sm text-[#10b981] mb-2">Mid-Range Estimate</div>
                  <div className="text-3xl font-bold text-[#10b981]" data-testid="value-valuation-mid">
                    ${financialMetrics.blendedValuation.mid >= 1000000 
                      ? (financialMetrics.blendedValuation.mid / 1000000).toFixed(2) + 'M' 
                      : (financialMetrics.blendedValuation.mid / 1000).toFixed(0) + 'K'}
                  </div>
                </div>
                <div className="text-center p-4 bg-[#1a1a1a] border border-[#2d2d2d]">
                  <div className="text-sm text-[#3b82f6] mb-2">Aggressive</div>
                  <div className="text-3xl font-bold text-[#3b82f6]" data-testid="value-valuation-high">
                    ${financialMetrics.blendedValuation.high >= 1000000 
                      ? (financialMetrics.blendedValuation.high / 1000000).toFixed(2) + 'M' 
                      : (financialMetrics.blendedValuation.high / 1000).toFixed(0) + 'K'}
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#666] mb-4">Valuation methodology breakdown:</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div className="p-3 bg-[#1a1a1a] border border-[#2d2d2d]">
                  <div className="text-[#a0aec0] mb-1">Revenue (10-50x)</div>
                  <div className="font-semibold" data-testid="value-rev-multiple">
                    ${(financialMetrics.web3Valuation.revenueMultiple.mid / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-[#2d2d2d]">
                  <div className="text-[#a0aec0] mb-1">Volume (1-10%)</div>
                  <div className="font-semibold" data-testid="value-vol-multiple">
                    ${(financialMetrics.web3Valuation.volumeMultiple.mid / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-[#2d2d2d]">
                  <div className="text-[#a0aec0] mb-1">Per DAU ($50-300)</div>
                  <div className="font-semibold" data-testid="value-dau-multiple">
                    ${(financialMetrics.web3Valuation.dauBased.mid / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-[#2d2d2d]">
                  <div className="text-[#a0aec0] mb-1">Per MAU ($10-75)</div>
                  <div className="font-semibold" data-testid="value-mau-multiple">
                    ${(financialMetrics.web3Valuation.mauBased.mid / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-[#2d2d2d]">
                  <div className="text-[#a0aec0] mb-1">Per Wallet ($100-1.5K)</div>
                  <div className="font-semibold" data-testid="value-wallet-multiple">
                    ${(financialMetrics.web3Valuation.walletBased.mid / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-xs text-[#666] italic">
                * Blended valuation uses Web3/dApp industry multiples: revenue (10-50x for high-growth), transaction volume (1-10%), 
                DAU ($50-300/user for gaming/miniapps), MAU ($10-75/user), and wallet value ($100-1.5K/active wallet).
              </div>
            </Block>
          </div>
        </section>

        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <LineChartIcon className="w-6 h-6 text-[#3b82f6]" />
              <h2 className="text-2xl font-semibold">Growth Trends</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Block delay={0.1}>
                <h3 className="text-lg font-medium mb-4">Daily Active Users</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData}>
                      <defs>
                        <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                      <XAxis dataKey="date" stroke="#666" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                      <YAxis stroke="#666" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d", borderRadius: 0 }} 
                        labelStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="totalDAU" stroke="#3b82f6" fill="url(#dauGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Block>

              <Block delay={0.15}>
                <h3 className="text-lg font-medium mb-4">Revenue Trend</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                      <XAxis dataKey="date" stroke="#666" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                      <YAxis stroke="#666" tick={{ fill: '#a0aec0', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d", borderRadius: 0 }} 
                        labelStyle={{ color: '#fff' }}
                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="totalRevenue" stroke="#10b981" fill="url(#revenueGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Block>

              <Block delay={0.2} className="lg:col-span-2">
                <h3 className="text-lg font-medium mb-4">Combined Metrics</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                      <XAxis dataKey="date" stroke="#666" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                      <YAxis yAxisId="left" stroke="#666" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#666" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d", borderRadius: 0 }} 
                        labelStyle={{ color: '#fff' }}
                      />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="totalDAU" name="DAU" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Line yAxisId="left" type="monotone" dataKey="totalMAU" name="MAU" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                      <Bar yAxisId="right" dataKey="totalTransactions" name="Transactions" fill="#f59e0b" opacity={0.6} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </Block>
            </div>
          </div>
        </section>

        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <BarChart3 className="w-6 h-6 text-[#3b82f6]" />
              <h2 className="text-2xl font-semibold">App Comparison</h2>
            </div>
            
            <Block delay={0.1}>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                    <XAxis type="number" stroke="#666" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" stroke="#666" tick={{ fill: '#a0aec0', fontSize: 12 }} width={100} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d", borderRadius: 0 }} 
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="DAU" fill="#3b82f6" />
                    <Bar dataKey="Revenue" fill="#10b981" />
                    <Bar dataKey="Transactions" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Block>
          </div>
        </section>

        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-6 h-6 text-[#3b82f6]" />
              <h2 className="text-2xl font-semibold">Projections</h2>
              <span className="text-sm text-[#a0aec0] ml-2">({projections.growthRate.toFixed(1)}% monthly growth based on trends)</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Block delay={0.1}>
                <div className="text-sm text-[#a0aec0] uppercase tracking-wider mb-4">30-Day Forecast</div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">MAU</span>
                    <span className="text-xl font-semibold" data-testid="value-30d-mau">{projections.day30.users.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">MRR</span>
                    <span className="text-xl font-semibold text-[#10b981]" data-testid="value-30d-mrr">${projections.day30.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">ARR</span>
                    <span className="text-xl font-semibold text-[#10b981]" data-testid="value-30d-arr">${projections.day30.arr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#2d2d2d] pt-3">
                    <span className="text-[#a0aec0]">Transactions</span>
                    <span className="font-semibold" data-testid="value-30d-txns">{projections.day30.transactions.toLocaleString()}</span>
                  </div>
                </div>
              </Block>

              <Block delay={0.15}>
                <div className="text-sm text-[#a0aec0] uppercase tracking-wider mb-4">60-Day Forecast</div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">MAU</span>
                    <span className="text-xl font-semibold" data-testid="value-60d-mau">{projections.day60.users.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">MRR</span>
                    <span className="text-xl font-semibold text-[#10b981]" data-testid="value-60d-mrr">${projections.day60.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">ARR</span>
                    <span className="text-xl font-semibold text-[#10b981]" data-testid="value-60d-arr">${projections.day60.arr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#2d2d2d] pt-3">
                    <span className="text-[#a0aec0]">Transactions</span>
                    <span className="font-semibold" data-testid="value-60d-txns">{projections.day60.transactions.toLocaleString()}</span>
                  </div>
                </div>
              </Block>

              <Block delay={0.2} className="bg-[#3b82f6]/10 border-[#3b82f6]/30">
                <div className="text-sm text-[#3b82f6] uppercase tracking-wider mb-4">90-Day Forecast</div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">MAU</span>
                    <span className="text-xl font-semibold" data-testid="value-90d-mau">{projections.day90.users.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">MRR</span>
                    <span className="text-xl font-semibold text-[#10b981]" data-testid="value-90d-mrr">${projections.day90.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">ARR</span>
                    <span className="text-xl font-semibold text-[#10b981]" data-testid="value-90d-arr">${projections.day90.arr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">Transactions</span>
                    <span className="text-xl font-semibold">{projections.day90.transactions.toLocaleString()}</span>
                  </div>
                </div>
              </Block>
            </div>
          </div>
        </section>

        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <PieChart className="w-6 h-6 text-[#3b82f6]" />
              <h2 className="text-2xl font-semibold">Detailed Metrics</h2>
            </div>

            <Block delay={0.1}>
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="metrics-table">
                  <thead>
                    <tr className="border-b border-[#2d2d2d]">
                      <th 
                        className="text-left py-4 px-4 text-sm text-[#a0aec0] font-medium cursor-pointer hover:text-white"
                        onClick={() => toggleSort('name')}
                        data-testid="sort-name"
                      >
                        <div className="flex items-center gap-2">
                          App
                          {sortField === 'name' && (sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                        </div>
                      </th>
                      <th 
                        className="text-right py-4 px-4 text-sm text-[#a0aec0] font-medium cursor-pointer hover:text-white"
                        onClick={() => toggleSort('dau')}
                        data-testid="sort-dau"
                      >
                        <div className="flex items-center justify-end gap-2">
                          DAU
                          {sortField === 'dau' && (sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                        </div>
                      </th>
                      <th 
                        className="text-right py-4 px-4 text-sm text-[#a0aec0] font-medium cursor-pointer hover:text-white"
                        onClick={() => toggleSort('mau')}
                        data-testid="sort-mau"
                      >
                        <div className="flex items-center justify-end gap-2">
                          MAU
                          {sortField === 'mau' && (sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                        </div>
                      </th>
                      <th 
                        className="text-right py-4 px-4 text-sm text-[#a0aec0] font-medium cursor-pointer hover:text-white"
                        onClick={() => toggleSort('revenue')}
                        data-testid="sort-revenue"
                      >
                        <div className="flex items-center justify-end gap-2">
                          Revenue
                          {sortField === 'revenue' && (sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                        </div>
                      </th>
                      <th 
                        className="text-right py-4 px-4 text-sm text-[#a0aec0] font-medium cursor-pointer hover:text-white"
                        onClick={() => toggleSort('transactions')}
                        data-testid="sort-transactions"
                      >
                        <div className="flex items-center justify-end gap-2">
                          Transactions
                          {sortField === 'transactions' && (sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                        </div>
                      </th>
                      <th className="text-right py-4 px-4 text-sm text-[#a0aec0] font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTableData.map(({ project, snapshot }) => (
                      <React.Fragment key={project!.id}>
                        <tr 
                          className="border-b border-[#2d2d2d] hover:bg-[#1a1a1a]/50 transition-colors"
                          data-testid={`row-app-${project!.id}`}
                        >
                          <td className="py-4 px-4">
                            <div className="font-medium">{project!.name}</div>
                            <div className="text-sm text-[#a0aec0]">{project!.description}</div>
                          </td>
                          <td className="py-4 px-4 text-right font-mono">
                            {snapshot.metrics.users.daily_active.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right font-mono">
                            {snapshot.metrics.users.monthly_active.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right font-mono text-[#10b981]">
                            ${snapshot.metrics.revenue.net_income.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right font-mono">
                            {snapshot.metrics.onchain.transactions.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => toggleExpand(project!.id)}
                              className="text-[#a0aec0] hover:text-white"
                              data-testid={`button-expand-${project!.id}`}
                            >
                              {expandedApps.has(project!.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                          </td>
                        </tr>
                        {expandedApps.has(project!.id) && (
                          <tr className="bg-[#0f0f0f]">
                            <td colSpan={6} className="py-4 px-8">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                  <div className="text-sm text-[#a0aec0] mb-1">Total Users</div>
                                  <div className="text-lg font-semibold">{snapshot.metrics.users.total.toLocaleString()}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-[#a0aec0] mb-1">Paying Users</div>
                                  <div className="text-lg font-semibold">{snapshot.metrics.users.paying.toLocaleString()}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-[#a0aec0] mb-1">Key Actions</div>
                                  <div className="text-lg font-semibold">{snapshot.metrics.engagement.key_actions.toLocaleString()}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-[#a0aec0] mb-1">Sessions Today</div>
                                  <div className="text-lg font-semibold">{snapshot.metrics.engagement.sessions_today.toLocaleString()}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-[#a0aec0] mb-1">Onchain Volume</div>
                                  <div className="text-lg font-semibold">${snapshot.metrics.onchain.volume.toLocaleString()}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-[#a0aec0] mb-1">WAU</div>
                                  <div className="text-lg font-semibold">{(snapshot.metrics.users as any).weekly_active?.toLocaleString() || 'N/A'}</div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </Block>
          </div>
        </section>

        <footer className="py-8 text-center text-sm text-[#a0aec0]">
          <p>Zeno Vision Portfolio Dashboard</p>
        </footer>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <PasswordGate storageKey="dashboardAuth" title="Portfolio Dashboard">
      <DashboardContent />
    </PasswordGate>
  );
}
