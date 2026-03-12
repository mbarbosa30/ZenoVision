import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, TrendingUp, TrendingDown, DollarSign, Zap, Activity, 
  ArrowUpRight, ArrowDownRight, RefreshCw, ChevronDown, ChevronUp,
  BarChart3, LineChart as LineChartIcon, PieChart, CreditCard, MousePointer,
  Calendar, Wallet, Box, Target, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Block } from "@/components/block";
import { Link } from "wouter";
import { PasswordGate } from "@/components/password-gate";
import { format } from "date-fns";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis
} from "recharts";

import { InfoButton, StatCard, formatNum, smartTickFormat } from "@/components/dashboard";
import type { GrowthTimeframe } from "@/components/dashboard";
import { useDashboardData } from "@/components/dashboard/use-dashboard-data";

function DashboardContent() {
  useEffect(() => { document.title = "Dashboard — Zeno Vision"; }, []);

  const {
    fetching, fetchProgress, expandedApps, sortField, sortDir,
    growthTimeframe, setGrowthTimeframe, lastRefreshTime, trendRange, setTrendRange,
    metricsLoading, allProjects, connectedProjects, projects, snapshots, historicalSnapshots,
    metricVisibility, showCategories, fetchAllMetrics, aggregatedStats,
    historicalData, appComparisonData, radarData, perAppTimeSeries, appColorMap,
    estimatedDailyRevenueData, estimatedDailyActivityData,
    filteredTrendData, filteredRevenueRateData, filteredActivityData,
    dailyPayersEstimate, financialMetrics, projections, sortedTableData,
    toggleSort, toggleExpand,
  } = useDashboardData();

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

      {Object.keys(fetchProgress).length > 0 && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-[#1a1a1a] border-b border-[#2d2d2d] px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap" data-testid="fetch-progress-bar">
            {connectedProjects.filter(p => fetchProgress[p.id]).map(project => {
              const status = fetchProgress[project.id];
              return (
                <div key={project.id} className="flex items-center gap-2 text-sm" data-testid={`fetch-status-${project.id}`}>
                  {status === 'pending' && <div className="w-2 h-2 bg-[#a0aec0]" />}
                  {status === 'fetching' && <RefreshCw className="w-3 h-3 text-[#3b82f6] animate-spin" />}
                  {status === 'done' && <div className="w-2 h-2 bg-[#10b981]" />}
                  {status === 'error' && <div className="w-2 h-2 bg-[#ef4444]" />}
                  <span className={
                    status === 'fetching' ? 'text-[#3b82f6]' :
                    status === 'done' ? 'text-[#10b981]' :
                    status === 'error' ? 'text-[#ef4444]' :
                    'text-[#a0aec0]'
                  }>
                    {project.name.split('.')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <main className={`pt-16 ${Object.keys(fetchProgress).length > 0 ? 'mt-12' : ''}`}>
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
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#a0aec0]">
                <span>{connectedProjects.length} of {allProjects.length} apps connected</span>
                <span className="w-1 h-1 bg-[#3b82f6]" />
                <span>{snapshots.length} with live metrics</span>
                <span className="w-1 h-1 bg-[#3b82f6]" />
                <span>{historicalData.length} snapshots over {financialMetrics.daysElapsed > 1 
                  ? `${financialMetrics.daysElapsed.toFixed(1)} days` 
                  : `${financialMetrics.hoursElapsed.toFixed(1)} hours`}</span>
                <span className="w-1 h-1 bg-[#3b82f6]" />
                <span>Updated: {lastRefreshTime ? format(lastRefreshTime, "MMM d, HH:mm:ss") : "—"}</span>
                <span className="w-1 h-1 bg-[#3b82f6]" />
                <div className="flex items-center gap-2">
                  <span>Growth view:</span>
                  <select 
                    value={growthTimeframe} 
                    onChange={(e) => setGrowthTimeframe(e.target.value as GrowthTimeframe)}
                    className="bg-[#1a1a1a] border border-[#2d2d2d] text-white px-2 py-1 text-sm"
                    data-testid="select-growth-timeframe"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
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
            {metricVisibility.users && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-[#3b82f6]" />
                  <h2 className="text-2xl font-semibold">User Metrics</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
                  <StatCard 
                    label="Total Users" 
                    value={formatNum(aggregatedStats.totalUsers)} 
                    change={aggregatedStats.totalUsers > 0 && historicalData.length >= 2 ? financialMetrics.userGrowthRate : undefined}
                    icon={Users} 
                    color="blue"
                    delay={0.1}
                    testId="stat-total-users"
                  />
                  <StatCard 
                    label="Monthly Active" 
                    value={formatNum(aggregatedStats.mau)} 
                    change={aggregatedStats.mau > 0 && historicalData.length >= 2 ? financialMetrics.mauGrowthRate : undefined}
                    icon={TrendingUp} 
                    color="purple"
                    delay={0.12}
                    testId="stat-mau"
                  />
                  <StatCard 
                    label="Weekly Active" 
                    value={formatNum(aggregatedStats.wau)} 
                    change={aggregatedStats.wau > 0 && historicalData.length >= 2 ? financialMetrics.wauGrowthRate : undefined}
                    icon={Calendar} 
                    color="cyan"
                    delay={0.14}
                    testId="stat-wau"
                  />
                  <StatCard 
                    label="Daily Active" 
                    value={formatNum(aggregatedStats.dau)} 
                    change={aggregatedStats.dau > 0 && historicalData.length >= 2 ? financialMetrics.dauGrowthRate : undefined}
                    icon={Activity} 
                    color="green"
                    delay={0.16}
                    testId="stat-dau"
                  />
                  <StatCard 
                    label="Paying Users" 
                    value={formatNum(aggregatedStats.payingUsers)} 
                    change={aggregatedStats.payingUsers > 0 && historicalData.length >= 2 ? financialMetrics.payingGrowthRate : undefined}
                    icon={CreditCard} 
                    color="green"
                    delay={0.18}
                    testId="stat-paying-users"
                  />
                </div>
              </>
            )}

            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-[#10b981]" />
              <h2 className="text-2xl font-semibold">Activity & Engagement</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {metricVisibility.revenue && (
                <StatCard 
                  label="Net Income" 
                  value={formatNum(aggregatedStats.totalRevenue, "$")} 
                  change={aggregatedStats.totalRevenue > 0 && historicalData.length >= 2 ? financialMetrics.revenueGrowthRate : undefined}
                  icon={DollarSign} 
                  color="green"
                  delay={0.2}
                  testId="stat-net-revenue"
                />
              )}
              {metricVisibility.revenue && (
                <StatCard 
                  label="All Payments" 
                  value={formatNum(aggregatedStats.totalPayments)} 
                  change={aggregatedStats.totalPayments > 0 && historicalData.length >= 2 ? financialMetrics.paymentsGrowthRate : undefined}
                  icon={CreditCard} 
                  color="green"
                  delay={0.21}
                  testId="stat-total-payments"
                />
              )}
              {metricVisibility.engagement && (
                <StatCard 
                  label="Daily Actions" 
                  value={formatNum(aggregatedStats.keyActions)} 
                  change={aggregatedStats.keyActions > 0 && historicalData.length >= 2 ? financialMetrics.actionsGrowthRate : undefined}
                  icon={MousePointer} 
                  color="blue"
                  delay={0.22}
                  testId="stat-key-actions"
                />
              )}
              {metricVisibility.engagement && (
                <StatCard 
                  label="Daily Sessions" 
                  value={formatNum(aggregatedStats.sessions)} 
                  change={aggregatedStats.sessions > 0 && historicalData.length >= 2 ? financialMetrics.sessionsGrowthRate : undefined}
                  icon={Target} 
                  color="purple"
                  delay={0.24}
                  testId="stat-sessions"
                />
              )}
              {metricVisibility.onchain && (
                <StatCard 
                  label="All Transfers" 
                  value={formatNum(aggregatedStats.totalTransactions)} 
                  change={aggregatedStats.totalTransactions > 0 && historicalData.length >= 2 ? financialMetrics.txGrowthRate : undefined}
                  icon={Zap} 
                  color="yellow"
                  delay={0.26}
                  testId="stat-transactions"
                />
              )}
              {metricVisibility.onchain && (
                <StatCard 
                  label="Total Volume" 
                  value={formatNum(aggregatedStats.totalVolume, "$")} 
                  change={aggregatedStats.totalVolume > 0 && historicalData.length >= 2 ? financialMetrics.volumeGrowthRate : undefined}
                  icon={Wallet} 
                  color="cyan"
                  delay={0.28}
                  testId="stat-volume"
                />
              )}
            </div>
          </div>
        </section>

        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <DollarSign className="w-6 h-6 text-[#10b981]" />
              <h2 className="text-2xl font-semibold">Financial KPIs</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Block delay={0.05} className="min-h-[130px]">
                <div className="text-xs text-[#a0aec0] uppercase tracking-wider mb-3 font-medium flex items-center gap-1">MRR <InfoButton metric="mrr" /></div>
                <div className="text-2xl md:text-3xl font-bold text-[#10b981]" data-testid="value-mrr">{formatNum(financialMetrics.mrr, "$")}</div>
                <div className="text-xs text-[#666] mt-2">Net Revenue (Current)</div>
              </Block>
              <Block delay={0.1} className="min-h-[130px]">
                <div className="text-xs text-[#a0aec0] uppercase tracking-wider mb-3 font-medium flex items-center gap-1">ARR <InfoButton metric="arr" /></div>
                <div className="text-2xl md:text-3xl font-bold text-[#10b981]" data-testid="value-arr">{formatNum(financialMetrics.arr, "$")}</div>
                <div className="text-xs text-[#666] mt-2">Annualized Run Rate</div>
              </Block>
              <Block delay={0.15} className="min-h-[130px]">
                <div className="text-xs text-[#a0aec0] uppercase tracking-wider mb-3 font-medium flex items-center gap-1">ARPU <InfoButton metric="arpu" /></div>
                <div className="text-2xl md:text-3xl font-bold" data-testid="value-arpu">${financialMetrics.arpu.toFixed(2)}</div>
                <div className="text-xs text-[#666] mt-2">Per Paying User</div>
              </Block>
              <Block delay={0.2} className="min-h-[130px]">
                <div className="text-xs text-[#a0aec0] uppercase tracking-wider mb-3 font-medium flex items-center gap-1">Conversion <InfoButton metric="conversion" /></div>
                <div className="text-2xl md:text-3xl font-bold" data-testid="value-conversion">{financialMetrics.conversionRate.toFixed(2)}%</div>
                <div className="text-xs text-[#666] mt-2">Paid / Total Users</div>
              </Block>
            </div>

            <div className="text-xs text-[#666] mb-4 italic">
              * Growth = (avg change per hour / avg value) × target hours. Based on {financialMetrics.dataPoints} snapshots over {financialMetrics.daysElapsed > 1 
                ? `${financialMetrics.daysElapsed.toFixed(1)} days` 
                : `${financialMetrics.hoursElapsed.toFixed(1)} hours`}.
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Block delay={0.25}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-[#3b82f6]">
                    Growth Rates ({growthTimeframe === 'daily' ? 'Daily' : growthTimeframe === 'weekly' ? 'Weekly' : 'Monthly'})
                  </h3>
                  <span 
                    data-testid="confidence-badge"
                    className={`text-xs px-2 py-0.5 font-medium ${
                      financialMetrics.confidence === 'high' 
                        ? 'bg-[#10b981]/20 text-[#10b981]' 
                        : financialMetrics.confidence === 'medium'
                        ? 'bg-[#f59e0b]/20 text-[#f59e0b]'
                        : 'bg-[#ef4444]/20 text-[#ef4444]'
                    }`}
                    title={financialMetrics.confidenceReason}
                  >
                    {financialMetrics.confidence === 'high' ? 'Reliable' : financialMetrics.confidence === 'medium' ? 'Developing' : 'Early'}
                  </span>
                </div>
                <p className="text-xs text-[#6b7280] mb-4" data-testid="confidence-reason">
                  {financialMetrics.confidenceReason}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0] flex items-center gap-1">DAU Growth <InfoButton metric="dauGrowth" /></span>
                    <span data-testid="value-dau-growth" className={`font-semibold ${financialMetrics.dauGrowthRate >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                      {financialMetrics.dauGrowthRate >= 0 ? "+" : ""}{financialMetrics.dauGrowthRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0] flex items-center gap-1">MAU Growth <InfoButton metric="mauGrowth" /></span>
                    <span data-testid="value-mau-growth" className={`font-semibold ${financialMetrics.mauGrowthRate >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                      {financialMetrics.mauGrowthRate >= 0 ? "+" : ""}{financialMetrics.mauGrowthRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0] flex items-center gap-1">Revenue Growth <InfoButton metric="revenueGrowth" /></span>
                    <span data-testid="value-revenue-growth" className={`font-semibold ${financialMetrics.revenueGrowthRate >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                      {financialMetrics.revenueGrowthRate >= 0 ? "+" : ""}{financialMetrics.revenueGrowthRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#2d2d2d] pt-3">
                    <span className="text-[#a0aec0] flex items-center gap-1">NRR (Est.) <InfoButton metric="nrr" /></span>
                    <span data-testid="value-nrr" className="font-semibold text-[#8b5cf6]">{financialMetrics.nrr.toFixed(0)}%</span>
                  </div>
                </div>
              </Block>

              <Block delay={0.3}>
                <h3 className="text-lg font-medium mb-4 text-[#f59e0b]">Unit Economics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0] flex items-center gap-1">LTV (Est.) <InfoButton metric="ltv" /></span>
                    <span data-testid="value-ltv" className="font-semibold">${financialMetrics.ltv.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0] flex items-center gap-1">CAC (Est.) <InfoButton metric="cac" /></span>
                    <span data-testid="value-cac" className="font-semibold">${financialMetrics.estimatedCac.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0] flex items-center gap-1">LTV:CAC <InfoButton metric="ltvCac" /></span>
                    <span data-testid="value-ltv-cac" className={`font-semibold ${financialMetrics.ltvCacRatio >= 3 ? "text-[#10b981]" : financialMetrics.ltvCacRatio >= 2 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>
                      {financialMetrics.ltvCacRatio.toFixed(1)}x
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#2d2d2d] pt-3">
                    <span className="text-[#a0aec0] flex items-center gap-1">Payback Period <InfoButton metric="payback" /></span>
                    <span data-testid="value-payback" className="font-semibold">{financialMetrics.paybackMonths.toFixed(1)} mo</span>
                  </div>
                </div>
              </Block>

              <Block delay={0.35}>
                <h3 className="text-lg font-medium mb-4 text-[#06b6d4]">Engagement Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0] flex items-center gap-1">DAU/MAU Ratio <InfoButton metric="dauMauRatio" /></span>
                    <span data-testid="value-stickiness" className={`font-semibold ${financialMetrics.stickiness >= 20 ? "text-[#10b981]" : financialMetrics.stickiness >= 10 ? "text-[#f59e0b]" : "text-white"}`}>
                      {financialMetrics.stickiness.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0] flex items-center gap-1">Revenue/User <InfoButton metric="revenuePerUser" /></span>
                    <span data-testid="value-rev-per-user" className="font-semibold">${financialMetrics.revenuePerUser.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0] flex items-center gap-1">Transfers/User <InfoButton metric="txnsPerUser" /></span>
                    <span data-testid="value-txns-per-user" className="font-semibold">{financialMetrics.transactionsPerUser.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#2d2d2d] pt-3">
                    <span className="text-[#a0aec0] flex items-center gap-1">Actions/User <InfoButton metric="actionsPerUser" /></span>
                    <span data-testid="value-actions-per-user" className="font-semibold">{financialMetrics.engagementPerUser.toFixed(1)}</span>
                  </div>
                </div>
              </Block>
            </div>

            <Block delay={0.4} className="bg-gradient-to-r from-[#8b5cf6]/10 to-[#06b6d4]/10 border-[#8b5cf6]/30">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">Zeno Studio Valuation <InfoButton metric="valuation" /></h3>
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

              <div className="text-xs text-[#666] mb-4 flex items-center gap-1">Valuation methodology breakdown: <InfoButton metric="valBlended" /></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
                <div className="p-4 bg-[#1a1a1a] border border-[#2d2d2d]">
                  <div className="text-[#a0aec0] text-xs mb-2 flex items-center gap-1">Revenue (10-50x) <InfoButton metric="valRevMultiple" /></div>
                  <div className="font-bold text-lg" data-testid="value-rev-multiple">
                    ${(financialMetrics.web3Valuation.revenueMultiple.mid / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className="p-4 bg-[#1a1a1a] border border-[#2d2d2d]">
                  <div className="text-[#a0aec0] text-xs mb-2 flex items-center gap-1">Volume (1-10%) <InfoButton metric="valVolumeMultiple" /></div>
                  <div className="font-bold text-lg" data-testid="value-vol-multiple">
                    ${(financialMetrics.web3Valuation.volumeMultiple.mid / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className="p-4 bg-[#1a1a1a] border border-[#2d2d2d]">
                  <div className="text-[#a0aec0] text-xs mb-2 flex items-center gap-1">Per DAU ($50-300) <InfoButton metric="valPerDau" /></div>
                  <div className="font-bold text-lg" data-testid="value-dau-multiple">
                    ${(financialMetrics.web3Valuation.dauBased.mid / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className="p-4 bg-[#1a1a1a] border border-[#2d2d2d]">
                  <div className="text-[#a0aec0] text-xs mb-2 flex items-center gap-1">Per MAU ($10-75) <InfoButton metric="valPerMau" /></div>
                  <div className="font-bold text-lg" data-testid="value-mau-multiple">
                    ${(financialMetrics.web3Valuation.mauBased.mid / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className="p-4 bg-[#1a1a1a] border border-[#2d2d2d]">
                  <div className="text-[#a0aec0] text-xs mb-2 flex items-center gap-1">Per Wallet ($100-1.5K) <InfoButton metric="valPerWallet" /></div>
                  <div className="font-bold text-lg" data-testid="value-wallet-multiple">
                    ${(financialMetrics.web3Valuation.walletBased.mid / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-3 text-xs text-center mt-2">
                {[
                  { label: 'Revenue', weight: financialMetrics.valuationWeights.revenue },
                  { label: 'Volume', weight: financialMetrics.valuationWeights.volume },
                  { label: 'DAU', weight: financialMetrics.valuationWeights.dau },
                  { label: 'MAU', weight: financialMetrics.valuationWeights.mau },
                  { label: 'Wallet', weight: financialMetrics.valuationWeights.wallet },
                ].map(w => {
                  const totalWeight = Object.values(financialMetrics.valuationWeights).reduce((a: number, b: number) => a + b, 0);
                  const pct = ((w.weight / totalWeight) * 100).toFixed(0);
                  return (
                    <div key={w.label} className="text-[#666]">
                      {pct}% weight
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 text-xs text-[#666] italic">
                * Blended valuation uses Web3/dApp industry multiples: revenue (10-50x for high-growth), transaction volume (1-10%), 
                DAU ($50-300/user for gaming/miniapps), MAU ($10-75/user), and wallet value ($100-1.5K/active wallet).
              </div>
            </Block>
          </div>
        </section>

        {metricVisibility.users && (
          <section className="border-b border-[#2d2d2d]">
            <div className="max-w-7xl mx-auto p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Users to Payers - Absolute totals */}
                <Block delay={0.1}>
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-5 h-5 text-[#3b82f6]" />
                    <h3 className="text-lg font-semibold">Users → Payers</h3>
                    <span className="text-xs text-[#666] ml-auto">Cumulative totals</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 py-4">
                    <div className="text-center p-4 bg-[#3b82f6]/10 border border-[#3b82f6]/30 min-w-[120px]">
                      <div className="text-2xl font-bold text-[#3b82f6]">{formatNum(aggregatedStats.totalUsers)}</div>
                      <div className="text-xs text-[#a0aec0]">Total Users</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <ArrowUpRight className="w-5 h-5 text-[#666] rotate-90" />
                      <div className="text-xs text-[#666]">
                        {aggregatedStats.totalUsers > 0 
                          ? ((aggregatedStats.payingUsers / aggregatedStats.totalUsers) * 100).toFixed(2) 
                          : "0.00"}%
                      </div>
                    </div>
                    <div className="text-center p-4 bg-[#10b981]/10 border border-[#10b981]/30 min-w-[120px]">
                      <div className="text-2xl font-bold text-[#10b981]">{formatNum(aggregatedStats.payingUsers)}</div>
                      <div className="text-xs text-[#a0aec0]">Paying Users</div>
                    </div>
                  </div>
                  <div className="text-xs text-[#666] text-center mt-4">
                    Conversion: Users who completed their first payment action
                  </div>
                </Block>

                {/* Active Users - Rolling metrics */}
                <Block delay={0.2}>
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-5 h-5 text-[#8b5cf6]" />
                    <h3 className="text-lg font-semibold">Active Users</h3>
                    <span className="text-xs text-[#666] ml-auto">Rolling windows</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 py-4">
                    <div className="text-center p-4 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 min-w-[100px]">
                      <div className="text-2xl font-bold text-[#8b5cf6]">{formatNum(aggregatedStats.mau)}</div>
                      <div className="text-xs text-[#a0aec0]">MAU</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <ArrowUpRight className="w-5 h-5 text-[#666] rotate-90" />
                      <div className="text-xs text-[#666]">{financialMetrics.wauToMau.toFixed(1)}%</div>
                    </div>
                    <div className="text-center p-4 bg-[#06b6d4]/10 border border-[#06b6d4]/30 min-w-[100px]">
                      <div className="text-2xl font-bold text-[#06b6d4]">{formatNum(aggregatedStats.wau)}</div>
                      <div className="text-xs text-[#a0aec0]">WAU</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <ArrowUpRight className="w-5 h-5 text-[#666] rotate-90" />
                      <div className="text-xs text-[#666]">{financialMetrics.dauToWau.toFixed(1)}%</div>
                    </div>
                    <div className="text-center p-4 bg-[#10b981]/10 border border-[#10b981]/30 min-w-[100px]">
                      <div className="text-2xl font-bold text-[#10b981]">{formatNum(aggregatedStats.dau)}</div>
                      <div className="text-xs text-[#a0aec0]">DAU</div>
                    </div>
                  </div>
                  <div className="text-xs text-[#666] text-center mt-4">
                    Retention: MAU → WAU → DAU shows user engagement over 30d/7d/1d windows
                  </div>
                </Block>
              </div>
            </div>
          </section>
        )}

        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <BarChart3 className="w-6 h-6 text-[#06b6d4]" />
              <h2 className="text-2xl font-semibold">Advanced Analytics</h2>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {metricVisibility.users && (
                <Block delay={0.1} className="flex-1 min-w-[280px] max-w-full md:max-w-[calc(50%-8px)] lg:max-w-[calc(25%-12px)]">
                  <h3 className="text-lg font-medium mb-4 text-[#3b82f6]">Cohort Ratios</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0] flex items-center gap-1">DAU/WAU <InfoButton metric="dauWau" /></span>
                      <span className={`font-semibold ${financialMetrics.dauWauRatio >= 30 ? "text-[#10b981]" : financialMetrics.dauWauRatio >= 20 ? "text-[#f59e0b]" : "text-white"}`}>
                        {financialMetrics.dauWauRatio.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0] flex items-center gap-1">WAU/MAU <InfoButton metric="wauMau" /></span>
                      <span className={`font-semibold ${financialMetrics.wauMauRatio >= 50 ? "text-[#10b981]" : financialMetrics.wauMauRatio >= 30 ? "text-[#f59e0b]" : "text-white"}`}>
                        {financialMetrics.wauMauRatio.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0] flex items-center gap-1">Paying/MAU <InfoButton metric="payingMau" /></span>
                      <span className={`font-semibold ${financialMetrics.payingMauRatio >= 5 ? "text-[#10b981]" : financialMetrics.payingMauRatio >= 2 ? "text-[#f59e0b]" : "text-white"}`}>
                        {financialMetrics.payingMauRatio.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#2d2d2d] pt-3">
                      <span className="text-[#a0aec0] flex items-center gap-1">DAU/MAU (Stickiness) <InfoButton metric="stickiness" /></span>
                      <span className={`font-semibold ${financialMetrics.stickiness >= 20 ? "text-[#10b981]" : financialMetrics.stickiness >= 10 ? "text-[#f59e0b]" : "text-white"}`}>
                        {financialMetrics.stickiness.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </Block>
              )}

              {metricVisibility.revenue && (
                <Block delay={0.15} className="flex-1 min-w-[280px] max-w-full md:max-w-[calc(50%-8px)] lg:max-w-[calc(25%-12px)]">
                  <h3 className="text-lg font-medium mb-4 text-[#10b981]">Revenue Analytics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0] flex items-center gap-1">ARPPU <InfoButton metric="arppu" /></span>
                      <span className="font-semibold">${financialMetrics.arppu.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0] flex items-center gap-1">Revenue/Tx <InfoButton metric="revPerTx" /></span>
                      <span className="font-semibold">${financialMetrics.revenuePerTx.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0] flex items-center gap-1">Avg Tx Size <InfoButton metric="avgTxSize" /></span>
                      <span className="font-semibold">${financialMetrics.avgTxSize.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#2d2d2d] pt-3">
                      <span className="text-[#a0aec0] flex items-center gap-1">ARPU (All) <InfoButton metric="arpuAll" /></span>
                      <span className="font-semibold">${financialMetrics.arpuAll.toFixed(2)}</span>
                    </div>
                  </div>
                </Block>
              )}

              {metricVisibility.onchain && (
                <Block delay={0.2} className="flex-1 min-w-[280px] max-w-full md:max-w-[calc(50%-8px)] lg:max-w-[calc(25%-12px)]">
                  <h3 className="text-lg font-medium mb-4 text-[#f59e0b]">On-chain Health</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0] flex items-center gap-1">Tx/User <InfoButton metric="txPerUser" /></span>
                      <span className="font-semibold">{financialMetrics.txPerUser.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0] flex items-center gap-1">Volume/Tx <InfoButton metric="volumePerTx" /></span>
                      <span className="font-semibold">${financialMetrics.volumePerTx.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0] flex items-center gap-1">Volume/DAU <InfoButton metric="volumePerDau" /></span>
                      <span className="font-semibold">${financialMetrics.volumePerActiveUser.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#2d2d2d] pt-3">
                      <span className="text-[#a0aec0] flex items-center gap-1">Total Volume <InfoButton metric="totalVolume" /></span>
                      <span className="font-semibold">{formatNum(aggregatedStats.totalVolume, "$")}</span>
                    </div>
                  </div>
                </Block>
              )}

              {metricVisibility.engagement && (
                <Block delay={0.25} className="flex-1 min-w-[280px] max-w-full md:max-w-[calc(50%-8px)] lg:max-w-[calc(25%-12px)]">
                  <h3 className="text-lg font-medium mb-4 text-[#8b5cf6]">Engagement Quality</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0] flex items-center gap-1">Actions/Session <InfoButton metric="actionsPerSession" /></span>
                      <span className="font-semibold">{financialMetrics.actionsPerSession.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0] flex items-center gap-1">Actions/DAU <InfoButton metric="actionsPerDau" /></span>
                      <span className="font-semibold">{financialMetrics.actionsPerDAU.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0] flex items-center gap-1">Sessions/DAU <InfoButton metric="sessionsPerDau" /></span>
                      <span className="font-semibold">{financialMetrics.sessionsPerDAU.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#2d2d2d] pt-3">
                      <span className="text-[#a0aec0] flex items-center gap-1">Total Sessions <InfoButton metric="totalSessions" /></span>
                      <span className="font-semibold">{formatNum(aggregatedStats.sessions)}</span>
                    </div>
                  </div>
                </Block>
              )}
            </div>
          </div>
        </section>

        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <LineChartIcon className="w-6 h-6 text-[#3b82f6]" />
              <h2 className="text-2xl font-semibold">Growth Trends</h2>
              <div className="ml-auto flex gap-1">
                {(['7d', '30d', 'all'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTrendRange(range)}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      trendRange === range
                        ? 'bg-[#3b82f6] text-white'
                        : 'bg-[#2d2d2d] text-[#a0aec0] hover:bg-[#3d3d3d]'
                    }`}
                    data-testid={`btn-trend-${range}`}
                  >
                    {range === 'all' ? 'All' : range.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {metricVisibility.users && (
                <Block delay={0.1}>
                  <h3 className="text-lg font-medium mb-4">Daily Active Users by App</h3>
                  <div className="h-72" data-testid="chart-dau-by-app">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={filteredTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                        <XAxis 
                          dataKey="timestamp" 
                          type="number"
                          scale="time"
                          domain={['dataMin', 'dataMax']}
                          stroke="#666" 
                          tick={{ fill: '#a0aec0', fontSize: 10 }} 
                          tickFormatter={(ts) => smartTickFormat(ts, filteredTrendData)}
                          tickCount={6}
                          minTickGap={40}
                        />
                        <YAxis stroke="#666" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d", borderRadius: 0 }} 
                          labelStyle={{ color: '#fff' }}
                          labelFormatter={(ts) => format(new Date(ts), "MMM d, yyyy HH:mm:ss")}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        {perAppTimeSeries.hasPerAppData ? (
                          perAppTimeSeries.apps.filter(app => app.showUsers).map((app) => {
                            return (
                              <Line 
                                key={app.key}
                                type="monotone" 
                                dataKey={app.dauKey} 
                                name={app.name}
                                stroke={appColorMap[app.key] || '#3b82f6'} 
                                strokeWidth={2}
                                dot={false}
                                connectNulls
                              />
                            );
                          })
                        ) : (
                          <Line 
                            type="monotone" 
                            dataKey="totalDAU" 
                            name="Total DAU"
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={false}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Block>
              )}

              {metricVisibility.users && (
                <Block delay={0.15}>
                  <h3 className="text-lg font-medium mb-4">Monthly Active Users by App</h3>
                <div className="h-72" data-testid="chart-mau-by-app">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                      <XAxis 
                        dataKey="timestamp" 
                        type="number"
                        scale="time"
                        domain={['dataMin', 'dataMax']}
                        stroke="#666" 
                        tick={{ fill: '#a0aec0', fontSize: 10 }} 
                        tickFormatter={(ts) => smartTickFormat(ts, filteredTrendData)}
                        tickCount={6}
                        minTickGap={40}
                      />
                      <YAxis stroke="#666" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d", borderRadius: 0 }} 
                        labelStyle={{ color: '#fff' }}
                        labelFormatter={(ts) => format(new Date(ts), "MMM d, yyyy HH:mm:ss")}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      {perAppTimeSeries.hasPerAppData ? (
                        perAppTimeSeries.apps.filter(app => app.showUsers).map((app) => {
                          return (
                            <Line 
                              key={app.key}
                              type="monotone" 
                              dataKey={`${app.key}_MAU`} 
                              name={app.name}
                              stroke={appColorMap[app.key] || '#3b82f6'} 
                              strokeWidth={2}
                              dot={false}
                              connectNulls
                            />
                          );
                        })
                      ) : (
                        <Line 
                          type="monotone" 
                          dataKey="totalMAU" 
                          name="Total MAU"
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          dot={false}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Block>
              )}

              {metricVisibility.revenue && (
                <Block delay={0.2}>
                  <h3 className="text-lg font-medium mb-4">Monthly Revenue by App</h3>
                <p className="text-xs text-[#6b7280] mb-3">Cumulative revenue (MRR equivalent)</p>
                <div className="h-72" data-testid="chart-revenue-by-app">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                      <XAxis 
                        dataKey="timestamp" 
                        type="number"
                        scale="time"
                        domain={['dataMin', 'dataMax']}
                        stroke="#666" 
                        tick={{ fill: '#a0aec0', fontSize: 10 }} 
                        tickFormatter={(ts) => smartTickFormat(ts, filteredTrendData)}
                        tickCount={6}
                        minTickGap={40}
                      />
                      <YAxis stroke="#666" tick={{ fill: '#a0aec0', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d", borderRadius: 0 }} 
                        labelStyle={{ color: '#fff' }}
                        labelFormatter={(ts) => format(new Date(ts), "MMM d, yyyy HH:mm:ss")}
                        formatter={(value: any) => [formatNum(Number(value), "$"), '']}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      {perAppTimeSeries.hasPerAppData ? (
                        perAppTimeSeries.apps.filter(app => app.showRevenue).map((app) => {
                          return (
                            <Line 
                              key={app.key}
                              type="monotone" 
                              dataKey={app.revenueKey} 
                              name={app.name}
                              stroke={appColorMap[app.key] || '#3b82f6'} 
                              strokeWidth={2}
                              dot={false}
                              connectNulls
                            />
                          );
                        })
                      ) : (
                        <Line 
                          type="monotone" 
                          dataKey="totalRevenue" 
                          name="Total Revenue"
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={false}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Block>
              )}

              {metricVisibility.revenue && estimatedDailyRevenueData.hasData && (
                <Block delay={0.2}>
                  <h3 className="text-lg font-medium mb-4">Estimated Daily Revenue Rate</h3>
                  <p className="text-xs text-[#6b7280] mb-3">Average daily revenue rate based on cumulative change over time</p>
                  <div className="h-72" data-testid="chart-daily-revenue-rate">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={filteredRevenueRateData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                        <XAxis 
                          dataKey="timestamp" 
                          type="number"
                          scale="time"
                          domain={['dataMin', 'dataMax']}
                          stroke="#666" 
                          tick={{ fill: '#a0aec0', fontSize: 10 }} 
                          tickFormatter={(ts) => smartTickFormat(ts, filteredRevenueRateData)}
                          tickCount={6}
                          minTickGap={40}
                        />
                        <YAxis stroke="#666" tick={{ fill: '#a0aec0', fontSize: 12 }} tickFormatter={(v) => `$${v.toFixed(0)}`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d", borderRadius: 0 }} 
                          labelStyle={{ color: '#fff' }}
                          labelFormatter={(ts) => format(new Date(ts), "MMM d, yyyy HH:mm:ss")}
                          formatter={(value: any) => [`$${Number(value).toFixed(2)}/day`, '']}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        {estimatedDailyRevenueData.apps.filter(app => app.showRevenue).map((app) => {
                          return (
                            <Line 
                              key={app.key}
                              type="monotone" 
                              dataKey={`${app.key}_DailyRate`} 
                              name={app.name}
                              stroke={appColorMap[app.key] || '#3b82f6'} 
                              strokeWidth={2}
                              dot={false}
                              connectNulls
                            />
                          );
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Block>
              )}

              <Block delay={0.25} className="lg:col-span-2">
                <h3 className="text-lg font-medium mb-4">Daily Activity Comparison</h3>
                <p className="text-xs text-[#6b7280] mb-3">Transfers & Volume extrapolated to 24h rate; Payers shown as point-in-time</p>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={filteredActivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                      <XAxis 
                        dataKey="timestamp" 
                        type="number"
                        scale="time"
                        domain={['dataMin', 'dataMax']}
                        stroke="#666" 
                        tick={{ fill: '#a0aec0', fontSize: 10 }} 
                        tickFormatter={(ts) => smartTickFormat(ts, filteredActivityData)}
                        tickCount={6}
                        minTickGap={40}
                      />
                      <YAxis yAxisId="left" stroke="#666" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#666" tick={{ fill: '#a0aec0', fontSize: 12 }} tickFormatter={(v) => `$${v.toFixed(0)}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d", borderRadius: 0 }} 
                        labelStyle={{ color: '#fff' }}
                        labelFormatter={(ts) => format(new Date(ts), "MMM d, yyyy HH:mm:ss")}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Line yAxisId="left" type="monotone" dataKey="dailyTransactions" name="Est. Daily Transfers" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Line yAxisId="left" type="monotone" dataKey="totalPaying" name="Paying Users" stroke="#10b981" strokeWidth={2} dot={false} />
                      <Bar yAxisId="right" dataKey="dailyVolume" name="Est. Daily Volume ($)" fill="#f59e0b" opacity={0.6} />
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Block delay={0.1}>
                <h3 className="text-lg font-medium mb-4">Performance by App</h3>
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
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="MAU" fill="#8b5cf6" />
                      <Bar dataKey="Revenue" fill="#10b981" />
                      <Bar dataKey="Transfers" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Block>

              {radarData.length > 0 && snapshots.length >= 2 && (
                <Block delay={0.15}>
                  <h3 className="text-lg font-medium mb-4">Normalized Comparison (Radar)</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#2d2d2d" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#666', fontSize: 10 }} />
                        {snapshots.map((s) => {
                          const project = projects.find(p => p.id === s.projectId);
                          const name = project?.name.split('.')[0] || 'Unknown';
                          const appKey = s.projectId.slice(0, 8);
                          const color = appColorMap[appKey] || '#3b82f6';
                          return (
                            <Radar 
                              key={s.id} 
                              name={name} 
                              dataKey={name} 
                              stroke={color} 
                              fill={color} 
                              fillOpacity={0.2} 
                            />
                          );
                        })}
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d", borderRadius: 0 }} 
                          labelStyle={{ color: '#fff' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-xs text-[#666] mt-2 text-center">Values normalized to 0-100% relative to highest performer per metric</div>
                </Block>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Block delay={0.2}>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">Engagement vs Revenue Correlation <InfoButton metric="engagementRevenue" /></h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                      <XAxis 
                        dataKey="KeyActions" 
                        type="number" 
                        stroke="#666" 
                        tick={{ fill: '#a0aec0', fontSize: 12 }}
                        name="Key Actions"
                        label={{ value: 'Key Actions', position: 'bottom', fill: '#a0aec0', fontSize: 12 }}
                      />
                      <YAxis 
                        dataKey="Revenue" 
                        type="number" 
                        stroke="#666" 
                        tick={{ fill: '#a0aec0', fontSize: 12 }}
                        name="Revenue"
                        label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft', fill: '#a0aec0', fontSize: 12 }}
                      />
                      <ZAxis dataKey="DAU" range={[50, 500]} name="DAU" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d", borderRadius: 0 }} 
                        cursor={{ strokeDasharray: '3 3' }}
                        formatter={(value: any, name: string) => [formatNum(Number(value)), name]}
                      />
                      <Scatter 
                        name="Apps" 
                        data={appComparisonData} 
                        fill="#8b5cf6"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-xs text-[#666] mt-2 text-center">Bubble size represents DAU</div>
              </Block>

              <Block delay={0.25}>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">Volume vs Transfers <InfoButton metric="volumeTransactions" /></h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                      <XAxis 
                        dataKey="Transfers" 
                        type="number" 
                        stroke="#666" 
                        tick={{ fill: '#a0aec0', fontSize: 12 }}
                        name="Transfers"
                        label={{ value: 'Transfers', position: 'bottom', fill: '#a0aec0', fontSize: 12 }}
                      />
                      <YAxis 
                        dataKey="Volume" 
                        type="number" 
                        stroke="#666" 
                        tick={{ fill: '#a0aec0', fontSize: 12 }}
                        name="Volume"
                        label={{ value: 'Volume ($)', angle: -90, position: 'insideLeft', fill: '#a0aec0', fontSize: 12 }}
                      />
                      <ZAxis dataKey="MAU" range={[50, 500]} name="MAU" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d", borderRadius: 0 }} 
                        cursor={{ strokeDasharray: '3 3' }}
                        formatter={(value: any, name: string) => [typeof value === 'number' ? formatNum(value) : value, name]}
                      />
                      <Scatter 
                        name="Apps" 
                        data={appComparisonData} 
                        fill="#06b6d4"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-xs text-[#666] mt-2 text-center">Bubble size represents MAU</div>
              </Block>
            </div>
          </div>
        </section>

        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-6 h-6 text-[#3b82f6]" />
              <h2 className="text-2xl font-semibold">Projections</h2>
              <InfoButton metric="projections" />
              <div className="ml-auto flex flex-wrap gap-3 text-xs">
                <span className="text-[#a0aec0]">
                  Users <span className={projections.userGrowthRate >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}>{projections.userGrowthRate >= 0 ? "+" : ""}{projections.userGrowthRate.toFixed(1)}%</span>/mo
                </span>
                <span className="text-[#a0aec0]">
                  Revenue <span className={projections.revenueGrowthRate >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}>{projections.revenueGrowthRate >= 0 ? "+" : ""}{projections.revenueGrowthRate.toFixed(1)}%</span>/mo
                </span>
                <span className="text-[#a0aec0]">
                  Transfers <span className={projections.txGrowthRate >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}>{projections.txGrowthRate >= 0 ? "+" : ""}{projections.txGrowthRate.toFixed(1)}%</span>/mo
                </span>
                <span className="text-[#666]">({(projections.decayFactor * 100).toFixed(0)}% decay/mo)</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Block delay={0.1}>
                <div className="text-sm text-[#a0aec0] uppercase tracking-wider mb-4">30-Day Forecast</div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">MAU</span>
                    <span className="text-xl font-semibold" data-testid="value-30d-mau">{formatNum(projections.day30.users)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">MRR</span>
                    <span className="text-xl font-semibold text-[#10b981]" data-testid="value-30d-mrr">{formatNum(projections.day30.revenue, "$")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">ARR</span>
                    <span className="text-xl font-semibold text-[#10b981]" data-testid="value-30d-arr">{formatNum(projections.day30.arr, "$")}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#2d2d2d] pt-3">
                    <span className="text-[#a0aec0]">Transfers</span>
                    <span className="font-semibold" data-testid="value-30d-txns">{formatNum(projections.day30.transactions)}</span>
                  </div>
                </div>
              </Block>

              <Block delay={0.15}>
                <div className="text-sm text-[#a0aec0] uppercase tracking-wider mb-4">60-Day Forecast</div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">MAU</span>
                    <span className="text-xl font-semibold" data-testid="value-60d-mau">{formatNum(projections.day60.users)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">MRR</span>
                    <span className="text-xl font-semibold text-[#10b981]" data-testid="value-60d-mrr">{formatNum(projections.day60.revenue, "$")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">ARR</span>
                    <span className="text-xl font-semibold text-[#10b981]" data-testid="value-60d-arr">{formatNum(projections.day60.arr, "$")}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#2d2d2d] pt-3">
                    <span className="text-[#a0aec0]">Transfers</span>
                    <span className="font-semibold" data-testid="value-60d-txns">{formatNum(projections.day60.transactions)}</span>
                  </div>
                </div>
              </Block>

              <Block delay={0.2} className="bg-[#3b82f6]/10 border-[#3b82f6]/30">
                <div className="text-sm text-[#3b82f6] uppercase tracking-wider mb-4">90-Day Forecast</div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">MAU</span>
                    <span className="text-xl font-semibold" data-testid="value-90d-mau">{formatNum(projections.day90.users)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">MRR</span>
                    <span className="text-xl font-semibold text-[#10b981]" data-testid="value-90d-mrr">{formatNum(projections.day90.revenue, "$")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">ARR</span>
                    <span className="text-xl font-semibold text-[#10b981]" data-testid="value-90d-arr">{formatNum(projections.day90.arr, "$")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0]">Transfers</span>
                    <span className="text-xl font-semibold">{formatNum(projections.day90.transactions)}</span>
                  </div>
                </div>
              </Block>
            </div>
            <div className="text-xs text-[#666] mt-4 italic">
              * Growth rates derived from observed trends. Each successive month applies {((1 - projections.decayFactor) * 100).toFixed(0)}% decay to model natural growth deceleration as the base scales.
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
                          Transfers
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
                            {formatNum(snapshot.metrics.users.daily_active)}
                          </td>
                          <td className="py-4 px-4 text-right font-mono">
                            {formatNum(snapshot.metrics.users.monthly_active)}
                          </td>
                          <td className="py-4 px-4 text-right font-mono text-[#10b981]">
                            {formatNum(snapshot.metrics.revenue.net_income, "$")}
                          </td>
                          <td className="py-4 px-4 text-right font-mono">
                            {formatNum(snapshot.metrics.onchain.transactions)}
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
                                  <div className="text-lg font-semibold">{formatNum(snapshot.metrics.users.total)}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-[#a0aec0] mb-1">Paying Users</div>
                                  <div className="text-lg font-semibold">{formatNum(snapshot.metrics.users.paying)}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-[#a0aec0] mb-1">Key Actions</div>
                                  <div className="text-lg font-semibold">{formatNum(snapshot.metrics.engagement.key_actions)}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-[#a0aec0] mb-1">Sessions Today</div>
                                  <div className="text-lg font-semibold">{formatNum(snapshot.metrics.engagement.sessions_today)}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-[#a0aec0] mb-1">Onchain Volume</div>
                                  <div className="text-lg font-semibold">{formatNum(snapshot.metrics.onchain.volume, "$")}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-[#a0aec0] mb-1">WAU</div>
                                  <div className="text-lg font-semibold">{(snapshot.metrics.users as any).weekly_active ? formatNum((snapshot.metrics.users as any).weekly_active) : 'N/A'}</div>
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

        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-6 h-6 text-[#3b82f6]" />
              <h2 className="text-2xl font-semibold">Snapshot History</h2>
            </div>

            <Block delay={0.1}>
              <p className="text-sm text-[#a0aec0] mb-4">
                All recorded data points ({historicalSnapshots.length} snapshots)
              </p>
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm" data-testid="snapshot-history-table">
                  <thead className="sticky top-0 bg-[#1a1a1a]">
                    <tr className="border-b border-[#2d2d2d]">
                      <th className="text-left py-3 px-3 text-[#a0aec0] font-medium">Timestamp</th>
                      <th className="text-left py-3 px-3 text-[#a0aec0] font-medium">App</th>
                      <th className="text-right py-3 px-3 text-[#a0aec0] font-medium">DAU</th>
                      <th className="text-right py-3 px-3 text-[#a0aec0] font-medium">MAU</th>
                      <th className="text-right py-3 px-3 text-[#a0aec0] font-medium">Paying</th>
                      <th className="text-right py-3 px-3 text-[#a0aec0] font-medium">Revenue</th>
                      <th className="text-right py-3 px-3 text-[#a0aec0] font-medium">Transfers</th>
                      <th className="text-right py-3 px-3 text-[#a0aec0] font-medium">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalSnapshots
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((snapshot) => {
                        const project = projects.find(p => p.id === snapshot.projectId);
                        return (
                          <tr 
                            key={snapshot.id} 
                            className="border-b border-[#2d2d2d]/50 hover:bg-[#1a1a1a]/50"
                            data-testid={`snapshot-row-${snapshot.id}`}
                          >
                            <td className="py-2 px-3 font-mono text-xs">
                              {format(new Date(snapshot.timestamp), "MMM d, HH:mm:ss")}
                            </td>
                            <td className="py-2 px-3">
                              {project?.name.split('.')[0] || snapshot.metrics.app || 'Unknown'}
                            </td>
                            <td className="py-2 px-3 text-right font-mono">
                              {formatNum(snapshot.metrics.users.daily_active)}
                            </td>
                            <td className="py-2 px-3 text-right font-mono">
                              {formatNum(snapshot.metrics.users.monthly_active)}
                            </td>
                            <td className="py-2 px-3 text-right font-mono">
                              {formatNum(snapshot.metrics.users.paying)}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-[#10b981]">
                              {formatNum(snapshot.metrics.revenue.net_income, "$")}
                            </td>
                            <td className="py-2 px-3 text-right font-mono">
                              {formatNum(snapshot.metrics.onchain.transactions)}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-[#f59e0b]">
                              {formatNum(snapshot.metrics.onchain.volume, "$")}
                            </td>
                          </tr>
                        );
                      })}
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
