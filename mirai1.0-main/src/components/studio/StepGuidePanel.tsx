"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, CircleDashed, Bot, Brain, Zap, AlertTriangle, Layers, Send, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMiraiStore, CognitiveMode } from "@/lib/store"
import { getGroqStreamingCompletion } from "@/lib/groq"
import StruggleTelemetry from "@/components/studio/StruggleTelemetry"

interface StepGuidePanelProps {
  realityMode?: boolean
  blindMode?: boolean
}

export default function StepGuidePanel({ realityMode = false, blindMode = false }: StepGuidePanelProps) {
  const { 
    struggleScore, 
    cognitiveMode, 
    personality,
  } = useMiraiStore()
  
  const [isThinking, setIsThinking] = useState(false)
  const [mentorResponse, setMentorResponse] = useState("")
  const [input, setInput] = useState("")

  const handleMentorAsk = async () => {
    if (!input.trim() || isThinking) return
    
    setIsThinking(true)
    setMentorResponse("")
    
    const systemPrompt = `You are the Mirai AI Pair Programmer. 
    Personality: ${personality}.
    Cognitive Mode Detected: ${cognitiveMode}.
    Struggle Score: ${struggleScore}/100.
    Reality Mode: ${realityMode ? 'ON (Inject chaos/messy reqs)' : 'OFF'}.
    Blind Mode: ${blindMode ? 'ON (No hints, force thinking)' : 'OFF'}.
    
    CRITICAL INSTRUCTION: You use Socratic Questioning. NEVER give the direct answer or write the code for the user. 
    Instead, ask leading questions, point out logical fallacies in their approach, and teach them the 'real coder mindset'.
    `

    try {
      // Thinking Delay Engine: Artificial delay to mimic human mentor thought process
      const delayMs = Math.random() * 1500 + 1000; // 1s to 2.5s delay
      await new Promise(resolve => setTimeout(resolve, delayMs));

      let fullText = ""
      await getGroqStreamingCompletion(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: input }
        ],
        (chunk) => {
          fullText += chunk
          setMentorResponse(fullText)
        }
      )
    } catch (error: any) {
      console.error("Studio AI Error:", error)
      setMentorResponse(`🚨 AI Error: ${error?.message || "Connection failed"}. Check your API key.`)
    } finally {
      setIsThinking(false)
      setInput("")
    }
  }

  const cognitiveLabels = {
    trial: { label: "Trial-and-Error", color: "text-orange-400", desc: "You're experimenting frequently. Precision over speed!" },
    copy: { label: "Copy-Paste Detection", color: "text-red-400", desc: "Detected external patterns. Try to internalize the logic." },
    logical: { label: "Logical Thinker", color: "text-indigo-400", desc: "Structured approach detected. Keep up the depth." },
    "ai-dependent": { label: "AI Dependent", color: "text-indigo-400", desc: "Relying heavily on hints. Blind mode suggested." }
  }

  const currentCognitive = cognitiveLabels[cognitiveMode]

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] text-white relative">
      {/* Top Section: Struggle Intel & Cognitive Mode */}
      <div className="p-4 border-b border-white/5 bg-[#0a0a0a]">
        <StruggleTelemetry />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {/* Step 1 */}
        <div className="flex items-start gap-4 opacity-40 grayscale group cursor-help">
          <div className="mt-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></div>
          <div className={blindMode ? "filter blur-sm select-none" : ""}>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">1. Setup basic HTML/CSS</h4>
            <p className="text-[10px] text-slate-600 mt-1">Completed in 12m 4s</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-4">
          <div className="mt-1"><CircleDashed className="h-4 w-4 text-indigo-400 animate-spin-slow" /></div>
          <div className="bg-[#151515] p-3 rounded-lg border border-white/5 relative overflow-hidden flex-1 shadow-inner">
            <AnimatePresence>
              {(realityMode || blindMode) && (
                <motion.div 
                  initial={{ opacity: 0, filter: 'blur(10px)', x: -20, skewX: 20 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', x: 0, skewX: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10, mass: 0.5 }}
                  className={`absolute inset-x-0 top-0 px-3 py-1 flex items-center gap-2 border-b ${blindMode ? 'bg-indigo-500/20 border-indigo-500/30' : 'bg-red-500/20 border-red-500/30'}`}
                >
                  {blindMode ? <Zap className="h-3 w-3 text-indigo-400" /> : <AlertTriangle className="h-3 w-3 text-red-400" />}
                  <span className={`text-[8px] font-black uppercase ${blindMode ? 'text-indigo-400' : 'text-red-400'}`}>
                    {blindMode ? 'Hardened Mode ACTIVE' : 'Chaos Injected'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className={blindMode ? "mt-4 filter blur-[3px] opacity-20 select-none grayscale" : "mt-4"}>
              <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wide">
                {realityMode ? "FWD: FWD: URGENT: Make it pop" : "2. Wire Frontend Form"}
              </h4>
              <div className="text-[11px] text-slate-400 leading-relaxed">
                {realityMode ? (
                  <div className="font-mono bg-yellow-900/10 border-l-2 border-yellow-500/50 pl-2 py-1 text-yellow-500/80">
                    <p>hey devs,</p>
                    <p>client just emailed. they want the main button to 'pop' more?? maybe add a shadow but make it dynamic. also there's a bug where clicking it does nothing or crashes. fix asap.</p>
                    <p>- sent from my iphone</p>
                  </div>
                ) : (
                  "Add an input field for the prompt and an empty div for the result."
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Mentor Footer */}
      <div className="p-4 bg-[#0a0a0a] border-t border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-indigo-500" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Mentor Nudge</span>
          </div>
          {isThinking && <Loader2 className="h-3 w-3 text-indigo-500 animate-spin" />}
        </div>
        
        <div className="bg-[#151515] rounded-lg p-3 text-[11px] text-slate-400 mb-3 border border-white/5 min-h-[60px] flex items-center italic leading-relaxed">
          <AnimatePresence mode="wait">
            {isThinking && !mentorResponse ? (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="thinking" className="text-slate-600">
                Processing structural logic...
              </motion.span>
            ) : (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                key="msg"
                className="whitespace-pre-wrap font-mono text-[10px]"
              >
                {mentorResponse || (struggleScore > 60 
                      ? "I see you're facing some friction. How about we refactor the event listeners first?" 
                      : "I'm ready to pair. Ask me to 'implement X' or 'debug Y'.")}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask mentor..." 
            onKeyDown={(e) => { if (e.key === 'Enter') handleMentorAsk() }}
            className="w-full bg-[#151515] border border-white/5 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 pr-8"
          />
          <button onClick={handleMentorAsk} className="absolute right-3 top-2.5">
            <Send className="h-3 w-3 text-slate-600 cursor-pointer hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </div>
  )
}


