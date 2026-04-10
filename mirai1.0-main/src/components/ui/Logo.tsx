"use client"

import { Hexagon } from "lucide-react"

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5 group">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/30 blur-md rounded-full group-hover:bg-emerald-500/50 transition-all duration-500" />
        <Hexagon className="relative h-7 w-7 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[8px] font-black text-white leading-none">M</span>
        </div>
      </div>
      <span className="text-xl font-black text-white tracking-tight group-hover:text-emerald-100 transition-colors duration-300">
        Mirai
      </span>
    </div>
  )
}
