"use client"

import LivePreviewPanel from "./LivePreviewPanel"
import TerminalPanel from "./TerminalPanel"
import { MonitorPlay, Terminal as TerminalIcon, Zap } from "lucide-react"

interface UnifiedOutputPanelProps {
  code: string;
  language: string;
}

export default function UnifiedOutputPanel({ code, language }: UnifiedOutputPanelProps) {
  const isWeb = language === "html"

  return (
    <div className="flex flex-col h-full bg-[#011627] border-l border-[#1e2a35] overflow-hidden">
      {/* Header */}
      <div className="h-10 flex flex-shrink-0 items-center justify-between px-4 bg-[#011627] border-b border-[#1e2a35] z-20">
        <div className="flex items-center gap-2">
          {isWeb ? (
            <MonitorPlay className="h-4 w-4 text-emerald-400" />
          ) : (
            <TerminalIcon className="h-4 w-4 text-indigo-400" />
          )}
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#4b6479]">
            {isWeb ? "Live Workspace Preview" : "Engine Output Stream"}
          </span>
        </div>
        <div className="flex items-center gap-2">
           <Zap className={`h-3 w-3 ${isWeb ? 'text-emerald-400' : 'text-indigo-400'} animate-pulse`} />
           <span className="text-[9px] font-bold text-[#4b6479] uppercase tracking-tighter">Runtime Active</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full bg-[#010e17]">
        {isWeb ? (
          <LivePreviewPanel code={code} />
        ) : (
          <TerminalPanel code={code} language={language} />
        )}
      </div>
    </div>
  )
}
