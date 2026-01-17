import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Factory, Hammer, CheckCircle, BarChart3, Users, Zap, Target, TrendingUp, Calendar } from "lucide-react";
import { Link } from "wouter";

interface BlockProps {
  variant?: "dark" | "light" | "accent";
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const Block = ({ variant = "dark", children, className = "", delay = 0 }: BlockProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const styles = {
    dark: "bg-[#1a1a1a] text-white border-[#2d2d2d]",
    light: "bg-white text-[#1a1a1a] border-[#e5e5e5]",
    accent: "bg-[#3b82f6] text-white border-[#2563eb]",
  };
  
  return (
    <motion.div
      ref={ref}
      className={`border p-6 md:p-8 ${styles[variant]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function Proposal() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#2d2d2d] bg-[#0f0f0f]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" data-testid="link-logo">
            <div className="w-8 h-8 bg-[#3b82f6]" />
            <span className="font-semibold text-lg tracking-tight">Zeno</span>
          </Link>
          <div className="text-sm text-[#a0aec0]">Partnership Proposal</div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto p-8 md:p-16 lg:p-24">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#a0aec0] hover:text-white transition-colors mb-8" data-testid="link-back-home">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-sm text-[#a0aec0] uppercase tracking-widest mb-4">Proposal</div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight mb-6">
                Zeno x Opera MiniPay
              </h1>
              <p className="text-2xl text-[#3b82f6] font-medium mb-8">
                Accelerating Ecosystem Growth via an AI-Native Studio Partner
              </p>
              <p className="text-xl text-[#a0aec0] max-w-3xl">
                A strategic partnership to establish a dedicated MiniPay Studio Engine. Building on early traction with MiniPlay and ongoing collaboration with the MiniPay team, Zeno has demonstrated the ability to ship and iterate on mini-apps rapidly.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Executive Summary */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="accent" className="border-b border-[#2563eb]" delay={0.1}>
              <h2 className="text-2xl font-semibold mb-4">Executive Summary</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                We propose a <strong>6-month initial collaboration</strong> at <strong>$25,000/month</strong> for Zeno to operate as a dedicated MiniPay App Studio, building new mini apps and helping other developers improve and launch apps for MiniPay listing.
              </p>
              <p className="text-white/80 leading-relaxed">
                Our mandate is twofold: <strong>Build</strong> high-quality, engagement-driven apps internally, and <strong>Empower</strong> the wider ecosystem by establishing best practices and optimizing third-party apps.
              </p>
            </Block>
            
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { value: "6", label: "Month initial term", sub: "with option to extend" },
                { value: "$25K", label: "Monthly retainer", sub: "all-inclusive" },
                { value: "4", label: "Dedicated agents", sub: "human + AI" },
                { value: "2-4", label: "Apps per month", sub: "launches/improvements" },
              ].map((stat, i) => (
                <Block 
                  key={i} 
                  variant="dark" 
                  className={`${i < 3 ? "border-r border-[#2d2d2d]" : ""}`} 
                  delay={0.15 + i * 0.05}
                >
                  <div className="text-2xl md:text-3xl font-semibold text-[#3b82f6] mb-1">{stat.value}</div>
                  <div className="text-sm font-medium mb-1">{stat.label}</div>
                  <div className="text-xs text-[#a0aec0]">{stat.sub}</div>
                </Block>
              ))}
            </div>
          </div>
        </section>

        {/* The Mandate: Factory & Foundry */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">The Mandate: Factory & Foundry</h2>
              <p className="text-[#a0aec0]">Zeno will operate on two parallel tracks to drive value for MiniPay and the Celo ecosystem.</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <div className="flex items-center gap-3 mb-4">
                  <Factory className="w-8 h-8 text-[#3b82f6]" />
                  <h3 className="text-2xl font-semibold">Track A: The Factory</h3>
                </div>
                <p className="text-sm text-[#a0aec0] uppercase tracking-widest mb-4">Internal Builds</p>
                <ul className="space-y-3 text-[#a0aec0]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#3b82f6] mt-1 flex-shrink-0" />
                    <span><strong className="text-white">Rapid Prototyping:</strong> Prototype and launch new mini-apps monthly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#3b82f6] mt-1 flex-shrink-0" />
                    <span><strong className="text-white">Focus:</strong> Engagement, onchain transactions on Celo, sustainable revenue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#3b82f6] mt-1 flex-shrink-0" />
                    <span><strong className="text-white">App Coins:</strong> Strategic token integration for retention, not speculation</span>
                  </li>
                </ul>
              </Block>
              
              <Block variant="dark" delay={0.2}>
                <div className="flex items-center gap-3 mb-4">
                  <Hammer className="w-8 h-8 text-[#3b82f6]" />
                  <h3 className="text-2xl font-semibold">Track B: The Foundry</h3>
                </div>
                <p className="text-sm text-[#a0aec0] uppercase tracking-widest mb-4">Ecosystem Optimization</p>
                <ul className="space-y-3 text-[#a0aec0]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#3b82f6] mt-1 flex-shrink-0" />
                    <span><strong className="text-white">Developer Support:</strong> Assist third-party developers applying to list on MiniPay</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#3b82f6] mt-1 flex-shrink-0" />
                    <span><strong className="text-white">Audits & Refactoring:</strong> Review apps for UX, onchain logic, and scalability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#3b82f6] mt-1 flex-shrink-0" />
                    <span><strong className="text-white">Scale or Kill:</strong> Data-driven recommendations on which apps to promote or delist</span>
                  </li>
                </ul>
              </Block>
            </div>
          </div>
        </section>

        {/* The Zeno Standard */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">The Zeno Standard</h2>
              <p className="text-[#a0aec0]">Best practices framework based on real-world data from MiniPlay's launch</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              <Block variant="dark" className="border-r border-[#2d2d2d] border-b md:border-b-0" delay={0.15}>
                <div className="text-sm text-[#3b82f6] uppercase tracking-widest mb-3">Community & Ops</div>
                <ul className="space-y-3 text-sm text-[#a0aec0]">
                  <li><strong className="text-white">Channels over Groups:</strong> Announcement-heavy channels with dedicated ticket systems</li>
                  <li><strong className="text-white">Scalability First:</strong> Apps architected for launch day spikes (hundreds of concurrent users)</li>
                  <li><strong className="text-white">Observability:</strong> Error tracking, latency monitoring, uptime alerts</li>
                </ul>
              </Block>
              
              <Block variant="dark" className="border-r border-[#2d2d2d] border-b md:border-b-0" delay={0.2}>
                <div className="text-sm text-[#3b82f6] uppercase tracking-widest mb-3">Product & Retention</div>
                <ul className="space-y-3 text-sm text-[#a0aec0]">
                  <li><strong className="text-white">Staged Roadmaps:</strong> Pre-launch QA, lean listing, release features in waves to sustain retention</li>
                  <li><strong className="text-white">Daily Onchain Habit:</strong> Check-in mechanics triggering low-cost Celo transactions</li>
                  <li><strong className="text-white">No Pay-to-Play:</strong> Progression, status, streaks over direct rewards</li>
                </ul>
              </Block>
              
              <Block variant="dark" delay={0.25}>
                <div className="text-sm text-[#3b82f6] uppercase tracking-widest mb-3">Growth & Analytics</div>
                <ul className="space-y-3 text-sm text-[#a0aec0]">
                  <li><strong className="text-white">Social Proof Loops:</strong> Referrals that reward sharing progress/status</li>
                  <li><strong className="text-white">Data Sovereignty:</strong> Google Analytics + internal admin dashboards</li>
                  <li><strong className="text-white">Viral Hooks:</strong> Measurable invite conversion and K-factor tracking</li>
                </ul>
              </Block>
            </div>
          </div>
        </section>

        {/* KPI Framework */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Health Score Framework</h2>
              <p className="text-[#a0aec0]">Standardized KPIs to measure app performance and guide ecosystem decisions</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Users, title: "Engagement", metrics: ["DAU / WAU / MAU", "Sessions per user/day", "Median session length", "Streak adoption rate"] },
                { icon: TrendingUp, title: "Retention", metrics: ["D1, D7, D30 retention", "Cohort by channel", "Repeat tx rate", "Check-in completion"] },
                { icon: Zap, title: "Onchain Activity", metrics: ["Tx per active user", "% users with 1+ tx", "Fee volume", "Network velocity"] },
                { icon: Target, title: "Revenue", metrics: ["Revenue per user", "Conversion rate", "ARPDAU", "Sustainable economics"] },
              ].map((category, i) => (
                <Block 
                  key={i} 
                  variant="dark" 
                  className={`${i < 3 ? "border-r border-[#2d2d2d]" : ""}`} 
                  delay={0.15 + i * 0.05}
                >
                  <category.icon className="w-6 h-6 text-[#3b82f6] mb-3" />
                  <h3 className="text-lg font-semibold mb-3">{category.title}</h3>
                  <ul className="space-y-2 text-sm text-[#a0aec0]">
                    {category.metrics.map((metric, j) => (
                      <li key={j}>{metric}</li>
                    ))}
                  </ul>
                </Block>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
              <Block variant="dark" className="border-r border-[#2d2d2d] border-t-0" delay={0.3}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500" />
                  <span className="font-semibold">Green: Scale</span>
                </div>
                <p className="text-sm text-[#a0aec0]">DAU &gt;10K, Retention &gt;30%, Tx &gt;1/user/day. Invest in features and marketing.</p>
              </Block>
              <Block variant="dark" className="border-r border-[#2d2d2d] border-t-0" delay={0.35}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-yellow-500" />
                  <span className="font-semibold">Yellow: Optimize</span>
                </div>
                <p className="text-sm text-[#a0aec0]">Below thresholds but positive trends. Iterate based on analytics and user feedback.</p>
              </Block>
              <Block variant="dark" className="border-t-0" delay={0.4}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500" />
                  <span className="font-semibold">Red: Delist</span>
                </div>
                <p className="text-sm text-[#a0aec0]">Stagnant/declining after 2-4 weeks. Sunset to free resources unless clear fix exists.</p>
              </Block>
            </div>
          </div>
        </section>

        {/* Budget */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Investment & Alignment</h2>
              <p className="text-[#a0aec0]">6-month initial term at $25,000/month (all-inclusive)</p>
            </Block>
            
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { amount: "$17.5K", category: "Human Agents", desc: "Pilot, Co-Pilot, Dev, Support" },
                { amount: "$3K", category: "AI Tools", desc: "Replit, custom agents" },
                { amount: "$3K", category: "Infrastructure", desc: "Servers, hosting, ops" },
                { amount: "$1.5K", category: "Growth & Misc", desc: "Analytics, compliance" },
              ].map((item, i) => (
                <Block 
                  key={i} 
                  variant="dark" 
                  className={`${i < 3 ? "border-r border-[#2d2d2d]" : ""}`} 
                  delay={0.15 + i * 0.05}
                >
                  <div className="text-2xl font-semibold text-[#3b82f6] mb-1">{item.amount}</div>
                  <div className="font-medium mb-1">{item.category}</div>
                  <div className="text-sm text-[#a0aec0]">{item.desc}</div>
                </Block>
              ))}
            </div>

            <Block variant="accent" className="border-t-0" delay={0.3}>
              <h3 className="text-xl font-semibold mb-3">Strategic Alignment: Skin in the Game</h3>
              <p className="text-white/90 mb-4">
                Zeno is structured as a DAO LLC. As part of this partnership, we propose allocating a monthly grant of <strong>$ZENO tokens</strong> (vested) to Opera MiniPay.
              </p>
              <p className="text-white/80">
                <strong>Why?</strong> This aligns our incentives. If Zeno builds successful apps that drive value to MiniPay and Celo, the value of the Zeno studio grows, and Opera shares in that upside.
              </p>
            </Block>
          </div>
        </section>

        {/* 30-Day Kickoff */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">30-Day Kickoff Plan</h2>
              <p className="text-[#a0aec0]">Immediate deployment to begin the next sprint</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-4">
              {[
                { week: "Week 1", title: "Foundation", tasks: ["Confirm goals and KPIs", "Define MiniPay Launch Standard v1", "Set up shared dashboard + reporting"] },
                { week: "Week 2", title: "Build", tasks: ["Ship 1-2 improvements to existing apps", "Begin new miniapp MVP build", "Implement community blueprint"] },
                { week: "Week 3", title: "Iterate", tasks: ["Continue MVP development", "Support 1 external builder app", "Refine KPI tracking"] },
                { week: "Week 4", title: "Launch", tasks: ["Ship MVP / pilot launch", "Publish first KPI report", "Finalize Health Score v1"] },
              ].map((week, i) => (
                <Block 
                  key={i} 
                  variant="dark" 
                  className={`${i < 3 ? "border-r border-[#2d2d2d]" : ""}`} 
                  delay={0.15 + i * 0.05}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-[#3b82f6]" />
                    <span className="text-sm text-[#3b82f6] font-medium">{week.week}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{week.title}</h3>
                  <ul className="space-y-2 text-sm text-[#a0aec0]">
                    {week.tasks.map((task, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-[#3b82f6] mt-1 flex-shrink-0" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </Block>
              ))}
            </div>
          </div>
        </section>

        {/* Operating Model */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Operating Model</h2>
              <p className="text-[#a0aec0]">How we work together</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <h3 className="text-lg font-semibold mb-3">Cadence</h3>
                <ul className="space-y-2 text-sm text-[#a0aec0]">
                  <li><strong className="text-white">Weekly:</strong> 30-45 min sync (priorities, blockers, launches)</li>
                  <li><strong className="text-white">Biweekly:</strong> Release planning + KPI review</li>
                  <li><strong className="text-white">Monthly:</strong> Strategic review (pipeline, learnings, next bets)</li>
                </ul>
              </Block>
              
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.2}>
                <h3 className="text-lg font-semibold mb-3">Communication</h3>
                <ul className="space-y-2 text-sm text-[#a0aec0]">
                  <li>Shared backlog (Linear / Notion)</li>
                  <li>Weekly status: shipped, in progress, next, risks</li>
                  <li>Monthly report: KPI snapshots, learnings, decisions</li>
                </ul>
              </Block>
              
              <Block variant="dark" delay={0.25}>
                <h3 className="text-lg font-semibold mb-3">Workflow</h3>
                <ul className="space-y-2 text-sm text-[#a0aec0]">
                  <li><strong className="text-white">MiniPay:</strong> Approval on concepts, branding, listing gates</li>
                  <li><strong className="text-white">Zeno:</strong> Build, test, instrument, deploy, iterate</li>
                </ul>
              </Block>
            </div>
          </div>
        </section>

        {/* Benefits to Opera */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Benefits to Opera</h2>
              <p className="text-[#a0aec0]">How this partnership drives broader business value</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Growth Acceleration", desc: "More high-quality mini apps = higher user stickiness, driving daily engagement and transaction volume across MiniPay's user base." },
                { title: "Innovation Edge", desc: "AI-native, curiosity-driven experiments introduce creative features that differentiate MiniPay in the market." },
                { title: "Strategic Advisory", desc: "Consultancy and strategic input on AI-native innovation, helping shape Opera and MiniPay's vision in this new era of acceleration." },
                { title: "Ecosystem Influence", desc: "Enhanced mini apps boost Celo activity, stablecoin adoption, and Opera's browser/wallet metrics across 60+ countries." },
              ].map((benefit, i) => (
                <Block 
                  key={i} 
                  variant="dark" 
                  className={`${i < 3 ? "border-r border-[#2d2d2d]" : ""}`} 
                  delay={0.15 + i * 0.05}
                >
                  <h3 className="text-lg font-semibold mb-2 text-[#3b82f6]">{benefit.title}</h3>
                  <p className="text-sm text-[#a0aec0]">{benefit.desc}</p>
                </Block>
              ))}
            </div>
          </div>
        </section>

        {/* Why Zeno */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="accent" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-6">Why Zeno</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Proven Execution</h3>
                  <ul className="space-y-2 text-white/80">
                    <li>Multiple experiments live, several with early traction and revenue</li>
                    <li>MiniPlay launched with strong initial engagement</li>
                    <li>High-throughput experimentation machine</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Partner Mindset</h3>
                  <ul className="space-y-2 text-white/80">
                    <li>We co-build, we elevate the ecosystem</li>
                    <li>Strategic input on AI-native innovation trends</li>
                    <li>Fast experiments + honest measurement</li>
                  </ul>
                </div>
              </div>
            </Block>
          </div>
        </section>

        {/* Next Steps */}
        <section>
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-6">Next Steps</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#3b82f6] flex items-center justify-center text-lg font-semibold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold mb-1">Review</h3>
                    <p className="text-sm text-[#a0aec0]">Does the Factory & Foundry model align with your current needs?</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#3b82f6] flex items-center justify-center text-lg font-semibold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold mb-1">Call</h3>
                    <p className="text-sm text-[#a0aec0]">30-minute call to confirm priorities and retainer scope</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#3b82f6] flex items-center justify-center text-lg font-semibold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold mb-1">Kickoff</h3>
                    <p className="text-sm text-[#a0aec0]">Start 30-day pilot that rolls into 6-month collaboration</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-[#2d2d2d] pt-6">
                <p className="text-[#a0aec0] mb-2">Contact: Marco Barbosa</p>
                <a href="https://x.com/mbarrbosa" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:text-white transition-colors" data-testid="link-contact-x">@mbarrbosa</a>
              </div>
            </Block>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#2d2d2d] py-8">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-[#4a5568]">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-[#3b82f6]" />
              <span>Zeno</span>
            </div>
            <div className="text-[#a0aec0]">
              Measure what matters. Ship what moves.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
