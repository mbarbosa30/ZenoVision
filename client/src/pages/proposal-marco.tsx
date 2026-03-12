import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Code, Users, Zap, Award, Globe, Briefcase, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { PasswordGate } from "@/components/password-gate";
import { Block } from "@/components/block";

export default function ProposalMarco() {
  return (
    <PasswordGate storageKey="marcoAuth" title="Personal Proposal">
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#2d2d2d] bg-[#0f0f0f]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" data-testid="link-logo">
            <div className="w-8 h-8 bg-[#3b82f6]" />
            <span className="font-semibold text-lg tracking-tight">Zeno</span>
          </Link>
          <div className="text-sm text-[#a0aec0]">Personal Proposal</div>
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
              <div className="text-sm text-[#a0aec0] uppercase tracking-widest mb-4">Personal Proposal</div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight mb-6">
                Marco Barbosa
              </h1>
              <p className="text-2xl text-[#3b82f6] font-medium mb-8">
                Builder-in-Residence for Opera MiniPay
              </p>
              <p className="text-xl text-[#a0aec0] max-w-3xl">
                An embedded builder and ecosystem contributor. I build apps, help other developers ship, and provide hands-on strategic input on AI-native product development.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Summary */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="accent" className="border-b border-[#2563eb]" delay={0.1}>
              <h2 className="text-2xl font-semibold mb-4">The Offer</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                A <strong>direct contractor relationship</strong> at <strong>$15,000/month</strong> for an extended engagement. No organizational overhead — just a proven builder embedded in your ecosystem.
              </p>
              <p className="text-white/80 leading-relaxed">
                I build mini apps, support ecosystem developers in optimizing and listing their apps, and contribute strategic perspective on AI-native innovation.
              </p>
            </Block>
            
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { value: "$15K", label: "Monthly rate", sub: "direct contractor", id: "rate" },
                { value: "12+", label: "Month commitment", sub: "flexible extension", id: "commitment" },
                { value: "100%", label: "Dedicated focus", sub: "MiniPay ecosystem", id: "focus" },
                { value: "15+", label: "Years experience", sub: "fintech & impact", id: "experience" },
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

        {/* What I Deliver */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">What I Deliver</h2>
              <p className="text-[#a0aec0]">Hands-on contribution across three areas</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.15}>
                <div className="flex items-center gap-3 mb-4">
                  <Code className="w-8 h-8 text-[#3b82f6]" />
                  <h3 className="text-xl font-semibold">App Builder</h3>
                </div>
                <ul className="space-y-2 text-[#a0aec0]">
                  <li>Build and ship mini apps directly</li>
                  <li>Rapid prototyping and iteration</li>
                  <li>AI-native development approach</li>
                  <li>Focus on engagement and retention</li>
                </ul>
              </Block>
              
              <Block variant="dark" className="border-r border-[#2d2d2d]" delay={0.2}>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-8 h-8 text-[#3b82f6]" />
                  <h3 className="text-xl font-semibold">Dev Rel</h3>
                </div>
                <ul className="space-y-2 text-[#a0aec0]">
                  <li>Help ecosystem builders optimize apps</li>
                  <li>Guide developers through listing process</li>
                  <li>Share best practices and patterns</li>
                  <li>Bridge between builders and MiniPay team</li>
                </ul>
              </Block>
              
              <Block variant="dark" delay={0.25}>
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-[#3b82f6]" />
                  <h3 className="text-xl font-semibold">Strategic Input</h3>
                </div>
                <ul className="space-y-2 text-[#a0aec0]">
                  <li>AI-native innovation perspective</li>
                  <li>Emerging market product insights</li>
                  <li>Ecosystem growth strategy</li>
                  <li>Direct feedback loop on product direction</li>
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
              <p className="text-[#a0aec0]">15+ years building fintech and impact products at scale</p>
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
                  <h3 className="text-xl font-semibold">Proven Scale</h3>
                </div>
                <ul className="space-y-3 text-[#a0aec0]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#3b82f6] mt-1">•</span>
                    <span><strong className="text-white">100K+ users</strong> on platforms in the Global South</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#3b82f6] mt-1">•</span>
                    <span><strong className="text-white">$3M+ value moved</strong> through DeFi protocols</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#3b82f6] mt-1">•</span>
                    <span><strong className="text-white">30+ countries</strong> reached with financial tools</span>
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
                  <span className="text-sm text-[#a0aec0]">2023 – Present</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Builder & Growth Strategist</h3>
                <p className="text-sm text-[#a0aec0] mb-3">AI-native onchain primitives for regenerative finance</p>
                <ul className="text-sm space-y-1 text-[#a0aec0]">
                  <li>• NanoPay — Gasless, offline-ready wallet</li>
                  <li>• MaxFlow — Sybil-resistant trust graph</li>
                  <li>• MiniPlay — Gaming for MiniPay</li>
                  <li>• Advisor: Talent Protocol</li>
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
                  <li>• $3M+ cUSD distributed (UBI + MicroCredit)</li>
                  <li>• $PACT token design and launch</li>
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
                  <li>• Pioneered "We-Commerce" tools</li>
                </ul>
              </Block>
            </div>
          </div>
        </section>

        {/* Technical Stack */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" delay={0.1}>
              <h2 className="text-2xl font-semibold mb-6">Core Competencies</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm text-[#3b82f6] uppercase tracking-widest mb-3">Product Strategy</h3>
                  <ul className="space-y-1 text-[#a0aec0]">
                    <li>Zero-to-One Discovery</li>
                    <li>Mobile-First / Offline UX</li>
                    <li>Tokenomics & Incentives</li>
                    <li>DeFi & Savings Mechanics</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm text-[#3b82f6] uppercase tracking-widest mb-3">Technical Stack</h3>
                  <ul className="space-y-1 text-[#a0aec0]">
                    <li>Celo, Base, Arbitrum</li>
                    <li>ERC-4626 / EIP-3009 / x402</li>
                    <li>AI-Native Development</li>
                    <li>Sybil Resistance & Trust Graphs</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm text-[#3b82f6] uppercase tracking-widest mb-3">Growth & Markets</h3>
                  <ul className="space-y-1 text-[#a0aec0]">
                    <li>Emerging Markets Focus</li>
                    <li>Remote Team Management</li>
                    <li>International Expansion</li>
                    <li>Venture Funding & Deals</li>
                  </ul>
                </div>
              </div>
            </Block>
          </div>
        </section>

        {/* Why This Works */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="dark" className="border-b border-[#2d2d2d]" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-2">Why This Works for Opera</h2>
              <p className="text-[#a0aec0]">Direct value, lower cost, longer commitment</p>
            </Block>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Lower Cost", desc: "$15K/month vs. studio rates — direct relationship with no organizational overhead.", id: "cost" },
                { title: "Longer Commitment", desc: "12+ month engagement provides continuity and deep ecosystem knowledge accumulation.", id: "commitment" },
                { title: "Proven Builder", desc: "Track record of shipping products that reach 100K+ users in emerging markets.", id: "builder" },
                { title: "Ecosystem Native", desc: "Deep Celo experience, existing relationships, and understanding of MiniPay's mission.", id: "ecosystem" },
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

        {/* Next Steps */}
        <section className="border-b border-[#2d2d2d]">
          <div className="max-w-7xl mx-auto">
            <Block variant="accent" delay={0.1}>
              <h2 className="text-3xl font-semibold mb-6">Next Steps</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 flex items-center justify-center text-lg font-semibold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold mb-1">Connect</h3>
                    <p className="text-sm text-white/80">30-minute call to discuss scope and expectations</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 flex items-center justify-center text-lg font-semibold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold mb-1">Align</h3>
                    <p className="text-sm text-white/80">Define priorities and success metrics for the engagement</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 flex items-center justify-center text-lg font-semibold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold mb-1">Start</h3>
                    <p className="text-sm text-white/80">Begin building and contributing immediately</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/20 pt-6">
                <p className="text-lg mb-4">Ready to discuss?</p>
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
          <p>Marco Barbosa — Tech Impact Entrepreneur & Web3 Builder</p>
          <p className="mt-1">Aveiro, Portugal</p>
        </footer>
      </main>
    </div>
    </PasswordGate>
  );
}
