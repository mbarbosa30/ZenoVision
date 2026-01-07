import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Terminal, Zap, Users, Box, Mail } from "lucide-react";
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

interface Project {
  name: string;
  description: string;
  highlight: string;
  url: string;
}

const PROJECTS: Project[] = [
  { name: "MiniPlay", highlight: "125K+ users", description: "Cognition gaming", url: "https://miniplay.studio" },
  { name: "nanoPay", highlight: "10K+ txs/week", description: "Financial utility", url: "https://nanopay.live" },
  { name: "MaxFlow", highlight: "5K+ signals", description: "Signal engine", url: "https://maxflow.one" },
];

const formSchema = z.object({
  role: z.enum(["Investor", "Partner", "Collaborator"]),
  name: z.string().min(2, "Required"),
  email: z.string().email("Invalid"),
  organization: z.string().optional(),
  exploring: z.string().min(10, "Tell us more"),
  consent: z.boolean().default(true),
});

const GlitchText = ({ children, className = "" }: { children: string; className?: string }) => {
  const [glitch, setGlitch] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className={glitch ? "opacity-0" : ""}>{children}</span>
      {glitch && (
        <>
          <span className="absolute inset-0 text-[#0f0] translate-x-[2px] translate-y-[-2px] opacity-70">{children}</span>
          <span className="absolute inset-0 text-[#f0f] translate-x-[-2px] translate-y-[2px] opacity-70">{children}</span>
        </>
      )}
    </span>
  );
};

const TypeWriter = ({ text, delay = 50 }: { text: string; delay?: number }) => {
  const [displayed, setDisplayed] = useState("");
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);

  useEffect(() => {
    const blink = setInterval(() => setCursor(c => !c), 500);
    return () => clearInterval(blink);
  }, []);

  return (
    <span>
      {displayed}
      <span className={cursor ? "opacity-100" : "opacity-0"}>_</span>
    </span>
  );
};

const ScanLines = () => (
  <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]">
    <div className="w-full h-full" style={{
      background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)"
    }} />
  </div>
);

const Noise = () => (
  <div className="fixed inset-0 pointer-events-none z-40 opacity-[0.015]">
    <svg className="w-full h-full">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)"/>
    </svg>
  </div>
);

