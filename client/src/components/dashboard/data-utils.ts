import { format } from "date-fns";
import type { Project, MetricsSnapshot } from "@/lib/types";

export type GrowthTimeframe = 'daily' | 'weekly' | 'monthly';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface GrowthResult {
  userGrowthRate: number;
  dauGrowthRate: number;
  wauGrowthRate: number;
  mauGrowthRate: number;
  payingGrowthRate: number;
  revenueGrowthRate: number;
  paymentsGrowthRate: number;
  txGrowthRate: number;
  volumeGrowthRate: number;
  actionsGrowthRate: number;
  sessionsGrowthRate: number;
  hoursElapsed: number;
  daysElapsed: number;
  dataPoints: number;
  confidence: ConfidenceLevel;
  confidenceReason: string;
  timeframeCoverage: number;
}

export function processHistoricalSnapshots(snapshots: MetricsSnapshot[], projects: Project[]) {
  const SESSION_WINDOW_MS = 2 * 60 * 1000;
  
  const sorted = [...snapshots].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  const sessions: MetricsSnapshot[][] = [];
  let currentSession: MetricsSnapshot[] = [];
  let sessionStart = 0;
  
  sorted.forEach(snapshot => {
    const ts = new Date(snapshot.timestamp).getTime();
    if (currentSession.length === 0) {
      currentSession.push(snapshot);
      sessionStart = ts;
    } else if (ts - sessionStart <= SESSION_WINDOW_MS) {
      currentSession.push(snapshot);
    } else {
      sessions.push(currentSession);
      currentSession = [snapshot];
      sessionStart = ts;
    }
  });
  if (currentSession.length > 0) {
    sessions.push(currentSession);
  }
  
  return sessions.map(sessionSnapshots => {
    const dedupedByProject = new Map<string, MetricsSnapshot>();
    sessionSnapshots.forEach(snapshot => {
      const existing = dedupedByProject.get(snapshot.projectId);
      if (!existing || new Date(snapshot.timestamp).getTime() > new Date(existing.timestamp).getTime()) {
        dedupedByProject.set(snapshot.projectId, snapshot);
      }
    });
    const uniqueSnapshots = Array.from(dedupedByProject.values());

    const timestamps = uniqueSnapshots.map(s => new Date(s.timestamp).getTime());
    const sessionTime = Math.max(...timestamps);
    const timestamp = new Date(sessionTime);
    
    const pointData: any = {
      date: format(timestamp, "MMM d HH:mm"),
      fullDate: timestamp.toISOString(),
      timestamp: sessionTime,
    };
    
    let totalUsers = 0;
    let totalDAU = 0;
    let totalWAU = 0;
    let totalMAU = 0;
    let totalPaying = 0;
    let totalRevenue = 0;
    let totalPayments = 0;
    let totalTransactions = 0;
    let totalVolume = 0;
    let totalKeyActions = 0;
    let totalSessions = 0;
    
    uniqueSnapshots.forEach(snapshot => {
      const project = projects.find(p => p.id === snapshot.projectId);
      if (!project) return;
      
      totalUsers += snapshot.metrics.users.total;
      totalDAU += snapshot.metrics.users.daily_active;
      totalWAU += snapshot.metrics.users.weekly_active;
      totalMAU += snapshot.metrics.users.monthly_active;
      totalPaying += snapshot.metrics.users.paying;
      totalRevenue += snapshot.metrics.revenue.net_income;
      totalPayments += snapshot.metrics.revenue.total_payments;
      totalTransactions += snapshot.metrics.onchain.transactions;
      totalVolume += snapshot.metrics.onchain.volume;
      totalKeyActions += snapshot.metrics.engagement.key_actions;
      totalSessions += snapshot.metrics.engagement.sessions_today;
      
      const safeKey = project.id.slice(0, 8);
      pointData[`${safeKey}_DAU`] = snapshot.metrics.users.daily_active;
      pointData[`${safeKey}_MAU`] = snapshot.metrics.users.monthly_active;
      pointData[`${safeKey}_Revenue`] = snapshot.metrics.revenue.net_income;
      pointData[`${safeKey}_Paying`] = snapshot.metrics.users.paying;
      pointData[`${safeKey}_Txns`] = snapshot.metrics.onchain.transactions;
      pointData[`${safeKey}_Volume`] = snapshot.metrics.onchain.volume;
      pointData[`${safeKey}_name`] = snapshot.metrics.app || project.name;
    });
    
    pointData.totalUsers = totalUsers;
    pointData.totalDAU = totalDAU;
    pointData.totalWAU = totalWAU;
    pointData.totalMAU = totalMAU;
    pointData.totalPaying = totalPaying;
    pointData.totalRevenue = totalRevenue;
    pointData.totalPayments = totalPayments;
    pointData.totalTransactions = totalTransactions;
    pointData.totalVolume = totalVolume;
    pointData.totalKeyActions = totalKeyActions;
    pointData.totalSessions = totalSessions;
    pointData.appsInSession = uniqueSnapshots.length;
    
    return pointData;
  });
}

