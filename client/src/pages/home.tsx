import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface Project {
  name: string;
  description: string;
  highlight: string;
  url: string;
}

const PROJECTS: Project[] = [
  { name: "MiniPlay.studio", highlight: "200K+ users", description: "Cognition gaming platform", url: "https://miniplay.studio" },
  { name: "nanoPay.live", highlight: "20K+ txs", description: "Digital financial utility", url: "https://nanopay.live" },
  { name: "MaxFlow.one", highlight: "5K+ signals", description: "Signal computation engine", url: "https://maxflow.one" },
  { name: "Tempos.bet", highlight: "Experiment", description: "Conviction markets", url: "https://tempos.bet" },
  { name: "inspecTor.markets", highlight: "Live", description: "Tor network analysis", url: "https://inspector.markets" },
  { name: "x4pp.xyz", highlight: "Prototype", description: "Attention-driven inbox", url: "https://x4pp.xyz" },
  { name: "ProsperON.market", highlight: "Beta", description: "Tokenomics utility OS", url: "https://prosperon.market" },
  { name: "TimeCapsule.news", highlight: "Live", description: "Time-bound content", url: "https://timecapsule.news" },
];


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

export default function Home() {
  const { data } = useQuery<{ success: boolean; projects: Project[] }>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const projects = data?.projects || PROJECTS;

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
              <a href="#contact" data-testid="nav-cta">Contact</a>
            </Button>
          </nav>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-8 p-8 md:p-16 lg:p-24 border-r border-[#2d2d2d]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-sm text-[#a0aec0] uppercase tracking-widest mb-8">
                    AI-Native App Studio
                  </div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight mb-8">
                    We build products
                    <br />
                    <span className="text-[#3b82f6]">that move.</span>
                  </h1>
                  <p className="text-lg text-[#a0aec0] max-w-xl mb-10">
                    Fast iteration with AI. Distribution through partner ecosystems. Compounding traction across a portfolio of live products.
                  </p>
                  <div className="flex items-center gap-6">
                    <Button asChild className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-none h-12 px-8" data-testid="hero-cta">
                      <a href="#contact">
                        Get in touch <ArrowRight className="ml-2 w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </motion.div>
              </div>
              <div className="lg:col-span-4 grid grid-rows-3">
                <Block variant="dark" className="border-b border-[#2d2d2d] flex items-center" delay={0.1}>
                  <div>
                    <div className="text-4xl font-semibold mb-1">200K+</div>
                    <div className="text-sm text-[#a0aec0]">Total users</div>
                  </div>
                </Block>
                <Block variant="dark" className="border-b border-[#2d2d2d] flex items-center" delay={0.2}>
                  <div>
                    <div className="text-4xl font-semibold mb-1">10+</div>
                    <div className="text-sm text-[#a0aec0]">Products shipped</div>
                  </div>
                </Block>
                <Block variant="accent" className="flex items-center" delay={0.3}>
                  <div>
                    <div className="text-4xl font-semibold mb-1">100K+</div>
                    <div className="text-sm text-white/80">Onchain transactions</div>
                  </div>
                </Block>
              </div>
            </div>
          </div>
        </section>

        {/* Thesis */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">
            <Block variant="dark" className="border-r border-[#2d2d2d] min-h-[200px]" delay={0.1}>
              <h2 className="text-2xl font-semibold mb-4">Most studios wait. We ship.</h2>
              <p className="text-[#a0aec0]">
                No pitch decks. No vapor. Real products generating real data. We validate through deployment, not speculation.
              </p>
            </Block>
            <Block variant="dark" className="min-h-[200px]" delay={0.2}>
              <h2 className="text-2xl font-semibold mb-4">AI for speed. Partners for reach.</h2>
              <p className="text-[#a0aec0]">
                MiniPay. Celo. Talent Protocol. We build on rails that already have users. Distribution from day one.
              </p>
            </Block>
          </div>
        </section>

        {/* Process */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
            {[
              { num: "01", title: "Observe", desc: "Find gaps in partner ecosystems" },
              { num: "02", title: "Build", desc: "Ship in 2-4 weeks with AI" },
              { num: "03", title: "Measure", desc: "Real users, real metrics" },
              { num: "04", title: "Iterate", desc: "Compound or kill" },
            ].map((step, i) => (
              <Block 
                key={i} 
                variant="dark" 
                className={`${i < 3 ? "border-r border-[#2d2d2d]" : ""} min-h-[180px]`} 
                delay={0.1 + i * 0.1}
              >
                <div className="text-sm text-[#3b82f6] mb-3">{step.num}</div>
                <div className="text-xl font-semibold mb-2">{step.title}</div>
                <div className="text-sm text-[#a0aec0]">{step.desc}</div>
              </Block>
            ))}
          </div>
        </section>

        {/* Portfolio */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Portfolio</h2>
              <p className="text-[#a0aec0]">10+ products shipped with real traction</p>
            </Block>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {projects.map((project, i) => (
                <a
                  key={i}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-6 md:p-8 border-b border-[#2d2d2d] ${(i % 4 !== 3) ? "lg:border-r" : ""} ${(i % 2 === 0) ? "md:border-r" : ""} hover:bg-[#1a1a1a] transition-colors`}
                  data-testid={`project-${i}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold group-hover:text-[#3b82f6] transition-colors">{project.name}</h3>
                    <ExternalLink className="w-4 h-4 text-[#4a5568] group-hover:text-[#3b82f6] transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-sm text-[#a0aec0] mb-3">{project.description}</p>
                  <div className="inline-block text-xs bg-[#3b82f6]/10 text-[#3b82f6] px-3 py-1">
                    {project.highlight}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Distribution Partners</h2>
              <p className="text-[#a0aec0]">We build on rails that already have users.</p>
            </Block>
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                { name: "MiniPay", desc: "Mobile distribution at scale" },
                { name: "Celo", desc: "Protocol-level infrastructure" },
                { name: "Talent Protocol", desc: "Builder network access" },
              ].map((partner, i) => (
              <Block 
                key={i} 
                variant="dark" 
                className={`${i < 2 ? "border-r border-[#2d2d2d]" : ""}`} 
                delay={0.1 + i * 0.1}
              >
                <div className="text-xl font-semibold mb-2">{partner.name}</div>
                <div className="text-sm text-[#a0aec0]">{partner.desc}</div>
              </Block>
            ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact">
          <div className="max-w-7xl mx-auto">
            <Block variant="accent" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-6">Let's connect</h2>
              <p className="text-white/80 mb-8">
                Investors, distribution partners, and builders welcome.
              </p>
              <a href="https://x.com/zenoVision_" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-white hover:text-white/80 transition-colors text-lg" data-testid="link-twitter">
                @zenoVision_
              </a>
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
