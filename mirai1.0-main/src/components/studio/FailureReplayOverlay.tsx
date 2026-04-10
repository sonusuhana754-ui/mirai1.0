"use client"

import { motion, AnimatePresence } from "framer-motion"
import { History, X, AlertTriangle, TrendingUp, Sparkles, Brain, Code } from "lucide-react"
import { useMiraiStore } from "@/lib/store"

interface FailureReplayOverlayProps {
  onClose: () => void
}

export default function FailureReplayOverlay({ onClose }: FailureReplayOverlayProps) {
  const { failureHistory, struggleScore } = useMiraiStore()

  const struggleData = failureHistory.length > 0 
    ? failureHistory.slice(-5).map((f, i) => ({
        time: new Date(f.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: f.error || "Logic Inconsistency",
        intensity: i % 2 === 0 ? "High" : "Medium",
        comment: "Detected pattern: " + (f.code.length > 500 ? "Complex logic hurdle" : "Syntax struggle"),
        code: f.code
      }))
    : [
        { time: "14:02", event: "Syntax Error: Unclosed <div>", intensity: "Low", comment: "Quick fix, but repeated 3 times. Focus on tags." },
        { time: "14:15", event: "Logical Loop: Infinite Fetch", intensity: "High", comment: "The Wall. You spent 12 minutes here. AI intervened with a nudge." },
        { time: "14:28", event: "Breakthrough: Logic Decoupling", intensity: "Medium", comment: "Significant improvement in architectural thinking." },
      ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
              <History className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-none mb-1 text-premium">Session Failure Replay</h2>
              <p className="text-xs text-slate-500 font-medium">Reflecting on your struggle patterns & breakthroughs</p>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors">
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Current Struggle</div>
              <div className={`text-lg font-black leading-none ${struggleScore > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                {struggleScore > 70 ? 'HIGH' : struggleScore > 40 ? 'MEDIUM' : 'LOW'}
              </div>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Failures Logged</div>
              <div className="text-lg font-black text-white leading-none">{failureHistory.length}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Growth Index</div>
              <div className="text-lg font-black text-emerald-400 leading-none">+{Math.floor(struggleScore / 5)}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Timeline */}
            <div className="space-y-4 relative">
              <div className="absolute left-[20px] top-2 bottom-2 w-px bg-slate-800" />
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                <Sparkles className="h-3 w-3 text-indigo-400" />
                Learning Timeline
              </div>

              {struggleData.map((item, idx) => (
                <div key={idx} className="relative flex gap-6 group">
                  <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center border-2 border-slate-900 z-10 flex-shrink-0
                    ${item.intensity === 'High' ? 'bg-red-500/20 text-red-400' : item.intensity === 'Medium' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                    {item.intensity === 'High' ? <AlertTriangle className="h-4 w-4" /> : item.intensity === 'Medium' ? <TrendingUp className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-500">{item.time}</span>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{item.event}</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-md">{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Code Diff Preview */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Code className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Failure Replay Code</h3>
              </div>
              <div className="flex-1 bg-slate-900 rounded-xl p-4 font-mono text-[10px] text-slate-400 overflow-hidden relative">
                <pre className="whitespace-pre-wrap">
                  {failureHistory.length > 0 
                    ? failureHistory[failureHistory.length - 1].code.substring(0, 500) + "..."
                    : "// No failures recorded yet."}
                </pre>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />
              </div>
              <p className="mt-4 text-[10px] text-slate-500 italic">
                AI Insight: You tend to struggle with asynchronous state updates. Focus on using useEffect cleanups.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-950/80 border-t border-slate-800/50 flex justify-end flex-shrink-0">
          <button 
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            I've Internalized These Lessons
          </button>
        </div>
      </motion.div>
    </div>
  )
}
