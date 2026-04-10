"use client"

import LandingNavbar from "@/components/landing/LandingNavbar"
import Hero from "@/components/landing/Hero"
import Features from "@/components/landing/Features"
import Pricing from "@/components/landing/Pricing"
import ProcessSection from "@/components/landing/ProcessSection"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#02040a]">
      <LandingNavbar />
      <Hero />
      <Features />
      <ProcessSection />
      <Pricing />
      
      {/* Footer Decoration */}
      <footer className="py-12 border-t border-white/5 bg-[#02040a] text-center">
        <p className="text-slate-600 text-xs font-black uppercase tracking-[0.4em]">
          © 2026 MIRAI Neural Protocol • Decentralized Intelligence
        </p>
      </footer>
    </main>
  )
}
