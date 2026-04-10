"use client"

import React from "react"
import { motion } from "framer-motion"

export default function MiraiBot() {
  return (
    <div className="relative w-32 h-32 md:w-48 md:h-48 group">
      {/* Glow Aura */}
      <div className="absolute inset-0 bg-emerald-500/20 blur-[64px] rounded-full group-hover:bg-emerald-500/40 transition-all duration-700" />
      
      {/* Bot Body Container */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Main Head Unit */}
        <div className="w-24 h-24 md:w-36 md:h-36 bg-slate-900 border-2 border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Internal Circuit Decoration */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:200%_200%] animate-gradient" />
          
          {/* Screen / Face Area */}
          <div className="absolute inset-2 bg-black/80 rounded-[1.5rem] flex items-center justify-center border border-white/5">
            <div className="flex gap-4">
              {/* Left Eye */}
              <motion.div
                animate={{
                  scaleY: [1, 1, 0.1, 1, 1],
                  opacity: [1, 1, 0.5, 1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  times: [0, 0.45, 0.5, 0.55, 1],
                }}
                className="w-3 h-3 md:w-4 md:h-4 bg-emerald-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)]"
              />
              {/* Right Eye */}
              <motion.div
                animate={{
                  scaleY: [1, 1, 0.1, 1, 1],
                  opacity: [1, 1, 0.5, 1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  times: [0, 0.45, 0.5, 0.55, 1],
                }}
                className="w-3 h-3 md:w-4 md:h-4 bg-emerald-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)]"
              />
            </div>
            
            {/* Thinking Pulse */}
            <motion.div
              animate={{
                opacity: [0, 0.3, 0],
                scale: [0.8, 1.1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 bg-emerald-500/5 rounded-[1.5rem]"
            />
          </div>
        </div>

        {/* Small Floating Satellites */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-500 rounded-lg border border-white/20 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-500 rounded-full border border-white/20 shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
        </motion.div>
      </motion.div>

      {/* Shadow */}
      <motion.div
        animate={{
          scale: [0.8, 1, 0.8],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full blur-xl"
      />
    </div>
  )
}
