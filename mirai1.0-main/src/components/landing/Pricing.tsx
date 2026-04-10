"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Shield, Zap, Sparkles, CreditCard, Rocket, Lock, ArrowRight, Wallet, BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const tiers = [
  {
    name: "Free Explorer",
    id: "free",
    price: "0",
    description: "Ideal for the casual learner starting their reverse learning journey.",
    features: [
      "Access to Coding Terminal",
      "Basic AI Assistant Queries",
      "Public Studio Projects",
      "Basic Performance Metrics"
    ],
    buttonText: "Start Free",
    limitations: [
      "No Grooming Lab access",
      "No Hackathon participation",
      "No Team formation"
    ]
  },
  {
    name: "Builder Plus",
    id: "plus",
    price: {
      daily: "20",
      monthly: "599",
      yearly: "6,999"
    },
    description: "The full engine for dedicated student builders ready to evolve.",
    features: [
      "UNLIMITED Coding Terminal",
      "ALL AI Studio Agents",
      "Full Grooming Lab Access",
      "Direct Hackathon Opportunities",
      "30-Day Project History",
      "Advanced Evolution Analytics"
    ],
    highlight: true,
    buttonText: "Join Plus"
  },
  {
    name: "Founder Elite",
    id: "elite",
    price: {
      monthly: "1,499"
    },
    description: "For leaders building the future through synergistic collaboration.",
    features: [
      "Everything in Builder Plus",
      "Community Access (Coming Soon)",
      "Team Formation Tools (Coming Soon)",
      "Venture Capital Network",
      "Priority AI Agent Processing",
      "Beta Access to New Labs"
    ],
    comingSoon: true,
    buttonText: "Request Access"
  }
]

export default function Pricing() {
  const [cycle, setCycle] = useState<"daily" | "monthly" | "yearly">("monthly")

  return (
    <section id="pricing" className="py-32 bg-[#02040a] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-emerald-500/10 to-transparent blur-[120px] pointer-events-none opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          >
            <Shield className="h-3 w-3" />
            <span>Secure Evolution Access</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]"
          >
            Choose Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-300% animate-gradient">Output Level.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg max-w-xl mx-auto font-medium"
          >
            Transparent protocols designed to scale with your cognitive growth and technical output.
          </motion.p>

          {/* High-Fidelity Cycle Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center pt-10"
          >
            <div className="bg-[#0a0a0a] border border-white/5 p-1 rounded-3xl flex items-center h-14 relative">
              <div 
                className={cn(
                  "absolute h-12 rounded-2xl bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-500",
                  cycle === "daily" ? "left-1 w-[100px]" : cycle === "monthly" ? "left-[105px] w-[120px]" : "left-[229px] w-[110px]"
                )} 
              />
              <button
                onClick={() => setCycle("daily")}
                className={cn(
                  "relative z-10 px-6 h-full flex items-center justify-center text-[11px] font-black uppercase tracking-widest transition-colors duration-300",
                  cycle === "daily" ? "text-black" : "text-slate-500 hover:text-white"
                )}
              >
                Daily
              </button>
              <button
                onClick={() => setCycle("monthly")}
                className={cn(
                  "relative z-10 px-8 h-full flex items-center justify-center text-[11px] font-black uppercase tracking-widest transition-colors duration-300",
                  cycle === "monthly" ? "text-black" : "text-slate-500 hover:text-white"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setCycle("yearly")}
                className={cn(
                  "relative z-10 px-8 h-full flex items-center justify-center text-[11px] font-black uppercase tracking-widest transition-colors duration-300",
                  cycle === "yearly" ? "text-black" : "text-slate-500 hover:text-white"
                )}
              >
                Yearly
              </button>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pb-20">
          {tiers.map((tier, index) => {
            const price = typeof tier.price === 'string' ? tier.price : 
                           (tier.price as any)[cycle] || (tier.price as any)['monthly']
            
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                className={cn(
                  "group relative p-10 rounded-[3rem] border transition-all duration-700 flex flex-col overflow-hidden",
                  tier.highlight 
                    ? "bg-white/[0.03] border-emerald-500/30 shadow-2xl shadow-emerald-500/5" 
                    : "bg-white/[0.015] border-white/5 hover:border-emerald-500/20"
                )}
              >
                {tier.highlight && (
                  <>
                    <div className="absolute top-0 right-0 p-8">
                       <Sparkles className="h-6 w-6 text-emerald-400/50 animate-pulse" />
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-b-2xl shadow-xl shadow-emerald-500/20">
                      Standard Evolution
                    </div>
                  </>
                )}

                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                     <h3 className="text-xl font-black text-white uppercase tracking-tight">{tier.name}</h3>
                     {tier.highlight && <BadgeCheck className="h-5 w-5 text-emerald-400" />}
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-6xl font-black text-white tracking-tighter">
                      ₹{price}
                    </span>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                      /{cycle === 'yearly' ? 'year' : cycle === 'monthly' ? 'month' : 'day'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="space-y-5 mb-12 flex-1 relative">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-4">
                      <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-emerald-400" />
                      </div>
                      <span className="text-[13px] text-slate-300 font-medium group-hover:text-white transition-colors">{feature}</span>
                    </div>
                  ))}
                  {tier.limitations?.map((limit) => (
                    <div key={limit} className="flex items-start gap-4 opacity-30 grayscale underline decoration-red-500/20 decoration-2">
                      <div className="mt-1 h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <Lock className="h-3 w-3 text-slate-600" />
                      </div>
                      <span className="text-[13px] text-slate-500 font-medium">{limit}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/signup"
                  className={cn(
                    "w-full py-5 rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.2em] text-center transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group/btn",
                    tier.highlight 
                      ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.3)]" 
                      : "bg-white/[0.03] text-white hover:bg-white/[0.08] border border-white/5 hover:border-emerald-500/30",
                    tier.comingSoon && "opacity-50 pointer-events-none grayscale"
                  )}
                >
                  <span className="relative z-10">{tier.comingSoon ? "Protocol Incoming" : tier.buttonText}</span>
                  <ArrowRight className="h-4 w-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                
                {tier.id === 'plus' && (
                  <p className="text-[9px] text-center text-emerald-500/60 mt-6 uppercase tracking-widest font-black flex items-center justify-center gap-2">
                    <Shield className="h-3 w-3" />
                    30-Day Prototyping Phase Included
                  </p>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Global Compliance Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto flex flex-col items-center gap-8 border-t border-white/5 pt-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500">
             <div className="flex flex-col items-center gap-2 text-center">
                <Shield className="h-5 w-5 text-emerald-500" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest leading-tight">Secure <br/> Payments</span>
             </div>
             <div className="flex flex-col items-center gap-2 text-center">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest leading-tight">Instant <br/> Evolution</span>
             </div>
             <div className="flex flex-col items-center gap-2 text-center">
                <Wallet className="h-5 w-5 text-indigo-500" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest leading-tight">Dynamic <br/> Wallet</span>
             </div>
             <div className="flex flex-col items-center gap-2 text-center">
                <Rocket className="h-5 w-5 text-cyan-500" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest leading-tight">Global <br/> Reach</span>
             </div>
          </div>
          
          <p className="text-center text-slate-600 text-[9px] sm:text-xs uppercase tracking-[0.25em] font-medium leading-relaxed">
            Authorized Protocol Access. Card initialization required for valid identity verification. 
            Daily plans utilize the <span className="text-white">Mirai Neural Wallet</span> with an initial ₹100 credit buffer.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
