"use client"

import { useMiraiStore, PersonalityType } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { UserCircle, Coffee, Briefcase, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function AIPersonalitySwitcher() {
  const { personality, setPersonality } = useMiraiStore()
  const [isOpen, setIsOpen] = useState(false)

  const personalities = [
    { id: 'strict', label: 'Strict Mentor', icon: UserCircle, color: 'text-red-400', desc: 'Evaluates your code against production standards.' },
    { id: 'chill', label: 'Chill Buddy', icon: Coffee, color: 'text-blue-400', desc: 'Helps you build without breaking a sweat.' },
    { id: 'interviewer', label: 'Interviewer', icon: Briefcase, color: 'text-emerald-400', desc: 'Tests your thinking with high-stakes questions.' },
  ]

  const current = personalities.find(p => p.id === personality) || personalities[0]

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full pl-2 pr-4 py-1.5 hover:border-slate-700 transition-all hover:bg-slate-800 group"
      >
        <div className={`h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 ${current.color}`}>
          <current.icon className="h-5 w-5" />
        </div>
        <div className="text-left">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Mentor Mode</div>
          <div className="text-xs font-bold text-white leading-none">{current.label}</div>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-3 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
          >
            <div className="p-3 mb-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Switch Personality</h4>
            </div>
            {personalities.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPersonality(p.id as PersonalityType)
                  setIsOpen(false)
                }}
                className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all hover:bg-slate-800 group ${personality === p.id ? 'bg-slate-800/50' : ''}`}
              >
                <div className={`mt-0.5 h-8 w-8 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800 ${p.color} transition-colors group-hover:bg-slate-900`}>
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className={`text-sm font-bold ${personality === p.id ? 'text-white' : 'text-slate-300'}`}>{p.label}</div>
                  <p className="text-[10px] text-slate-500 line-clamp-2">{p.desc}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
