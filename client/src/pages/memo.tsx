import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowLeft, Zap, Users, TrendingUp, Shield, Coins, Target, BarChart3, Repeat, AlertTriangle, Layers, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function Memo() {
  return (
    <PasswordGate storageKey="memoAuth" title="Investment Memo">
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#2d2d2d] bg-[#0f0f0f]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" data-testid="link-logo">
            <div className="w-8 h-8 bg-[#3b82f6]" />
            <span className="font-semibold text-lg tracking-tight">Zeno</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/about" className="text-sm text-[#a0aec0] hover:text-white transition-colors" data-testid="nav-about">About</Link>
            <Button asChild className="bg-white text-black hover:bg-white/90 rounded-none h-10 px-6">
              <Link href="/#contact" data-testid="nav-cta">Contact</Link>
            </Button>
          </nav>
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
              <div className="text-sm text-[#a0aec0] uppercase tracking-widest mb-4">Investment Memo</div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight mb-8">
                Measure what matters.
                <br />
                <span className="text-[#3b82f6]">Ship what moves.</span>
              </h1>
              <p className="text-xl text-[#a0aec0] max-w-2xl mb-6">
                Zeno is an AI-native Web3 app studio operating as a "startups ETF" — building our own products and helping others build theirs for equity and tokens. We compound upside across a growing portfolio through high-throughput experimentation and real distribution rails.
              </p>
              <p className="text-sm text-[#4a5568] italic">
                For discussion and feedback purposes only. Not investment advice.
              </p>
            </motion.div>
          </div>
        </section>

        {/* TL;DR */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="accent" className="border-b border-[#2563eb]" delay={0.1}>
              <h2 className="text-2xl font-semibold mb-4">TL;DR</h2>
              <p className="text-white/90 leading-relaxed">
                Zeno is built for a moment where three things became true at once: AI collapses build costs, crypto is the economic layer, and distribution is king. We're a high-throughput experimentation machine with explicit scale-or-kill gates — 8+ live products shipped, 200K+ users across the portfolio, and real onchain traction, in weeks, not years.
              </p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <div className="text-[#3b82f6] mb-4">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Collapses Build Costs</h3>
                <p className="text-[#a0aec0]">
                  Execution becomes a high-speed, low-cost loop. The bottleneck moves from "can you build?" to choosing the right experiments.
                </p>
              </Block>
              
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.2}>
                <div className="text-[#3b82f6] mb-4">
                  <Coins className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Crypto is the Economic Layer</h3>
                <p className="text-[#a0aec0]">
                  Global value exchange and coordination — including AI agent transactions — will happen onchain. Ownership, incentives, and composability.
                </p>
              </Block>
              
              <Block variant="dark" delay={0.25}>
                <div className="text-[#3b82f6] mb-4">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Distribution is King</h3>
                <p className="text-[#a0aec0]">
                  In an era of abundant software supply, the scarce resources are real distribution rails and the discipline to turn them into traction.
                </p>
              </Block>
            </div>
          </div>
        </section>

        {/* Status */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Current Status</h2>
              <p className="text-[#a0aec0]">Zeno is not an idea. It's a throughput machine that already ships.</p>
            </Block>
            
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { value: "200K+", label: "Total users" },
                { value: "7K+", label: "Daily active users" },
                { value: "67K+", label: "Onchain transactions" },
                { value: "22K+", label: "Paying users" },
              ].map((stat, i) => (
                <Block 
                  key={i} 
                  variant="dark" 
                  className={`${i < 3 ? "border-r border-[#2d2d2d]" : ""}`} 
                  delay={0.15 + i * 0.1}
                >
                  <div className="text-3xl md:text-4xl font-semibold text-[#3b82f6] mb-1">{stat.value}</div>
                  <div className="text-sm text-[#a0aec0]">{stat.label}</div>
                </Block>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Highlights */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Portfolio Highlights</h2>
              <p className="text-[#a0aec0]">Live products with hard early signals — all built in weeks</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                { name: "MiniPlay.studio", desc: "Cognition gaming platform", stat: "184K+ users | 19K+ paying | 41K+ onchain txs", highlight: "$1.9K+ onchain volume" },
                { name: "nanoPay.live", desc: "Digital financial utility", stat: "12K+ users | 300+ paying | 21K+ onchain txs", highlight: "$157K+ onchain volume" },
                { name: "Oracle360.net", desc: "AI cosmic daily guide", stat: "17K+ users | 2.7K paying | 3.9K+ onchain txs", highlight: "$520+ onchain volume" },
              ].map((project, i) => (
                <Block 
                  key={i} 
                  variant="dark" 
                  className={`${i < 2 ? "border-r border-[#2d2d2d]" : ""}`} 
                  delay={0.15 + i * 0.1}
                >
                  <h3 className="text-xl font-semibold mb-1">{project.name}</h3>
                  <p className="text-xs text-[#4a5568] mb-3">{project.desc}</p>
                  <p className="text-[#a0aec0] mb-2 text-sm">{project.stat}</p>
                  <div className="text-sm text-[#3b82f6] font-medium">{project.highlight}</div>
                </Block>
              ))}
            </div>
            
            <Block variant="dark" delay={0.3}>
              <p className="text-[#a0aec0]">
                Additional shipped experiments: MaxFlow.one, tempos.bet, x4pp.xyz, prosperon.market, timecapsule.news — each testing a different thesis at the intersection of AI, crypto, and user behavior.
              </p>
            </Block>
          </div>
        </section>

        {/* The ETF Model */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <div className="flex items-center gap-3 mb-2">
                <Layers className="w-6 h-6 text-[#3b82f6]" />
                <h2 className="text-3xl font-semibold">The Startups ETF Model</h2>
              </div>
              <p className="text-[#a0aec0]">Why the portfolio approach compounds faster than single bets</p>
            </Block>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <h3 className="text-xl font-semibold mb-4">Portfolio Diversification</h3>
                <ul className="space-y-3 text-[#a0aec0] text-sm">
                  <li className="flex gap-2"><span className="text-[#3b82f6] mt-0.5">&#x2022;</span><span>Each product is an independent experiment — if one fails, the portfolio absorbs it</span></li>
                  <li className="flex gap-2"><span className="text-[#3b82f6] mt-0.5">&#x2022;</span><span>Cross-pollination: user bases, distribution rails, and infrastructure are shared across products</span></li>
                  <li className="flex gap-2"><span className="text-[#3b82f6] mt-0.5">&#x2022;</span><span>Co-builds with partners add deal flow without proportional cost</span></li>
                </ul>
              </Block>

              <Block variant="dark" delay={0.2}>
                <h3 className="text-xl font-semibold mb-4">Compounding Advantages</h3>
                <ul className="space-y-3 text-[#a0aec0] text-sm">
                  <li className="flex gap-2"><span className="text-[#3b82f6] mt-0.5">&#x2022;</span><span>AI makes each subsequent product cheaper and faster to build</span></li>
                  <li className="flex gap-2"><span className="text-[#3b82f6] mt-0.5">&#x2022;</span><span>Learnings from each launch improve hit rate over time</span></li>
                  <li className="flex gap-2"><span className="text-[#3b82f6] mt-0.5">&#x2022;</span><span>One breakout product can 10x the entire portfolio value</span></li>
                </ul>
              </Block>
            </div>
          </div>
        </section>

        {/* Business Model */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Business Model</h2>
              <p className="text-[#a0aec0]">We don't sell hours — we either build in-house, or co-build with a partner for shared upside</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                { title: "Retainer", desc: "High-trust preferred partners with ongoing collaboration and guaranteed allocation. Predictable cash flow funds studio operations and new experiments." },
                { title: "Co-build + Upside", desc: "Heavy upside via token allocation or revenue share. We build, they distribute. Aligned incentives ensure both sides push for real traction." },
                { title: "Pure Upside", desc: "High-conviction internal bets with full ownership, full risk, full reward. These are the products that can 10x the entire portfolio." },
              ].map((model, i) => (
                <Block 
                  key={i} 
                  variant="dark" 
                  className={`${i < 2 ? "border-r border-[#2d2d2d]" : ""}`} 
                  delay={0.15 + i * 0.1}
                >
                  <div className="text-xl font-semibold mb-2">{model.title}</div>
                  <div className="text-sm text-[#a0aec0]">{model.desc}</div>
                </Block>
              ))}
            </div>
          </div>
        </section>

        {/* Why $10M */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-[#3b82f6]" />
                <h2 className="text-3xl font-semibold">Why $10M</h2>
              </div>
              <p className="text-[#a0aec0]">This is a forward-looking valuation for a studio with demonstrated velocity. Here's the logic.</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <div className="text-sm text-[#3b82f6] uppercase tracking-widest mb-3">Portfolio Traction</div>
                <p className="text-[#a0aec0] text-sm mb-3">
                  200K+ users, 22K+ paying, 67K+ onchain transactions, and $160K+ onchain volume — achieved organically through product-led growth without paid acquisition.
                </p>
                <p className="text-[#a0aec0] text-sm">
                  Even at conservative early-stage multiples, the combination of user growth velocity, paying conversion, and onchain activity puts portfolio trajectory well above the $10M mark.
                </p>
              </Block>

              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.2}>
                <div className="text-sm text-[#3b82f6] uppercase tracking-widest mb-3">Comparable Models</div>
                <p className="text-[#a0aec0] text-sm mb-3">
                  Venture studios (Idealab, eFounders, Atomic) are typically valued at 2-5x their portfolio. Crypto studios with token mechanics carry additional upside via token appreciation and LP fees.
                </p>
                <p className="text-[#a0aec0] text-sm">
                  $10M prices Zeno at the lower end of studio comps, with the speed advantage of AI-native building.
                </p>
              </Block>

              <Block variant="dark" delay={0.25}>
                <div className="text-sm text-[#3b82f6] uppercase tracking-widest mb-3">Throughput Premium</div>
                <p className="text-[#a0aec0] text-sm mb-3">
                  Traditional studios ship 2-4 products per year. Zeno has shipped 8+ live products in weeks. AI-native building is a structural advantage that compounds — each product is cheaper and faster than the last.
                </p>
                <p className="text-[#a0aec0] text-sm">
                  You're not buying one product. You're buying a machine that produces them.
                </p>
              </Block>
            </div>
          </div>
        </section>

        {/* Onchain Ownership */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Onchain Ownership</h2>
              <p className="text-[#a0aec0]">Zeno is designed as a native onchain business via DAO LLC (MIDAO)</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <h3 className="text-xl font-semibold mb-4">$ZENO Token Allocation</h3>
                <div className="space-y-3">
                  {[
                    { label: "Pilot / Co-Pilot", pct: "70%", note: "Core team and operators" },
                    { label: "Agents (incl. humans)", pct: "10%", note: "Contributors and builders" },
                    { label: "Investors", pct: "10%", note: "Current and future rounds" },
                    { label: "FAFO", pct: "10%", note: "Experiments and incentives" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <span className="text-[#a0aec0]">{row.label}</span>
                        <span className="text-xs text-[#4a5568] ml-2">{row.note}</span>
                      </div>
                      <span className="text-[#3b82f6] font-semibold">{row.pct}</span>
                    </div>
                  ))}
                </div>
              </Block>
              
              <Block variant="dark" delay={0.2}>
                <h3 className="text-xl font-semibold mb-4">$ZENO Flywheel</h3>
                <div className="space-y-3">
                  {[
                    { step: "LPs pair $ZENO with app tokens ($APP)", detail: "Liquidity deepens with each new product launch" },
                    { step: "Fees in $ZENO are burned", detail: "Sustained activity reduces circulating supply" },
                    { step: "Fees in $APP accrue to treasury", detail: "Portfolio diversification happens automatically" },
                    { step: "Activity-driven, not narrative-driven", detail: "Real usage from real products creates real demand" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="text-[#a0aec0]">&#x2022; {item.step}</div>
                      <div className="text-xs text-[#4a5568] ml-4">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </Block>
            </div>
          </div>
        </section>

        {/* The Round */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="accent" className="border-b border-[#2563eb]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-4">The Round</h2>
              <p className="text-white/90">We're raising to increase throughput, improve reliability, and deepen partner pilots.</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <div className="text-sm text-[#3b82f6] uppercase tracking-widest mb-2">Instrument</div>
                <div className="text-xl font-semibold">SAFT / Token Purchase</div>
                <div className="text-sm text-[#a0aec0] mt-2">Final form pending DAO LLC formation</div>
              </Block>
              
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.2}>
                <div className="text-sm text-[#3b82f6] uppercase tracking-widest mb-2">Valuation</div>
                <div className="text-xl font-semibold">$10M post-money</div>
                <div className="text-sm text-[#a0aec0] mt-2">Raising $500K–$1M</div>
              </Block>
              
              <Block variant="dark" delay={0.25}>
                <div className="text-sm text-[#3b82f6] uppercase tracking-widest mb-2">Minimum Ticket</div>
                <div className="text-xl font-semibold">$25K</div>
                <div className="text-sm text-[#a0aec0] mt-2">No maximum cap</div>
              </Block>
            </div>
            
            <Block variant="dark" delay={0.3}>
              <h3 className="text-xl font-semibold mb-4">Use of Funds</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-[#3b82f6] font-semibold mb-2">Agents</div>
                  <p className="text-sm text-[#a0aec0]">Coding agents, ops agents, and human agents to increase shipping throughput</p>
                </div>
                <div>
                  <div className="text-[#3b82f6] font-semibold mb-2">Infrastructure</div>
                  <p className="text-sm text-[#a0aec0]">Improve reliability and security as projects scale</p>
                </div>
                <div>
                  <div className="text-[#3b82f6] font-semibold mb-2">Growth</div>
                  <p className="text-sm text-[#a0aec0]">Marketing experiments and partner pilot deepening</p>
                </div>
              </div>
            </Block>
          </div>
        </section>

        {/* Risks */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-[#f59e0b]" />
                <h2 className="text-3xl font-semibold">Risks & Transparency</h2>
              </div>
              <p className="text-[#a0aec0]">We believe in being direct about what could go wrong</p>
            </Block>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {[
                { risk: "Solo operator risk", mitigation: "AI agents handle the work of a 5-person team. Co-pilot and agent hiring underway. The DAO structure distributes governance over time." },
                { risk: "Early revenue", mitigation: "Revenue is nascent (~$1.1K cumulative) but growing. The model is designed for optionality: most value accrues through token appreciation and onchain activity, not SaaS margins." },
                { risk: "Regulatory uncertainty", mitigation: "DAO LLC (MIDAO) provides legal structure. SAFT instrument is standard for token-based raises. No US securities offerings." },
                { risk: "Market timing", mitigation: "Products are live and generating real usage regardless of market conditions. Crypto-native infrastructure reduces dependency on bull/bear cycles." },
              ].map((item, i) => (
                <Block
                  key={i}
                  variant="dark"
                  className={`${i % 2 === 0 ? "border-r border-[#2d2d2d]" : ""}`}
                  delay={0.15 + i * 0.05}
                >
                  <h3 className="text-lg font-semibold mb-2 text-[#f59e0b]">{item.risk}</h3>
                  <p className="text-sm text-[#a0aec0]">{item.mitigation}</p>
                </Block>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="text-center" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-4">Interested?</h2>
              <p className="text-[#a0aec0] mb-8 max-w-xl mx-auto">
                We're raising $500K–$1M from aligned investors who understand the opportunity at the intersection of AI, crypto, and distribution. $25K minimum.
              </p>
              <Button asChild className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-none h-12 px-8">
                <Link href="/#contact" data-testid="cta-contact">
                  Get in touch <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
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
            <div className="flex items-center gap-6">
              <Link href="/about" className="hover:text-white transition-colors" data-testid="footer-about">About</Link>
              <Link href="/memo" className="hover:text-white transition-colors" data-testid="footer-memo">Memo</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
    </PasswordGate>
  );
}
