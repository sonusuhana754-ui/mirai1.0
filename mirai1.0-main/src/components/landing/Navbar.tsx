"use client"

import Link from "next/link"
import Logo from "@/components/ui/Logo"
import { motion } from "framer-motion"

export default function LandingNavbar() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between px-6 md:px-12 backdrop-blur-md bg-black/10 border-b border-white/5"
    >
      <Link href="/">
        <Logo />
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</Link>
        <Link href="#about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">About</Link>
        <Link href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Showcase</Link>
      </nav>

      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Login
        </Link>
        <Link 
          href="/signup" 
          className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-white/5"
        >
          Get Started
        </Link>
      </div>
    </motion.header>
  )
}
