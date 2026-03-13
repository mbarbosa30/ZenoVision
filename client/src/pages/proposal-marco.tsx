import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Code, Users, Zap, Award, Globe, Briefcase, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Block } from "@/components/block";

export default function ProposalMarco() {
  useEffect(() => { document.title = "Hello, Replit — Marco Barbosa"; }, []);
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#2d2d2d] bg-[#0f0f0f]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" data-testid="link-logo">
            <div className="w-8 h-8 bg-[#3b82f6]" />
            <span className="font-semibold text-lg tracking-tight">Zeno</span>
          </Link>
          <div className="text-sm text-[#a0aec0]">Hello, Replit</div>
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
              <div className="text-sm text-[#a0aec0] uppercase tracking-widest mb-4">Introduction</div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight mb-6">
                Marco Barbosa
              </h1>
              <p className="text-2xl text-[#3b82f6] font-medium mb-8">
                Why I'd Love to Join Replit's Marketing Team
              </p>
              <p className="text-xl text-[#a0aec0] max-w-3xl">
                Top 0.1% Replit builder in 2025, with 280+ apps shipped. I live and breathe vibe coding — and I'd love to help show the world what Replit makes possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { value: "280+", label: "Apps built", sub: "on Replit", id: "apps" },
                { value: "Top 0.1%", label: "Replit builder", sub: "2025 ranking", id: "ranking" },
                { value: "15+", label: "Years experience", sub: "building & shipping", id: "experience" },
                { value: "100K+", label: "Users reached", sub: "across products", id: "users" },
              ].map((stat, i) => (
                <Block 
                  key={i} 
                  variant="dark" 
                  className={`${i < 3 ? "border-r border-[#2d2d2d]" : ""}`} 
                  delay={0.15 + i * 0.05}
                >
                  <div className="text-2xl md:text-3xl font-semibold text-[#3b82f6] mb-1" data-testid={`stat-value-${stat.id}`}>{stat.value}</div>
                  <div className="text-sm font-medium mb-1" data-testid={`stat-label-${stat.id}`}>{stat.label}</div>
                  <div className="text-xs text-[#a0aec0]">{stat.sub}</div>
                </Block>
              ))}
            </div>
          </div>
        </section>

        {/* What I Bring */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">What I Bring</h2>
              <p className="text-[#a0aec0]">Three areas where I can make an immediate impact</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <div className="flex items-center gap-3 mb-4">
                  <Code className="w-8 h-8 text-[#3b82f6]" />
                  <h3 className="text-xl font-semibold">Vibe Coding & Demos</h3>
                </div>
                <ul className="space-y-2 text-[#a0aec0]">
                  <li>Build compelling demos that showcase Replit's power</li>
                  <li>Rapid prototyping — idea to working app in hours</li>
                  <li>AI-native development as a daily practice</li>
                  <li>Real-world examples that inspire builders</li>
                </ul>
              </Block>
              
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.2}>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-8 h-8 text-[#3b82f6]" />
                  <h3 className="text-xl font-semibold">Content & Communication</h3>
                </div>
                <ul className="space-y-2 text-[#a0aec0]">
                  <li>Storytelling through products people can use</li>
                  <li>Translate technical capabilities into clear narratives</li>
                  <li>Create content that resonates with builders</li>
                  <li>Bridge the gap between product and audience</li>
                </ul>
              </Block>
              
              <Block variant="dark" delay={0.25}>
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-[#3b82f6]" />
                  <h3 className="text-xl font-semibold">Product Instinct & Speed</h3>
                </div>
                <ul className="space-y-2 text-[#a0aec0]">
                  <li>Ship fast, iterate faster — proven across 280+ apps</li>
                  <li>Spot what makes a product click with users</li>
                  <li>Deep understanding of the builder mindset</li>
                  <li>Turn product features into compelling stories</li>
                </ul>
              </Block>
            </div>
          </div>
        </section>

        {/* Track Record */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Track Record</h2>
              <p className="text-[#a0aec0]">15+ years of building, shipping, and scaling real products</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-[#3b82f6]" />
                  <h3 className="text-xl font-semibold">Recognition</h3>
                </div>
                <ul className="space-y-3 text-[#a0aec0]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#3b82f6] mt-1">•</span>
                    <span><strong className="text-white">Top 0.1% Replit Builder</strong> — One of the most prolific builders on the platform in 2025</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#3b82f6] mt-1">•</span>
                    <span><strong className="text-white">Microsoft Imagine Cup</strong> — 4th Place Worldwide (Sustainability / IoT)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#3b82f6] mt-1">•</span>
                    <span><strong className="text-white">European Youth Award</strong> — Best Business Potential</span>
                  </li>
                </ul>
              </Block>
              
              <Block variant="dark" delay={0.2}>
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-[#3b82f6]" />
                  <h3 className="text-xl font-semibold">Shipping at Scale</h3>
                </div>
                <ul className="space-y-3 text-[#a0aec0]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#3b82f6] mt-1">•</span>
                    <span><strong className="text-white">280+ apps built</strong> across diverse domains — fintech, social impact, gaming, and more</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#3b82f6] mt-1">•</span>
                    <span><strong className="text-white">100K+ users</strong> reached with products shipped to production</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#3b82f6] mt-1">•</span>
                    <span><strong className="text-white">30+ countries</strong> served with tools built from scratch</span>
                  </li>
                </ul>
              </Block>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Experience</h2>
              <p className="text-[#a0aec0]">Key roles and ventures</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-[#3b82f6]" />
                  <span className="text-sm text-[#a0aec0]">2024 – Present</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Prolific Replit Builder</h3>
                <p className="text-sm text-[#a0aec0] mb-3">AI-native development, rapid prototyping, vibe coding</p>
                <ul className="text-sm space-y-1 text-[#a0aec0]">
                  <li>• 280+ apps built and shipped on Replit</li>
                  <li>• Top 0.1% builder ranking in 2025</li>
                  <li>• Full-stack apps across fintech, social, gaming</li>
                  <li>• AI-native workflows as daily practice</li>
                </ul>
              </Block>
              
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.2}>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-[#3b82f6]" />
                  <span className="text-sm text-[#a0aec0]">2019 – 2023</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Co-Founder & President</h3>
                <p className="text-sm text-[#a0aec0] mb-3">impactMarket — Decentralized UBI protocol</p>
                <ul className="text-sm space-y-1 text-[#a0aec0]">
                  <li>• Scaled to 20+ team members</li>
                  <li>• 100K+ users across 30+ countries</li>
                  <li>• Built and shipped production products at scale</li>
                  <li>• Led product strategy and growth</li>
                </ul>
              </Block>
              
              <Block variant="dark" delay={0.25}>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-[#3b82f6]" />
                  <span className="text-sm text-[#a0aec0]">2013 – 2021</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Co-Founder & CEO</h3>
                <p className="text-sm text-[#a0aec0] mb-3">eSolidar — Social marketplace & CSR platform</p>
                <ul className="text-sm space-y-1 text-[#a0aec0]">
                  <li>• Expanded from Portugal to UK and US</li>
                  <li>• €1M+ raised for charities</li>
                  <li>• Venture-backed growth</li>
                  <li>• Full product lifecycle ownership</li>
                </ul>
              </Block>
            </div>
          </div>
        </section>

        {/* Core Competencies */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" delay={0.1}>
              <h2 className="text-2xl font-semibold mb-6">Core Competencies</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm text-[#3b82f6] uppercase tracking-widest mb-3">Rapid Prototyping</h3>
                  <ul className="space-y-1 text-[#a0aec0]">
                    <li>Idea to Working App in Hours</li>
                    <li>AI-Native Development</li>
                    <li>Full-Stack Vibe Coding</li>
                    <li>Ship Fast, Iterate Faster</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm text-[#3b82f6] uppercase tracking-widest mb-3">Storytelling Through Products</h3>
                  <ul className="space-y-1 text-[#a0aec0]">
                    <li>Demo-Driven Marketing</li>
                    <li>Product Narratives That Convert</li>
                    <li>Technical Content Creation</li>
                    <li>Builder Community Engagement</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm text-[#3b82f6] uppercase tracking-widest mb-3">Product & Growth</h3>
                  <ul className="space-y-1 text-[#a0aec0]">
                    <li>Zero-to-One Product Instinct</li>
                    <li>User-Centric Design Thinking</li>
                    <li>Cross-Functional Communication</li>
                    <li>International Market Experience</li>
                  </ul>
                </div>
              </div>
            </Block>
          </div>
        </section>

        {/* Why I'm a Great Match */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Why I'm a Great Match</h2>
              <p className="text-[#a0aec0]">Aligned with what you're looking for</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "I Build on Replit Every Day", desc: "280+ apps shipped. I don't just understand the platform — I live on it. I know what makes builders excited.", id: "daily-builder" },
                { title: "I Speak Builder & Human", desc: "I can translate technical power into stories that resonate — whether it's a tweet, a demo, or a conversation.", id: "communicator" },
                { title: "I Ship Relentlessly", desc: "Top 0.1% builder status isn't luck. I move fast, iterate constantly, and always deliver working products.", id: "shipper" },
                { title: "I Get the Vision", desc: "Replit is making software creation accessible to everyone. I've built my career around that same belief.", id: "vision" },
              ].map((benefit, i) => (
                <Block 
                  key={i} 
                  variant="dark" 
                  className={`${i < 3 ? "border-r border-[#2d2d2d]" : ""}`} 
                  delay={0.15 + i * 0.05}
                >
                  <h3 className="text-lg font-semibold mb-2 text-[#3b82f6]" data-testid={`benefit-title-${benefit.id}`}>{benefit.title}</h3>
                  <p className="text-sm text-[#a0aec0]" data-testid={`benefit-desc-${benefit.id}`}>{benefit.desc}</p>
                </Block>
              ))}
            </div>
          </div>
        </section>

        {/* Let's Connect */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="accent" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-6">Let's Connect</h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl">
                I'd love to chat about how I can help showcase what Replit makes possible. Whether it's a quick call or an async conversation — I'm ready.
              </p>
              <div className="border-t border-white/20 pt-6">
                <a 
                  href="https://x.com/mbarrbosa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[#3b82f6] px-6 py-3 font-semibold hover:bg-white/90 transition-colors"
                  data-testid="link-twitter-contact"
                >
                  <span>Reach out on X</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </Block>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-sm text-[#a0aec0]">
          <p>Marco Barbosa — Builder, Maker & Vibe Coder</p>
          <p className="mt-1">Aveiro, Portugal</p>
        </footer>
      </main>
    </div>
  );
}
