import React, { useRef, useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useInView } from "framer-motion";
import { 
  Users, TrendingUp, TrendingDown, DollarSign, Zap, Activity, 
  ArrowUpRight, ArrowDownRight, RefreshCw, ChevronDown, ChevronUp,
  BarChart3, LineChart as LineChartIcon, PieChart, CreditCard, MousePointer,
  Calendar, Wallet, Box, Target, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Block } from "@/components/block";
import { Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PasswordGate } from "@/components/password-gate";
import { format, subDays } from "date-fns";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis
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
  showUsersMetrics: boolean;
  showEngagementMetrics: boolean;
  showRevenueMetrics: boolean;
  showOnchainMetrics: boolean;
  chartColor: string | null;
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

const metricDefinitions: Record<string, { title: string; description: string; calculation: string; benchmarks: string; context: string }> = {
  mrr: {
    title: "Monthly Recurring Revenue (MRR)",
    description: "The total revenue the studio's portfolio generates each month across all tracked apps. This is the heartbeat metric — it tells you whether the combined product suite is producing real, recurring income or just burning runway.",
    calculation: "Aggregates the net_income field from each tracked app's latest metrics snapshot. Net income reflects actual revenue after platform fees and refunds — not gross bookings. Updated each time a new snapshot is pulled from the app APIs.",
    benchmarks: "Pre-seed Web3 studios: $500-5K/mo is strong traction. Seed stage: $5K-25K/mo. Series A territory: $50K+/mo. For a solo-operator studio, any consistent MRR above $1K signals product-market fit emerging across the portfolio.",
    context: "In a studio/ETF model, MRR is the sum of all portfolio company revenues. Unlike a single-product startup, rising MRR here means the diversified bet is working — multiple products contributing revenue reduces concentration risk. Investors look at portfolio MRR to gauge whether the studio model can self-fund operations and reduce dilution over time."
  },
  arr: {
    title: "Annual Recurring Revenue (ARR)",
    description: "The annualized run-rate of the studio's monthly revenue. If you maintained this month's revenue for a full year, this is what you'd earn. It's the standard way investors compare revenue across companies at different stages.",
    calculation: "MRR × 12. Simple annualization of the current monthly rate. Does not account for seasonality or growth — it's a snapshot projection, not a forecast.",
    benchmarks: "Pre-seed: $10K-50K ARR shows early signal. Seed: $100K-500K ARR. The median YC company raises at ~$100K ARR. For Web3 studios, ARR above $50K with 3+ contributing products is a strong signal.",
    context: "ARR is the primary language investors use for revenue-stage companies. For a studio, ARR from multiple products is more defensible than ARR from a single app — if one product dips, others can compensate. This portfolio diversification is the core thesis of the studio-as-ETF model."
  },
  arpu: {
    title: "Average Revenue Per User (ARPU)",
    description: "How much revenue each paying user generates on average. This measures your monetization efficiency — are you capturing meaningful value from the users who do pay?",
    calculation: "Total net_income across all tracked apps ÷ total paying users across all tracked apps. Only counts users flagged as 'paying' in the metrics, not total signups.",
    benchmarks: "Mobile gaming: $1-5 ARPU is typical. Web3 apps with token mechanics: $5-20+. Premium SaaS tools: $20-100+. Higher ARPU with lower user counts can be more sustainable than low ARPU with massive scale.",
    context: "For a multi-product studio, ARPU tells you whether your apps are building real economic relationships with users or just generating vanity signups. High ARPU across the portfolio suggests the studio has found monetization patterns that work — a repeatable playbook that can be applied to new products."
  },
  conversion: {
    title: "Free-to-Paid Conversion Rate",
    description: "The percentage of all users across the portfolio who become paying customers. This is the funnel's most critical junction — where attention turns into revenue.",
    calculation: "(Total paying users ÷ Total users) × 100. Aggregated across all tracked apps. Includes both direct payments and onchain transactions that generate revenue.",
    benchmarks: "Freemium apps: 2-5% is standard. Mobile gaming: 1-3%. Web3 with token incentives: 5-15% is achievable because onchain actions often have built-in monetization. Above 10% across a portfolio is exceptional.",
    context: "In the studio model, conversion rate reveals which apps have found pricing/value fit. A portfolio with 8 apps where 2-3 convert at 10%+ and others at 1-2% tells a clear story: double down on what works, iterate on what doesn't. This metric helps prioritize where to allocate the solo operator's limited time."
  },
  dauGrowth: {
    title: "DAU Growth Rate",
    description: "How fast daily active users are growing across the portfolio. DAU is the purest engagement signal — these are people who come back and use a product every single day, not just signed up once.",
    calculation: "Compares DAU between historical snapshots over the selected timeframe (daily/weekly/monthly). Calculates the average hourly rate of change, then extrapolates to the target period. Uses time-weighted averaging when multiple snapshots exist.",
    benchmarks: "Healthy consumer apps: 5-15% weekly DAU growth in early stages. Viral products can see 20-50% weekly spikes. Negative DAU growth for more than 2 weeks signals retention problems that need immediate attention.",
    context: "For a studio, DAU growth across the portfolio shows whether the combined product suite is building daily habits. Even if individual apps have volatile DAU, portfolio-level DAU smoothing is a key advantage — similar to how an ETF reduces volatility through diversification."
  },
  mauGrowth: {
    title: "MAU Growth Rate",
    description: "The rate at which monthly active users are growing. MAU captures the broader user base — people who engage at least once a month. It's less volatile than DAU and shows the longer-term acquisition trajectory.",
    calculation: "Percentage change in monthly active users between snapshots over the selected timeframe. Uses the same time-weighted methodology as DAU growth, adjusted for monthly periods.",
    benchmarks: "Strong early-stage: 15-30% month-over-month. Sustainable growth: 5-15% MoM. Hypergrowth (often unsustainable): 50%+ MoM. Negative MAU growth means you're losing users faster than gaining them — a red flag for any portfolio company.",
    context: "MAU growth is the headline metric investors look at first. For a studio/ETF, aggregate MAU growth across products shows whether the overall portfolio is expanding its reach. It's also the denominator in many valuation methods (per-MAU valuation), so growing MAU directly increases the studio's implied valuation."
  },
  revenueGrowth: {
    title: "Revenue Growth Rate",
    description: "How fast total revenue is increasing across the portfolio. This is arguably the most important growth metric — user growth without revenue growth means you're scaling costs without scaling income.",
    calculation: "Percentage change in total net_income between historical snapshots. Computed over the selected timeframe using time-weighted averaging to handle irregular snapshot intervals.",
    benchmarks: "Top-quartile startups: 15-25% MoM revenue growth. 'Triple triple double double' rule: 3x revenue years 1-2, 2x years 3-4. For early-stage studios, any consistent positive revenue growth across the portfolio is a strong signal.",
    context: "Revenue growth across a multi-product portfolio is the strongest signal that the studio model works. If multiple apps are growing revenue simultaneously, it validates the operator's ability to build and monetize repeatedly — the core thesis behind a studio/ETF approach. Investors weight revenue growth heavily in early-stage valuations."
  },
  nrr: {
    title: "Net Revenue Retention (NRR)",
    description: "Whether your existing revenue base is expanding or shrinking over time. An NRR above 100% means existing users are spending more over time — the holy grail of SaaS and Web3 economics.",
    calculation: "Estimated as 100% + the observed revenue growth rate. In a full implementation, this would track cohort-level revenue changes. The current approximation uses portfolio-wide revenue trends as a proxy.",
    benchmarks: "Elite SaaS: 130-150% NRR. Good: 110-130%. Concerning: below 100% (revenue churn). Web3 apps with token mechanics can achieve very high NRR as token utility drives increased spending from existing users.",
    context: "NRR above 100% means the portfolio generates more revenue from its existing user base over time — new user acquisition is gravy on top. For a solo operator, high NRR across the portfolio means less pressure to constantly acquire new users and more time to build new products."
  },
  ltv: {
    title: "Lifetime Value (LTV)",
    description: "The total revenue you can expect from an average paying user over their entire relationship with your products. LTV is the ceiling on what you can rationally spend to acquire a user.",
    calculation: "ARPU × 12 months (estimated retention period). This is a simplified model — actual LTV would account for churn rates, expansion revenue, and cross-product usage within the studio's portfolio.",
    benchmarks: "Mobile gaming: $5-30 LTV. Web3 with wallets: $20-200+ (wallet users tend to be more committed). SaaS tools: $100-1,000+. For a studio, cross-product LTV (users who adopt multiple apps) can be 3-5x single-product LTV.",
    context: "In a studio/ETF model, LTV has an extra dimension: users who discover one product may adopt others in the portfolio, multiplying their lifetime value. This cross-pollination effect is a key advantage studios have over single-product startups — it means user acquisition ROI compounds across the portfolio."
  },
  cac: {
    title: "Customer Acquisition Cost (CAC)",
    description: "How much it costs to turn someone into a paying user. This includes all marketing, distribution, and operational costs needed to acquire one paying customer.",
    calculation: "Estimated based on revenue and engagement ratios. In a full model, CAC = total acquisition spend ÷ new paying users acquired. Currently approximated from portfolio metrics since direct ad spend data isn't tracked.",
    benchmarks: "Organic/viral products: near $0 CAC (the dream). Paid acquisition: $1-10 for mobile gaming, $10-50 for Web3 apps, $100-500 for SaaS. The key is that CAC must be significantly less than LTV.",
    context: "A studio that builds products with organic distribution (Telegram bots, onchain virality, token incentives) can achieve near-zero CAC — this is one of the strongest arguments for the Web3 studio model. Each product in the portfolio that acquires users organically also becomes a distribution channel for other products."
  },
  ltvCac: {
    title: "LTV:CAC Ratio",
    description: "The return on investment for each user acquired. If you spend $10 to acquire a user who generates $30 in lifetime value, your ratio is 3:1. This is the fundamental unit economics equation.",
    calculation: "Lifetime Value ÷ Customer Acquisition Cost. Both values are portfolio-level aggregates across all tracked apps.",
    benchmarks: "Minimum viable: 3:1 (you earn 3x what you spend). Strong: 5:1+. Exceptional: 10:1+ (common in organic/viral products). Below 1:1 means you're losing money on every user — unsustainable without massive scale effects.",
    context: "For a studio with mostly organic distribution (Web3 virality, Telegram bots, onchain mechanics), LTV:CAC ratios can be extremely high because CAC approaches zero. This is a key selling point for investors: the studio doesn't need to burn capital on paid acquisition because the products have built-in distribution."
  },
  payback: {
    title: "CAC Payback Period",
    description: "How many months it takes to recover the cost of acquiring a user. Shorter payback = faster reinvestment cycle = more capital-efficient growth.",
    calculation: "CAC ÷ monthly ARPU. Tells you how many months of revenue from an average user are needed to break even on their acquisition cost.",
    benchmarks: "Excellent: under 3 months. Good: 3-6 months. Acceptable for VC-backed: 6-12 months. Over 12 months requires strong retention certainty or significant funding runway.",
    context: "For a bootstrapped solo operator, short payback periods are critical — you can't afford to wait 12 months to see ROI on acquisition spend. Products with built-in Web3 distribution and token incentives naturally achieve shorter payback because the 'acquisition spend' is minimal."
  },
  dauMauRatio: {
    title: "DAU/MAU Ratio (Stickiness)",
    description: "What percentage of monthly users come back every single day. This is the stickiness metric — it measures whether your products create daily habits or just occasional visits. Higher stickiness means stronger retention and more monetization opportunities.",
    calculation: "Daily Active Users ÷ Monthly Active Users × 100. Aggregated across all tracked apps in the portfolio.",
    benchmarks: "Social media (Facebook, Instagram): 50-60%. Gaming apps: 20-30%. Utility apps: 10-20%. A portfolio averaging 20%+ DAU/MAU across multiple products indicates strong habitual usage patterns.",
    context: "Stickiness across a multi-product portfolio is more meaningful than for a single app — it shows the studio consistently builds products people return to daily. For investors, high stickiness implies predictable engagement, which translates to predictable revenue and lower churn risk."
  },
  revenuePerUser: {
    title: "Revenue Per User (All Users)",
    description: "How much revenue you generate per user across the entire base, including non-paying users. This measures total-base monetization efficiency — how well the portfolio extracts value from every user it touches.",
    calculation: "Total net_income across tracked apps ÷ total users across tracked apps. Includes all users, not just paying ones.",
    benchmarks: "Ad-supported apps: $0.01-0.10/user. Freemium with IAP: $0.10-1.00/user. Web3 with token mechanics: $0.50-5.00/user. The gap between this and ARPU shows how much upside exists in converting free users.",
    context: "This metric reveals untapped monetization potential in the portfolio. A big gap between ARPU (paying users) and Revenue/User (all users) means there's a large free user base that could be converted — a growth lever the operator can pull through better onboarding, pricing, or token incentives."
  },
  txnsPerUser: {
    title: "Transfers Per User",
    description: "How many onchain transfers each user makes on average. This measures blockchain engagement depth — are users just signing up, or actually transacting onchain?",
    calculation: "Total onchain transfers across tracked apps ÷ total users across tracked apps.",
    benchmarks: "Low engagement: <0.1 tx/user (most users never transact). Moderate: 0.1-1 tx/user. Strong onchain engagement: 1+ tx/user. DeFi power users: 10+ tx/user.",
    context: "For a Web3 studio, onchain transfers are proof of real economic activity, not just pageviews. High tx/user across the portfolio means users are actively engaging with blockchain features — validating the Web3 thesis and creating protocol-level value that can be captured through fees or token mechanics."
  },
  actionsPerUser: {
    title: "Key Actions Per User",
    description: "How many meaningful in-app actions each user takes on average. Key actions are the core value moments — playing a game, making a prediction, sending a payment — not just clicks or pageviews.",
    calculation: "Total key_actions across tracked apps ÷ total users across tracked apps.",
    benchmarks: "Low engagement: <1 action/user. Moderate: 1-5 actions/user. High engagement: 5-20 actions/user. Power users in gaming: 50+ actions/user.",
    context: "Key actions per user measures whether the studio's products deliver their core value proposition. In a gaming app, this is plays. In a payments app, it's transfers. High actions/user across multiple products shows the studio builds things people actually use — not just download and forget."
  },
  dauWau: {
    title: "DAU/WAU Ratio",
    description: "What percentage of weekly users are active daily. This is a more granular stickiness metric than DAU/MAU — it shows how many of your weekly regulars are actually daily users.",
    calculation: "Daily Active Users ÷ Weekly Active Users × 100. Aggregated across tracked apps.",
    benchmarks: "Strong daily habit: 40%+ (nearly half of weekly users come daily). Moderate: 20-40%. Low: under 20% (most weekly users only visit 1-2 days).",
    context: "DAU/WAU helps distinguish between apps that create true daily habits vs. those that people check a few times a week. For a gaming studio, you want this high — daily players are worth 5-10x weekly players in terms of LTV and engagement depth."
  },
  wauMau: {
    title: "WAU/MAU Ratio",
    description: "What percentage of monthly users engage at least weekly. Shows whether monthly users are truly engaged or just retained on paper.",
    calculation: "Weekly Active Users ÷ Monthly Active Users × 100. Aggregated across tracked apps.",
    benchmarks: "Excellent: 60%+ (most monthly users are weekly regulars). Good: 40-60%. Concerning: under 30% (most monthly users are barely engaged).",
    context: "WAU/MAU reveals the quality of the MAU number. A portfolio with 50K MAU but only 10% WAU/MAU has a retention problem — those monthly users are mostly dormant. A portfolio with 20K MAU but 60% WAU/MAU has a much healthier, more engaged user base."
  },
  payingMau: {
    title: "Paying Users / MAU",
    description: "What percentage of monthly active users are paying customers. This is the monetization depth of your engaged user base — not total signups, but the people who actually show up regularly.",
    calculation: "Total paying users ÷ Monthly Active Users × 100. Aggregated across tracked apps.",
    benchmarks: "Freemium apps: 2-5%. Premium mobile games: 5-15%. Web3 with strong token utility: 10-25%. Above 20% indicates strong value proposition — users see enough value to pay.",
    context: "This metric is more useful than overall conversion rate because it focuses on engaged users. A high Paying/MAU ratio means your active users see clear value worth paying for — the product has found monetization fit, not just product-market fit."
  },
  stickiness: {
    title: "DAU/MAU Stickiness Index",
    description: "The classic stickiness measure — what fraction of your monthly users show up every day. This single number captures whether your portfolio creates daily habits or just occasional visits.",
    calculation: "Daily Active Users ÷ Monthly Active Users × 100. Portfolio aggregate across all tracked apps.",
    benchmarks: "Elite consumer apps (social media): 50%+. Strong gaming/utility: 20-30%. Average consumer app: 10-15%. Below 10% suggests the product is a 'check occasionally' tool, not a daily habit.",
    context: "Portfolio-level stickiness is a studio superpower metric. If the studio consistently builds apps with 20%+ stickiness, it demonstrates a repeatable ability to create habitual products — a pattern investors can underwrite. This is the studio's 'batting average' for engagement."
  },
  arppu: {
    title: "Average Revenue Per Paying User (ARPPU)",
    description: "How much each paying user spends on average. Unlike ARPU (which includes free users), ARPPU focuses only on people who actually pay — giving you a clearer picture of willingness-to-pay among your best users.",
    calculation: "Total net_income ÷ total paying users. Only includes users flagged as paying in the metrics data.",
    benchmarks: "Casual mobile games: $5-15. Mid-core gaming: $15-50. Web3 with token mechanics: $20-100+. High ARPPU with low paying count can be more sustainable than low ARPPU with massive paying base.",
    context: "ARPPU reveals the revenue ceiling per customer. For a studio building premium Web3 products, high ARPPU suggests users find deep, ongoing value. Combined with conversion rate, ARPPU helps model total revenue potential: (Total Users × Conversion Rate × ARPPU = Revenue)."
  },
  revPerTx: {
    title: "Revenue Per Transfer",
    description: "How much revenue each onchain transfer generates. This measures the studio's ability to capture value from blockchain activity — essentially the 'take rate' on onchain flows.",
    calculation: "Total net_income ÷ total onchain transfers across tracked apps.",
    benchmarks: "Payment protocols: $0.01-0.10/tx (high volume, low margin). Gaming transfers: $0.10-1.00/tx. DeFi/trading: highly variable. Higher rev/tx with fewer transfers can be more profitable than low rev/tx at massive scale.",
    context: "Revenue per transaction is the studio's onchain monetization efficiency. In the ETF model, this helps compare which portfolio apps extract the most value per blockchain interaction — informing where to invest more development time and which monetization mechanics to replicate across products."
  },
  avgTxSize: {
    title: "Average Transfer Size",
    description: "The average dollar amount of each onchain transfer. This shows the typical economic magnitude of user interactions with the portfolio's blockchain features.",
    calculation: "Total onchain volume (USD) ÷ total onchain transfers across tracked apps.",
    benchmarks: "Micro-payments (gaming): $0.01-1.00. Standard payments: $1-50. DeFi/trading: $100-10,000+. The distribution matters more than the average — a few whale transfers can skew this significantly.",
    context: "Average transfer size reveals what kind of economic activity the portfolio facilitates. Small, frequent transfers (gaming, micropayments) suggest consumer-scale utility. Large, infrequent transfers suggest financial/DeFi utility. Both are valid — but they imply very different growth strategies and investor narratives."
  },
  arpuAll: {
    title: "ARPU (All Users)",
    description: "Revenue per user across the entire user base, including free users. This is a more conservative monetization metric than ARPU (paying only) — it shows what each user is worth on average, regardless of payment status.",
    calculation: "Total net_income ÷ total users (all users, paying and free). Portfolio aggregate.",
    benchmarks: "Ad-supported: $0.01-0.10. Freemium with some paid: $0.10-1.00. Strong Web3 monetization: $1-5+. The gap between ARPU(all) and ARPU(paying) shows conversion opportunity.",
    context: "This metric is essential for modeling portfolio-level revenue potential. If you know ARPU(all) and total user count, you can quickly estimate total revenue without needing to know exact conversion rates. For investors, rising ARPU(all) means the studio is getting better at monetizing its reach."
  },
  txPerUser: {
    title: "Onchain Transfers Per User",
    description: "How many blockchain transfers each user generates on average. This is a Web3-specific engagement metric — are users actually using the onchain features, or just the off-chain parts?",
    calculation: "Total onchain transfers ÷ total users across all tracked apps.",
    benchmarks: "Early-stage Web3 app: 0.1-0.5 tx/user. Growing: 0.5-2 tx/user. Mature DeFi/gaming: 5+ tx/user. Higher is better — it means users are engaging with the blockchain, not just the frontend.",
    context: "Transfers per user is the Web3 adoption metric. For a studio building AI and Web3 products, high tx/user proves that the blockchain component adds real value — it's not just 'Web3 for marketing purposes.' This is critical for token-based fundraising narratives."
  },
  volumePerTx: {
    title: "Volume Per Transfer",
    description: "The average dollar amount flowing through each blockchain transfer. Identical to average transfer size, but framed as throughput efficiency — how much economic value each transfer carries.",
    calculation: "Total onchain volume (USD) ÷ total onchain transactions.",
    benchmarks: "Micropayment apps: $0.10-5. Standard Web3 transfers: $10-100. DeFi protocols: $500-50,000+. Context matters — a gaming app with $0.50 avg tx doing 10K tx/day is healthier than a DeFi app with $5K avg tx doing 2 tx/day.",
    context: "Volume per transaction helps characterize the portfolio's onchain economic profile. Lower volume with high frequency suggests consumer utility. Higher volume with lower frequency suggests financial infrastructure. Both contribute to the studio's valuation but through different mechanisms."
  },
  volumePerDau: {
    title: "Volume Per Daily Active User",
    description: "The total onchain dollar volume each daily active user generates. This combines engagement (daily activity) with economic intensity (how much value they move onchain).",
    calculation: "Total onchain volume (USD) ÷ total daily active users across tracked apps.",
    benchmarks: "Low-value engagement: under $1/DAU. Moderate: $1-50/DAU. High-value (DeFi, payments): $50-500+/DAU. Context: a gaming app at $2/DAU is strong; a payments app at $2/DAU is weak.",
    context: "Volume/DAU is a Web3-specific measure of how economically productive each active user is. For a studio, high Volume/DAU across the portfolio means users aren't just engaging — they're moving meaningful economic value onchain, which translates directly to fee revenue and protocol value."
  },
  totalVolume: {
    title: "Total Onchain Volume",
    description: "The total dollar value of all onchain transfers across every tracked app in the portfolio. This is the studio's gross economic throughput — the total value flowing through the products it has built.",
    calculation: "Sum of the 'volume' field from each tracked app's onchain metrics. Represents all token transfers, payments, and value flows processed by the portfolio's smart contracts and onchain features.",
    benchmarks: "Early-stage portfolio: $10K-100K cumulative. Growing: $100K-1M. Significant traction: $1M+. For context, even small DeFi protocols can process millions in volume — what matters is the studio's capture rate on that volume.",
    context: "Total volume is the top-line economic activity metric for the portfolio. In the valuation methodology, it's used for the 'volume percentage' method — if the studio captures 1-10% of the volume flowing through its products, that directly translates to imputed value. Think of it as the 'gross merchandise value' equivalent for Web3."
  },
  projections: {
    title: "Data-Driven Growth Projections",
    description: "Forward-looking estimates for users, revenue, and transfers at 30, 60, and 90-day horizons. These projections are computed entirely from observed historical data — no assumptions or targets. They model natural growth deceleration using a decay factor, reflecting the well-established principle that maintaining percentage growth becomes harder as the base scales.",
    calculation: "For each metric (MAU, revenue, transfers), the system computes the actual monthly growth rate from historical snapshots. These rates are then projected forward with a 15% monthly decay factor: Month 1 uses the full observed rate, Month 2 uses 85% of it (rate × 0.85), Month 3 uses 72.25% (rate × 0.85²). Rates are clamped at [-50%, +100%] to prevent extreme outlier extrapolation. Each metric uses its own independent growth rate.",
    benchmarks: "The decay model is conservative by design. If current growth is 20%/mo, projections assume 20% → 17% → 14.5% over 3 months. Actual performance may beat projections (if growth accelerates) or miss them (if growth stalls). The confidence indicator shows how reliable the underlying data is based on snapshot count and time coverage.",
    context: "These projections help the studio operator and investors understand where the portfolio is heading based on current momentum. Unlike pitch deck projections that assume constant or accelerating growth, these use actual data with built-in conservatism. The decay factor mirrors DCF fade rates used in professional startup financial modeling — acknowledging that early growth rates are unsustainable long-term."
  },
  valRevMultiple: {
    title: "Revenue Multiple Valuation (10-50x ARR)",
    description: "Values the studio based on a multiple of its annual revenue. Revenue multiples are the most widely used valuation method for SaaS and Web3 companies — they translate current revenue performance into an implied company value.",
    calculation: "ARR × multiple. Three scenarios: Conservative (10x) — typical for established, slower-growth projects. Mid (25x) — appropriate for steadily growing early-stage studios. Aggressive (50x) — justified for hypergrowth with strong retention. The multiples are based on comparable Web3 gaming studio and miniapp fundraises from 2023-2025.",
    benchmarks: "Public SaaS companies trade at 5-15x ARR. Private early-stage with high growth: 20-50x. Web3 gaming studios (pre-seed/seed): 30-80x in bull markets, 10-20x in bear markets. A solo-operator studio with real revenue at 25x ARR is a reasonable baseline.",
    context: "Revenue multiples are the primary valuation language in startup fundraising. For a studio/ETF, the multiple should reflect both current revenue AND the pipeline of unrealized value in early-stage portfolio products. A studio with $50K ARR from 3 apps but 5 more in development could justify a higher multiple than a single-product company with the same ARR."
  },
  valVolumeMultiple: {
    title: "Volume Percentage Valuation (1-10%)",
    description: "Values the studio as a percentage of the total onchain volume flowing through its products. This treats the studio as a value-capture layer on transaction flows — similar to how payment networks (Visa, Stripe) are valued relative to their payment volume.",
    calculation: "Annualized onchain volume × capture percentage. Conservative (1%) — minimal fee capture, early infrastructure. Mid (5%) — moderate fees or token burns. Aggressive (10%) — strong moat with embedded fee structures. Annualized volume = current volume extrapolated to 12 months using the daily rate.",
    benchmarks: "Payment networks: valued at 0.5-2% of payment volume. DeFi protocols: 1-5% of TVL or volume. For early-stage studios, even 1% of significant volume implies meaningful value. Uniswap's volume-based valuation equivalent is roughly 2-3% of annualized volume.",
    context: "Volume-based valuation is uniquely relevant to Web3 studios because onchain volume is transparent, verifiable, and directly correlated with economic utility. Unlike Web2 metrics that can be gamed, onchain volume requires real value to flow through the protocols. For the studio/ETF model, volume across all portfolio apps represents the total economic activity the operator has enabled."
  },
  valPerDau: {
    title: "Per-DAU Valuation ($50-300/user)",
    description: "Values the studio based on how much each daily active user is worth. DAU-based valuation captures engagement intensity — daily users are the most valuable because they represent habitual, sticky usage that's hardest to replicate.",
    calculation: "Total DAU across portfolio × dollar value per DAU. Conservative ($50) — baseline for utility apps. Mid ($150) — strong engagement with monetization. Aggressive ($300) — gaming/social apps with high LTV and retention. Based on acquisition benchmarks from Telegram miniapp and mobile gaming M&A deals.",
    benchmarks: "Facebook's implied per-DAU value: ~$200. Telegram miniapps (2024-2025): $50-200/DAU in fundraises. Mobile gaming studios (acquisition): $100-500/DAU depending on genre and retention. For a Web3 studio, $150/DAU is a reasonable mid-case.",
    context: "Per-DAU valuation rewards the studio for building products people use daily. In the ETF model, total DAU across all products is additive — a studio with 5 apps each doing 500 DAU has the same per-DAU valuation as one app with 2,500 DAU, but with lower risk because one app's decline doesn't kill the metric."
  },
  valPerMau: {
    title: "Per-MAU Valuation ($10-75/user)",
    description: "Values the studio based on its monthly active user base. MAU-based valuation is the standard consumer app approach — it captures the breadth of the user base, even if not everyone is engaged daily.",
    calculation: "Total MAU across portfolio × dollar value per MAU. Conservative ($10) — early-stage, unmonetized users. Mid ($30) — moderate monetization and retention. Aggressive ($75) — strong monetization with Web3 premium. Standard for consumer app fundraises and M&A.",
    benchmarks: "Snapchat's implied per-MAU value: ~$30-40. Instagram at acquisition: ~$30/MAU. Web3 apps command a premium due to onchain monetization — $30-75/MAU is common in token-based fundraises. Traditional apps: $5-20/MAU.",
    context: "MAU-based valuation captures the studio's total reach. For investors, a large MAU base across multiple products represents distribution — the ability to launch new products with a built-in audience. This is the ETF thesis: each new product benefits from the existing portfolio's user base through cross-promotion and shared wallets."
  },
  valPerWallet: {
    title: "Per-Wallet Valuation ($100-1,500/wallet)",
    description: "Values the studio based on its active wallet count. This is a Web3-native valuation method — each connected wallet represents a verified economic actor who has taken the friction-heavy step of setting up and connecting a crypto wallet, making them far more valuable than a typical signup.",
    calculation: "Total paying/active wallets × dollar value per wallet. Conservative ($100) — wallets with minimal activity. Mid ($500) — regular transacting wallets. Aggressive ($1,500) — high-value wallets with frequent onchain activity. Unique to Web3 where wallets are pseudonymous but economically verified.",
    benchmarks: "DeFi protocols: valued at $500-5,000/active wallet. NFT platforms: $200-1,000/wallet. Web3 gaming: $100-500/wallet. The key insight: a 'wallet' in Web3 is more like a 'verified financial account' in traditional finance — it represents genuine economic intent.",
    context: "Wallet-based valuation is the studio's Web3-native edge. Traditional apps count signups (often fake or dormant). Web3 apps count wallets that have made real onchain transactions — every wallet represents a user who has gone through KYC/wallet setup, funded their wallet, and executed transactions. For the ETF model, unique wallets across the portfolio represent the studio's Web3 distribution moat."
  },
  valBlended: {
    title: "Confidence-Weighted Blended Valuation",
    description: "The studio's estimated value using a weighted blend of all five valuation methods. No single method perfectly captures an early-stage Web3 studio's value, so this blends revenue, volume, user, and wallet-based approaches — weighting each based on data quality and confidence.",
    calculation: "Weighted average of: Revenue Multiple, Volume Percentage, Per-DAU, Per-MAU, and Per-Wallet valuations. Weights dynamically adjust based on data quality: methods with strong underlying data (e.g., >$0 revenue, >100 DAU) receive full weight, while methods with weak or zero data receive reduced weight. Weight percentages are displayed in the breakdown to show how each method contributes to the final blend.",
    benchmarks: "The blended approach reduces volatility compared to any single method. Typically, the conservative blend lands 20-40% below the highest individual method and 20-40% above the lowest. A tight range between conservative and aggressive suggests consistent data across methods. A wide range suggests high uncertainty.",
    context: "Blended valuation is the studio's equivalent of a mutual fund NAV (Net Asset Value). Just as an ETF's value is the weighted sum of its holdings, the studio's value is the weighted blend of its portfolio metrics. This approach is especially important for a one-person studio where some products may have strong revenue but low users, while others have massive users but no revenue yet — the blend captures the full picture."
  },
  actionsPerSession: {
    title: "Key Actions Per Session",
    description: "How many meaningful actions users take in each visit. This measures the depth of each session — are users popping in for a quick glance, or diving deep into the product's core features?",
    calculation: "Total key_actions ÷ total sessions_today across tracked apps.",
    benchmarks: "Quick-check apps (weather, news): 1-3 actions/session. Interactive apps (games, tools): 5-20 actions/session. Power-user tools: 20+ actions/session. Higher is generally better, but context matters — a payment app might have low actions/session by design.",
    context: "Actions per session reveals product depth. For a studio building gaming and utility apps, high actions/session means users are deeply engaging with the core loops — playing multiple rounds, exploring features, transacting. This correlates strongly with retention and monetization potential."
  },
  actionsPerDau: {
    title: "Key Actions Per Daily Active User",
    description: "How many core interactions each daily user has with the products. This is a per-user engagement intensity measure — it combines session frequency with session depth.",
    calculation: "Total key_actions ÷ total daily active users across tracked apps.",
    benchmarks: "Light engagement: 1-5 actions/DAU. Moderate: 5-20 actions/DAU. Heavy engagement (gaming): 20-100+ actions/DAU. Very high numbers can indicate either power users or that 'key actions' are defined too granularly.",
    context: "Actions/DAU is the engagement quality metric. A studio where DAUs average 30+ actions per day is building genuinely compelling products — these users are spending meaningful time and attention, which translates to monetization opportunities and strong retention signals."
  },
  sessionsPerDau: {
    title: "Sessions Per Daily Active User",
    description: "How many times each daily active user opens the app per day. Multiple sessions per day indicate the product has created a strong habitual loop — users keep coming back throughout the day.",
    calculation: "Total sessions_today ÷ total daily active users across tracked apps.",
    benchmarks: "Single-session apps: 1-1.5 sessions/DAU. Habitual check-in apps: 2-4 sessions/DAU. Highly addictive (social, gaming): 5-10+ sessions/DAU. Above 3 sessions/DAU strongly indicates the product is part of users' daily routine.",
    context: "Multiple daily sessions is a leading indicator of monetization potential and retention. For a gaming studio, 3+ sessions/DAU means users are coming back between gaming sessions — the core loop is working. Each additional session is another opportunity to show value, drive transactions, and deepen engagement."
  },
  totalSessions: {
    title: "Total Sessions (Portfolio)",
    description: "The total number of app sessions across all tracked products today. This is the portfolio's aggregate attention capture — how much total user engagement the studio's products are generating.",
    calculation: "Sum of sessions_today from each tracked app's latest metrics snapshot.",
    benchmarks: "Early portfolio (few apps): 100-1,000 sessions/day. Growing: 1,000-10,000. Significant: 10,000+ daily sessions across the portfolio. Each session represents a user voluntarily choosing to spend time with your product.",
    context: "Total sessions is the studio's attention economy metric. In a world where user attention is the scarcest resource, a portfolio generating thousands of daily sessions has built meaningful distribution. This aggregate attention can be monetized, redirected to new products, or used as a growth lever for partner projects."
  },
  engagementRevenue: {
    title: "Engagement vs Revenue Correlation",
    description: "A scatter plot showing each app's key actions (engagement) against its net income (revenue), with bubble size representing DAU. This visualization reveals which products in the portfolio are most efficiently converting user engagement into revenue.",
    calculation: "X-axis: key_actions per app. Y-axis: net_income per app. Bubble size: DAU per app. Each bubble represents one tracked app in the portfolio.",
    benchmarks: "Ideal position: upper-right (high engagement AND high revenue). Upper-left: monetized but not deeply engaging. Lower-right: engaging but not monetized (opportunity). Lower-left: needs work on both fronts.",
    context: "This chart is the portfolio manager's strategic view. It immediately shows which products are the studio's cash cows (upper-right), which are engagement plays waiting to be monetized (lower-right), and which need a rethink. For a solo operator deciding where to spend time, this visualization makes the allocation decision clear."
  },
  volumeTransactions: {
    title: "Volume vs Transfers Correlation",
    description: "A scatter plot showing each app's transaction count against its onchain volume, with bubble size representing MAU. This reveals the relationship between transaction frequency and economic magnitude across the portfolio.",
    calculation: "X-axis: transaction count per app. Y-axis: onchain volume (USD) per app. Bubble size: MAU per app. Each bubble represents one tracked app.",
    benchmarks: "High volume, few transactions: large-value transfers (DeFi-like). Many transactions, low volume: micro-payments (gaming-like). The diagonal represents balanced proportional growth — most healthy apps sit near or above it.",
    context: "This chart characterizes the portfolio's onchain economic profile. Apps in the upper-left are processing large-value transactions (financial infrastructure). Apps in the lower-right are processing many small transactions (consumer utility). Understanding this distribution helps the studio optimize fee structures and identify which economic models work best across the portfolio."
  },
  valuation: {
    title: "Zeno Studio Portfolio Valuation",
    description: "The estimated total value of the studio and its portfolio of AI and Web3 products, calculated using five industry-standard valuation methods blended with confidence weighting. Think of this as the studio's 'NAV' (Net Asset Value) — similar to how an ETF's value is the weighted sum of all its holdings.",
    calculation: "Blends five methods: Revenue Multiple (10-50x ARR), Volume Percentage (1-10% of annualized onchain volume), Per-DAU ($50-300), Per-MAU ($10-75), and Per-Wallet ($100-1,500). Each method produces Conservative/Mid/Aggressive estimates. The final blended value weights each method by data quality — methods with stronger underlying data contribute more to the final number.",
    benchmarks: "Pre-seed Web3 studios: $500K-2M. Seed-stage with traction: $2M-10M. Series A: $10M-50M. The range between Conservative and Aggressive reflects market uncertainty — tighter ranges indicate more consistent data across methods, wider ranges indicate higher uncertainty.",
    context: "This valuation serves two purposes: (1) for fundraising — it gives investors a data-driven, multi-method estimate rather than an arbitrary number; and (2) for portfolio management — tracking how valuation changes over time shows whether the studio's strategy is working. The ETF parallel is intentional: just as an index fund's NAV rises when its holdings appreciate, the studio's valuation rises when its portfolio apps grow."
  },
};

