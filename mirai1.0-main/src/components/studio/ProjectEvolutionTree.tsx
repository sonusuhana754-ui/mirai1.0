"use client"

import { useState } from "react"
import { useMiraiStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, ChevronRight, Loader2, Sparkles, Target, Unlock } from "lucide-react"

export default function ProjectEvolutionTree() {
  const { projectConcept, setProjectConcept, evolutionLevel, setEvolutionLevel, evolutionTree, setEvolutionTree } = useMiraiStore()
  const [inputConcept, setInputConcept] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateTree = async () => {
    if (!inputConcept.trim()) return
    setIsGenerating(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "system",
            content: "You are the Mirai Evolution Engine. The user provides a project idea. You must break it down into EXACTLY 4 linear evolution stages, from a primitive prototype to a production-ready application. Return ONLY A JSON ARRAY of 4 objects with this structure: { \"id\": \"1\", \"title\": \"Basic MVP\", \"desc\": \"short description\" }."
          }, {
            role: "user",
            content: `Break down this project: ${inputConcept}`
          }],
          model: "llama-3.3-70b-versatile",
          stream: false
        })
      });
      const data = await response.json();
      const content = data.choices[0].message.content;
      const jsonStart = content.indexOf('[');
      const jsonEnd = content.lastIndexOf(']') + 1;
      const rawJson = content.slice(jsonStart, jsonEnd);
      
      const parsedTree = JSON.parse(rawJson).map((node: any, index: number) => ({
        id: (index + 1).toString(),
        title: node.title,
        desc: node.desc,
        unlocked: index === 0
      }));
      
      setEvolutionTree(parsedTree)
      setProjectConcept(inputConcept)
      setEvolutionLevel(1)
    } catch (e) {
      console.error("Failed to generate tree:", e)
    } finally {
      setIsGenerating(false)
    }
  }

  const unlockNext = () => {
    if (evolutionLevel >= evolutionTree.length) return
    const nextLevel = evolutionLevel + 1
    setEvolutionLevel(nextLevel)
    setEvolutionTree(evolutionTree.map((node, i) => ({
      ...node,
      unlocked: i < nextLevel
    })))
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {evolutionTree.length === 0 ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-slate-900/50 p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            Project Catalyst
          </h3>
          <p className="text-xs text-slate-400">Describe what you want to build. Mirai will assemble a 4-stage evolution tree.</p>
          <div className="flex gap-2 z-10">
            <input 
              value={inputConcept} 
              onChange={e => setInputConcept(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && generateTree()}
              placeholder="e.g. A real-time chat app..." 
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button 
              onClick={generateTree} 
              disabled={isGenerating}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-lg px-4 py-2 text-sm font-bold flex items-center gap-2 transition-all"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl border border-white/5 bg-slate-950 p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Evolution Map</h3>
            <span className="text-xs font-bold text-indigo-400">Phase {evolutionLevel} / 4</span>
          </div>

          <div className="relative flex flex-col gap-1 z-10">
            {/* SVG Path connecting the nodes */}
            <div className="absolute top-4 left-6 bottom-4 w-px bg-slate-800 -z-10" />
            
            <AnimatePresence>
              {evolutionTree.map((node, index) => {
                const isActive = index + 1 === evolutionLevel;
                const isPast = index + 1 < evolutionLevel;
                const isLocked = !node.unlocked;

                return (
                  <motion.div 
                    key={node.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start gap-4 p-3 rounded-xl transition-all duration-500 ${
                      isActive ? 'bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 
                      isPast   ? 'bg-transparent border border-transparent opacity-60' : 
                                 'bg-black/20 border border-white/5 backdrop-blur-md opacity-40 grayscale'
                    }`}
                  >
                    <div className="mt-1 bg-slate-950 rounded-full p-0.5">
                      {isPast ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : 
                       isActive ? <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" /> : 
                                  <div className="h-5 w-5 rounded-full border-2 border-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-700">{index + 1}</div>}
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${isActive ? 'text-indigo-300' : isPast ? 'text-slate-300' : 'text-slate-500'}`}>
                          {node.title}
                        </span>
                        {isLocked && <Unlock className="h-3 w-3 text-slate-700" />}
                      </div>
                      <span className="text-[11px] text-slate-500 leading-tight">
                        {node.desc}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {evolutionLevel < evolutionTree.length && (
            <button onClick={unlockNext} className="mt-2 w-full py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold tracking-widest uppercase hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2 group">
              Achieve Milestone
              <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {evolutionLevel === evolutionTree.length && (
            <div className="mt-2 w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-widest uppercase text-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              System Live & Deployed
            </div>
          )}
        </div>
      )}
    </div>
  )
}
