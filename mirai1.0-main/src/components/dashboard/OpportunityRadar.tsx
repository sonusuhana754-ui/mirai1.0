"use client"

import { motion } from "framer-motion"

interface OpportunityRadarProps {
  score: number
  skills: { name: string; value: number }[]
  color?: string
}

export default function OpportunityRadar({ score, skills, color = "#6366f1" }: OpportunityRadarProps) {
  // Simple Radar implementation with SVG
  const points = skills.map((s, i) => {
    const angle = (i / skills.length) * 2 * Math.PI - Math.PI / 2
    const radius = s.value * 0.8 // scale to 80% of container
    const x = 50 + radius * Math.cos(angle)
    const y = 50 + radius * Math.sin(angle)
    return `${x},${y}`
  }).join(" ")

  return (
    <div className="relative h-48 w-48 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-12">
        {/* Background Grid */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((r) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r * 40}
            fill="none"
            stroke="white"
            strokeOpacity="0.05"
            strokeWidth="0.5"
          />
        ))}

        {/* Skill Axis Lines */}
        {skills.map((_, i) => {
          const angle = (i / skills.length) * 2 * Math.PI - Math.PI / 2
          return (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 40 * Math.cos(angle)}
              y2={50 + 40 * Math.sin(angle)}
              stroke="white"
              strokeOpacity="0.1"
              strokeWidth="0.5"
            />
          )
        })}

        {/* Radar Path */}
        <motion.polygon
          points={points}
          fill={color}
          fillOpacity="0.2"
          stroke={color}
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Skill Points Overlay */}
        {skills.map((s, i) => {
            const angle = (i / skills.length) * 2 * Math.PI - Math.PI / 2
            const radius = s.value * 0.8
            const x = 50 + radius * Math.cos(angle)
            const y = 50 + radius * Math.sin(angle)
            return (
                <circle key={i} cx={x} cy={y} r="1.5" fill={color} />
            )
        })}
      </svg>

      {/* Center Score */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-black text-white leading-none">{score}%</span>
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Readiness</span>
      </div>
      
      {/* Skill Labels around the radar */}
      {skills.map((s, i) => {
        const angle = (i / skills.length) * 2 * Math.PI - Math.PI / 2
        const x = 50 + 48 * Math.cos(angle)
        const y = 50 + 48 * Math.sin(angle)
        return (
          <div 
            key={i} 
            className="absolute text-[7px] font-black text-slate-500 uppercase tracking-tighter w-12 text-center"
            style={{ 
              left: `${x}%`, 
              top: `${y}%`, 
              transform: 'translate(-50%, -50%)' 
            }}
          >
            {s.name}
          </div>
        )
      })}
    </div>
  )
}