export default function Home() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { consent: true },
  });

  const { data } = useQuery<{ success: boolean; projects: Project[] }>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const projects = data?.projects?.slice(0, 3) || PROJECTS;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "// SIGNAL_RECEIVED", description: "We'll respond soon." });
      form.reset();
    } catch {
      toast({ title: "// ERROR", description: "Try again.", variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#0f0] font-mono selection:bg-[#0f0] selection:text-black">
      <ScanLines />
      <Noise />
      
      {/* Terminal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#0f0]/20 bg-[#0a0a0a]/90 backdrop-blur">
        <div className="flex items-center justify-between px-4 h-10">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#0f0]/40">zeno@vision:</span>
            <span className="text-[#0f0]">~</span>
            <span className="text-[#0f0]/60">$</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#0f0]/40">
            <span>SYS.OK</span>
            <span className="w-2 h-2 rounded-full bg-[#0f0] animate-pulse" />
          </div>
        </div>
      </header>

      {/* Bento Grid */}
      <main className="pt-10 p-2 md:p-4 min-h-screen">
        <div className="grid grid-cols-12 gap-2 md:gap-3 auto-rows-[minmax(120px,auto)]">
          
          {/* Hero - Large */}
          <motion.div 
            className="col-span-12 lg:col-span-8 row-span-3 bg-[#0f0]/5 border border-[#0f0]/20 p-6 md:p-10 flex flex-col justify-between relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 p-4 text-xs text-[#0f0]/30">
              v2.4.1
            </div>
            <div>
              <div className="text-xs text-[#0f0]/40 mb-4">// INIT_SEQUENCE</div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.9] mb-6">
                <GlitchText>WE BUILD</GlitchText>
                <br />
                <span className="text-[#0f0]/40">PRODUCTS THAT</span>
                <br />
                <GlitchText className="text-[#0f0]">MOVE_</GlitchText>
              </h1>
              <p className="text-sm md:text-base text-[#0f0]/50 max-w-md leading-relaxed">
                AI-native Web3 venture studio. Fast iteration. Partner distribution. Compounding traction.
              </p>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <Button asChild className="bg-[#0f0] text-black hover:bg-[#0f0]/80 rounded-none font-mono">
                <a href="#contact" data-testid="hero-cta">
                  ./contact --init <ArrowUpRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Status Box */}
          <motion.div 
            className="col-span-6 lg:col-span-4 row-span-1 bg-[#0f0]/5 border border-[#0f0]/20 p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-xs text-[#0f0]/40 mb-2">// STATUS</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0f0] animate-pulse" />
              <span className="text-2xl md:text-3xl font-bold">ACTIVE</span>
            </div>
            <div className="text-xs text-[#0f0]/40 mt-2">all_systems_nominal</div>
          </motion.div>

          {/* Products Count */}
          <motion.div 
            className="col-span-6 lg:col-span-4 row-span-1 bg-[#0f0]/5 border border-[#0f0]/20 p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-xs text-[#0f0]/40 mb-2">// PRODUCTS_SHIPPED</div>
            <div className="text-4xl md:text-5xl font-bold">08</div>
            <div className="text-xs text-[#0f0]/40 mt-2">live_experiments</div>
          </motion.div>

          {/* Users Count */}
          <motion.div 
            className="col-span-12 lg:col-span-4 row-span-1 bg-[#0f0]/5 border border-[#0f0]/20 p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-xs text-[#0f0]/40 mb-2">// TOTAL_USERS</div>
            <div className="text-4xl md:text-5xl font-bold">140K+</div>
            <div className="text-xs text-[#0f0]/40 mt-2">across_all_products</div>
          </motion.div>

          {/* Manifesto */}
          <motion.div 
            className="col-span-12 md:col-span-6 row-span-2 bg-[#0f0]/5 border border-[#0f0]/20 p-6 md:p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-xs text-[#0f0]/40 mb-4">// MANIFESTO.md</div>
            <div className="space-y-4 text-sm md:text-base">
              <p className="text-[#0f0]/70">
                <span className="text-[#0f0]">&gt;</span> Most studios wait. <span className="text-[#0f0]">We ship.</span>
              </p>
              <p className="text-[#0f0]/70">
                <span className="text-[#0f0]">&gt;</span> We don't pitch ideas. We build products.
              </p>
              <p className="text-[#0f0]/70">
                <span className="text-[#0f0]">&gt;</span> AI for speed. Partners for distribution.
              </p>
              <p className="text-[#0f0]/70">
                <span className="text-[#0f0]">&gt;</span> Compound what works. <span className="text-[#f0f]">Kill what doesn't.</span>
              </p>
            </div>
          </motion.div>

          {/* Process */}
          <motion.div 
            className="col-span-12 md:col-span-6 row-span-2 bg-[#0f0]/5 border border-[#0f0]/20 p-6 md:p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-xs text-[#0f0]/40 mb-4">// PROCESS.sh</div>
            <div className="space-y-3 text-sm font-mono">
              {["OBSERVE", "BUILD", "MEASURE", "ITERATE"].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="text-[#0f0]/30 w-6">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[#0f0]">{step}</span>
                  <span className="flex-1 border-b border-dashed border-[#0f0]/10" />
                  <span className="text-[#0f0]/30">OK</span>
                </div>
              ))}
              <div className="text-[#f0f] text-xs mt-4 animate-pulse">↺ LOOP_INFINITE</div>
            </div>
          </motion.div>

          {/* Projects */}
          {projects.map((project, i) => (
            <motion.a
              key={i}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-12 md:col-span-4 row-span-1 bg-[#0f0]/5 border border-[#0f0]/20 p-4 md:p-6 hover:bg-[#0f0]/10 hover:border-[#0f0]/40 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              data-testid={`project-${i}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-xs text-[#0f0]/40">EXP_{String(i + 1).padStart(3, '0')}</div>
                <ArrowUpRight className="w-4 h-4 text-[#0f0]/30 group-hover:text-[#0f0] transition-colors" />
              </div>
              <div className="text-lg md:text-xl font-bold mb-1 group-hover:text-[#0f0] transition-colors">{project.name}</div>
              <div className="text-xs text-[#0f0]/40 mb-2">{project.description}</div>
              <div className="inline-block text-xs bg-[#0f0]/10 text-[#0f0] px-2 py-1">{project.highlight}</div>
            </motion.a>
          ))}

          {/* Contact Form */}
          <motion.div 
            id="contact"
            className="col-span-12 lg:col-span-8 row-span-3 bg-[#0f0]/5 border border-[#0f0]/20 p-6 md:p-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="text-xs text-[#0f0]/40 mb-4">// CONTACT.init</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              <TypeWriter text="SEND_SIGNAL_" />
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#0f0]/40 text-xs">--type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-[#0f0]/20 rounded-none text-[#0f0] focus:ring-[#0f0]/30" data-testid="select-role">
                            <SelectValue placeholder="SELECT_ROLE" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#0a0a0a] border-[#0f0]/20 text-[#0f0]">
                          <SelectItem value="Investor">INVESTOR</SelectItem>
                          <SelectItem value="Partner">PARTNER</SelectItem>
                          <SelectItem value="Collaborator">BUILDER</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[#f00]" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0f0]/40 text-xs">--name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="your_name" 
                            className="bg-transparent border-[#0f0]/20 rounded-none text-[#0f0] placeholder:text-[#0f0]/20 focus-visible:ring-[#0f0]/30" 
                            data-testid="input-name"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-[#f00]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0f0]/40 text-xs">--email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="you@domain.com" 
                            className="bg-transparent border-[#0f0]/20 rounded-none text-[#0f0] placeholder:text-[#0f0]/20 focus-visible:ring-[#0f0]/30" 
                            data-testid="input-email"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-[#f00]" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="exploring"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#0f0]/40 text-xs">--message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="what_are_you_exploring?" 
                          className="bg-transparent border-[#0f0]/20 rounded-none text-[#0f0] placeholder:text-[#0f0]/20 focus-visible:ring-[#0f0]/30 min-h-[100px] resize-none" 
                          data-testid="input-message"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-[#f00]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                          className="border-[#0f0]/30 data-[state=checked]:bg-[#0f0] data-[state=checked]:text-black"
                          data-testid="checkbox-consent" 
                        />
                      </FormControl>
                      <FormLabel className="text-[#0f0]/30 text-xs font-normal">
                        --accept-communications
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="bg-[#0f0] text-black hover:bg-[#0f0]/80 rounded-none font-mono w-full md:w-auto px-8"
                  data-testid="submit-btn"
                >
                  ./send --execute <Zap className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </Form>
          </motion.div>

          {/* Partners */}
          <motion.div 
            className="col-span-12 lg:col-span-4 row-span-2 bg-[#0f0]/5 border border-[#0f0]/20 p-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="text-xs text-[#0f0]/40 mb-4">// PARTNER_RAILS</div>
            <div className="space-y-4">
              {["MiniPay", "Celo", "Talent Protocol"].map((partner, i) => (
                <div key={partner} className="flex items-center gap-3 text-sm">
                  <span className="w-2 h-2 bg-[#0f0]" />
                  <span className="text-[#0f0]/70">{partner}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-[#0f0]/10 text-xs text-[#0f0]/30">
              distribution_networks_active
            </div>
          </motion.div>

          {/* Footer Links */}
          <motion.div 
            className="col-span-12 lg:col-span-4 row-span-1 bg-[#0f0]/5 border border-[#0f0]/20 p-4 md:p-6 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <a href="mailto:thwayf@gmail.com" className="text-xs text-[#0f0]/40 hover:text-[#0f0] transition-colors flex items-center gap-2" data-testid="link-email">
              <Mail className="w-3 h-3" />
              thwayf@gmail.com
            </a>
            <a href="https://x.com/zenoVision_" target="_blank" rel="noopener noreferrer" className="text-xs text-[#0f0]/40 hover:text-[#0f0] transition-colors" data-testid="link-twitter">
              @zenoVision_
            </a>
          </motion.div>

        </div>

        {/* Terminal Footer */}
        <div className="mt-4 text-xs text-[#0f0]/20 text-center py-4">
          zeno_vision_v2.4.1 // © 2025 // measure_what_matters
        </div>
      </main>
    </div>
  );
}
