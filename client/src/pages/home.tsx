import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Terminal, Code2, Users, ExternalLink, Network, Boxes, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import quantumBg from "@assets/generated_images/abstract_quantum_physics_background_pattern.png";

// --- Types & Data ---

interface Project {
  id: string;
  name: string;
  description: string;
  highlight: string;
  url: string;
  sortOrder: number;
}

const FALLBACK_PROJECTS = [
  { name: "MiniPlay.studio", description: "Cognition gaming platform", highlight: "500K plays / 1 week", url: "https://miniplay.studio" },
  { name: "nanoPay.live", description: "Digital financial utility", highlight: "3K+ wallets / 2 weeks", url: "https://nanopay.live" },
  { name: "MaxFlow.one", description: "Signal computation engine", highlight: "91% avg retention", url: "https://maxflow.one" },
  { name: "Tempos.bet", description: "Conviction markets", highlight: "Experiment", url: "https://tempos.bet" },
  { name: "inspecTor.markets", description: "Tor network analysis", highlight: "Live", url: "https://inspector.markets" },
  { name: "x4pp.xyz", description: "Attention-driven inbox", highlight: "Prototype", url: "https://x4pp.xyz" },
  { name: "ProsperON.market", description: "Tokenomics utility OS", highlight: "Beta", url: "https://prosperon.market" },
  { name: "TimeCapsule.news", description: "Time-bound content", highlight: "Live", url: "https://timecapsule.news" },
];

const PARTNER_TYPES = [
  { title: "Platform Partners", example: "MiniPay", icon: <Globe className="w-5 h-5" />, desc: "Unlock massive mobile reach" },
  { title: "Protocol Ecosystems", example: "Celo", icon: <Network className="w-5 h-5" />, desc: "Provide liquidity & tooling" },
  { title: "Community Networks", example: "Talent Protocol", icon: <Users className="w-5 h-5" />, desc: "Access builder talent" },
  { title: "Local Organizations", example: "Emerging Markets", icon: <Boxes className="w-5 h-5" />, desc: "Real-world testing grounds" },
];

const formSchema = z.object({
  role: z.enum(["Investor", "Partner", "Collaborator"]),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  organization: z.string().optional(),
  exploring: z.string().min(10, "Please tell us a bit more"),
  links: z.string().optional(),
  consent: z.boolean().default(true),
});

// --- Components ---

