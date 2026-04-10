"use client"

import { useState, useEffect } from "react"
import { Maximize2, RotateCw } from "lucide-react"

interface LivePreviewPanelProps {
  code: string;
}

export default function LivePreviewPanel({ code }: LivePreviewPanelProps) {
  const [debouncedCode, setDebouncedCode] = useState(code)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCode(code)
    }, 500)
    return () => clearTimeout(timer)
  }, [code])

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      <div className="flex items-center justify-between h-9 px-4 border-b border-gray-200 bg-gray-50/80 backdrop-blur-sm absolute top-0 w-full z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="text-[10px] font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest">
          <div className="flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
          </div>
          Live Runtime
        </div>
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-200 rounded text-gray-400 transition">
            <RotateCw className="h-3 w-3" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 w-full bg-white">
        <iframe
          srcDoc={debouncedCode}
          title="Live Preview"
          sandbox="allow-scripts"
          className="w-full h-full border-none"
        />
      </div>
    </div>
  )
}
