"use client"

import { motion } from "framer-motion"
import { Dna, Target, Zap, Search, Layers } from "lucide-react"
import { useMiraiStore } from "@/lib/store"

export default function SkillDNAGraph() {
  const { skills, cognitiveMode } = useMiraiStore()
  
  const skillIcons: Record<string, any> = {
    "Problem Solving": Target,
    "Debugging Depth": Search,
    "System Thinking": Layers,
    "Coding Velocity": Zap,
    "Next.js": Target,
    "TypeScript": Layers,
    "TailwindCSS": Zap,
    "React": Target
  }

  const cognitiveLabels = {
    trial: "Trial-and-Error",
    copy: "Pattern Matcher",
    logical: "Structural Thinker",
    "ai-dependent": "AI Augmented"
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <Dna className="h-32 w-32 text-indigo-400" />
      </div>

      <div className="flex items-center gap-2 text-indigo-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
        <Dna className="h-3 w-3" />
        Neuro-Skill DNA
      </div>

      <div className="relative w-full aspect-square flex items-center justify-center my-4">
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
          {/* Radar Grid Web */}
          {[20, 40, 60, 80, 100].map((radius, i) => (
            <circle 
              key={`grid-${i}`} 
              cx="100" cy="100" r={radius} 
              fill="none" 
              stroke="rgba(99, 102, 241, 0.1)" 
              strokeWidth="1" 
              strokeDasharray={i % 2 === 0 ? "2 2" : "none"}
            />
          ))}

          {/* Axes */}
          {skills.slice(0, 4).map((_, i) => {
            const angle = (Math.PI * 2 * i) / 4;
            return (
              <line 
                key={`axis-${i}`} 
                x1="100" y1="100" 
                x2={100 + Math.cos(angle) * 100} 
                y2={100 + Math.sin(angle) * 100} 
                stroke="rgba(99, 102, 241, 0.2)" 
                strokeWidth="1" 
              />
            )
          })}

          {/* DNA Path */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            d={`M ${skills.slice(0,4).map((skill, i) => {
              const angle = (Math.PI * 2 * i) / 4;
              const radius = Math.max(20, skill.value); // min 20%
              return `${100 + Math.cos(angle) * radius} ${100 + Math.sin(angle) * radius}`;
            }).join(' L ')} Z`}
            fill="rgba(99, 102, 241, 0.2)"
            stroke="#4f46e5"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {skills.slice(0, 4).map((skill, i) => {
            const angle = (Math.PI * 2 * i) / 4;
            const radius = Math.max(20, skill.value);
            const x = 100 + Math.cos(angle) * radius;
            const y = 100 + Math.sin(angle) * radius;
            
            return (
              <g key={`point-${i}`}>
                <circle cx={x} cy={y} r="4" fill="#10b981" />
                <circle cx={x} cy={y} r="8" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" style={{ transformOrigin: `${x}px ${y}px` }} />
              </g>
            )
          })}
        </svg>

        {/* Labels positioned absolutely over the SVG */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute -top-2 text-[10px] font-bold text-indigo-400 bg-[#0f0f0f] px-2 rounded-full">{skills[0]?.name}</div>
          <div className="absolute -right-2 text-[10px] font-bold text-indigo-400 bg-[#0f0f0f] px-2 rounded-full">{skills[1]?.name}</div>
          <div className="absolute -bottom-2 text-[10px] font-bold text-indigo-400 bg-[#0f0f0f] px-2 rounded-full">{skills[2]?.name}</div>
          <div className="absolute -left-2 text-[10px] font-bold text-indigo-400 bg-[#0f0f0f] px-2 rounded-full">{skills[3]?.name}</div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
        <div className="text-[10px] text-slate-500 font-bold uppercase">Learning Pattern</div>
        <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {cognitiveLabels[cognitiveMode]}
        </div>
      </div>
    </div>
  )
}
