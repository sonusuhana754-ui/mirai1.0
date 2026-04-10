"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, Loader2, Code2, AlertTriangle, UserCircle, Cpu, Zap, Lightbulb, HelpCircle, BrainCircuit } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMiraiStore } from "@/lib/store"
import { getGroqStreamingCompletion } from "@/lib/groq"

interface AIAssistantSidebarProps {
  code: string;
  language: string;
}

export default function AIAssistantSidebar({ code, language }: AIAssistantSidebarProps) {
  const { struggleScore, personality, addAgentInsight, proactiveHintTrigger, lastActionLine, agentInsights } = useMiraiStore()
  const [input, setInput] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [isProactive, setIsProactive] = useState(false)
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'assistant', content: string}[]>([])
  const [currentStream, setCurrentStream] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatHistory, currentStream])

  const handleSend = async (forcedInput?: string) => {
    const userMessage = forcedInput || input
    if (!userMessage.trim() || isThinking) return

    if (!forcedInput) setInput("")
    
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }])
    setIsThinking(true)
    setCurrentStream("")

    // REVERSE LEARNING PROMPT LOGIC
    const systemPrompt = `You are the Mirai Reverse Learning Mentor. 
    Personality: ${personality}. 
    Current User Struggle Score: ${struggleScore}/100.

    RULES FOR REVERSE LEARNING:
    1. NEVER give the full solution immediately.
    2. SOCRATIC METHOD: Ask questions that guide the user to the answer.
    3. HINTING: If the user asks for a hint or struggleScore > 60, provide a CONCEPTUAL HINT.
    4. CODE SNIPPETS: Only provide small syntax examples. Avoid logic-heavy snippets unless struggleScore > 85.
    5. IDENTIFY CONCEPTS: Explicitly name the coding concepts involved (e.g., "Closure", "Box Model", "Flexbox").
    6. REVERSAL: Ask the user "What do you think happens if we change X?" or "Why did you choose this approach?"
    
    CROSS-AGENT NEURAL CONTEXT:
    Other agents in the Grooming Lab have observed the following:
    ${agentInsights.length > 0 ? agentInsights.map(a => `[${a.source}]: ${a.insight}`).join("\n") : "No shared insights yet."}
    
    Instruction: Reference these findings if they are relevant to the current user struggle. It makes the system feel unified.

    Context:
    \`\`\`${language}
    ${code}
    \`\`\``

    try {
      let fullResponse = ""
      await getGroqStreamingCompletion([
        { role: "system", content: systemPrompt },
        ...chatHistory,
        { role: "user", content: userMessage }
      ], (chunk) => {
        fullResponse += chunk
        setCurrentStream(fullResponse)
      })
      
      setChatHistory(prev => [...prev, { role: 'assistant', content: fullResponse }])
      addAgentInsight("Mentor", `Diagnostic query handled at ${struggleScore}% struggle.`);
    } catch (e: any) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: `🚨 Neural Link Error: ${e.message}` }])
    } finally {
      setIsThinking(false)
      setIsProactive(false)
      setCurrentStream("")
    }
  }

  const handleProactiveHint = async () => {
    if (isThinking) return
    setIsThinking(true)
    setIsProactive(true)
    setCurrentStream("")

    const observerPrompt = `You are the Mirai Neural Observer. 
    The user has been significantly stalled on line ${lastActionLine} for 15+ seconds while writing ${language.toUpperCase()}.
    Analyze the surrounding context and offer a very short, Socratic clue (1-2 sentences) to help them move forward.
    DO NOT provide the final code solution. Use the Reverse Learning method.
    
    Context:
    \`\`\`${language}
    ${code}
    \`\`\``

    try {
      let fullResponse = ""
      await getGroqStreamingCompletion([
        { role: "system", content: observerPrompt }
      ], (chunk) => {
        fullResponse += chunk
        setCurrentStream(fullResponse)
      })
      
      setChatHistory(prev => [...prev, { role: 'assistant', content: fullResponse }])
      addAgentInsight("Observer", `Proactive hint delivered for line ${lastActionLine}.`);
    } catch (e: any) {
      // silent fail for proactive
    } finally {
      setIsThinking(false)
      setIsProactive(false)
      setCurrentStream("")
    }
  }

  useEffect(() => {
    if (proactiveHintTrigger > 0) {
      handleProactiveHint()
    }
  }, [proactiveHintTrigger])

  const handleHintRequest = () => {
    handleSend("Can you give me a small hint on what to do next? Don't give me the code, just a nudge.")
  }

  return (
    <div className="flex flex-col h-full bg-[#011627] relative overflow-hidden">
      
      {/* Header */}
      <div className="h-10 flex flex-shrink-0 items-center justify-between px-4 border-b border-[#1e2a35] bg-[#011627] z-20">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-[#82aaff]" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#4b6479]">Reverse Learning</span>
        </div>
        <div className="flex items-center gap-2">
           <div className={`h-1.5 w-1.5 rounded-full ${struggleScore > 60 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
           <span className="text-[9px] font-bold text-[#4b6479]">{struggleScore}% STRETCH</span>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide bg-[#01111d]">
        <AnimatePresence>
          {chatHistory.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-12 px-4"
            >
              <div className="h-12 w-12 rounded-2xl bg-[#82aaff]/10 border border-[#82aaff]/20 flex items-center justify-center mx-auto mb-4">
                <Bot className="h-6 w-6 text-[#82aaff]" />
              </div>
              <h3 className="text-[#d6deeb] text-[12px] font-bold uppercase tracking-widest mb-2">Mentor Initialized</h3>
              <p className="text-[11px] text-[#4b6479] leading-relaxed">
                I'm tracking your struggle score. I won't give you the answers, but I'll teach you how to find them.
              </p>
              <button 
                onClick={() => handleSend("I'm ready. Analyze my current code and ask me a diagnostic question.")}
                className="mt-6 px-4 py-2 bg-[#82aaff]/10 border border-[#82aaff]/20 rounded-lg text-[10px] font-bold text-[#82aaff] hover:bg-[#82aaff]/20 transition-all uppercase tracking-widest"
              >
                Begin Session
              </button>
            </motion.div>
          ) : (
            <>
              {chatHistory.map((msg, i) => (
                <motion.div initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }} animate={{ opacity: 1, x: 0 }} key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1 text-[9px] font-bold uppercase tracking-widest text-[#4b6479]">
                    {msg.role === 'user' ? 'Aspirant' : 'Mentor'}
                  </div>
                  <div className={`text-[12px] leading-relaxed p-3 rounded-xl max-w-[90%] ${
                    msg.role === 'user' 
                    ? 'bg-[#1d3b53] text-[#d6deeb] border border-[#2d4b63]' 
                    : 'bg-[#0b2942] text-[#8fa7b8] border border-[#1e2a35] whitespace-pre-wrap'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              
              {(isThinking || currentStream) && (
                <div className="flex flex-col items-start">
                  <div className={`flex items-center gap-2 mb-1 text-[9px] font-bold uppercase tracking-widest ${isProactive ? 'text-rose-500' : 'text-[#82aaff]'}`}>
                    <Loader2 className={`h-3 w-3 ${isProactive ? '' : 'animate-spin'}`} />
                    {isProactive ? 'Neural Observer Pulse' : 'Analyzing Pulse'}
                  </div>
                  <div className={`text-[12px] p-3 rounded-xl border whitespace-pre-wrap leading-relaxed max-w-[90%] min-h-[40px] ${
                    isProactive 
                    ? 'bg-rose-500/5 border-rose-500/20 text-rose-200' 
                    : 'bg-[#0b2942] border-[#1e2a35] text-[#8fa7b8]'
                  }`}>
                    {currentStream}
                    <span className={`inline-block w-1.5 h-3 ml-1 animate-pulse ${isProactive ? 'bg-rose-500' : 'bg-[#82aaff]'}`} />
                  </div>
                </div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Control Area */}
      <div className="p-4 bg-[#011627] border-t border-[#1e2a35]">
        <div className="flex gap-2 mb-3">
           <button 
             onClick={handleHintRequest}
             className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-500/10 border border-indigo-400/20 rounded-lg text-[10px] font-bold text-indigo-400 hover:bg-indigo-500/20 transition-all uppercase tracking-widest"
           >
             <Lightbulb className="h-3 w-3" />
             Small Hint
           </button>
           <button 
             onClick={() => handleSend("Explain the core concepts I'm currently using.")}
             className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500/10 border border-emerald-400/20 rounded-lg text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all uppercase tracking-widest"
           >
             <HelpCircle className="h-3 w-3" />
             Concepts
           </button>
        </div>
        <div className="relative group">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Talk to your growth coach..." 
            className="w-full bg-[#0b2942] border border-[#1e2a35] rounded-xl pl-4 pr-12 py-3 text-[12px] text-[#d6deeb] placeholder:text-[#4b6479] focus:outline-none focus:border-[#82aaff]/40 transition-all resize-none h-16 scrollbar-hide"
          />
          <button 
            onClick={() => handleSend()}
            disabled={isThinking || !input.trim()}
            className="absolute right-3 bottom-3 p-1.5 bg-[#82aaff] hover:bg-[#a9c9ff] disabled:opacity-30 text-[#011627] rounded-lg transition-all"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
