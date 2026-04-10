"use client"

import { useMiraiStore } from "@/lib/store"
import { motion, useAnimation } from "framer-motion"
import { Activity, AlertTriangle, TerminalSquare } from "lucide-react"
import { useEffect, useState } from "react"

export default function StruggleTelemetry() {
  const { struggleScore, keystrokeLatency, deleteFrequency, cognitiveMode } = useMiraiStore()
  const controls = useAnimation()
  const [dataPoints, setDataPoints] = useState<number[]>(Array(20).fill(10))

  useEffect(() => {
    setDataPoints(prev => {
      const next = [...prev.slice(1), struggleScore]
      return next
    })
    
    // Animate a heart-beat spike if struggle jumps
    if (struggleScore > 30) {
      controls.start({
        scale: [1, 1.1, 1],
        boxShadow: ["0 0 0 rgba(239, 68, 68, 0)", "0 0 20px rgba(239, 68, 68, 0.4)", "0 0 0 rgba(239, 68, 68, 0)"],
        transition: { duration: 0.5 }
      })
    }
  }, [struggleScore, controls])

  return (
    <motion.div animate={controls} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden">
      
      {/* Background Pulse if critical */}
      {struggleScore > 70 && (
        <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
      )}
      
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Activity className={`h-4 w-4 ${struggleScore > 50 ? 'text-red-500' : 'text-indigo-500'}`} />
          <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase">Live Telemetry</h3>
        </div>
        <div className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
          Cognitive Mode: {cognitiveMode.toUpperCase()}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 z-10">
        <div className="bg-black/50 p-3 rounded-lg border border-white/5 flex flex-col justify-between">
          <span className="text-[9px] text-slate-500 uppercase font-black">Strain Level</span>
          <span className={`text-xl font-bold tracking-tighter ${struggleScore > 50 ? 'text-red-400' : 'text-slate-200'}`}>
            {Math.round(struggleScore)}%
          </span>
        </div>
        
        <div className="bg-black/50 p-3 rounded-lg border border-white/5 flex flex-col justify-between">
          <span className="text-[9px] text-slate-500 uppercase font-black">Latency (ms)</span>
          <span className="text-xl font-bold tracking-tighter text-slate-200">{Math.round(keystrokeLatency)}</span>
        </div>

        <div className="bg-black/50 p-3 rounded-lg border border-white/5 flex flex-col justify-between">
          <span className="text-[9px] text-slate-500 uppercase font-black">Backtracks</span>
          <span className="text-xl font-bold tracking-tighter text-slate-200">{deleteFrequency}</span>
        </div>
      </div>

      {/* Real-time Graph SVG */}
      <div className="h-16 w-full mt-2 relative z-10">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <motion.polyline
            points={dataPoints.map((val, i) => `${(i / 19) * 100},${100 - val}`).join(" ")}
            fill="none"
            stroke={struggleScore > 50 ? "#ef4444" : "#6366f1"}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 1 }}
            animate={{ pathLength: 1 }}
            transition={{ type: "tween" }}
          />
        </svg>
      </div>

    </motion.div>
  )
}
