"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles, BrainCircuit, Zap, Shield, Cpu } from "lucide-react"
import MiraiBot from "./MiraiBot"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20 bg-[#02040a]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#02040a_80%)] -z-10" />

      <div className="container mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-emerald-400 text-[10px] font-black mb-12 uppercase tracking-[0.4em] shadow-2xl backdrop-blur-md"
        >
          <BrainCircuit className="h-4 w-4" />
          <span>Neural Evolution Protocol v3.0</span>
        </motion.div>

        <div className="flex flex-col items-center gap-16">
          {/* Central Visual Focus */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[80px] animate-pulse" />
            <div className="relative z-10">
               <MiraiBot />
            </div>
          </motion.div>

          <div className="max-w-5xl">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="text-7xl md:text-[11rem] font-black mb-6 tracking-tighter leading-[0.75] text-white italic"
              style={{ textShadow: '0 0 40px rgba(255,255,255,0.1)' }}
            >
              MIRAI
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-10"
            >
              <h2 className="text-2xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-cyan-400 bg-300% animate-gradient uppercase tracking-tighter">
                Reverse Learning Engine
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-3xl mx-auto text-slate-400 text-lg md:text-xl mb-12 leading-relaxed font-medium px-4"
            >
              The era of passive tutorials is over. Master production-grade ecosystems through autonomous execution, iterative struggle, and multi-agent neural feedback. 
              Built for the next generation of <span className="text-white italic">Technical Founders.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link 
                href="/signup" 
                className="group relative px-12 py-6 rounded-2xl bg-white text-black font-black text-lg hover:bg-emerald-400 transition-all duration-500 flex items-center gap-3 overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.3)]"
              >
                <span className="relative z-10">Initialize Evolution</span>
                <ArrowRight className="relative z-10 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#features" 
                className="px-12 py-6 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-black text-lg hover:bg-white/[0.08] transition-all duration-300 backdrop-blur-md flex items-center gap-3 group"
              >
                <span>The Recursive Loop</span>
                <Cpu className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-32 max-w-6xl mx-auto border-t border-white/5 pt-16"
        >
           {[
              { label: 'Neural Sync', desc: 'Cross-Agent Context' },
              { label: 'Zero Placeholder', desc: 'Real Execution' },
              { label: 'Struggle Engine', desc: 'Cognitive Optimization' },
              { label: 'Venture Ready', desc: 'Founder Evolution' },
           ].map((stat, i) => (
              <div key={i} className="text-center group cursor-crosshair">
                 <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 group-hover:text-emerald-500 transition-colors">{stat.label}</div>
                 <div className="text-sm font-bold text-white tracking-tight">{stat.desc}</div>
              </div>
           ))}
        </motion.div>
      </div>

      {/* Atmospheric Texture */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none -z-10" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#02040a] to-transparent z-20" />
    </section>
  )
}
