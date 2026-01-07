import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowDown, Activity, Zap, Target, Rocket, ExternalLink, Eye, Radio, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { ModeToggle } from "@/components/ui/mode-toggle";

interface Project {
  id: string;
  name: string;
  description: string;
  highlight: string;
  url: string;
  sortOrder: number;
}

const FALLBACK_PROJECTS = [
  { name: "MiniPlay.studio", description: "Cognition gaming platform", highlight: "125K+ users", url: "https://miniplay.studio" },
  { name: "nanoPay.live", description: "Digital financial utility", highlight: "10K+ weekly txs", url: "https://nanopay.live" },
  { name: "MaxFlow.one", description: "Signal computation engine", highlight: "5K+ signals", url: "https://maxflow.one" },
  { name: "Tempos.bet", description: "Conviction markets", highlight: "Experiment", url: "https://tempos.bet" },
  { name: "inspecTor.markets", description: "Tor network analysis", highlight: "Live", url: "https://inspector.markets" },
  { name: "x4pp.xyz", description: "Attention-driven inbox", highlight: "Prototype", url: "https://x4pp.xyz" },
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

const GridBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
  </div>
);

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 mix-blend-difference">
    <div className="container mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="font-mono text-sm text-white uppercase tracking-[0.2em]">Zeno Vision</span>
      </div>
      <div className="flex items-center gap-6">
        <a href="#signal" className="font-mono text-xs text-white/60 hover:text-white transition-colors uppercase tracking-wider" data-testid="link-nav-signal">Enter</a>
      </div>
    </div>
  </nav>
);

const Chapter = ({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`min-h-screen relative snap-start snap-always ${className}`}>
    {children}
  </section>
);

const QuantumHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <Chapter id="hero" className="flex items-center justify-center bg-background">
      <motion.div 
        ref={containerRef}
        className="relative w-full h-full flex items-center"
        style={{ opacity, scale, y }}
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <motion.div 
            className="w-[800px] h-[800px] rounded-full border border-primary/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute w-[600px] h-[600px] rounded-full border border-primary/5"
            animate={{ rotate: -360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute w-[400px] h-[400px] rounded-full border border-primary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute w-4 h-4 rounded-full bg-primary shadow-[0_0_60px_20px_rgba(16,185,129,0.3)]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground uppercase tracking-[0.3em]">
                <span className="w-12 h-px bg-primary/50" />
                <span>AI-Native Web3 Venture Studio</span>
              </div>

              <div className="space-y-2">
                <motion.h1 
                  className="text-[clamp(2.5rem,8vw,7rem)] font-heading font-bold leading-[0.9] tracking-tight"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  <span className="block text-muted-foreground/40">Measure</span>
                  <span className="block text-muted-foreground/60">what matters.</span>
                </motion.h1>
                <motion.h1 
                  className="text-[clamp(2.5rem,8vw,7rem)] font-heading font-bold leading-[0.9] tracking-tight"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.1 }}
                >
                  <span className="block bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">Ship what moves.</span>
                </motion.h1>
              </div>

              <motion.p 
                className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.4 }}
              >
                We build AI products on partner rails. Fast iteration. Real distribution. Compounding traction.
              </motion.p>

              <motion.div 
                className="flex items-center gap-6 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.7 }}
              >
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 group">
                  <a href="#signal" data-testid="button-hero-cta">
                    <span>Send Signal</span>
                    <Zap className="ml-2 w-4 h-4 group-hover:animate-pulse" />
                  </a>
                </Button>
                <a href="#evidence" className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2" data-testid="link-hero-scroll">
                  See proof
                  <ArrowDown className="w-4 h-4" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-6 items-end"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <div className="text-right">
            <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-sm text-primary">ACTIVE</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-1">Products</div>
            <div className="font-heading text-2xl font-bold">8</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Users</div>
            <div className="font-heading text-2xl font-bold">140K+</div>
          </div>
        </motion.div>

        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </motion.div>
    </Chapter>
  );
};

