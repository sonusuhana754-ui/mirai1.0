"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "./AuthContext"
import { Shield, Check, Lock, Sparkles, ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import Link from "next/link"
import { useRouter } from "next/navigation"

const tiers = [
  {
    name: "Free Explorer",
    id: "free",
    price: "0",
    description: "Start your journey immediately with core building tools.",
    features: ["Mirai Studio (A-B-C)", "Core Terminal", "Public Profile"],
    buttonText: "Stay Free",
    link: "#"
  },
  {
    name: "Builder Plus",
    id: "plus",
    price: "599",
    description: "The full evolution engine with 30-day premium trial.",
    features: ["Grooming Lab AI", "Opportunity Engine", "Elite Hackathons"],
    highlight: true,
    buttonText: "Start 30-Day Trial",
    link: "/checkout?plan=plus-monthly"
  },
  {
    name: "Founder Elite",
    id: "elite",
    price: "Coming Soon",
    description: "Synergistic collaboration and venture networks.",
    features: ["Everything in Plus", "Community Access", "Team Formation"],
    comingSoon: true,
    buttonText: "Coming Soon",
    link: "#"
  }
]

export default function OnboardingModal() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!loading && user && profile && !profile.hasSeenOnboarding && profile.plan === 'free') {
      const timer = setTimeout(() => setIsOpen(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [loading, user, profile])

  const handleSkip = async () => {
    setIsOpen(false)
    if (!user || !db) return
    setIsUpdating(true)
    try {
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        hasSeenOnboarding: true
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleClose = async () => {
    setIsOpen(false)
    if (!user || !db) return
    setIsUpdating(true)
    try {
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        hasSeenOnboarding: true
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#05060b]/90 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden shadow-emerald-500/10"
        >
          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid md:grid-cols-[1fr_350px]">
            {/* Primary Promo */}
            <div className="p-8 md:p-12 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="h-3 w-3" />
                  <span>Evolution Opportunity</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none">
                  Accelerate your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Output Level.</span>
                </h2>
                <p className="text-slate-400 text-sm max-w-md">
                  You are currently on the Free Protocol. Evolve to Builder Plus to unlock the Grooming Lab, premium hackathons, and unlimited AI assistance.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tiers.map((tier) => (
                  <div 
                    key={tier.id}
                    className={cn(
                      "p-6 rounded-3xl border flex flex-col justify-between transition-all",
                      tier.highlight 
                        ? "bg-white/[0.04] border-emerald-500/30 ring-1 ring-emerald-500/20 shadow-xl shadow-emerald-500/5" 
                        : "bg-white/[0.02] border-white/10",
                      tier.comingSoon && "opacity-80"
                    )}
                  >
                    <div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-1">{tier.name}</h3>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-2xl font-black text-white italic">
                          {tier.price.includes('Soon') ? '' : '₹'}{tier.price}
                        </span>
                        {!tier.price.includes('Soon') && <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">/month</span>}
                      </div>
                      <ul className="space-y-2 mb-6">
                        {tier.features.map(f => (
                          <li key={f} className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                            <Check className="h-3 w-3 text-emerald-500" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {tier.link && tier.link !== '#' ? (
                      <Link 
                        href={tier.link}
                        className="w-full py-3 rounded-xl bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 text-center transition-all flex items-center justify-center gap-2"
                      >
                        {tier.buttonText}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : tier.id === 'free' ? (
                      <button 
                        onClick={handleSkip}
                        disabled={isUpdating}
                        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                      >
                        {isUpdating ? "Confirming..." : tier.buttonText}
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-slate-500 font-black text-[10px] uppercase tracking-widest cursor-not-allowed"
                      >
                        {tier.buttonText}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Stats Teaser */}
            <div className="hidden md:flex flex-col bg-[#05060b] border-l border-white/5 p-10 justify-center space-y-8">
              <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Module Readiness</h4>
                {[
                  { label: "Grooming Lab", status: "Locked", color: "text-rose-500" },
                  { label: "Elite Opportunities", status: "Locked", color: "text-rose-500" },
                  { label: "Studio Agents", status: "Limited", color: "text-orange-500" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-400 font-medium">{stat.label}</span>
                    <div className="flex items-center gap-2">
                       <Lock className="h-3 w-3 text-slate-600" />
                       <span className={cn("text-[10px] font-black uppercase tracking-tighter", stat.color)}>{stat.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/5">
                <p className="text-[10px] text-slate-500 italic leading-relaxed">
                   "Mirai Builders who evolve to the Plus protocol see a 400% increase in hackathon acceptance rates."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
