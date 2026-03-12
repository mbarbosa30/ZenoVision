export type MetricDefinition = { title: string; description: string; calculation: string; benchmarks: string; context: string };

export const metricDefinitions: Record<string, { title: string; description: string; calculation: string; benchmarks: string; context: string }> = {
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
    calculation: "(Total paying users ÷ Total users) × 100. Aggregated across all tracked apps. Includes both direct payments and onchain transfers that generate revenue.",
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
    context: "Revenue per transfer is the studio's onchain monetization efficiency. In the ETF model, this helps compare which portfolio apps extract the most value per blockchain interaction — informing where to invest more development time and which monetization mechanics to replicate across products."
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
    calculation: "Total onchain volume (USD) ÷ total onchain transfers.",
    benchmarks: "Micropayment apps: $0.10-5. Standard Web3 transfers: $10-100. DeFi protocols: $500-50,000+. Context matters — a gaming app with $0.50 avg tx doing 10K tx/day is healthier than a DeFi app with $5K avg tx doing 2 tx/day.",
    context: "Volume per transfer helps characterize the portfolio's onchain economic profile. Lower volume with high frequency suggests consumer utility. Higher volume with lower frequency suggests financial infrastructure. Both contribute to the studio's valuation but through different mechanisms."
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
    description: "Values the studio as a percentage of the total onchain volume flowing through its products. This treats the studio as a value-capture layer on transfer flows — similar to how payment networks (Visa, Stripe) are valued relative to their payment volume.",
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
    context: "Wallet-based valuation is the studio's Web3-native edge. Traditional apps count signups (often fake or dormant). Web3 apps count wallets that have made real onchain transfers — every wallet represents a user who has gone through KYC/wallet setup, funded their wallet, and executed transfers. For the ETF model, unique wallets across the portfolio represent the studio's Web3 distribution moat."
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
    context: "Multiple daily sessions is a leading indicator of monetization potential and retention. For a gaming studio, 3+ sessions/DAU means users are coming back between gaming sessions — the core loop is working. Each additional session is another opportunity to show value, drive transfers, and deepen engagement."
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
    description: "A scatter plot showing each app's transfer count against its onchain volume, with bubble size representing MAU. This reveals the relationship between transfer frequency and economic magnitude across the portfolio.",
    calculation: "X-axis: transfer count per app. Y-axis: onchain volume (USD) per app. Bubble size: MAU per app. Each bubble represents one tracked app.",
    benchmarks: "High volume, few transfers: large-value transfers (DeFi-like). Many transfers, low volume: micro-payments (gaming-like). The diagonal represents balanced proportional growth — most healthy apps sit near or above it.",
    context: "This chart characterizes the portfolio's onchain economic profile. Apps in the upper-left are processing large-value transfers (financial infrastructure). Apps in the lower-right are processing many small transfers (consumer utility). Understanding this distribution helps the studio optimize fee structures and identify which economic models work best across the portfolio."
  },
  valuation: {
    title: "Zeno Studio Portfolio Valuation",
    description: "The estimated total value of the studio and its portfolio of AI and Web3 products, calculated using five industry-standard valuation methods blended with confidence weighting. Think of this as the studio's 'NAV' (Net Asset Value) — similar to how an ETF's value is the weighted sum of all its holdings.",
    calculation: "Blends five methods: Revenue Multiple (10-50x ARR), Volume Percentage (1-10% of annualized onchain volume), Per-DAU ($50-300), Per-MAU ($10-75), and Per-Wallet ($100-1,500). Each method produces Conservative/Mid/Aggressive estimates. The final blended value weights each method by data quality — methods with stronger underlying data contribute more to the final number.",
    benchmarks: "Pre-seed Web3 studios: $500K-2M. Seed-stage with traction: $2M-10M. Series A: $10M-50M. The range between Conservative and Aggressive reflects market uncertainty — tighter ranges indicate more consistent data across methods, wider ranges indicate higher uncertainty.",
    context: "This valuation serves two purposes: (1) for fundraising — it gives investors a data-driven, multi-method estimate rather than an arbitrary number; and (2) for portfolio management — tracking how valuation changes over time shows whether the studio's strategy is working. The ETF parallel is intentional: just as an index fund's NAV rises when its holdings appreciate, the studio's valuation rises when its portfolio apps grow."
  },
};
