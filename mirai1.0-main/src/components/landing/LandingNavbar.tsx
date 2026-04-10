"use client"

import Link from "next/link"
import Logo from "@/components/ui/Logo"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth/AuthContext"
import InitialAvatar from "@/components/auth/InitialAvatar"

export default function LandingNavbar() {
  const { user, profile, logout } = useAuth()

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
        {user ? (
          <div className="flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all duration-300"
            >
              Dashboard
            </Link>
            <div className="group relative">
               <InitialAvatar name={profile?.displayName || user.email || 'Builder'} size="sm" className="cursor-pointer" />
               <div className="absolute top-full right-0 mt-2 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all pt-2 z-50">
                  <div className="bg-slate-900 border border-white/10 rounded-2xl p-2 w-48 shadow-2xl">
                     <button 
                       onClick={logout}
                       className="w-full text-left px-4 py-3 text-xs font-black uppercase text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                     >
                       Terminate Session
                     </button>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link 
              href="/signup" 
              className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-white/5"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </motion.header>
  )
}