const InfoModal = ({ isOpen, onClose, metric }: { isOpen: boolean; onClose: () => void; metric: string }) => {
  if (!isOpen) return null;
  const def = metricDefinitions[metric];
  if (!def) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative bg-[#1a1a1a] border border-[#2d2d2d] max-w-lg w-full mx-4 z-10 max-h-[85vh] overflow-y-auto" data-testid={`modal-info-${metric}`} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#2d2d2d] px-6 py-4 flex items-start justify-between">
          <h4 className="text-lg font-semibold pr-8">{def.title}</h4>
          <button onClick={onClose} className="text-[#a0aec0] hover:text-white text-lg leading-none flex-shrink-0 mt-0.5" data-testid={`button-close-info-${metric}`}>✕</button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-sm text-[#ccc] leading-relaxed">{def.description}</p>
          </div>
          <div>
            <div className="text-xs text-[#3b82f6] uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
              <span className="w-1 h-1 bg-[#3b82f6] inline-block flex-shrink-0" />
              How It's Calculated
            </div>
            <p className="text-sm text-[#ccc] leading-relaxed">{def.calculation}</p>
          </div>
          <div>
            <div className="text-xs text-[#10b981] uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
              <span className="w-1 h-1 bg-[#10b981] inline-block flex-shrink-0" />
              Benchmarks & Targets
            </div>
            <p className="text-sm text-[#ccc] leading-relaxed">{def.benchmarks}</p>
          </div>
          <div>
            <div className="text-xs text-[#f59e0b] uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
              <span className="w-1 h-1 bg-[#f59e0b] inline-block flex-shrink-0" />
              Studio Context
            </div>
            <p className="text-sm text-[#ccc] leading-relaxed">{def.context}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const InfoButton = ({ metric }: { metric: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className="inline-flex items-center justify-center w-4 h-4 text-[10px] border border-[#444] text-[#888] hover:text-white hover:border-[#888] transition-colors leading-none flex-shrink-0"
        title="Info"
        data-testid={`button-info-${metric}`}
      >
        i
      </button>
      <InfoModal isOpen={open} onClose={() => setOpen(false)} metric={metric} />
    </>
  );
};

const formatNum = (num: number, prefix = ""): string => {
  if (num >= 1000000) {
    return `${prefix}${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 100000) {
    return `${prefix}${(num / 1000).toFixed(0)}K`;
  }
  if (num >= 10000) {
    return `${prefix}${(num / 1000).toFixed(1)}K`;
  }
  if (num >= 1000) {
    return `${prefix}${(num / 1000).toFixed(2)}K`;
  }
  if (num < 10000 && num !== Math.floor(num)) {
    return `${prefix}${num.toFixed(2)}`;
  }
  return `${prefix}${num.toLocaleString()}`;
};

function smartTickFormat(ts: number, data: any[]): string {
  if (!data || data.length === 0) return '';
  const timestamps = data.map(d => d.timestamp).filter(Boolean);
  if (timestamps.length < 2) return format(new Date(ts), "MMM d HH:mm");
  const min = Math.min(...timestamps);
  const max = Math.max(...timestamps);
  const spanHours = (max - min) / (1000 * 60 * 60);
  
  if (spanHours < 6) {
    return format(new Date(ts), "HH:mm");
  } else if (spanHours < 72) {
    return format(new Date(ts), "M/d HH:mm");
  } else {
    return format(new Date(ts), "MMM d");
  }
}

const StatCard = ({ 
  label, 
  value, 
  change, 
  icon: Icon, 
  color = "blue",
  delay = 0,
  testId
}: { 
  label: string; 
  value: string | number; 
  change?: number; 
  icon: any;
  color?: "blue" | "green" | "yellow" | "purple" | "cyan";
  delay?: number;
  testId?: string;
}) => {
  const colors = {
    blue: "text-[#3b82f6] bg-[#3b82f6]/10",
    green: "text-[#10b981] bg-[#10b981]/10",
    yellow: "text-[#f59e0b] bg-[#f59e0b]/10",
    purple: "text-[#8b5cf6] bg-[#8b5cf6]/10",
    cyan: "text-[#06b6d4] bg-[#06b6d4]/10",
  };

  return (
    <Block delay={delay} className="relative overflow-hidden min-h-[100px] p-4">
      <div className={`absolute top-3 right-3 p-1.5 ${colors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="pr-8">
        <div className="text-[10px] text-[#a0aec0] uppercase tracking-wider mb-1.5 font-medium">{label}</div>
        <div className="text-lg sm:text-xl md:text-2xl font-bold mb-1.5 leading-tight" data-testid={testId}>{value}</div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-[10px] font-medium ${change >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`} data-testid={testId ? `${testId}-change` : undefined}>
            {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
    </Block>
  );
};

function processHistoricalSnapshots(snapshots: MetricsSnapshot[], projects: Project[]) {
  // Group snapshots by fetch session (within 2-minute window = same session)
  const SESSION_WINDOW_MS = 2 * 60 * 1000; // 2 minutes
  
  // Sort all snapshots by timestamp first
  const sorted = [...snapshots].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Group into sessions
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
      pointData[`${safeKey}_name`] = project.name;
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

type GrowthTimeframe = 'daily' | 'weekly' | 'monthly';
type ConfidenceLevel = 'low' | 'medium' | 'high';

interface GrowthResult {
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

function calculateGrowthRates(historical: any[], timeframe: GrowthTimeframe = 'daily'): GrowthResult {
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

function DashboardContent() {
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

  // Set timestamp on initial successful data load
  useEffect(() => {
    if (latestMetrics?.success && !initialLoadDone) {
      setLastRefreshTime(new Date());
      setInitialLoadDone(true);
    }
  }, [latestMetrics?.success, initialLoadDone]);
  const historicalSnapshots = (historicalMetrics?.snapshots || []).filter(s =>
    connectedProjects.some(p => p.id === s.projectId)
  );

  // Compute which metric categories to show based on project settings
  // Show a category if ANY connected project has it enabled
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
          const res = await fetch(`/api/metrics/fetch/${project.id}`, { method: "POST" });
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

  // Per-app time series for multi-line charts (DAU and Revenue)
  const perAppTimeSeries = useMemo(() => {
    if (historicalData.length === 0 || projects.length === 0) return { data: historicalData, apps: [], hasPerAppData: false };
    
    // Get unique apps that appear in the data
    const appKeys = new Set<string>();
    historicalData.forEach(point => {
      Object.keys(point).forEach(key => {
        if (key.endsWith('_DAU')) {
          appKeys.add(key.replace('_DAU', ''));
        }
      });
    });
    
    // Build app info with exact slice match
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

  const APP_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444'];
  const appColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    const sortedProjects = [...projects].sort((a, b) => a.name.localeCompare(b.name));
    sortedProjects.forEach((p, i) => {
      const key = p.id.slice(0, 8);
      map[key] = p.chartColor || APP_COLORS[i % APP_COLORS.length];
    });
    return map;
  }, [projects]);

  // Estimated Daily Revenue Rate per app
  // Uses expanding window: for each point, calculates average daily rate from the first data point
  // Requires at least 1 hour of data span to avoid noisy short-interval extrapolation
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

  // Estimated daily activity data - transactions and volume extrapolated to 24h
  // Uses expanding window from first data point for stable rates
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

  // Estimated Daily Payers - calculated from cumulative paying users difference over time
  const dailyPayersEstimate = useMemo(() => {
    if (historicalData.length < 2) {
      return { value: 0, hasData: false, isEstimate: true };
    }

    // Get the first and last data point within 24h window
    const now = historicalData[historicalData.length - 1].timestamp;
    const windowStart = now - (24 * 60 * 60 * 1000);
    const pointsInWindow = historicalData.filter(
      h => h.timestamp >= windowStart && h.timestamp <= now
    );

    if (pointsInWindow.length < 2) {
      // Not enough data in 24h, extrapolate from available data
      const first = historicalData[0];
      const last = historicalData[historicalData.length - 1];
      const hoursElapsed = (last.timestamp - first.timestamp) / (1000 * 60 * 60);
      
      if (hoursElapsed <= 0) {
        return { value: 0, hasData: false, isEstimate: true };
      }

      const payersChange = (last.payingUsers ?? 0) - (first.payingUsers ?? 0);
      const dailyPayers = Math.max(0, (payersChange / hoursElapsed) * 24);
      
      return { value: Math.round(dailyPayers), hasData: true, isEstimate: true };
    }

    // Use 24h window data
    const first = pointsInWindow[0];
    const last = pointsInWindow[pointsInWindow.length - 1];
    const hoursElapsed = (last.timestamp - first.timestamp) / (1000 * 60 * 60);

    if (hoursElapsed <= 0) {
      return { value: 0, hasData: false, isEstimate: true };
    }

    const payersChange = (last.payingUsers ?? 0) - (first.payingUsers ?? 0);
    const dailyPayers = Math.max(0, (payersChange / hoursElapsed) * 24);
    const has24hData = hoursElapsed >= 20; // Consider "enough" if at least 20h of data

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
    
    // Stickiness = DAU/MAU ratio - how often monthly users return daily
    const stickiness = stats.mau > 0 ? (stats.dau / stats.mau) * 100 : 0;
    
    // LTV = ARPU × estimated customer lifetime
    // Estimate lifetime from stickiness: higher stickiness = longer retention
    // Base: 12 months, adjusted by stickiness (20%+ stickiness → up to 24 months)
    const avgLifetimeMonths = Math.max(6, Math.min(24, 12 * (1 + stickiness / 100)));
    const ltv = arpu * avgLifetimeMonths;
    
    // CAC = estimated customer acquisition cost
    // Industry benchmark: CAC should be ~1/3 of LTV for healthy unit economics
    // We estimate CAC as 3× monthly ARPU (typical for dApps)
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
    
    // Convert selected timeframe growth to monthly rate for projections
    // daily -> monthly: multiply by 30, weekly -> monthly: multiply by ~4.3, monthly: use as-is
    const monthlyGrowthRate = growthTimeframe === 'daily' 
      ? (revenueGrowthRate / 100) * 30 
      : growthTimeframe === 'weekly' 
        ? (revenueGrowthRate / 100) * (30/7)
        : revenueGrowthRate / 100;
    
    const revenuePerUser = stats.totalUsers > 0 ? stats.totalRevenue / stats.totalUsers : 0;
    const transactionsPerUser = stats.totalUsers > 0 ? stats.totalTransactions / stats.totalUsers : 0;
    const engagementPerUser = stats.totalUsers > 0 ? stats.keyActions / stats.totalUsers : 0;
    
    // NRR = Net Revenue Retention: measures revenue retained from existing customers
    // For dApps, approximate as: 100% + monthly revenue growth (clamped to realistic range)
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
    
    // Advanced metrics
    const arppu = stats.payingUsers > 0 ? stats.totalRevenue / stats.payingUsers : 0;
    const revenuePerTx = stats.totalTransactions > 0 ? stats.totalRevenue / stats.totalTransactions : 0;
    const avgTxSize = stats.totalTransactions > 0 ? stats.totalVolume / stats.totalTransactions : 0;
    
    // Cohort ratios
    const dauWauRatio = stats.wau > 0 ? (stats.dau / stats.wau) * 100 : 0;
    const wauMauRatio = stats.mau > 0 ? (stats.wau / stats.mau) * 100 : 0;
    const payingMauRatio = stats.mau > 0 ? (stats.payingUsers / stats.mau) * 100 : 0;
    
    // Engagement quality
    const actionsPerSession = stats.sessions > 0 ? stats.keyActions / stats.sessions : 0;
    const actionsPerDAU = stats.dau > 0 ? stats.keyActions / stats.dau : 0;
    const sessionsPerDAU = stats.dau > 0 ? stats.sessions / stats.dau : 0;
    
    // On-chain health
    const txPerUser = stats.totalUsers > 0 ? stats.totalTransactions / stats.totalUsers : 0;
    const volumePerTx = stats.totalTransactions > 0 ? stats.totalVolume / stats.totalTransactions : 0;
    const volumePerActiveUser = stats.dau > 0 ? stats.totalVolume / stats.dau : 0;
    
    // Engagement funnel conversion rates (Total → MAU → WAU → DAU → Paying)
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
