import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Factory, Hammer, CheckCircle, Users, Zap } from "lucide-react";
import { Link } from "wouter";
import { PasswordGate } from "@/components/password-gate";

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
    <PasswordGate storageKey="proposalAuth" title="Partnership Proposal">
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
                We propose a <strong>6-month initial collaboration</strong> at <strong>$25,000/month</strong> for Zeno to operate as a dedicated MiniPay App Studio, building new mini apps for the ecosystem.
              </p>
              <p className="text-white/80 leading-relaxed">
                Core focus on shipping high-quality, engagement-driven apps. We'll also run an exploratory pilot to help external developers list on MiniPay.
              </p>
            </Block>
            
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { value: "6", label: "Month initial term", sub: "with option to extend" },
                { value: "$25K", label: "Monthly retainer", sub: "all-inclusive" },
                { value: "4+", label: "Dedicated agents", sub: "human + AI" },
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

        {/* The Mandate: Factory + Foundry Pilot */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">The Mandate</h2>
              <p className="text-[#a0aec0]">Core focus on building apps, with an exploratory pilot to support ecosystem developers.</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <div className="flex items-center gap-3 mb-4">
                  <Factory className="w-8 h-8 text-[#3b82f6]" />
                  <h3 className="text-2xl font-semibold">The Factory</h3>
                </div>
                <p className="text-sm text-[#3b82f6] uppercase tracking-widest mb-4">Core Deliverable</p>
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
                  <Hammer className="w-8 h-8 text-[#a0aec0]" />
                  <h3 className="text-2xl font-semibold text-[#a0aec0]">The Foundry</h3>
                </div>
                <p className="text-sm text-[#a0aec0] uppercase tracking-widest mb-4">Exploratory Pilot</p>
                <p className="text-sm text-[#a0aec0] mb-4">Test with 1-2 external apps to validate the model before scaling.</p>
                <ul className="space-y-3 text-[#a0aec0]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#a0aec0] mt-1 flex-shrink-0" />
                    <span>Assist third-party developers applying to list on MiniPay</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#a0aec0] mt-1 flex-shrink-0" />
                    <span>Review apps for UX, onchain logic, and scalability</span>
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

        {/* How We Measure ROI */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">How We Measure ROI</h2>
              <p className="text-[#a0aec0]">Two metrics that matter for app performance decisions</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <Users className="w-8 h-8 text-[#3b82f6] mb-3" />
                <h3 className="text-2xl font-semibold mb-2">DAU</h3>
                <p className="text-[#a0aec0]">Daily Active Users — the core engagement signal. Are people coming back?</p>
              </Block>
              <Block variant="dark" delay={0.2}>
                <Zap className="w-8 h-8 text-[#3b82f6] mb-3" />
                <h3 className="text-2xl font-semibold mb-2">Transactions</h3>
                <p className="text-[#a0aec0]">Onchain transactions per user — the value signal. Are users transacting on Celo?</p>
              </Block>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
              <Block variant="dark" className="border-r border-[#2d2d2d] border-t-0" delay={0.3}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500" />
                  <span className="font-semibold">Scale</span>
                </div>
                <p className="text-sm text-[#a0aec0]">Strong DAU + Txs. Invest in features and marketing.</p>
              </Block>
              <Block variant="dark" className="border-r border-[#2d2d2d] border-t-0" delay={0.35}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-yellow-500" />
                  <span className="font-semibold">Optimize</span>
                </div>
                <p className="text-sm text-[#a0aec0]">Positive trends but below thresholds. Iterate.</p>
              </Block>
              <Block variant="dark" className="border-t-0" delay={0.4}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500" />
                  <span className="font-semibold">Sunset</span>
                </div>
                <p className="text-sm text-[#a0aec0]">Stagnant after 2-4 weeks. Free resources.</p>
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

            <Block variant="dark" className="border-t-0" delay={0.3}>
              <h3 className="text-xl font-semibold mb-3">Future Opportunity: Shared Upside</h3>
              <p className="text-[#a0aec0] mb-4">
                As Zeno grows, we're exploring a <strong>$ZENO token</strong> model that could give partners like Opera MiniPay exposure to the studio's success.
              </p>
              <p className="text-sm text-[#a0aec0]">
                This is worth exploring as a way to align long-term incentives — if Zeno builds successful apps that drive value to MiniPay and Celo, Opera could share in that upside.
              </p>
            </Block>
          </div>
        </section>

        {/* How We Work */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.1}>
                <h2 className="text-2xl font-semibold mb-4">How We Work</h2>
                <ul className="space-y-2 text-[#a0aec0]">
                  <li><strong className="text-white">Weekly sync:</strong> 30-45 min on priorities and launches</li>
                  <li><strong className="text-white">Monthly report:</strong> KPIs, learnings, next bets</li>
                  <li><strong className="text-white">MiniPay approves</strong> concepts and listing; <strong className="text-white">Zeno builds</strong></li>
                </ul>
              </Block>
              <Block variant="dark" delay={0.15}>
                <h2 className="text-2xl font-semibold mb-4">Value to Opera</h2>
                <ul className="space-y-2 text-[#a0aec0]">
                  <li><strong className="text-white">More apps, more stickiness:</strong> Daily engagement and transactions</li>
                  <li><strong className="text-white">AI-native innovation:</strong> Strategic input on product direction</li>
                </ul>
              </Block>
            </div>
          </div>
        </section>

        {/* Why Zeno */}
        <section>
          <div className="max-w-7xl mx-auto">
            <Block variant="accent" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-6">Why Zeno</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Team</h3>
                  <p className="text-white/80">Marco Barbosa (Forbes 30U30) + Pedro Oliveira, with 15+ years combined experience in fintech and impact products at scale.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">MiniPlay</h3>
                  <p className="text-white/80">Launched on MiniPay with strong initial engagement. Built in weeks, iterated based on real user data.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Alignment</h3>
                  <p className="text-white/80">We're already building for MiniPay and want to deepen the partnership. Same mission, shared success.</p>
                </div>
              </div>
              <div className="border-t border-white/20 pt-6">
                <p className="text-white/80 mb-2">Contact: Marco Barbosa</p>
                <a href="https://x.com/mbarrbosa" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors" data-testid="link-contact-x">@mbarrbosa</a>
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
    </PasswordGate>
  );
}
