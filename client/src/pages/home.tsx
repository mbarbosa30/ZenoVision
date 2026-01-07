import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Zap, Users, Rocket, Mail, ExternalLink } from "lucide-react";
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
  { name: "MiniPlay", highlight: "125K+ users", description: "Gaming platform", url: "https://miniplay.studio" },
  { name: "nanoPay", highlight: "10K+ txs", description: "Payments", url: "https://nanopay.live" },
  { name: "MaxFlow", highlight: "5K+ signals", description: "Analytics", url: "https://maxflow.one" },
];

const formSchema = z.object({
  role: z.enum(["Investor", "Partner", "Collaborator"]),
  name: z.string().min(2, "Required"),
  email: z.string().email("Invalid"),
  organization: z.string().optional(),
  exploring: z.string().min(10, "Tell us more"),
  consent: z.boolean().default(true),
});

const COLORS = {
  sky: "#5BC0EB",
  coral: "#F25F5C",
  sunflower: "#FFE066",
  lilac: "#C89BFC",
  mint: "#8CE2B8",
  navy: "#0B1F3A",
  dark: "#1C1C1C",
  light: "#F7F7F7",
};

interface BlockProps {
  color: keyof typeof COLORS;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

const Block = ({ color, children, className = "", delay = 0, hover = true }: BlockProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const bg = COLORS[color];
  const isDark = color === "navy" || color === "dark";
  
  return (
    <motion.div
      ref={ref}
      className={`rounded-2xl p-6 md:p-8 relative ${isDark ? "text-white" : "text-[#1C1C1C]"} ${hover ? "hover:-translate-y-2 hover:shadow-2xl" : ""} transition-all duration-300 ${className}`}
      style={{ 
        backgroundColor: bg,
        boxShadow: `0 8px 0 0 ${bg}88, 0 12px 40px -10px ${bg}66`,
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

const SmallBlock = ({ color, children, className = "" }: { color: keyof typeof COLORS; children: React.ReactNode; className?: string }) => {
  const bg = COLORS[color];
  const isDark = color === "navy" || color === "dark";
  
  return (
    <div 
      className={`rounded-xl p-3 md:p-4 ${isDark ? "text-white" : "text-[#1C1C1C]"} ${className}`}
      style={{ backgroundColor: bg }}
    >
      {children}
    </div>
  );
};

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
      toast({ title: "Message sent!", description: "We'll be in touch soon." });
      form.reset();
    } catch {
      toast({ title: "Error", description: "Please try again.", variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Outfit', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-[#5BC0EB]" />
              <div className="w-4 h-4 rounded bg-[#F25F5C]" />
              <div className="w-4 h-4 rounded bg-[#FFE066]" />
            </div>
            <span className="font-bold text-lg text-[#0B1F3A]">Zeno Vision</span>
          </div>
          <Button asChild className="bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 rounded-full">
            <a href="#contact" data-testid="nav-cta">Talk to us</a>
          </Button>
        </div>
      </header>

      <main className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Hero Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            {/* Main Hero Block */}
            <Block color="navy" className="md:col-span-8 md:row-span-2" delay={0}>
              <div className="flex flex-col h-full justify-between min-h-[300px] md:min-h-[400px]">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-sm mb-6">
                    <Zap className="w-4 h-4" />
                    <span>AI-Native Web3 Studio</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95]">
                    We build
                    <br />
                    <span className="text-[#5BC0EB]">products</span>
                    <br />
                    that move.
                  </h1>
                </div>
                <p className="text-white/60 text-lg max-w-md mt-6">
                  Fast iteration. Partner distribution. Real traction.
                </p>
              </div>
            </Block>

            {/* Stats Blocks */}
            <Block color="sky" className="md:col-span-4" delay={0.1}>
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8 opacity-60" />
                <div>
                  <div className="text-4xl md:text-5xl font-extrabold">125K+</div>
                  <div className="text-sm opacity-70">Total users</div>
                </div>
              </div>
            </Block>

            <Block color="coral" className="md:col-span-4" delay={0.2}>
              <div className="flex items-center gap-4">
                <Rocket className="w-8 h-8 opacity-60" />
                <div>
                  <div className="text-4xl md:text-5xl font-extrabold">8</div>
                  <div className="text-sm opacity-70">Products shipped</div>
                </div>
              </div>
            </Block>

            {/* CTA Block */}
            <Block color="sunflower" className="md:col-span-4" delay={0.15}>
              <div className="flex flex-col h-full justify-between">
                <div className="text-lg font-semibold mb-4">Ready to build together?</div>
                <Button asChild className="bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 rounded-full w-fit" data-testid="hero-cta">
                  <a href="#contact">
                    Let's talk <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>
            </Block>

            {/* Speed Block */}
            <Block color="lilac" className="md:col-span-4" delay={0.25}>
              <div className="flex items-center gap-4">
                <Zap className="w-8 h-8 opacity-60" />
                <div>
                  <div className="text-4xl md:text-5xl font-extrabold">&lt;4</div>
                  <div className="text-sm opacity-70">Weeks to ship</div>
                </div>
              </div>
            </Block>
          </div>

          {/* Manifesto Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Block color="mint" delay={0.3}>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Most studios wait.</h2>
              <p className="text-lg opacity-80">We ship. No decks. No vapor. Real products, real users, real data.</p>
            </Block>
            <Block color="sky" delay={0.35}>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">AI for speed.</h2>
              <p className="text-lg opacity-80">Partners for distribution. MiniPay. Celo. Talent Protocol. Existing users, day one.</p>
            </Block>
          </div>

          {/* Process Blocks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: "01", title: "Observe", color: "coral" as const },
              { num: "02", title: "Build", color: "sunflower" as const },
              { num: "03", title: "Measure", color: "lilac" as const },
              { num: "04", title: "Iterate", color: "mint" as const },
            ].map((step, i) => (
              <Block key={i} color={step.color} delay={0.4 + i * 0.1}>
                <div className="text-sm opacity-50 mb-2">{step.num}</div>
                <div className="text-xl md:text-2xl font-bold">{step.title}</div>
              </Block>
            ))}
          </div>

          {/* Portfolio Section */}
          <Block color="navy" delay={0.5} hover={false}>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Shipped products</h2>
              <p className="text-white/60">Live experiments with real traction.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((project, i) => (
                <a
                  key={i}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                  data-testid={`project-${i}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold group-hover:text-[#5BC0EB] transition-colors">{project.name}</h3>
                    <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-white/50 text-sm mb-4">{project.description}</p>
                  <SmallBlock color="sky" className="inline-block text-sm font-medium">
                    {project.highlight}
                  </SmallBlock>
                </a>
              ))}
            </div>
          </Block>

          {/* Partners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "MiniPay", desc: "Mobile distribution", color: "coral" as const },
              { name: "Celo", desc: "Protocol ecosystem", color: "sunflower" as const },
              { name: "Talent Protocol", desc: "Builder network", color: "lilac" as const },
            ].map((partner, i) => (
              <Block key={i} color={partner.color} delay={0.6 + i * 0.1}>
                <div className="text-xl font-bold mb-1">{partner.name}</div>
                <div className="text-sm opacity-70">{partner.desc}</div>
              </Block>
            ))}
          </div>

          {/* Contact Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6" id="contact">
            <Block color="mint" className="lg:col-span-2" delay={0.7}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's connect</h2>
              <p className="text-lg opacity-80 mb-6">
                Whether you're an investor, partner, or builder — we'd love to hear from you.
              </p>
              <div className="space-y-3">
                <a href="mailto:thwayf@gmail.com" className="flex items-center gap-2 hover:opacity-70 transition-opacity" data-testid="link-email">
                  <Mail className="w-4 h-4" />
                  <span>thwayf@gmail.com</span>
                </a>
                <a href="https://x.com/zenoVision_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-70 transition-opacity" data-testid="link-twitter">
                  <span>@zenoVision_</span>
                </a>
              </div>
            </Block>

            <Block color="light" className="lg:col-span-3" delay={0.8} hover={false}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0B1F3A]/60">I am a</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-[#0B1F3A]/10 rounded-xl h-12" data-testid="select-role">
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Investor">Investor</SelectItem>
                            <SelectItem value="Partner">Partner</SelectItem>
                            <SelectItem value="Collaborator">Builder</SelectItem>
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
                          <FormLabel className="text-[#0B1F3A]/60">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" className="bg-white border-[#0B1F3A]/10 rounded-xl h-12" data-testid="input-name" {...field} />
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
                          <FormLabel className="text-[#0B1F3A]/60">Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@company.com" className="bg-white border-[#0B1F3A]/10 rounded-xl h-12" data-testid="input-email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="exploring"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0B1F3A]/60">What brings you here?</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us what you're looking for..." className="bg-white border-[#0B1F3A]/10 rounded-xl min-h-[100px] resize-none" data-testid="input-message" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-consent" />
                        </FormControl>
                        <FormLabel className="text-[#0B1F3A]/50 text-sm font-normal">
                          I agree to receive communications
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" className="w-full bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 rounded-xl h-14 text-lg" data-testid="submit-btn">
                    Send message <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </Form>
            </Block>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 text-[#0B1F3A]/40 text-sm">
            <div className="flex justify-center gap-2 mb-4">
              <div className="w-3 h-3 rounded bg-[#5BC0EB]" />
              <div className="w-3 h-3 rounded bg-[#F25F5C]" />
              <div className="w-3 h-3 rounded bg-[#FFE066]" />
              <div className="w-3 h-3 rounded bg-[#C89BFC]" />
              <div className="w-3 h-3 rounded bg-[#8CE2B8]" />
            </div>
            © 2025 Zeno Vision
          </div>
        </div>
      </main>
    </div>
  );
}
