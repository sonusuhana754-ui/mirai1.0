"use client"

import React from "react"
import { useAuth } from "./AuthContext"
import { Lock, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PlanGuardProps {
  children: React.ReactNode
  requiredPlan: 'plus' | 'elite'
  fallback?: "blur" | "redirect" | "message"
  className?: string
}

export default function PlanGuard({ 
  children, 
  requiredPlan, 
  fallback = "message",
  className 
}: PlanGuardProps) {
  const { profile, isGuest, loading } = useAuth()

  if (loading) return null

  // Helper to determine if current plan meets requirements
  const hasAccess = () => {
    if (isGuest) return false
    if (!profile) return false
    
    const hierarchy = { free: 0, plus: 1, elite: 2 }
    return hierarchy[profile.plan] >= hierarchy[requiredPlan]
  }

  if (hasAccess()) {
    return <>{children}</>
  }

  // Fallback modes
  if (fallback === "blur") {
    return (
      <div className={cn("relative group", className)}>
        <div className="filter blur-md pointer-events-none select-none opacity-40">
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-3xl p-6 text-center backdrop-blur-[2px] border border-white/5">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="text-lg font-black text-white uppercase italic">Protocol Locked</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-[200px]">This module requires a <span className="text-emerald-400 font-bold">{requiredPlan.toUpperCase()}</span> evolution level.</p>
          <Link 
            href="/signup" 
            className="mt-4 px-6 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase rounded-xl hover:bg-emerald-400 transition-all"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    )
  }

  if (fallback === "message") {
    return (
      <div className={cn("flex flex-col items-center justify-center p-12 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]", className)}>
        <ShieldAlert className="h-12 w-12 text-slate-700 mb-6" />
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Evolution Required</h2>
        <p className="text-slate-500 max-w-sm mx-auto mt-4 text-sm font-medium">
          The module you are trying to access is reserved for {requiredPlan === 'plus' ? 'Builder Plus' : 'Founder Elite'} members. 
          {isGuest ? ' Create a permanent account to start your 30-day trial.' : ' Evolution is necessary to proceed.'}
        </p>
        <Link 
          href="/signup" 
          className="mt-8 px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-xl"
        >
          Evolve to {requiredPlan.toUpperCase()}
        </Link>
      </div>
    )
  }

  return null
}
