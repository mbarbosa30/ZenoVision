import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Block } from "@/components/block";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";

import type { PublicMetrics, Project } from "@/lib/types";

function CoBuildSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Co-Builder",
    exploring: "",
    organization: "",
    links: "",
    consent: "true",
  });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const inputClass = "w-full bg-[#0f0f0f] border border-[#2d2d2d] text-white px-4 py-3 text-sm placeholder-[#4a5568] focus:outline-none focus:border-[#3b82f6] transition-colors";

  return (
    <section id="contact" className="border-b border-[#2d2d2d]">
      <div className="max-w-7xl mx-auto">
        <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
          <h2 className="text-3xl font-semibold mb-2">Co-Build With Us</h2>
          <p className="text-[#a0aec0]">
            Have an idea or need help building? Tell us what you're working on and let's explore together.
          </p>
        </Block>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <Block variant="dark" className="lg:border-r border-[#2d2d2d]" delay={0.2}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">We got your message</h3>
                <p className="text-[#a0aec0]">We'll review your submission and get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                    data-testid="input-cobuild-name"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass}
                    data-testid="input-cobuild-email"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Organization or project name (optional)"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className={inputClass}
                  data-testid="input-cobuild-org"
                />
                <textarea
                  placeholder="What are you building or exploring? Tell us about your idea, the problem you're solving, and what kind of help you need."
                  required
                  rows={5}
                  value={formData.exploring}
                  onChange={(e) => setFormData({ ...formData, exploring: e.target.value })}
                  className={`${inputClass} resize-none`}
                  data-testid="input-cobuild-idea"
                />
                <input
                  type="text"
                  placeholder="Links to demos, repos, or references (optional)"
                  value={formData.links}
                  onChange={(e) => setFormData({ ...formData, links: e.target.value })}
                  className={inputClass}
                  data-testid="input-cobuild-links"
                />
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-none h-12 px-8 w-full md:w-auto"
                  data-testid="button-cobuild-submit"
                >
                  {mutation.isPending ? "Submitting..." : (
                    <>Submit <Send className="ml-2 w-4 h-4" /></>
                  )}
                </Button>
                {mutation.isError && (
                  <p className="text-red-400 text-sm" data-testid="text-cobuild-error">Something went wrong. Please try again.</p>
                )}
              </form>
            )}
          </Block>

          <Block variant="dark" delay={0.3}>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">What we look for</h3>
                <ul className="space-y-2 text-sm text-[#a0aec0]">
                  <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">-</span> Clear problem with identifiable users</li>
                  <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">-</span> Web3 or AI angle that adds real value</li>
                  <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">-</span> Can ship an MVP in 2-4 weeks</li>
                  <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">-</span> Distribution path through existing ecosystems</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How it works</h3>
                <ul className="space-y-2 text-sm text-[#a0aec0]">
                  <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">01</span> You submit your idea</li>
                  <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">02</span> We review and reach out within 48h</li>
                  <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">03</span> If it's a fit, we co-build and ship together</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-[#2d2d2d]">
                <p className="text-sm text-[#a0aec0] mb-2">Or reach out directly</p>
                <a href="https://x.com/zenoVision_" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#3b82f6] hover:text-[#60a5fa] transition-colors text-sm" data-testid="link-twitter">
                  @zenoVision_
                </a>
              </div>
            </div>
          </Block>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { data } = useQuery<{ success: boolean; projects: Project[] }>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: metricsData } = useQuery<{ success: boolean; metrics: PublicMetrics }>({
    queryKey: ["/api/public-metrics"],
    queryFn: async () => {
      const res = await fetch("/api/public-metrics");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    refetchInterval: 60000,
  });

  const projects = (data?.projects || []).filter(p => p.showOnLandingPage !== false);
  const publicMetrics = metricsData?.metrics;
  const trackedProjectIds = new Set(publicMetrics?.trackedProjectIds || []);

  useEffect(() => {
    document.title = "Zeno Vision — AI-Native Web3 Venture Studio";
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K+`;
    return num.toString();
  };

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
                    <div className="text-4xl font-semibold mb-1">
                      {publicMetrics?.totalUsers ? publicMetrics.totalUsers.toLocaleString() : "200,000+"}
                    </div>
                    <div className="text-sm text-[#a0aec0]">Active users</div>
                  </div>
                </Block>
                <Block variant="dark" className="border-b border-[#2d2d2d] flex items-center" delay={0.2}>
                  <div>
                    <div className="text-4xl font-semibold mb-1">
                      {publicMetrics?.trackedApps ? `${publicMetrics.trackedApps}+` : "3+"}
                    </div>
                    <div className="text-sm text-[#a0aec0]">Apps tracking</div>
                  </div>
                </Block>
                <Block variant="accent" className="flex items-center" delay={0.3}>
                  <div>
                    <div className="text-4xl font-semibold mb-1">
                      {publicMetrics?.totalTransactions ? publicMetrics.totalTransactions.toLocaleString() : "100,000+"}
                    </div>
                    <div className="text-sm text-white/80">Onchain transfers</div>
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
              <p className="text-[#a0aec0]">{projects.length > 0 ? `${projects.length} products shipped with real traction` : "Loading portfolio..."}</p>
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
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold group-hover:text-[#3b82f6] transition-colors">{project.name}</h3>
                      {project.id && trackedProjectIds.has(project.id) && (
                        <span className="text-[10px] uppercase tracking-wide bg-emerald-500/20 text-emerald-400 px-2 py-0.5 border border-emerald-500/30" data-testid={`badge-tracked-${project.id}`}>
                          Live
                        </span>
                      )}
                    </div>
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

        {/* Co-Build Form */}
        <CoBuildSection />

        {/* Footer */}
        <footer className="border-t border-[#2d2d2d] py-8">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-[#4a5568]">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-[#3b82f6]" />
              <span>&copy; {new Date().getFullYear()} Zeno Vision</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/about" className="hover:text-white transition-colors" data-testid="footer-about">About</Link>
              <Link href="/memo" className="hover:text-white transition-colors" data-testid="footer-memo">Memo</Link>
              <a href="https://x.com/zenoVision_" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" data-testid="footer-twitter">@zenoVision_</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
