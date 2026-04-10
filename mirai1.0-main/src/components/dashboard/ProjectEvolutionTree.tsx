"use client"

import { useMiraiStore } from "@/lib/store"
import { motion } from "framer-motion"
import { Check, Lock, ChevronRight, Zap } from "lucide-react"

export default function ProjectEvolutionTree() {
  const { evolutionLevel } = useMiraiStore()

  const stages = [
    { level: 1, title: "Base Logic", desc: "Core algorithms" },
    { level: 2, title: "UI Integration", desc: "React components" },
    { level: 3, title: "State Mgmt", desc: "Data flow & context" },
    { level: 4, title: "Production App", desc: "Deploy & Scale" }
  ]

  return (
    <div className="relative mt-6 pt-4 border-t border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Zap className="h-3 w-3 text-emerald-400" />
          Project Evolution
        </h4>
        <span className="text-[10px] font-bold bg-slate-800 px-2 py-1 rounded text-slate-300">
          Level {evolutionLevel}
        </span>
      </div>

      <div className="relative flex justify-between items-center">
        {/* Background Line */}
        <div className="absolute left-[10%] right-[10%] h-0.5 bg-slate-800 top-4 -z-10" />
        
        {/* Progress Line */}
        <motion.div 
          className="absolute left-[10%] h-0.5 bg-emerald-500 top-4 -z-10"
          initial={{ width: 0 }}
          animate={{ width: `${(Math.min(evolutionLevel - 1, 3) / 3) * 80}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {stages.map((stage, idx) => {
          const isUnlocked = stage.level <= evolutionLevel
          const isCurrent = stage.level === evolutionLevel

          return (
            <div key={stage.level} className="flex flex-col items-center relative group">
              <motion.div 
                initial={false}
                animate={{ 
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isUnlocked ? '#10b981' : '#1e293b',
                  borderColor: isCurrent ? '#34d399' : isUnlocked ? '#10b981' : '#334155'
                }}
                className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors z-10 
                  ${isUnlocked ? 'text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-slate-500'}
                `}
              >
                {isUnlocked ? <Check className="h-4 w-4" /> : <Lock className="h-3 w-3" />}
              </motion.div>
              
              <div className="absolute top-10 flex flex-col items-center w-24 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className={`text-[10px] font-bold whitespace-nowrap ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                  {stage.title}
                </div>
                <div className="text-[8px] text-slate-400 text-center leading-tight mt-0.5">
                  {stage.desc}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