import { ModeToggle } from "@/components/ui/mode-toggle";

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
    <div className="container mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary animate-pulse" />
        <span className="font-heading font-bold text-xl tracking-tight">Zeno <span className="font-normal opacity-60">Vision</span></span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#proof" className="hover:text-foreground transition-colors">Proof</a>
          <a href="#loop" className="hover:text-foreground transition-colors">Loop</a>
          <a href="#rails" className="hover:text-foreground transition-colors">Rails</a>
          <a href="#portfolio" className="hover:text-foreground transition-colors">Portfolio</a>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex border-primary/20 hover:border-primary/50 text-foreground">
            <a href="#interest">Talk to us</a>
          </Button>
        </div>
      </div>
    </div>
  </nav>
);

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Layered background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.08] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url(${quantumBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          maskImage: 'radial-gradient(ellipse 80% 60% at 70% 40%, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 70% 40%, black 20%, transparent 70%)',
        }} 
      />
      {/* Accent glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[80vh]">
          {/* Left: Main content */}
          <div className="lg:col-span-7 xl:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-xs text-primary uppercase tracking-wider">AI-Native Web3 Venture Studio</span>
              </div>
              
              <h1 className="font-heading font-bold tracking-tight mb-8">
                <span className="block text-3xl md:text-4xl lg:text-5xl text-muted-foreground/70 mb-2">
                  Measure what matters.
                </span>
                <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                  Ship what moves.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed">
                We build AI-native products with onchain rails, distributed through partner ecosystems. Ship fast, scale what works.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Button size="lg" className="h-14 px-8 text-base font-semibold group" asChild>
                  <a href="#interest">
                    Talk to us 
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button size="lg" variant="ghost" className="h-14 px-8 text-base font-medium text-muted-foreground hover:text-foreground" asChild>
                  <a href="#loop">Explore the Method</a>
                </Button>
              </div>
            </motion.div>
          </div>
          
          {/* Right: Visual element */}
          <div className="lg:col-span-5 xl:col-span-6 hidden lg:flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Abstract visual representation */}
              <div className="relative w-80 h-80 xl:w-96 xl:h-96">
                {/* Orbiting rings */}
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-primary/30 animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-8 rounded-full border border-primary/40" />
                
                {/* Center pulse */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-primary/20 animate-ping absolute inset-0" />
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center relative">
                      <Activity className="w-10 h-10 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                
                {/* Data points */}
                {[0, 72, 144, 216, 288].map((deg, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-primary"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${deg}deg) translateX(140px) translateY(-50%)`,
                    }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-muted-foreground/50" />
        </div>
      </motion.div>
    </section>
  );
};

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!isVisible) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const ProofStrip = () => {
  const metrics = [
    { label: "MiniPlay.studio", value: 125, suffix: "K+ users", sub: "since Dec 2024", icon: Users, url: "https://miniplay.studio" },
    { label: "nanoPay.live", value: 10, suffix: "K+ txs", sub: "every week", icon: Activity, url: "https://nanopay.live" },
    { label: "MaxFlow.one", value: 5000, suffix: "+", sub: "signals computed", icon: Terminal, url: "https://maxflow.one" },
  ];

  return (
    <section id="proof" className="py-16 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-6 relative">
        <motion.p 
          className="text-center text-muted-foreground mb-10 font-mono text-sm uppercase tracking-widest"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Shipped Products & Live Traction
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-4xl mx-auto">
          {metrics.map((m, i) => (
            <motion.div 
              key={i} 
              className="relative p-8 text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              {/* Divider */}
              {i < metrics.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
              )}
              
              <a 
                href={m.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block hover:scale-105 transition-transform duration-300"
                data-testid={`link-metric-${m.label.toLowerCase().replace('.', '-')}`}
              >
                <div className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-2 tabular-nums">
                  <AnimatedCounter value={m.value} suffix={m.suffix} />
                </div>
                <div className="text-sm font-mono text-primary mb-1">{m.label}</div>
                <div className="text-xs text-muted-foreground">{m.sub}</div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyZenoNow = () => (
  <section id="thesis" className="py-32 relative overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background pointer-events-none" />
    
    <div className="container mx-auto px-6 relative">
      {/* Header */}
      <motion.div 
        className="max-w-3xl mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="inline-block font-mono text-xs text-primary uppercase tracking-widest mb-4">The Opportunity</span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight">
          Why Zeno, <span className="text-primary">Now</span>
        </h2>
        <p className="text-xl text-muted-foreground leading-relaxed">
          AI collapses build costs. Crypto infrastructure is ready. Partner ecosystems offer distribution. 
          We're built to harness all three.
        </p>
      </motion.div>

      {/* Focus Areas - Staggered layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
        {[
          {
            focus: "Consumer Onchain",
            timing: "Wallets embedded, users ready",
            description: "Gaming, social, commerce—bringing everyday users onchain through familiar experiences.",
            icon: Globe,
            accent: "from-emerald-500/20 to-transparent"
          },
          {
            focus: "AI-Native Fintech",
            timing: "Build costs collapsed 10x",
            description: "Financial tools with AI + onchain rails for unprecedented speed and global access.",
            icon: Terminal,
            accent: "from-cyan-500/20 to-transparent"
          },
          {
            focus: "Incentive Primitives",
            timing: "Programmable economics mature",
            description: "Retention, growth, and value sharing mechanisms that compound network effects.",
            icon: Activity,
            accent: "from-violet-500/20 to-transparent"
          }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            className={`relative p-8 rounded-2xl bg-card/50 backdrop-blur border border-border/50 group hover:border-primary/30 transition-all duration-500 ${i === 2 ? 'lg:col-span-2 lg:max-w-2xl' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            {/* Gradient accent */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">{item.focus}</h3>
                  <p className="text-xs font-mono text-primary uppercase tracking-wider">{item.timing}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed pl-16">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pillars */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { pillar: "Partner Rails", desc: "Day-one distribution via MiniPay, Celo, Talent Protocol", num: "01" },
            { pillar: "AI Velocity", desc: "Ship in weeks what used to take months", num: "02" },
            { pillar: "Scale or Kill", desc: "No zombie projects—we move on what works", num: "03" }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              className="relative bg-background p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-mono text-primary/50 bg-background px-2">{item.num}</span>
              <div className="text-xl font-bold mb-3">{item.pillar}</div>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

const EngineLoop = () => {
  const steps = [
    { step: "Partners", sub: "Distribution Rails", icon: Network, color: "from-emerald-500" },
    { step: "Rapid Build", sub: "AI-Accelerated", icon: Code2, color: "from-cyan-500" },
    { step: "Field Test", sub: "Real Markets", icon: Globe, color: "from-blue-500" },
    { step: "Learn", sub: "Iterate / Pivot", icon: Terminal, color: "from-violet-500" },
    { step: "Scale", sub: "Or Kill", icon: Activity, color: "from-primary" },
  ];

  return (
    <section id="loop" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-secondary/10 to-background pointer-events-none" />
      
      <div className="container mx-auto px-6 relative">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block font-mono text-xs text-primary uppercase tracking-widest mb-4">The Method</span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            Partner-Powered <span className="text-primary">Experiment Loop</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We don't just build apps. We leverage distribution rails to test hypotheses in the wild.
          </p>
        </motion.div>

        {/* Loop visualization */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            {steps.map((s, i) => (
              <motion.div 
                key={i} 
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex flex-col items-center text-center p-6 bg-card border border-border/50 rounded-2xl hover:border-primary/30 transition-all duration-300 group">
                  {/* Step number */}
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground bg-card px-2 border border-border/50 rounded-full">
                    0{i + 1}
                  </span>
                  
                  {/* Icon with gradient */}
                  <div className={`relative mb-5 p-4 rounded-2xl bg-gradient-to-br ${s.color} to-transparent`}>
                    <div className="absolute inset-0 rounded-2xl bg-card/80" />
                    <s.icon className="w-7 h-7 text-primary relative z-10" />
                  </div>
                  
                  <div className="font-bold text-lg mb-1">{s.step}</div>
                  <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{s.sub}</div>
                </div>
                
                {/* Arrow connector */}
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 w-6 h-6 items-center justify-center z-20 -translate-y-1/2">
                    <ArrowRight className="w-4 h-4 text-primary/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Loop back arrow */}
          <motion.div 
            className="hidden md:block absolute -bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <div className="w-8 h-px bg-border" />
              <span>repeat</span>
              <div className="w-8 h-px bg-border" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const EcosystemRails = () => (
  <section id="rails" className="py-24">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Ecosystem Rails</h2>
          <p className="text-muted-foreground max-w-xl">
            Partners are not just logos. They are the infrastructure that unlocks reach, trust, and testing environments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PARTNER_TYPES.map((p, i) => (
          <Card key={i} className="bg-card border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="mb-3 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
                {p.icon}
              </div>
              <CardTitle className="text-lg">{p.title}</CardTitle>
              <CardDescription className="font-mono text-xs mt-1 text-primary/80">
                e.g. {p.example}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const EngagementModels = () => (
  <section className="py-24 bg-card">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold font-heading mb-12 text-center">How We Work</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          { title: "Retainer + Upside", subtitle: "Equity/tokens case-by-case" },
          { title: "Milestone + Success", subtitle: "Fee / Revenue Share" },
          { title: "Pure Upside", subtitle: "Selective (High-fit only)" },
        ].map((model, i) => (
          <div key={i} className="p-8 border border-border/60 rounded-xl bg-background/50 text-center flex flex-col justify-center h-48 hover:border-primary/50 transition-colors cursor-default">
            <h3 className="text-xl font-bold mb-2">{model.title}</h3>
            <p className="text-sm text-muted-foreground">{model.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PortfolioGrid = () => {
  const { data } = useQuery<{ success: boolean; projects: Project[] }>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const projects = data?.projects || FALLBACK_PROJECTS;
  const featured = projects.slice(0, 3);
  const others = projects.slice(3);

  return (
    <section id="portfolio" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <span className="inline-block font-mono text-xs text-primary uppercase tracking-widest mb-4">Portfolio</span>
            <h2 className="text-4xl md:text-5xl font-bold font-heading">Selected Works</h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Products we've built and shipped. Real traction, real users, real learnings.
          </p>
        </motion.div>
        
        {/* Featured projects - larger cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {featured.map((item, i) => (
            <motion.a 
              key={i} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative p-8 bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 block"
              data-testid={`card-portfolio-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-xs font-mono text-primary/60 uppercase tracking-wider">0{i + 1}</div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="font-bold text-2xl font-heading mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                <p className="text-muted-foreground mb-6">{item.description}</p>
                
                <div className="inline-flex items-center gap-2 text-sm font-mono text-primary py-2 px-4 bg-primary/10 rounded-full">
                  <Activity className="w-3 h-3" />
                  {item.highlight}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
        
        {/* Other projects - compact list */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {others.map((item, i) => (
            <a 
              key={i} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group p-4 bg-secondary/20 border border-border/30 rounded-xl hover:border-primary/30 hover:bg-secondary/30 transition-all duration-300"
              data-testid={`card-portfolio-${i + 3}`}
            >
              <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors truncate">{item.name}</h4>
              <p className="text-xs text-muted-foreground truncate">{item.highlight}</p>
            </a>
          ))}
          <div className="flex items-center justify-center p-4 border border-dashed border-border/50 rounded-xl text-muted-foreground text-xs font-mono">
            + more coming
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Personas = () => {
  const personas = [
    { 
      role: "Investor", 
      subtitle: "Capital Allocator",
      benefits: [
        "Diversified compounded exposure", 
        "Early access before public markets"
      ],
      cta: "Request Deck",
      formValue: "Investor",
      icon: "📊"
    },
    { 
      role: "Partner", 
      subtitle: "Founder / Protocol",
      benefits: [
        "Ship fast on battle-tested rails", 
        "Plug into existing distribution"
      ],
      cta: "Partner with us",
      formValue: "Partner",
      icon: "🤝"
    },
    { 
      role: "Collaborator", 
      subtitle: "Builder / Operator",
      benefits: [
        "Build and scale product lines with us", 
        "Focus on traction, not admin"
      ],
      cta: "Join the studio",
      formValue: "Collaborator",
      icon: "🛠️"
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-secondary/10 to-background pointer-events-none" />
      
      <div className="container mx-auto px-6 relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block font-mono text-xs text-primary uppercase tracking-widest mb-4">Work With Us</span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading">Who It's For</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {personas.map((p, i) => (
            <motion.div 
              key={i} 
              className="relative bg-card border border-border/50 p-8 rounded-2xl flex flex-col h-full hover:border-primary/30 transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{p.role}</h3>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-6">{p.subtitle}</p>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {p.benefits.map((b, j) => (
                  <li key={j} className="text-sm text-foreground/90 flex gap-3">
                    <span className="text-primary/50 mt-0.5">•</span> 
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 relative">
                <a href="#interest">{p.cta}</a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const InterestForm = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      consent: true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      toast({
        title: "Request Sent",
        description: "Thanks for reaching out. We'll be in touch soon.",
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <section id="interest" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Interested in Zeno?</h2>
          <p className="text-muted-foreground">
            We’re sharing this to get feedback and find high-fit partners, investors, and collaborators.
          </p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I'm interested as</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Investor">Investor</SelectItem>
                          <SelectItem value="Partner">Partner</SelectItem>
                          <SelectItem value="Collaborator">Collaborator</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Alice Builder" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="alice@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Company / DAO / Lab" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exploring"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What are you exploring?</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your context or what you'd like to build/test..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="links"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Links (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Website, Twitter, Deck, Github..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I'm okay receiving a follow-up message.
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full text-base py-6">Request Intro</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

const FAQ = () => (
  <section className="py-24 bg-secondary/5">
    <div className="container mx-auto px-6 max-w-3xl">
      <h2 className="text-2xl font-bold font-heading mb-8 text-center">Common Questions</h2>
      <div className="space-y-6">
        {[
          { q: "Do you take equity or tokens?", a: "We are flexible. We optimize for long-term alignment, whether that's equity, tokens, or revenue share models depending on the venture." },
          { q: "What stage do you work with?", a: "We primarily work at the earliest stages—from 0 to 1. We help validate primitives and get to first traction." },
          { q: "Do you invest directly?", a: "No, we are a venture studio, not a VC fund. We invest our time, engineering, and design resources." },
          { q: "How do you decide what to build?", a: "We look for intersections between new technical primitives and distribution opportunities within our partner networks." },
          { q: "How do partners fit into distribution rails?", a: "Partners provide the environment (users, liquidity, community) where we can deploy and test applications rapidly." },
          { q: "Which ecosystems do you work with?", a: "We are ecosystem-agnostic but partner-driven. We go where there is a clear path to users and validated need." },
        ].map((item, i) => (
          <div key={i} className="space-y-2">
            <h4 className="font-bold text-foreground/90">{item.q}</h4>
            <p className="text-sm text-muted-foreground">{item.a}</p>
          </div>
        ))}
        <div className="space-y-2">
          <h4 className="font-bold text-foreground/90">Why the name “Zeno <span className="font-normal opacity-60">Vision</span>”?</h4>
          <div className="text-sm text-muted-foreground space-y-4">
            <p>Two philosophical references shape the name. Zeno's paradoxes remind us that analysis paralysis can freeze progress—you can't think your way into traction, you have to move. The Quantum Zeno effect warns that measuring the wrong way too frequently can inhibit change—so we measure carefully, not compulsively.</p>
            <p>The name also evokes Stoic discipline (from Zeno of Citium): calm execution, long-horizon thinking, and steady cadence under uncertainty. Not hype spikes. Not panic pivots.</p>
            <p>Finally, "Zeno" suggests asymptotic progress—you rarely reach certainty in one jump, you approach it through iterations that compound. That's venture building in practice, especially when AI makes experimentation cheap and speed high.</p>
            <p>Vision sets direction when the destination isn't fully known. Together, the name encodes our operating principle: disciplined measurement, steady shipping, and compounding progress.</p>
            <p className="font-semibold italic text-primary">That's why we say: Measure what matters. Ship what moves.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 border-t border-border/40 text-center">
    <div className="container mx-auto px-6">
      <div className="flex items-center justify-center gap-2 mb-6 opacity-50">
        <Activity className="w-5 h-5" />
        <span className="font-heading font-bold">Zeno <span className="font-normal opacity-60">Vision</span></span>
      </div>
      <p className="font-heading text-lg mb-8 max-w-xl mx-auto text-foreground/80">
        “Experiment with consistency, even when the destination is unknown.”
      </p>
      <div className="text-sm text-muted-foreground space-y-2 font-mono">
        <div className="flex items-center justify-center gap-4">
          <a href="mailto:thwayf@gmail.com" className="hover:text-primary transition-colors">Contact Us</a>
          <span className="opacity-30">|</span>
          <a href="https://x.com/zenoVision_" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@zenoVision_</a>
        </div>
        <p className="text-xs opacity-50 mt-4">For feedback purposes. Not investment advice.</p>
      </div>
    </div>
  </footer>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <Hero />
      <ProofStrip />
      <WhyZenoNow />
      <EngineLoop />
      <EcosystemRails />
      <EngagementModels />
      <PortfolioGrid />
      <Personas />
      <InterestForm />
      <FAQ />
      <Footer />
    </div>
  );
}
