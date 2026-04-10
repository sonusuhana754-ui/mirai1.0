"use client"

import { motion } from "framer-motion"
import { Code2, Brain, Target, Workflow, Microscope, Activity } from "lucide-react"

const features = [
  {
    title: "Project-First Studio",
    description: "Skip the theory and dive straight into production code. Build real-world applications with real-time AI guidance.",
    icon: Code2,
    color: "from-emerald-400 to-cyan-400"
  },
  {
    title: "Cognitive Grooming",
    description: "When your project fails, our AI analyzes the gap and serves exactly the theory you need to succeed next time.",
    icon: Brain,
    color: "from-blue-400 to-indigo-400"
  },
  {
    title: "Evolution Tree",
    description: "Visualize your growth. Watch your personal skill tree branch out as you conquer complex building challenges.",
    icon: Workflow,
    color: "from-purple-400 to-rose-400"
  },
  {
    title: "Failure Replays",
    description: "Learn from the 'deep end'. Inspect why industrial-grade systems fail and how to engineer resilient solutions.",
    icon: Microscope,
    color: "from-orange-400 to-amber-400"
  },
  {
    title: "Real-World Ops",
    description: "Connect your builds to real hackathons and job opportunities that match your validated skill score.",
    icon: Target,
    color: "from-pink-400 to-red-400"
  },
  {
    title: "Neural Synergy",
    description: "Our platform learns how you learn, optimizing the reverse learning loop for your unique builder personality.",
    icon: Activity,
    color: "from-cyan-400 to-blue-400"
  }
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#05060b] relative overflow-hidden">
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-6"
          >
            Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-6 text-white"
          >
            Engineered for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">Autonomous Builders.</span>
          </motion.h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            Mirai doesn't just teach you to code. It forces you to think like an architect, 
            learn like a researcher, and execute like a founder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut" 
              }}
              whileHover={{ y: -5 }}
              className="group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500 relative overflow-hidden"
            >
              {/* Card Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-[64px] group-hover:bg-white/10 transition-all duration-500" />
              
              <div className={`h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-white/20 transition-all duration-500`}>
                <feature.icon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">
                {feature.description}
              </p>
              
              {/* Bottom Decoration */}
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r ${feature.color} transition-all duration-700 group-hover:w-full`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
