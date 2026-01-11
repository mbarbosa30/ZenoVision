import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowLeft, Zap, Users, Target, Repeat, Brain, Scale, Eye, Flame } from "lucide-react";
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

export default function About() {
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
            <Link href="/about" className="text-sm text-white hover:text-[#3b82f6] transition-colors" data-testid="nav-about">About</Link>
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
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight mb-8">
                About <span className="text-[#3b82f6]">Zeno</span>
              </h1>
              <p className="text-xl text-[#a0aec0] max-w-2xl">
                Measure what matters. Ship what moves. An AI-native app studio built for high-throughput experimentation and compounding traction.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Why the Name Zeno */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Why "Zeno"?</h2>
              <p className="text-[#a0aec0]">A name that carries paradox, physics, philosophy, and purpose</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <Block variant="dark" className="border-r border-b border-[#2d2d2d]" delay={0.15}>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#3b82f6]/10 text-[#3b82f6]">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Zeno's Paradoxes</h3>
                    <p className="text-[#a0aec0] leading-relaxed">
                      The ancient Greek philosopher Zeno of Elea proposed paradoxes about motion and infinity. His insight: infinite small steps can sum to finite progress. This mirrors our approach—rapid, small experiments that compound into significant outcomes.
                    </p>
                  </div>
                </div>
              </Block>
              
              <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.2}>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#3b82f6]/10 text-[#3b82f6]">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">The Quantum Zeno Effect</h3>
                    <p className="text-[#a0aec0] leading-relaxed">
                      In quantum physics, frequent observation of a system can freeze its evolution—the act of measurement affects the outcome. At Zeno, we measure what matters. Rigorous observation shapes our products' trajectories, keeping them on course or revealing when to pivot.
                    </p>
                  </div>
                </div>
              </Block>
              
              <Block variant="dark" className="border-r border-b border-[#2d2d2d]" delay={0.25}>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#3b82f6]/10 text-[#3b82f6]">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Stoic Discipline</h3>
                    <p className="text-[#a0aec0] leading-relaxed">
                      Zeno of Citium founded Stoicism—a philosophy of discipline, focus on what you can control, and elimination of waste. Our "scale-or-kill" gates embody this: we don't cling to failing experiments. We measure honestly, decide rationally, and move forward.
                    </p>
                  </div>
                </div>
              </Block>
              
              <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.3}>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#3b82f6]/10 text-[#3b82f6]">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Asymptotic Progress</h3>
                    <p className="text-[#a0aec0] leading-relaxed">
                      Like Zeno's arrow approaching its target through infinite increments, we pursue continuous improvement. Each experiment brings us closer. Each failure teaches. Each success compounds. The journey is asymptotic—always advancing, never truly finished.
                    </p>
                  </div>
                </div>
              </Block>
            </div>
            
            <Block variant="accent" delay={0.35}>
              <p className="text-lg leading-relaxed">
                The name "Zeno" encapsulates our philosophy: <strong>paradoxical patience in a fast-moving world</strong>, 
                <strong> measurement that shapes outcomes</strong>, <strong>disciplined execution without attachment</strong>, 
                and <strong>asymptotic pursuit of what works</strong>.
              </p>
            </Block>
          </div>
        </section>

        {/* The Zeno Vision */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">The Zeno <span className="font-light text-white/50">Vision</span></h2>
              <p className="text-[#a0aec0]">Where we sit, and why it matters</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <div className="text-[#3b82f6] mb-4">
                  <Brain className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI + Math + Psychology</h3>
                <p className="text-[#a0aec0]">
                  We combine AI-native execution with mathematical rigor and deep understanding of human behavior to build products that resonate.
                </p>
              </Block>
              
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.2}>
                <div className="text-[#3b82f6] mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Builder Economy</h3>
                <p className="text-[#a0aec0]">
                  The future belongs to builders. We operate in the builder economy, creating value through shipping, not speculation.
                </p>
              </Block>
              
              <Block variant="dark" delay={0.25}>
                <div className="text-[#3b82f6] mb-4">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Protocol Design</h3>
                <p className="text-[#a0aec0]">
                  We understand incentive design and coordination mechanisms. Crypto provides the rails for ownership, value exchange, and composability.
                </p>
              </Block>
            </div>
          </div>
        </section>

        {/* How We Operate */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">How We Operate</h2>
              <p className="text-[#a0aec0]">A "heavy redux" mindset—legacy costs are heavy, so we ruthlessly cut what doesn't work</p>
            </Block>
            
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { num: "01", title: "Ship Quickly", desc: "AI-native execution keeps burn per experiment low", icon: <Zap className="w-6 h-6" /> },
                { num: "02", title: "Measure Honestly", desc: "Track only high-signal metrics, not dashboard theatre", icon: <Target className="w-6 h-6" /> },
                { num: "03", title: "Decide", desc: "Scale what works, pivot what might, kill what doesn't", icon: <Scale className="w-6 h-6" /> },
                { num: "04", title: "Compound", desc: "Reusable tools, workflows, and playbooks accumulate", icon: <Repeat className="w-6 h-6" /> },
              ].map((step, i) => (
                <Block 
                  key={i} 
                  variant="dark" 
                  className={`${i < 3 ? "border-r border-[#2d2d2d]" : ""}`} 
                  delay={0.15 + i * 0.1}
                >
                  <div className="text-[#3b82f6] mb-4">{step.icon}</div>
                  <div className="text-sm text-[#3b82f6] mb-2">{step.num}</div>
                  <div className="text-xl font-semibold mb-2">{step.title}</div>
                  <div className="text-sm text-[#a0aec0]">{step.desc}</div>
                </Block>
              ))}
            </div>
          </div>
        </section>

        {/* Distribution Rails */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Distribution Rails</h2>
              <p className="text-[#a0aec0]">Traction through partners, not synthetic hype</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                { name: "Platform Partners", example: "Opera MiniPay", desc: "Mobile-first distribution at scale across emerging markets" },
                { name: "Protocol Ecosystems", example: "Celo", desc: "Infrastructure, liquidity, and composable building blocks" },
                { name: "Community Networks", example: "Funding the Commons", desc: "Access to builder talent and aligned communities" },
              ].map((partner, i) => (
                <Block 
                  key={i} 
                  variant="dark" 
                  className={`${i < 2 ? "border-r border-[#2d2d2d]" : ""}`} 
                  delay={0.15 + i * 0.1}
                >
                  <div className="text-sm text-[#3b82f6] uppercase tracking-widest mb-3">{partner.example}</div>
                  <div className="text-xl font-semibold mb-2">{partner.name}</div>
                  <div className="text-sm text-[#a0aec0]">{partner.desc}</div>
                </Block>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Team</h2>
              <p className="text-[#a0aec0]">Human agents behind the machine</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <div className="text-sm text-[#3b82f6] uppercase tracking-widest mb-3">Pilot</div>
                <div className="text-2xl font-semibold mb-2">Marco</div>
                <p className="text-[#a0aec0] mb-4">Leading vision, strategy, and execution</p>
                <div className="flex items-center gap-4 text-sm">
                  <a href="https://x.com/mbarrbosa" target="_blank" rel="noopener noreferrer" className="text-[#a0aec0] hover:text-white transition-colors" data-testid="link-marco-x">X</a>
                  <a href="https://talent.app/barbosa" target="_blank" rel="noopener noreferrer" className="text-[#a0aec0] hover:text-white transition-colors" data-testid="link-marco-talent">Talent</a>
                </div>
              </Block>
              
              <Block variant="dark" delay={0.2}>
                <div className="text-sm text-[#3b82f6] uppercase tracking-widest mb-3">Co-Pilot</div>
                <div className="text-2xl font-semibold mb-2">Pedro</div>
                <p className="text-[#a0aec0] mb-4">Operations, partnerships, and growth</p>
                <div className="flex items-center gap-4 text-sm">
                  <a href="https://x.com/pcbo" target="_blank" rel="noopener noreferrer" className="text-[#a0aec0] hover:text-white transition-colors" data-testid="link-pedro-x">X</a>
                  <a href="https://talent.app/pcbo" target="_blank" rel="noopener noreferrer" className="text-[#a0aec0] hover:text-white transition-colors" data-testid="link-pedro-talent">Talent</a>
                </div>
              </Block>
            </div>
            
            <Block variant="dark" delay={0.25}>
              <p className="text-[#a0aec0]">
                Plus human collaborators and advisors spanning AI research, psychology, builder economy, and protocol design.
              </p>
            </Block>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">
            <Block variant="accent" delay={0.1}>
              <h2 className="text-2xl font-semibold mb-4">Ready to learn more?</h2>
              <p className="text-white/80 mb-6">Read our full investment thesis and understand how we're building.</p>
              <Button asChild className="bg-white text-[#3b82f6] hover:bg-white/90 rounded-none h-12 px-8">
                <Link href="/memo" data-testid="cta-memo">
                  Read Investment Memo <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Block>
            <Block variant="dark" delay={0.15}>
              <h2 className="text-2xl font-semibold mb-4">Want to connect?</h2>
              <p className="text-[#a0aec0] mb-6">We're looking for investors, partners, and builders who share our vision.</p>
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
