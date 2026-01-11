import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowLeft, Zap, Users, TrendingUp, Shield, Coins, Target, BarChart3, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function Memo() {
  return (
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
                Zeno is an AI-native app studio. We run high-throughput product experiments, validate them through partner distribution rails, and compound upside across a portfolio of products and co-builds.
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
                Zeno is built for a moment where three things became true at once: AI collapses build costs, crypto is the economic layer, and distribution is king. We're a high-throughput experimentation machine with explicit scale-or-kill gates.
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
                  Global value exchange and coordination—including AI agent transactions—will happen onchain. Ownership, incentives, and composability.
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
                { value: "10+", label: "Products shipped" },
                { value: "130K+", label: "Users (MiniPlay)" },
                { value: "20K+", label: "Onchain txs" },
                { value: "5K+", label: "Signals computed" },
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
              <p className="text-[#a0aec0]">Selected examples with hard early signals</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                { name: "Miniplay.studio", stat: "~130K users, 2.5M+ games played", time: "3 weeks" },
                { name: "nanoPay.live", stat: "7,500+ users, 20K onchain transactions", time: "4 weeks" },
                { name: "MaxFlow.one", stat: "5,000+ signals computed", time: "Live" },
              ].map((project, i) => (
                <Block 
                  key={i} 
                  variant="dark" 
                  className={`${i < 2 ? "border-r border-[#2d2d2d]" : ""}`} 
                  delay={0.15 + i * 0.1}
                >
                  <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                  <p className="text-[#a0aec0] mb-2">{project.stat}</p>
                  <div className="text-sm text-[#3b82f6]">After {project.time}</div>
                </Block>
              ))}
            </div>
            
            <Block variant="dark" delay={0.3}>
              <p className="text-[#a0aec0]">
                Other shipped experiments: oracle360.net, tempos.bet, inspector.markets, x4pp.xyz, prosperon.market, timecapsule.social (and more).
              </p>
            </Block>
          </div>
        </section>

        {/* Business Model */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Business Model</h2>
              <p className="text-[#a0aec0]">We don't sell hours: we either build in-house, or co-build with a partner</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                { title: "Retainer", desc: "High-trust preferred partners with ongoing collaboration" },
                { title: "Co-build + Upside", desc: "Heavy upside via token or revenue share arrangements" },
                { title: "Pure Upside", desc: "High-conviction bets on internal products" },
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
                    { label: "Pilot / Co-Pilot", pct: "70%" },
                    { label: "Agents (incl. humans)", pct: "10%" },
                    { label: "Investors", pct: "10%" },
                    { label: "FAFO", pct: "10%" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[#a0aec0]">{row.label}</span>
                      <span className="text-[#3b82f6] font-semibold">{row.pct}</span>
                    </div>
                  ))}
                </div>
              </Block>
              
              <Block variant="dark" delay={0.2}>
                <h3 className="text-xl font-semibold mb-4">$ZENO Flywheel</h3>
                <ul className="space-y-3 text-[#a0aec0]">
                  <li>• LPs pair $ZENO with app tokens ($APP)</li>
                  <li>• Fees in $ZENO are burned (supply reduction)</li>
                  <li>• Fees in $APP accrue to treasury</li>
                  <li>• Activity-driven, not narrative-driven</li>
                </ul>
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
              </Block>
              
              <Block variant="dark" delay={0.25}>
                <div className="text-sm text-[#3b82f6] uppercase tracking-widest mb-2">Ticket Size</div>
                <div className="text-xl font-semibold">$50K – $150K</div>
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

        {/* CTA */}
        <section>
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="text-center" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-4">Interested?</h2>
              <p className="text-[#a0aec0] mb-8 max-w-xl mx-auto">
                We're looking for aligned investors who understand the opportunity at the intersection of AI, crypto, and distribution.
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
  );
}
