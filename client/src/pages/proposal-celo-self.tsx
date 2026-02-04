import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, Shield, Users, Coins, Repeat, Target, AlertTriangle, Calendar, CheckCircle, Zap, Lock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PasswordGate } from "@/components/password-gate";

interface BlockProps {
  variant?: "dark" | "light" | "accent" | "green";
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
    green: "bg-[#059669] text-white border-[#047857]",
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

export default function ProposalCeloSelf() {
  return (
    <PasswordGate storageKey="proposalCeloAuth" title="Initiative Proposal">
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#2d2d2d] bg-[#0f0f0f]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" data-testid="link-logo">
            <div className="w-8 h-8 bg-[#3b82f6]" />
            <span className="font-semibold text-lg tracking-tight">Zeno</span>
          </Link>
          <div className="text-sm text-[#a0aec0]">Initiative Spec v1.1</div>
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
              <div className="text-sm text-[#a0aec0] uppercase tracking-widest mb-4">Infrastructure Initiative</div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight mb-6">
                The Real Human Economy Stack
              </h1>
              <p className="text-xl md:text-2xl text-[#3b82f6] font-medium mb-8">
                Identity + Context + Routing for Celo
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-[#a0aec0]">
                <span>To: Celo Foundation & Self.xyz</span>
                <span className="text-[#4a5568]">|</span>
                <span>From: Marco Barbosa, Zeno Vision Studio</span>
                <span className="text-[#4a5568]">|</span>
                <span>February 2026</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Executive Summary */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="accent" className="border-b border-[#2563eb]" delay={0.1}>
              <h2 className="text-2xl font-semibold mb-4">Executive Summary: The Vertical Thesis</h2>
              <div className="space-y-4 text-white/90 leading-relaxed">
                <p>
                  <strong>The Pivot Point:</strong> L2s are currently competing on horizontal throughput (TPS). Celo does not need to run this race. Celo's winning vertical is <span className="text-white font-semibold">Real-World Identity & Mobile Distribution</span>.
                </p>
                <p>
                  <strong>The Problem:</strong> "Identity" (Self.xyz) is the container. The content—context, reliability, and economic incentive—is currently missing. Without this layer, Celo apps cannot distinguish long-term participants from extractive farmers, and every builder must reinvent their own loyalty program.
                </p>
                <p>
                  <strong>The Solution:</strong> Zeno Vision Studio proposes to build the <span className="text-white font-semibold">Real Human Economy Stack</span> on Celo—a unified infrastructure comprising Identity, Context, and Routing.
                </p>
              </div>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <div className="text-[#3b82f6] mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Strategic Wedge</h3>
                <p className="text-[#a0aec0]">
                  Zeno is not starting from zero. We bring a <strong className="text-white">Data Moat</strong> (170k+ unique wallets across MiniPlay/NanoPay) and a <strong className="text-white">Live Economic Engine</strong> (ProsperON) that solves retention for the entire ecosystem.
                </p>
              </Block>
              
              <Block variant="dark" delay={0.2}>
                <div className="text-[#3b82f6] mb-4">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Value Proposition</h3>
                <ul className="text-[#a0aec0] space-y-2">
                  <li><strong className="text-white">Self</strong> proves you are real</li>
                  <li><strong className="text-white">CHS</strong> proves you are safe/reliable</li>
                  <li><strong className="text-white">ProsperON</strong> funds the loop and keeps you coming back</li>
                </ul>
              </Block>
            </div>
          </div>
        </section>

        {/* The Architecture Triangle */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">The Architecture: The Triangle</h2>
              <p className="text-[#a0aec0]">Identity qualifies you, Context tiers you, ProsperON rewards you</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              <Block variant="dark" className="border-r border-[#2d2d2d] border-b md:border-b-0" delay={0.15}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#8b5cf6] flex items-center justify-center text-white font-bold">1</div>
                  <h3 className="text-xl font-semibold">Identity (Self.xyz)</h3>
                </div>
                <p className="text-[#3b82f6] font-medium mb-3">"Is this a real, unique human?"</p>
                <p className="text-[#a0aec0]">Prevents Sybil farming of the layers below. The foundational proof of uniqueness.</p>
              </Block>
              
              <Block variant="dark" className="border-r border-[#2d2d2d] border-b md:border-b-0" delay={0.2}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#3b82f6] flex items-center justify-center text-white font-bold">2</div>
                  <h3 className="text-xl font-semibold">Context (Zeno CHS)</h3>
                </div>
                <p className="text-[#3b82f6] font-medium mb-3">"What capabilities can this human safely unlock?"</p>
                <p className="text-[#a0aec0]">Privacy-preserving capability signals: Trust Tier, Consistency, Agent Policy.</p>
              </Block>
              
              <Block variant="dark" delay={0.25}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#10b981] flex items-center justify-center text-white font-bold">3</div>
                  <h3 className="text-xl font-semibold">Routing (ProsperON)</h3>
                </div>
                <p className="text-[#10b981] font-medium mb-3">"How do we reward their participation?"</p>
                <p className="text-[#a0aec0]">Burn Gas → Mint Score → Claim Yield. The economic engine.</p>
              </Block>
            </div>
          </div>
        </section>

        {/* Component A: CHS */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Component A: Consentful Human Signals (CHS)</h2>
              <p className="text-[#a0aec0]">User-Sovereign Attestations that allow apps to request specific capability proofs without accessing raw data</p>
            </Block>
            
            <Block variant="dark" delay={0.15}>
              <h3 className="text-xl font-semibold mb-6">The Signal Set (v1)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#2d2d2d]">
                      <th className="pb-4 pr-6 text-[#a0aec0] font-medium">Signal</th>
                      <th className="pb-4 pr-6 text-[#a0aec0] font-medium">Source</th>
                      <th className="pb-4 text-[#a0aec0] font-medium">Definition</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[
                      { signal: "Verified Human", source: "Self.xyz", def: "The baseline Sybil-resistance check." },
                      { signal: "Prosper Tier", source: "ProsperON", def: "Economic weight based on real cost paid (gas) + activity decay." },
                      { signal: "Trust Tier", source: "NanoPay", def: "Coarse reliability bucket (e.g., 'Established History' vs. 'New')." },
                      { signal: "Consistency", source: "MiniPlay", def: "Time-based activity proof (filters bursty/bot behavior)." },
                      { signal: "Agent Policy", source: "Selfclaw", def: "Proof that a user's AI agent operates within safe limits." },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-[#2d2d2d]/50">
                        <td className="py-4 pr-6 font-medium text-white">{row.signal}</td>
                        <td className="py-4 pr-6 text-[#3b82f6]">{row.source}</td>
                        <td className="py-4 text-[#a0aec0]">{row.def}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Block>
          </div>
        </section>

        {/* Component B: ProsperON */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Component B: The Routing Layer (ProsperON)</h2>
              <p className="text-[#a0aec0]">The native retention engine for Celo. Turns unavoidable gas costs into a loyalty program for the entire chain.</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "Burn", subtitle: "Real Cost", desc: "User transactions burn CELO (deflationary)", icon: Coins, color: "#ef4444" },
                { step: "Mint", subtitle: "Influence", desc: "Burning mints non-transferable Prosper Score", icon: Zap, color: "#f59e0b" },
                { step: "Decay", subtitle: "Rent, Don't Own", desc: "Scores decay at 2% weekly. Influence is rented.", icon: Repeat, color: "#8b5cf6" },
                { step: "Allocate", subtitle: "Yield", desc: "Weekly Yield Pool routed pro-rata based on score", icon: Target, color: "#10b981" },
              ].map((item, i) => (
                <Block key={i} variant="dark" className={`${i < 3 ? "border-r border-[#2d2d2d]" : ""}`} delay={0.15 + i * 0.05}>
                  <item.icon className="w-8 h-8 mb-4" style={{ color: item.color }} />
                  <h3 className="text-lg font-semibold mb-1">{item.step}</h3>
                  <p className="text-sm text-[#3b82f6] mb-2">{item.subtitle}</p>
                  <p className="text-sm text-[#a0aec0]">{item.desc}</p>
                </Block>
              ))}
            </div>
            
            <Block variant="dark" delay={0.3}>
              <h3 className="text-xl font-semibold mb-4">Why This Wins</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-[#3b82f6] font-medium mb-2">For Celo</h4>
                  <p className="text-sm text-[#a0aec0]">Creates counter-cyclical demand sink. Score is cheaper to earn when CELO price is low.</p>
                </div>
                <div>
                  <h4 className="text-[#10b981] font-medium mb-2">For Builders</h4>
                  <p className="text-sm text-[#a0aec0]">"Use my app, earn Network Yield." Builders get a loyalty program out-of-the-box.</p>
                </div>
                <div>
                  <h4 className="text-[#8b5cf6] font-medium mb-2">For Self</h4>
                  <p className="text-sm text-[#a0aec0]">Prosper Scores bound to Self IDs. Prevents wallet splitting (sybil attacks) from gaming the linear minting curve.</p>
                </div>
              </div>
            </Block>
          </div>
        </section>

        {/* Studio Structure */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Studio Structure: Marshall Islands DAO (MIDAO)</h2>
              <p className="text-[#a0aec0]">Long-term alignment and regulatory clarity</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                { title: "Legal Personhood", desc: "Grants Zeno the ability to enter contracts and hold IP while maintaining credible neutrality.", icon: Shield },
                { title: "Alignment Token ($ZENO)", desc: "Represents governance and treasury stewardship rights.", icon: Coins },
                { title: "Portfolio Model", desc: "The Zeno Treasury accrues value from ecosystem activity. Governance rights offer ecosystem-aligned exposure.", icon: Target },
              ].map((item, i) => (
                <Block key={i} variant="dark" className={`${i < 2 ? "border-r border-[#2d2d2d]" : ""}`} delay={0.15 + i * 0.05}>
                  <item.icon className="w-8 h-8 text-[#3b82f6] mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-[#a0aec0]">{item.desc}</p>
                </Block>
              ))}
            </div>
          </div>
        </section>

        {/* Strategic Proposal & Ask */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="accent" className="border-b border-[#2563eb]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Strategic Proposal & Ask</h2>
              <p className="text-white/90">Goal: Establish the "Real Human Economy" standard on Celo before social capital migrates to Base or TON</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <div className="text-2xl font-bold text-[#3b82f6] mb-2">A</div>
                <h3 className="text-lg font-semibold mb-3">Resource Alignment (Capital)</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[#a0aec0]">Ask:</span>
                    <p className="text-white">Runway funding (via Grant or Swap) to finalize MIDAO formation and fund 12 months of core dev.</p>
                  </div>
                  <div>
                    <span className="text-[#a0aec0]">Offer:</span>
                    <p className="text-white">Milestone-vested strategic governance allocation of $ZENO tokens to Celo Community Fund and Self Treasury.</p>
                  </div>
                </div>
              </Block>
              
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.2}>
                <div className="text-2xl font-bold text-[#10b981] mb-2">B</div>
                <h3 className="text-lg font-semibold mb-3">The Yield Endowment (ProsperON Pilot)</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[#a0aec0]">Ask:</span>
                    <p className="text-white">Celo/Mento allocates a pilot "Yield Endowment" to ProsperON Season 0 pool. (Principal stays safe; only yield is distributed)</p>
                  </div>
                  <div>
                    <span className="text-[#a0aec0]">Goal:</span>
                    <p className="text-white">Demonstrate that "paying gas" can be marketed as "investing in your weekly yield check."</p>
                  </div>
                </div>
              </Block>
              
              <Block variant="dark" delay={0.25}>
                <div className="text-2xl font-bold text-[#8b5cf6] mb-2">C</div>
                <h3 className="text-lg font-semibold mb-3">Technical Integration</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[#a0aec0]">Action:</span>
                    <p className="text-white">Designate a Technical Point-of-Contact from Celo/Self for bi-weekly architectural reviews.</p>
                  </div>
                  <div>
                    <span className="text-[#a0aec0]">Purpose:</span>
                    <p className="text-white">Ensure CHS schemas align with Self credential standards.</p>
                  </div>
                </div>
              </Block>
            </div>
          </div>
        </section>

        {/* Risk Assessment */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-8 h-8 text-[#f59e0b]" />
                <h2 className="text-3xl font-semibold">Critical Risk Assessment</h2>
              </div>
              <p className="text-[#a0aec0]">Identified risks and mitigation strategies</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              {[
                { 
                  risk: "Pay-to-Win (Plutocracy)", 
                  mitigations: [
                    "Decay: 2% weekly decay means whales cannot buy influence once and sit on it",
                    "Linear Minting: No exponential bonus for massive burns",
                    "Usage Bias: Portion of pool reserved for transaction frequency, not just volume"
                  ]
                },
                { 
                  risk: "Regressive Tax", 
                  mitigations: [
                    "Sponsored Burns: Builders can subsidize onboarding for new users",
                    "Degraded Mode: Lack of Prosper Tier never blocks basic access"
                  ]
                },
                { 
                  risk: "Black Mirror (Privacy)", 
                  mitigations: [
                    "Degraded Mode Pattern: Users can always opt-out of sharing CHS signals",
                    "Users sacrifice convenience/boosts but never their fundamental right to transact"
                  ]
                },
                { 
                  risk: "Sybil Farming", 
                  mitigations: [
                    "The Self Binding: All CHS signals and Prosper Scores bound to Self.xyz ID",
                    "Exponentially expensive to farm when every account requires unique human verification"
                  ]
                },
              ].map((item, i) => (
                <Block key={i} variant="dark" className={`${i % 2 === 0 ? "border-r border-[#2d2d2d]" : ""}`} delay={0.15 + i * 0.05}>
                  <h3 className="text-lg font-semibold mb-3 text-[#f59e0b]">{item.risk}</h3>
                  <ul className="space-y-2">
                    {item.mitigations.map((m, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[#a0aec0]">
                        <CheckCircle className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </Block>
              ))}
            </div>
          </div>
        </section>

        {/* Execution Roadmap */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-8 h-8 text-[#3b82f6]" />
                <h2 className="text-3xl font-semibold">Execution Roadmap</h2>
              </div>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <div className="text-sm text-[#3b82f6] font-medium mb-2">PHASE 1</div>
                <h3 className="text-xl font-semibold mb-1">Integration & Unification</h3>
                <p className="text-sm text-[#a0aec0] mb-4">Months 1–6</p>
                <p className="text-[#a0aec0] mb-4">Ship CHS v1 + ProsperON Integration</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#10b981] mt-0.5" />
                    <span className="text-[#a0aec0]">CHS SDK with "Prosper Tier" signal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#10b981] mt-0.5" />
                    <span className="text-[#a0aec0]">Reference App: Weekly claim loop demo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#10b981] mt-0.5" />
                    <span className="text-[#a0aec0]">Transparent dashboards: Gas Burn → Yield</span>
                  </li>
                </ul>
              </Block>
              
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.2}>
                <div className="text-sm text-[#8b5cf6] font-medium mb-2">PHASE 2</div>
                <h3 className="text-xl font-semibold mb-1">Hardening & Agents</h3>
                <p className="text-sm text-[#a0aec0] mb-4">Months 6–12</p>
                <p className="text-[#a0aec0] mb-4">Agentic workflows and ZK upgrades</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#8b5cf6] mt-0.5" />
                    <span className="text-[#a0aec0]">Agent Policy Attestations (Selfclaw)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#8b5cf6] mt-0.5" />
                    <span className="text-[#a0aec0]">ZK proofs for sensitive financial signals</span>
                  </li>
                </ul>
              </Block>
              
              <Block variant="dark" delay={0.25}>
                <div className="text-sm text-[#f59e0b] font-medium mb-2">PHASE 3</div>
                <h3 className="text-xl font-semibold mb-1">Governance Experiments</h3>
                <p className="text-sm text-[#a0aec0] mb-4">Year 1+</p>
                <p className="text-[#a0aec0] mb-4">Explore merit-based governance</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-[#f59e0b] mt-0.5" />
                    <span className="text-[#a0aec0]">Only pursued if community legitimacy allows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-[#f59e0b] mt-0.5" />
                    <span className="text-[#a0aec0]">Optional governance experiments</span>
                  </li>
                </ul>
              </Block>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="green" delay={0.1}>
              <div className="text-center">
                <h2 className="text-3xl font-semibold mb-4">Next Steps</h2>
                <p className="text-xl text-white/90 mb-2">The stack is defined. The data is live. The opportunity is now.</p>
                <p className="text-white/80 mb-8">
                  Schedule a 45-minute sync to review the MIDAO structure and ProsperON yield mechanics.<br />
                  Align on Q3/Q4 milestones for the "Real Human Economy" rollout.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild className="bg-white text-[#059669] hover:bg-white/90 rounded-none h-12 px-8 text-lg font-medium">
                    <a href="mailto:marco@zeno.vision" data-testid="cta-email">
                      Contact Marco
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-none h-12 px-8 text-lg font-medium">
                    <Link href="/" data-testid="link-home">
                      View Portfolio
                    </Link>
                  </Button>
                </div>
              </div>
            </Block>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#2d2d2d] py-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm text-[#4a5568]">
              Marco Barbosa · Founder, Zeno Vision Studio
            </p>
          </div>
        </footer>
      </main>
    </div>
    </PasswordGate>
  );
}
