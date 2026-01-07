import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
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
  id: string;
  name: string;
  description: string;
  highlight: string;
  url: string;
  sortOrder: number;
}

const FALLBACK_PROJECTS = [
  { name: "MiniPlay.studio", description: "Cognition gaming", highlight: "125K+ users", url: "https://miniplay.studio" },
  { name: "nanoPay.live", description: "Financial utility", highlight: "10K+ weekly txs", url: "https://nanopay.live" },
  { name: "MaxFlow.one", description: "Signal engine", highlight: "5K+ signals", url: "https://maxflow.one" },
];

const formSchema = z.object({
  role: z.enum(["Investor", "Partner", "Collaborator"]),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  organization: z.string().optional(),
  exploring: z.string().min(10, "Please tell us a bit more"),
  consent: z.boolean().default(true),
});

const StickyNav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFEF5]/90 backdrop-blur-sm border-b border-black/5">
    <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
      <span className="text-sm font-medium tracking-tight text-black">Zeno Vision</span>
      <Button asChild size="sm" className="bg-black text-white hover:bg-black/80 rounded-full px-6">
        <a href="#contact" data-testid="nav-cta">Talk to us</a>
      </Button>
    </div>
  </nav>
);

const FloatingCTA = () => (
  <motion.div 
    className="fixed bottom-8 right-8 z-50"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 2 }}
  >
    <Button asChild size="lg" className="bg-black text-white hover:bg-black/80 rounded-full shadow-2xl px-8">
      <a href="#contact" data-testid="floating-cta">
        Let's talk <ArrowRight className="ml-2 w-4 h-4" />
      </a>
    </Button>
  </motion.div>
);

const HeroManifesto = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="min-h-[100svh] flex items-center justify-center relative bg-[#FFFEF5] pt-14">
      <motion.div 
        className="max-w-6xl mx-auto px-6 py-20"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <p className="text-lg md:text-xl text-black/50 max-w-xl">
            AI-native Web3 venture studio
          </p>
          
          <h1 className="text-[clamp(3rem,12vw,10rem)] font-serif font-normal leading-[0.85] tracking-[-0.03em] text-black">
            We build
            <br />
            <em className="italic">products</em>
            <br />
            that move.
          </h1>

          <div className="pt-8 flex flex-col sm:flex-row gap-6 items-start">
            <Button asChild size="lg" className="bg-black text-white hover:bg-black/80 rounded-full px-10 py-6 text-lg">
              <a href="#contact" data-testid="hero-cta">Get in touch</a>
            </Button>
            <button 
              onClick={() => document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 text-black/50 hover:text-black transition-colors group"
              data-testid="scroll-down"
            >
              <span>Read more</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-black/10" />
    </section>
  );
};

const ManifestoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section id="manifesto" className="bg-black text-white py-32 md:py-48" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="space-y-16"
        >
          <h2 className="text-[clamp(2rem,6vw,4.5rem)] font-serif font-normal leading-[1.1] tracking-[-0.02em]">
            Most studios wait.
            <br />
            <span className="text-white/40">We ship.</span>
          </h2>

          <div className="space-y-8 text-xl md:text-2xl text-white/70 leading-relaxed max-w-2xl">
            <p>
              We don't pitch ideas. We build products. Fast iteration with AI. Real distribution through partner ecosystems.
            </p>
            <p>
              MiniPay. Celo. Talent Protocol. We plug into networks that already have users. Then we measure what matters.
            </p>
            <p className="text-white">
              <em>Compound what works. Kill what doesn't.</em>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const NumbersStrip = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const numbers = [
    { value: "125K+", label: "Users" },
    { value: "8", label: "Products shipped" },
    { value: "< 4", label: "Weeks to ship" },
  ];

  return (
    <section className="bg-[#FFFEF5] py-24 border-y border-black/10" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
          {numbers.map((n, i) => (
            <motion.div
              key={i}
              className="text-center md:border-r md:last:border-r-0 border-black/10"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className="text-6xl md:text-7xl lg:text-8xl font-serif font-normal text-black tracking-tight">
                {n.value}
              </div>
              <div className="text-black/40 text-lg mt-2">{n.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WorkSection = () => {
  const { data } = useQuery<{ success: boolean; projects: Project[] }>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const projects = data?.projects?.slice(0, 3) || FALLBACK_PROJECTS;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="bg-[#FFFEF5] py-32" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-normal text-black tracking-tight mb-6">
            Selected work
          </h2>
          <p className="text-xl text-black/50 max-w-xl">
            Products in market. Real users. Real traction.
          </p>
        </motion.div>

        <div className="space-y-1">
          {projects.map((project, i) => (
            <motion.a
              key={i}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block py-8 border-b border-black/10 hover:bg-black/[0.02] transition-colors -mx-6 px-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              data-testid={`project-${i}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-serif text-black group-hover:underline decoration-1 underline-offset-4">
                    {project.name}
                  </h3>
                  <p className="text-black/40 mt-1">{project.description}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-lg text-black/60">{project.highlight}</span>
                  <ArrowRight className="w-5 h-5 text-black/30 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

const ApproachSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="bg-[#1a1a1a] text-white py-32 md:py-48" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="space-y-20"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-normal tracking-tight">
            How we work
          </h2>

          <div className="space-y-16">
            {[
              { num: "01", title: "Observe", text: "We find gaps in partner ecosystems. Underserved users. Infrastructure opportunities." },
              { num: "02", title: "Build", text: "AI-accelerated development. Concept to deployed product in 2-4 weeks. No vapor." },
              { num: "03", title: "Measure", text: "Real users, real behavior. We track what matters for the next decision." },
              { num: "04", title: "Iterate", text: "Double down on traction. Kill what doesn't move. No attachment." },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="grid grid-cols-12 gap-4 md:gap-8"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              >
                <div className="col-span-2 md:col-span-1">
                  <span className="text-white/30 font-mono text-sm">{step.num}</span>
                </div>
                <div className="col-span-10 md:col-span-11">
                  <h3 className="text-2xl md:text-3xl font-serif mb-3">{step.title}</h3>
                  <p className="text-white/50 text-lg leading-relaxed">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { consent: true },
  });

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit");
      toast({ title: "Message sent", description: "We'll be in touch soon." });
      form.reset();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  return (
    <section id="contact" className="bg-[#FFFEF5] py-32" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-normal text-black tracking-tight mb-6">
            Let's talk
          </h2>
          <p className="text-xl text-black/50 max-w-xl mb-16">
            Whether you're an investor, distribution partner, or builder — we'd love to hear from you.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-xl">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black/60 text-base">I am a</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-black/20 bg-transparent rounded-none border-0 border-b text-lg h-14 focus:ring-0" data-testid="select-role">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Investor">Investor</SelectItem>
                        <SelectItem value="Partner">Distribution Partner</SelectItem>
                        <SelectItem value="Collaborator">Builder / Collaborator</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black/60 text-base">Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your name" 
                          className="border-black/20 bg-transparent rounded-none border-0 border-b text-lg h-14 focus-visible:ring-0 placeholder:text-black/30" 
                          data-testid="input-name"
                          {...field} 
                        />
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
                      <FormLabel className="text-black/60 text-base">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="you@company.com" 
                          className="border-black/20 bg-transparent rounded-none border-0 border-b text-lg h-14 focus-visible:ring-0 placeholder:text-black/30" 
                          data-testid="input-email"
                          {...field} 
                        />
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
                    <FormLabel className="text-black/60 text-base">Organization</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Company or fund" 
                        className="border-black/20 bg-transparent rounded-none border-0 border-b text-lg h-14 focus-visible:ring-0 placeholder:text-black/30" 
                        data-testid="input-org"
                        {...field} 
                      />
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
                    <FormLabel className="text-black/60 text-base">What brings you here?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us what you're looking for..." 
                        className="border-black/20 bg-transparent rounded-none border-0 border-b text-lg min-h-[120px] resize-none focus-visible:ring-0 placeholder:text-black/30" 
                        data-testid="input-message"
                        {...field} 
                      />
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
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                        className="border-black/30"
                        data-testid="checkbox-consent" 
                      />
                    </FormControl>
                    <FormLabel className="text-black/40 text-sm font-normal">
                      I agree to receive communications from Zeno Vision
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                size="lg" 
                className="bg-black text-white hover:bg-black/80 rounded-full px-12 py-6 text-lg mt-4"
                data-testid="submit-btn"
              >
                Send message <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-[#FFFEF5] border-t border-black/10 py-12">
    <div className="max-w-6xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="text-black/40">© 2025 Zeno Vision</span>
        <div className="flex items-center gap-8 text-black/40">
          <a href="mailto:thwayf@gmail.com" className="hover:text-black transition-colors" data-testid="link-email">thwayf@gmail.com</a>
          <a href="https://x.com/zenoVision_" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" data-testid="link-twitter">@zenoVision_</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFEF5] text-black antialiased selection:bg-black selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        .font-serif { font-family: 'Instrument Serif', serif; }
      `}</style>
      
      <StickyNav />
      <FloatingCTA />
      
      <main>
        <HeroManifesto />
        <ManifestoSection />
        <NumbersStrip />
        <WorkSection />
        <ApproachSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
}
