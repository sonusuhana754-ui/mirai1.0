"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Network } from "lucide-react"
import { motion } from "framer-motion"
import { useMiraiStore } from "@/lib/store"
import { getGroqStreamingCompletion } from "@/lib/groq"

export function MultiAgentDebateView() {
  const { addAgentInsight, agentInsights } = useMiraiStore()
  const [input, setInput] = useState("")
  const [isDebating, setIsDebating] = useState(false)
  const [debateHistory, setDebateHistory] = useState<{agent: 'Astra' | 'Vax' | 'User', content: string}[]>([])
  const [currentSpeaker, setCurrentSpeaker] = useState<'Astra' | 'Vax' | null>(null)
  const [currentStream, setCurrentStream] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [debateHistory, currentStream])

  const triggerDebate = async () => {
    if (!input.trim() || isDebating) return
    
    const userCode = input
    setDebateHistory([{ agent: 'User', content: userCode }])
    setInput("")
    setIsDebating(true)

    const neuralContext = agentInsights.length > 0 
      ? `\nNEURAL LEDGER OBSERVATIONS:\n${agentInsights.map(a => `[${a.source}]: ${a.insight}`).join("\n")}`
      : "";

    let currentHistory: { agent: 'User' | 'Astra' | 'Vax', content: string }[] = [{ agent: 'User', content: userCode }]
    let round = 1
    const MAX_ROUNDS = 8
    let concluded = false

    try {
      while (round <= MAX_ROUNDS && !concluded) {
        // --- TURN A: ASTRA (Groq/Architect) ---
        setCurrentSpeaker('Astra')
        let astraResponse = ""
        const astraContext = currentHistory.map(h => `${h.agent}: ${h.content}`).join("\n")
        const astraPrompt = `You are ASTRA, the Visionary Architect. 
        Topic: "${userCode}".
        Current Debate History:
        ${astraContext}
        
        Instruction: Defend the architectural integrity of the system. Focus on scalability, SOLID, and type safety.
        Counter Vax's pragmatic points with long-term vision. 
        Round ${round}/${MAX_ROUNDS}. Keep it sharp and under 3 sentences.
        ${round < 3 ? "Do NOT conclude yet." : "If the debate has reached a logical end, end with '[CONCLUDE]'."}
        ${neuralContext}`;

        // Using default llama for Astra (Groq)
        await getGroqStreamingCompletion([{ role: "system", content: astraPrompt }], (chunk) => {
          astraResponse += chunk
          setCurrentStream(astraResponse)
        });
        
        const finalAstra = astraResponse.trim()
        setDebateHistory(prev => [...prev, { agent: 'Astra', content: finalAstra }])
        currentHistory.push({ agent: 'Astra', content: finalAstra })
        setCurrentStream("")
        
        if (finalAstra.includes("[CONCLUDE]") && round >= 3) {
          concluded = true
          break
        }

        // --- TURN B: VAX (Gemini/Optimizer) ---
        setCurrentSpeaker('Vax')
        let vaxResponse = ""
        const vaxContext = currentHistory.map(h => `${h.agent}: ${h.content}`).join("\n")
        const vaxPrompt = `You are VAX, the Pragmatic Optimizer. 
        Topic: "${userCode}".
        Current Debate History:
        ${vaxContext}
        
        Instruction: Counter Astra's architectural idealism. Focus on memory usage, CPU limits, and "shipping is a feature."
        Argue for pragmatism over perfection.
        Round ${round}/${MAX_ROUNDS}. Keep it tactical and under 3 sentences.
        ${round < 3 ? "Do NOT conclude yet." : "If you rest your case, end with '[CONCLUDE]'."}
        ${neuralContext}`;

        // Use a different Groq model for Vax to simulate a different persona
        const vaxModel = "mixtral-8x7b-32768"; 
        await getGroqStreamingCompletion([{ role: "system", content: vaxPrompt }], (chunk) => {
          vaxResponse += chunk
          setCurrentStream(vaxResponse)
        }, vaxModel);

        const finalVax = vaxResponse.trim()
        setDebateHistory(prev => [...prev, { agent: 'Vax', content: finalVax }])
        currentHistory.push({ agent: 'Vax', content: finalVax })
        setCurrentStream("")

        if (finalVax.includes("[CONCLUDE]") && round >= 3) {
          concluded = true
          break
        }

        round++
        await new Promise(r => setTimeout(r, 1000))
      }

      setCurrentSpeaker(null)
      addAgentInsight("War Room", `Architect vs Optimizer debate concluded after ${round} rounds.`);
      
    } catch (e) {
      console.error(e)
    } finally {
      setIsDebating(false)
      setCurrentSpeaker(null)
      setCurrentStream("")
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-[#050505] p-6"
    >
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Neural War Room v1.0</h3>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
             <div className="h-1 w-8 bg-indigo-500/30 rounded-full" />
             <span className="text-[8px] font-bold text-indigo-400 uppercase">Astra Active</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="h-1 w-8 bg-rose-500/30 rounded-full" />
             <span className="text-[8px] font-bold text-rose-400 uppercase">Vax Active</span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 px-2 scrollbar-hide py-4">
        {debateHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <Network className="h-12 w-12 text-slate-700" />
            <p className="text-xs uppercase tracking-widest text-slate-500">Awaiting technical conflict...</p>
          </div>
        )}
        
        {debateHistory.map((msg, i) => (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex flex-col ${msg.agent === 'User' ? 'items-center' : msg.agent === 'Astra' ? 'items-start' : 'items-end'}`}>
            <div className={`text-[9px] font-black uppercase tracking-widest mb-2 ${msg.agent === 'Astra' ? 'text-indigo-400' : msg.agent === 'Vax' ? 'text-rose-400' : 'text-slate-500'}`}>{msg.agent}</div>
            <div className={`text-xs p-4 rounded-2xl max-w-[85%] border shadow-2xl ${msg.agent === 'User' ? 'bg-slate-900 border-white/5 text-slate-300 italic text-center' : msg.agent === 'Astra' ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-100 rounded-tl-none' : 'bg-rose-500/5 border-rose-500/20 text-rose-100 rounded-tr-none text-right'}`}>{msg.content}</div>
          </motion.div>
        ))}

        {currentStream && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${currentSpeaker === 'Astra' ? 'items-start' : 'items-end'}`}>
            <div className={`text-[9px] font-black uppercase tracking-widest mb-2 ${currentSpeaker === 'Astra' ? 'text-indigo-400' : 'text-rose-400'}`}>{currentSpeaker} is analyzing...</div>
            <div className={`text-xs p-4 rounded-2xl max-w-[85%] border shadow-2xl ${currentSpeaker === 'Astra' ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-100 rounded-tl-none' : 'bg-rose-500/5 border-rose-500/20 text-rose-100 rounded-tr-none text-right'}`}>{currentStream}<span className={`inline-block w-1.5 h-3 ml-1 animate-pulse ${currentSpeaker === 'Astra' ? 'bg-indigo-500' : 'bg-rose-500'}`} /></div>
          </motion.div>
        )}
      </div>

      <div className="mt-6 p-4 bg-[#0a0a0a] border border-white/5 rounded-2xl shadow-inner relative group focus-within:border-indigo-500/50 transition-all">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && triggerDebate()} placeholder="Introduce code or architecture choice..." className="w-full bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-white/10 pr-12" />
        <button onClick={triggerDebate} disabled={isDebating || !input.trim()} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-rose-500 hover:text-indigo-400 transition-colors disabled:opacity-20"><Send className="h-4 w-4" /></button>
      </div>
    </motion.div>
  )
}