const EvidenceArray = () => {
  const metrics = [
    { value: "125K+", label: "MiniPlay", sub: "Users acquired", icon: <Activity className="w-5 h-5" /> },
    { value: "10K+", label: "nanoPay", sub: "Weekly transactions", icon: <Zap className="w-5 h-5" /> },
    { value: "5K+", label: "MaxFlow", sub: "Signals processed", icon: <Radio className="w-5 h-5" /> },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Chapter id="evidence" className="flex items-center justify-center bg-background">
      <div className="container mx-auto px-6" ref={ref}>
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 font-mono text-xs text-primary uppercase tracking-[0.3em] mb-6">
              <Eye className="w-4 h-4" />
              <span>Evidence Array</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-6">
              Observed traction.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Products in market generating measurable signal. No vapor. No promises. Real users, real transactions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                className="group relative p-10 bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-500"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                data-testid={`metric-${m.label.toLowerCase()}`}
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg">
                    {m.icon}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground uppercase">0{i + 1}</div>
                </div>
                
                <div className="font-heading text-5xl md:text-6xl font-bold mb-2 tabular-nums">{m.value}</div>
                <div className="font-mono text-sm text-primary uppercase tracking-wider mb-1">{m.label}</div>
                <div className="text-sm text-muted-foreground">{m.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Chapter>
  );
};

const ExperimentSpine = () => {
  const steps = [
    { phase: "OBSERVE", title: "Spot the gap", desc: "We monitor ecosystems for underserved user needs and infrastructure opportunities." },
    { phase: "HYPOTHESIZE", title: "Design the wedge", desc: "Minimal product, maximum learning surface. Built to test one core assumption." },
    { phase: "BUILD", title: "Ship in weeks", desc: "AI-accelerated development. From concept to deployed product in 2-4 weeks." },
    { phase: "MEASURE", title: "Collect signal", desc: "Real users, real behavior. Metrics that matter for the next decision." },
    { phase: "ITERATE", title: "Compound or kill", desc: "Double down on traction. Sunset what doesn't move. No attachment." },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Chapter id="loop" className="flex items-center justify-center bg-background py-32">
      <div className="container mx-auto px-6" ref={ref}>
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 font-mono text-xs text-primary uppercase tracking-[0.3em] mb-6">
              <Target className="w-4 h-4" />
              <span>Experiment Spine</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-6">
              The engine loop.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Systematic experimentation. Fast failure. Compounding success.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden md:block" />
            
            <div className="space-y-1">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="group relative flex gap-8 p-6 hover:bg-card/50 transition-all duration-300"
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="hidden md:flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-background border-2 border-primary/30 group-hover:border-primary flex items-center justify-center font-mono text-sm text-primary transition-colors">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-mono text-xs text-primary/60 uppercase tracking-[0.2em] mb-2">{step.phase}</div>
                    <h3 className="text-xl md:text-2xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="flex items-center gap-4 mt-8 pl-6 md:pl-20"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
            >
              <Waves className="w-5 h-5 text-primary animate-pulse" />
              <span className="font-mono text-sm text-muted-foreground">↺ Repeat</span>
            </motion.div>
          </div>
        </div>
      </div>
    </Chapter>
  );
};

const ExperimentArchive = () => {
  const { data } = useQuery<{ success: boolean; projects: Project[] }>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const projects = data?.projects || FALLBACK_PROJECTS;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Chapter id="portfolio" className="flex items-center justify-center bg-background py-32">
      <div className="container mx-auto px-6" ref={ref}>
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 font-mono text-xs text-primary uppercase tracking-[0.3em] mb-6">
              <Rocket className="w-4 h-4" />
              <span>Experiment Archive</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-6">
              Shipped products.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Live experiments generating real-world data. Each product is a probe into an opportunity space.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {projects.map((project, i) => (
              <motion.a
                key={i}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-8 bg-card/30 border border-border/30 hover:border-primary/50 hover:bg-card/60 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                data-testid={`card-project-${i}`}
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start justify-between mb-6">
                  <div className="font-mono text-xs text-muted-foreground/60 uppercase">EXP-{String(i + 1).padStart(3, '0')}</div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{project.description}</p>
                
                <div className="inline-flex items-center gap-2 font-mono text-xs text-primary py-1.5 px-3 bg-primary/10 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {project.highlight}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </Chapter>
  );
};

const SignalCapture = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { consent: true },
  });

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit");
      toast({ title: "Signal received", description: "We'll be in touch." });
      form.reset();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  return (
    <Chapter id="signal" className="flex items-center justify-center bg-background py-32">
      <div className="container mx-auto px-6" ref={ref}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 font-mono text-xs text-primary uppercase tracking-[0.3em] mb-6">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Signal Capture</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6">
                Send a signal.
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We're looking for aligned investors, distribution partners, and exceptional builders. 
                If you see something here, reach out.
              </p>
              
              <div className="space-y-6 p-6 bg-card/30 border border-border/50 rounded-lg">
                <div>
                  <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">For Investors</div>
                  <p className="text-sm text-foreground/80">Early access to portfolio, thesis deep-dives, and co-investment opportunities.</p>
                </div>
                <div>
                  <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">For Partners</div>
                  <p className="text-sm text-foreground/80">Distribution integration, white-label products, and revenue share models.</p>
                </div>
                <div>
                  <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">For Builders</div>
                  <p className="text-sm text-foreground/80">Studio residency, product leadership roles, and equity participation.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl blur-xl" />
              
              <div className="relative p-8 bg-card border border-border/50 rounded-xl">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-xs uppercase tracking-wider">I am a</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background/50" data-testid="select-role">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Investor">Investor</SelectItem>
                              <SelectItem value="Partner">Partner</SelectItem>
                              <SelectItem value="Collaborator">Builder / Collaborator</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-xs uppercase tracking-wider">Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" className="bg-background/50" data-testid="input-name" {...field} />
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
                            <FormLabel className="font-mono text-xs uppercase tracking-wider">Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@company.com" className="bg-background/50" data-testid="input-email" {...field} />
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
                          <FormLabel className="font-mono text-xs uppercase tracking-wider">Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="Company or fund" className="bg-background/50" data-testid="input-org" {...field} />
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
                          <FormLabel className="font-mono text-xs uppercase tracking-wider">What are you exploring?</FormLabel>
                          <FormControl>
                            <Textarea placeholder="What caught your attention?" className="bg-background/50 min-h-[100px] resize-none" data-testid="input-exploring" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="consent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-consent" />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-xs text-muted-foreground">
                              I consent to receiving communications from Zeno Vision.
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg" data-testid="button-submit">
                      <Radio className="mr-2 w-4 h-4" />
                      Send Signal
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Chapter>
  );
};

const Footer = () => (
  <footer className="py-16 border-t border-border/30">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-sm uppercase tracking-[0.2em]">Zeno Vision</span>
        </div>
        
        <div className="flex items-center gap-8 font-mono text-xs text-muted-foreground">
          <a href="mailto:thwayf@gmail.com" className="hover:text-foreground transition-colors" data-testid="link-email">thwayf@gmail.com</a>
          <a href="https://x.com/zenoVision_" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" data-testid="link-twitter">@zenoVision_</a>
          <ModeToggle />
        </div>
      </div>
      
      <div className="mt-12 pt-8 border-t border-border/20 text-center">
        <p className="font-mono text-xs text-muted-foreground/60">
          "If you cannot measure it, you cannot improve it." — Kelvin
        </p>
      </div>
    </div>
  </footer>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <GridBackground />
      <Navbar />
      
      <main className="snap-y snap-mandatory">
        <QuantumHero />
        <EvidenceArray />
        <ExperimentSpine />
        <ExperimentArchive />
        <SignalCapture />
      </main>
      
      <Footer />
    </div>
  );
}