export function calculateGrowthRates(historical: any[], timeframe: GrowthTimeframe = 'daily'): GrowthResult {
  const targetHours = timeframe === 'daily' ? 24 : timeframe === 'weekly' ? 168 : 720;
  
  const defaultRates: GrowthResult = { 
    userGrowthRate: 0, dauGrowthRate: 0, wauGrowthRate: 0, mauGrowthRate: 0, 
    payingGrowthRate: 0, revenueGrowthRate: 0, paymentsGrowthRate: 0,
    txGrowthRate: 0, volumeGrowthRate: 0, actionsGrowthRate: 0, sessionsGrowthRate: 0,
    hoursElapsed: 0, daysElapsed: 0, dataPoints: 0,
    confidence: 'low', confidenceReason: 'No data available', timeframeCoverage: 0
  };
  
  if (historical.length < 2) return defaultRates;
  
  const now = Date.now();
  const cutoffTime = now - (targetHours * 60 * 60 * 1000);
  
  const filteredHistorical = historical.filter(h => h.timestamp >= cutoffTime);
  
  const dataToUse = filteredHistorical.length >= 2 ? filteredHistorical : historical;
  const usingAllData = filteredHistorical.length < 2;
  
  const first = dataToUse[0];
  const last = dataToUse[dataToUse.length - 1];
  const hoursElapsed = (last.timestamp - first.timestamp) / (1000 * 60 * 60);
  const daysElapsed = hoursElapsed / 24;
  
  if (hoursElapsed <= 0) return defaultRates;
  
  const timeframeCoverage = Math.min(100, (hoursElapsed / targetHours) * 100);
  
  let confidence: ConfidenceLevel;
  let confidenceReason: string;
  
  if (dataToUse.length >= 10 && timeframeCoverage >= 80) {
    confidence = 'high';
    confidenceReason = `${dataToUse.length} points over ${hoursElapsed.toFixed(1)}h`;
  } else if (dataToUse.length >= 3 && timeframeCoverage >= 25) {
    confidence = 'medium';
    confidenceReason = `${dataToUse.length} points, ${timeframeCoverage.toFixed(0)}% of ${timeframe} window`;
  } else {
    confidence = 'low';
    if (usingAllData) {
      confidenceReason = `Limited: ${dataToUse.length} points over ${hoursElapsed.toFixed(1)}h (all available)`;
    } else {
      confidenceReason = `Early: ${dataToUse.length} points, ${timeframeCoverage.toFixed(0)}% coverage`;
    }
  }
  
  const calculateLinearGrowth = (dataKey: string): number => {
    const points: { t: number; y: number }[] = [];
    const baseTime = dataToUse[0].timestamp;
    
    for (const h of dataToUse) {
      const val = h[dataKey];
      if (val !== undefined && val !== null) {
        const t = (h.timestamp - baseTime) / (1000 * 60 * 60);
        points.push({ t, y: val });
      }
    }
    
    if (points.length < 2) return 0;
    
    const avgValue = points.reduce((s, p) => s + p.y, 0) / points.length;
    if (avgValue <= 0) return 0;
    
    const n = points.length;
    const sumT = points.reduce((s, p) => s + p.t, 0);
    const sumY = points.reduce((s, p) => s + p.y, 0);
    const sumTY = points.reduce((s, p) => s + p.t * p.y, 0);
    const sumT2 = points.reduce((s, p) => s + p.t * p.t, 0);
    
    const denominator = n * sumT2 - sumT * sumT;
    if (Math.abs(denominator) < 1e-10) return 0;
    
    const slope = (n * sumTY - sumT * sumY) / denominator;
    
    const changePerHourPercent = (slope / avgValue) * 100;
    const growthRate = changePerHourPercent * targetHours;
    
    return Math.max(-100, Math.min(500, growthRate));
  };
  
  return {
    userGrowthRate: calculateLinearGrowth('totalUsers'),
    dauGrowthRate: calculateLinearGrowth('totalDAU'),
    wauGrowthRate: calculateLinearGrowth('totalWAU'),
    mauGrowthRate: calculateLinearGrowth('totalMAU'),
    payingGrowthRate: calculateLinearGrowth('totalPaying'),
    revenueGrowthRate: calculateLinearGrowth('totalRevenue'),
    paymentsGrowthRate: calculateLinearGrowth('totalPayments'),
    txGrowthRate: calculateLinearGrowth('totalTransactions'),
    volumeGrowthRate: calculateLinearGrowth('totalVolume'),
    actionsGrowthRate: calculateLinearGrowth('totalKeyActions'),
    sessionsGrowthRate: calculateLinearGrowth('totalSessions'),
    hoursElapsed,
    daysElapsed,
    dataPoints: dataToUse.length,
    confidence,
    confidenceReason,
    timeframeCoverage,
  };
}
