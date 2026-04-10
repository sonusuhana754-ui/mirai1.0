"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, MessageSquare, Mic, Send } from "lucide-react"
import { useMiraiStore } from "@/lib/store"
import { getGroqStreamingCompletion } from "@/lib/groq"

export default function AICompanion() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "I'm your Mirai AI Companion. Need help navigating the platform or debugging?" }
  ])
  const [isTyping, setIsTyping] = useState(false)
  
  const { personality, cognitiveMode, struggleScore } = useMiraiStore()

  const handleSend = async () => {
    if (!input.trim() || isTyping) return
    
    const userMsg = input
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }])
    setInput("")
    setIsTyping(true)
    
    const systemPrompt = `You are the Mirai Global AI Companion.
    Personality: ${personality}.
    User's Cognitive State: ${cognitiveMode} (Struggle Score: ${struggleScore}/100)
    
    Keep responses short, helpful, and conversational. Refer to the fact you are constantly monitoring their progress.`

    let currentResponse = ""
    setChatHistory(prev => [...prev, { role: 'assistant', content: "" }])
    
    try {
      await getGroqStreamingCompletion(
        [
          { role: 'system', content: systemPrompt },
          ...chatHistory,
          { role: 'user', content: userMsg }
        ] as any,
        (chunk) => {
          currentResponse += chunk
          setChatHistory(prev => {
            const newHistory = [...prev]
            newHistory[newHistory.length - 1].content = currentResponse
            return newHistory
          })
        }
      )
    } catch (e) {
      console.error(e)
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-80 shadow-2xl bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="h-12 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Bot className="h-3 w-3 text-indigo-400" />
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-widest">Mirai Link</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="h-96 p-4 overflow-y-auto space-y-4 scrollbar-hide text-sm">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-[#151515] border border-white/5 text-slate-300 rounded-tl-none'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#151515] border border-white/5 p-3 rounded-xl rounded-tl-none text-slate-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-[#0a0a0a] border-t border-white/5">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..." 
                  className="w-full bg-[#151515] border border-white/5 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button onClick={handleSend} className="absolute right-3 text-indigo-500 hover:text-indigo-400">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all transform hover:scale-110"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>
    </div>
  )
}
