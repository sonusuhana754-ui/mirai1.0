"use client"

import { useState, useEffect, useRef } from "react"
import { Terminal as TerminalIcon, Play, Trash2, Maximize2, Hash, Power } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMiraiStore } from "@/lib/store"

interface TerminalPanelProps {
  code: string;
  language: string;
}

export default function TerminalPanel({ code, language }: TerminalPanelProps) {
  const [logs, setLogs] = useState<{type: string, message: string, id: number}[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { executionTrigger } = useMiraiStore()
  const initialRender = useRef(true)

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }
    executeCode()
  }, [executionTrigger])

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs])

  const executeRemote = async () => {
    try {
      setLogs(prev => [...prev, { type: 'system', message: `> Establishing Neural Link: Analyzing ${language.toUpperCase()} logic stream...`, id: Date.now() + 1 }])
      
      const res = await fetch('/api/simulate-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      })

      if (!res.ok) throw new Error("Neural Link Divergence: Simulation cluster unreachable.")
      const data = await res.json()

      if (data.stderr) {
         setLogs(prev => [...prev, { type: 'error', message: data.stderr, id: Date.now() + 2 }])
      }
      
      if (data.stdout) {
         setLogs(prev => [...prev, { type: 'log', message: data.stdout, id: Date.now() + 3 }])
      } else if (!data.stderr) {
         setLogs(prev => [...prev, { type: 'system', message: '[Neural execution complete: Void return]', id: Date.now() + 6 }])
      }

      if (data.explanation) {
        setLogs(prev => [...prev, { type: 'system', message: `> Neural Insight: ${data.explanation}`, id: Date.now() + 8 }])
      }

    } catch (err: any) {
      setLogs(prev => [...prev, { type: 'error', message: `ENGINE CRITICAL: ${err.message}`, id: Date.now() + 7 }])
    } finally {
      setIsRunning(false)
    }
  }

  const executeCode = () => {
    setIsRunning(true)
    setLogs(prev => [...prev, { type: 'system', message: `--- Mirai Terminal Session Initiated ---`, id: Date.now() }])
    executeRemote()
  }

  return (
    <div className="flex flex-col h-full bg-[#020205] backdrop-blur-3xl font-mono relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex items-center justify-between h-10 px-6 glass-panel border-b border-white/5 bg-black/40">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-white border-b border-indigo-500 pb-3 translate-y-2">
            <Hash className="h-3 w-3 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Main Console</span>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={executeCode} 
            disabled={isRunning} 
            className="group flex items-center gap-2 px-4 py-1.5 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 text-indigo-400 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
          >
            <Play className={`h-3 w-3 ${isRunning ? 'animate-pulse' : ''}`} />
            {isRunning ? 'Executing...' : 'Run Script'}
          </button>
          
          <div className="h-4 w-px bg-white/5" />
          
          <div className="flex items-center gap-1">
            <button onClick={() => setLogs([])} className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-colors">
              <Trash2 className="h-3 w-3" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-colors">
              <Maximize2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Scrollable Logs Area */}
      <div className="flex-1 overflow-y-auto p-8 text-[12px] leading-relaxed bg-black/40 scrollbar-hide">
        <div className="flex items-center gap-3 mb-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
          <Power className="h-3 w-3" />
          <span>System Log Stream v3.0</span>
        </div>

        <div className="space-y-4">
          {logs.map((log) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              key={log.id} 
              className="flex gap-4 group"
            >
              <span className={`select-none font-black ${
                log.type === 'error' ? 'text-rose-900' :
                log.type === 'system' ? 'text-indigo-900' :
                'text-white/10'
              }`}>
                0x{log.id.toString(16).slice(-4)}
              </span>
              <span className={`flex-1 break-words whitespace-pre-wrap ${
                log.type === 'error' ? 'text-rose-400' :
                log.type === 'system' ? 'text-indigo-400 font-black' :
                'text-emerald-300'
              }`}>
                {log.message}
              </span>
            </motion.div>
          ))}
          {isRunning && (
            <div className="flex gap-4 text-[#82aaff] animate-pulse">
              <span className="select-none font-black">....</span>
              <span className="font-black italic">Neural Engine analyzing logic buffer...</span>
            </div>
          )}
        </div>
        <div ref={bottomRef} className="h-8" />
      </div>

      {/* Footer Connectivity Bar */}
      <div className="h-6 flex items-center px-6 bg-black/60 border-t border-white/5 text-[8px] font-black uppercase tracking-[0.2em] text-white/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className={`h-1.5 w-1.5 rounded-full ${isRunning ? 'bg-[#82aaff] animate-ping' : 'bg-emerald-500 shadow-[0_0_5px_#10b981]'}`} />
            <span>Connection: Mirai-Neural-V1</span>
          </div>
          <div className="h-2 w-px bg-white/10" />
          <span>Latency: 42ms</span>
          <div className="h-2 w-px bg-white/10" />
          <span>Env: Mirai-Obsidian-Core</span>
        </div>
      </div>
    </div>
  )
}
