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
import quantumBg from "@assets/generated_images/abstract_quantum_physics_background_pattern.png";

// --- Types & Data ---

const PORTFOLIO_ITEMS = [
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
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none mix-blend-screen dark:mix-blend-lighten z-0"
        style={{
          backgroundImage: `url(${quantumBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none z-0" />
      
      <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-6 font-mono text-xs border-primary/30 text-primary uppercase tracking-wider bg-primary/5">
            AI-Native Venture Studio
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold font-heading leading-tight mb-6 tracking-tight">
            <span className="text-muted-foreground">Measure what matters.</span> <br />
            <span className="text-[1.1em]">Ship what moves.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            We build internal ventures and co-build with partners.
            AI maximizes efficiency and reduces the cost of building, while our partners' ecosystems unlock distribution and traction.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base font-medium rounded-full" asChild>
              <a href="#interest">Talk to us <ArrowRight className="ml-2 w-4 h-4" /></a>
            </Button>
            <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-medium rounded-full" asChild>
              <a href="#proof">See the proof</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ProofStrip = () => {
  const metrics = [
    { label: "MiniPlay.studio", value: "81K+ users", sub: "in its 1st week", icon: Users, url: "https://miniplay.studio" },
    { label: "nanoPay.live", value: "~10K txs", sub: "onchain, after 2 weeks", icon: Activity, url: "https://nanopay.live" },
    { label: "MaxFlow.one", value: "3,500+", sub: "signals computed", icon: Terminal, url: "https://maxflow.one" },
  ];

  return (
    <section id="proof" className="py-12 border-y border-border/40 bg-card/30">
      <div className="container mx-auto px-6">
        <p className="text-center text-muted-foreground mb-8 font-mono text-sm">Initial products launched & its traction.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((m, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <m.icon className="w-5 h-5" />
              </div>
              <div>
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground font-mono mb-1 hover:text-primary transition-colors" data-testid={`link-metric-${m.label.toLowerCase().replace('.', '-')}`}>{m.label}</a>
                <div className="text-2xl font-bold font-heading">{m.value}</div>
                <div className="text-xs text-primary/80 font-medium">{m.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 text-sm font-mono text-muted-foreground opacity-70">
          // Shipped and growing, not just imagined.
        </div>
      </div>
    </section>
  );
};

const Introduction = () => (
  <section className="py-24">
    <div className="container mx-auto px-6 max-w-3xl">
      <h2 className="text-3xl font-bold mb-6 font-heading">What is Zeno <span className="font-normal opacity-60">Vision</span>?</h2>
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        We are a venture studio that ships internal products and co-builds with ecosystem partners.
        By leveraging partner rails, we run rapid traction experiments to validate ideas before scaling.
      </p>
      <ul className="space-y-4 font-medium text-foreground/90 mb-12">
        {[
          "Venture studio building internal ventures",
          "Co-builds with partners (Retainer + Upside)",
          "Rapid traction experiments via partner rails",
          "Scales or spins out what proves itself"
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>

      <div className="p-6 rounded-lg bg-secondary/30 border border-primary/20">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Why "Zeno <span className="font-normal opacity-60">Vision</span>"?
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed italic">
          "There’s a phenomenon called the Zeno effect: observe the wrong way and you can freeze progress. 
          So our rule is simple: measure what matters, then get out of the way and ship what moves. 
          We use measurement to accelerate momentum, not to create dashboards that feel productive."
        </p>
      </div>
    </div>
  </section>
);

const EngineLoop = () => (
  <section id="loop" className="py-24 bg-secondary/20">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary">The Method</Badge>
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Partner-Powered Experiment Loop</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We don't just build apps. We leverage distribution rails to test hypotheses in the wild.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {[
            { step: "Partners", sub: "Distribution Rails", icon: Network },
            { step: "Rapid Build", sub: "AI-Accelerated", icon: Code2 },
            { step: "Field Test", sub: "Real Markets", icon: Globe },
            { step: "Learn", sub: "Iterate / Pivot", icon: Terminal },
            { step: "Scale", sub: "Or Kill", icon: Activity },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-card border border-border rounded-xl">
              <div className="mb-4 p-3 rounded-full bg-secondary text-primary">
                <s.icon className="w-6 h-6" />
              </div>
              <div className="font-bold text-lg mb-1">{s.step}</div>
              <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{s.sub}</div>
              {i < 4 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-muted-foreground/30 z-0">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto text-center">
        {[
          "Faster learning cycles via real-world feedback",
          "Lower build costs using AI-native workflows",
          "Higher quality distribution via trusted local partners"
        ].map((item, i) => (
          <div key={i} className="p-4 rounded-lg bg-background/30 border border-border/30 backdrop-blur-sm">
            <p className="font-medium text-sm">{item}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

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

const WhatWeDo = () => (
  <section className="py-24 bg-secondary/10 border-y border-border/50">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold font-heading flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-mono text-primary">A</span>
            Internal Portfolio
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            We ship and operate our own products to explore primitives and prove interaction loops.
            We prioritize speed, iteration, and real usage over theoretical perfection.
          </p>
        </div>
        <div className="space-y-6">
          <h3 className="text-2xl font-bold font-heading flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-mono text-primary">B</span>
            Partner Co-Builds
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            We help teams ship and validate quickly through our established process and partner rails.
            We bring the execution muscle while partners provide the distribution context.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const WhyUs = () => (
  <section className="py-24">
    <div className="container mx-auto px-6 max-w-4xl">
      <h2 className="text-3xl font-bold font-heading mb-10 text-center">Why Zeno <span className="font-normal opacity-60">Vision</span>?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          "Demonstrated shipping velocity (multiple live products)",
          "Early traction across consumer usage + onchain activity",
          "Operator-first execution (design, engineering, growth)",
          "Access to trust-anchored experiments via partners",
          "Simple alignment structures (no complex deal theatre)",
          "Diversified exposure to a dynamic basket of experiments, assets and solutions"
        ].map((item, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-lg hover:bg-secondary/30 transition-colors">
            <div className="mt-1 text-primary">✓</div>
            <p className="text-foreground/90">{item}</p>
          </div>
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
      <p className="text-center mt-8 text-sm text-muted-foreground font-mono">
        We keep terms simple and optimize for long-term alignment.
      </p>
    </div>
  </section>
);

const PortfolioGrid = () => (
  <section id="portfolio" className="py-24">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold font-heading mb-12">Selected Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {PORTFOLIO_ITEMS.map((item, i) => (
          <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="group relative p-6 bg-secondary/10 border border-border rounded-lg overflow-hidden hover:bg-secondary/20 transition-all block cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg font-heading group-hover:text-primary transition-colors">{item.name}</h3>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
            <div className="text-xs font-mono text-primary/80 py-1 px-2 bg-primary/5 rounded inline-block">
              {item.highlight}
            </div>
          </a>
        ))}
        <div className="flex items-center justify-center p-6 border border-dashed border-border rounded-lg text-muted-foreground text-sm font-mono">
          + Our experiments
        </div>
      </div>
    </div>
  </section>
);

const Personas = () => {
  const personas = [
    { 
      role: "Investor", 
      subtitle: "Capital Allocator",
      benefits: [
        "Diversified compounding exposure", 
        "Access to deal flow before public markets", 
        "Capital efficiency via shared infrastructure"
      ],
      cta: "Request Deck",
      formValue: "Investor"
    },
    { 
      role: "Partner", 
      subtitle: "Founder / Protocol",
      benefits: [
        "Ship fast using our battle-tested rails", 
        "Plug into existing distribution & liquidity", 
        "Align upside with long-term incentives"
      ],
      cta: "Partner with us",
      formValue: "Partner"
    },
    { 
      role: "Collaborator", 
      subtitle: "Builder / Operator",
      benefits: [
        "Build, own, and scale specific product lines", 
        "Access to studio resources and network", 
        "Focus on product & traction, not admin/ops"
      ],
      cta: "Join the studio",
      formValue: "Collaborator"
    },
  ];

  return (
    <section className="py-24 bg-secondary/10">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold font-heading mb-12 text-center">Who It's For</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personas.map((p, i) => (
            <div key={i} className="bg-background border border-border p-8 rounded-xl flex flex-col h-full hover:border-primary/30 transition-colors group">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-primary mb-1">{p.role}</h3>
                <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider">{p.subtitle}</p>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {p.benefits.map((b, j) => (
                  <li key={j} className="text-sm text-foreground/90 flex gap-3">
                    <span className="text-primary/50 mt-0.5">•</span> 
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                <a href="#interest">{p.cta}</a>
              </Button>
            </div>
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
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Interested in Zeno <span className="font-normal opacity-60">Vision</span>?</h2>
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
            <p>“Zeno” is a name with layered meanings, and we chose it because each layer maps to how we build.</p>
            <p>First, Zeno of Elea is famous for paradoxes about motion and progress: when you slice movement into infinite steps, progress can start to look impossible. In startups, the modern version is analysis paralysis, endless planning, and measuring everything until momentum evaporates. Zeno is our reminder that you can’t think your way into traction. You have to move.</p>
            <p>Second, in quantum physics there’s the Quantum Zeno effect: observation can change a system, and measuring in the wrong way too frequently can inhibit change. Startups have a version of that too: dashboards, vanity metrics, and constant KPI thrash can “freeze” teams into optimization theater. So “Zeno” also reminds us to measure carefully, not compulsively.</p>
            <p>Third, many people associate “Zeno” with Stoic discipline (from Zeno of Citium, founder of Stoicism). That layer matters to us as a studio: calm execution, long-horizon thinking, and steady cadence under uncertainty. Not hype spikes. Not panic pivots.</p>
            <p>Finally, “Zeno” also evokes asymptotic progress: you rarely reach certainty in one jump, you approach it through iterations that compound. That’s venture building in practice, especially in an AI-native world where experimentation is cheap and speed is high.</p>
            <p>Vision is what makes all of those meanings actionable. Vision sets direction when the destination isn’t fully known, and it tells us which signals are worth steering by. Together, the name encodes our operating principle: disciplined measurement, steady shipping, and compounding progress.</p>
            <p className="font-semibold italic text-primary">That’s why we say: Measure what matters. Ship what moves.</p>
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
        <a href="mailto:hello@zenovision.xyz" className="hover:text-primary transition-colors">Contact Us</a>
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
      <Introduction />
      <EngineLoop />
      <EcosystemRails />
      <WhatWeDo />
      <WhyUs />
      <EngagementModels />
      <PortfolioGrid />
      <Personas />
      <InterestForm />
      <FAQ />
      <Footer />
    </div>
  );
}
