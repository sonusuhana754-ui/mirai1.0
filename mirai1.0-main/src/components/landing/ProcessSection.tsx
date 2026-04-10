"use client"

import { motion } from "framer-motion"
import { PlayCircle, Target, RefreshCw, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: PlayCircle,
    title: "Project-First Start",
    desc: "Instead of tutorials, you're assigned a complex production-ready goal. Build first, struggle purposefully.",
    sub: "01"
  },
  {
    icon: RefreshCw,
    title: "Iterative Failure",
    desc: "Your code fails by design. This is where real learning happens. AI identifies exactly what theory you're missing.",
    sub: "02"
  },
  {
    icon: Target,
    title: "Theoretic Mastery",
    desc: "Targeted 'Grooming Sessions' fill your gaps instantly. Apply the new theory immediately to solve your build.",
    sub: "03"
  }
]

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 bg-[#05060b] relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]"
            >
              The Methodology
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter"
            >
              Mastery <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Through Execution.</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-slate-500 text-lg font-medium leading-relaxed max-w-lg"
            >
              Traditional learning is linear. Build, forget, repeat. 
              Mirai's Reverse Learning Loop is exponential—identify the gap, fill the gap, perfect the build.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pt-4"
            >
              <div className="flex items-center gap-4 text-white/40 font-black text-xl italic uppercase tracking-widest">
                Real world first. Theory second.
              </div>
            </motion.div>
          </div>

          {/* Steps Visualizer */}
          <div className="lg:w-1/2 relative space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.7, 
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="group relative bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] flex gap-6 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 shadow-xl"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-emerald-500/30 transition-all duration-500">
                  <step.icon className="h-8 w-8 text-emerald-400" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">{step.title}</h3>
                    <span className="text-4xl font-black text-white/[0.03] group-hover:text-emerald-500/10 transition-colors uppercase italic">{step.sub}</span>
                  </div>
                  <p className="text-slate-500 leading-relaxed text-sm font-medium pr-8">{step.desc}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="absolute -bottom-4 left-14 h-8 w-px bg-gradient-to-b from-emerald-500/50 to-transparent z-10 hidden md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
