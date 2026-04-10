"use client"

import { useState, useEffect } from "react"
import CodeEditorPanel from "@/components/studio/CodeEditorPanel"
import AIAssistantSidebar from "@/components/studio/AIAssistantSidebar"
import UnifiedOutputPanel from "@/components/studio/UnifiedOutputPanel"
import { useMiraiStore } from "@/lib/store"
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels"
import { 
  ChevronRight,
  Code2,
  Cpu
} from "lucide-react"

const LANGUAGES = [
  { id: "html", name: "HTML" },
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "python", name: "Python" },
  { id: "cpp", name: "C++" },
  { id: "java", name: "Java" },
]

const TEMPLATES: Record<string, string> = {
  html: `<html>\n  <head>\n    <style>\n      body { background: #011627; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: 'Inter', sans-serif; }\n      .card { padding: 3rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 2rem; backdrop-filter: blur(20px); text-align: center; }\n      h1 { font-size: 3rem; color: #82aaff; font-weight: 800; }\n      p { color: #4b6479; text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.8rem; }\n    </style>\n  </head>\n  <body>\n    <div class="card">\n      <h1>Studio 3.0</h1>\n      <p>A-B-C Layout Active</p>\n    </div>\n  </body>\n</html>`,
  javascript: 'console.log("Mirai Engine: Unified Logic Stream Attached.");\n',
  typescript: 'const engine: string = "Mirai Core";\nconsole.log(`Running on ${engine} v3.0`);',
  python: 'print("Mirai Subsystem: Python Runtime Connected.")',
}

export default function StudioPage() {
  const [language, setLanguage] = useState("html")
  const [code, setCode] = useState(TEMPLATES["html"])
  
  const { struggleScore, setStruggleScore, personality } = useMiraiStore()
  const [lastKeystrokeTime, setLastKeystrokeTime] = useState(Date.now())

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang)
    setCode(TEMPLATES[newLang] || "")
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const now = Date.now()
      const latency = now - lastKeystrokeTime
      if (code.length > 0 && code !== TEMPLATES[language]) {
        if (latency > 5000) {
          setStruggleScore(Math.min(100, struggleScore + 2))
        } else {
          setStruggleScore(Math.max(0, struggleScore - 1))
        }
      }
    }, 2000)
    setLastKeystrokeTime(Date.now())
    return () => clearTimeout(timer)
  }, [code])

  return (
    <div className={`flex flex-col w-full h-[calc(100vh-6rem)] bg-[#011627] text-[#d6deeb] overflow-hidden`}>
      
      {/* Top Breadcrumb / Language Bar */}
      <div className="h-10 flex-shrink-0 flex items-center px-6 bg-[#011627] border-b border-[#1e2a35] gap-4 z-40">
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#4b6479] uppercase tracking-widest">
           <Code2 className="h-4 w-4 text-[#82aaff]" />
           <span>Mirai Studio</span>
           <ChevronRight className="h-3 w-3 opacity-30" />
           <span className="text-[#82aaff]">v3.0 (3-Column Mode)</span>
        </div>

        <div className="ml-auto flex items-center gap-6">
           <div className="flex items-center gap-3">
              <span className="text-[9px] font-bold text-[#4b6479] uppercase tracking-tighter">Target:</span>
              <select 
                value={language} 
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-[#0b2942] border border-[#1e2a35] outline-none text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md text-[#82aaff] cursor-pointer"
              >
                {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
           </div>
           
           <div className="flex items-center gap-3 border-l border-white/5 pl-6">
              <Cpu className="h-3 w-3 text-indigo-400" />
              <span className="text-[9px] font-black uppercase text-[#4b6479]">Cognitive Load: <span className={struggleScore > 60 ? 'text-rose-500' : 'text-indigo-400'}>{struggleScore}%</span></span>
           </div>
        </div>
      </div>

      {/* 3-Column Horizontal Layout */}
      {/* @ts-ignore */}
      <PanelGroup direction="horizontal" className="flex-1">
        
        {/* Column A: AI Assisted Suggestions */}
        <Panel defaultSize={22} minSize={18} maxSize={35}>
          <div className="h-full bg-[#011627]">
            <AIAssistantSidebar code={code} language={language} />
          </div>
        </Panel>

        <CustomResizeHandle />

        {/* Column B: Actual Code Editor */}
        <Panel defaultSize={53} minSize={30}>
          <div className="h-full bg-[#010e17]">
             <CodeEditorPanel code={code} language={language} onChange={(val) => setCode(val || "")} />
          </div>
        </Panel>

        <CustomResizeHandle />

        {/* Column C: Live Output Preview */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full bg-[#011627]">
             <UnifiedOutputPanel code={code} language={language} />
          </div>
        </Panel>

      </PanelGroup>

      {/* Global Status Bar */}
      <div className="h-6 flex-shrink-0 bg-[#011627] border-t border-[#1e2a35] flex items-center px-6 gap-6 text-[8px] font-bold uppercase tracking-widest text-[#4b6479]">
         <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Studio Engine: Stable</span>
         </div>
         <div className="h-3 w-px bg-white/5" />
         <span>Mode: {personality}</span>
         <div className="ml-auto flex items-center gap-4">
            <span>Encoding: UTF-8</span>
            <span>Tab: 2 Spaces</span>
         </div>
      </div>

    </div>
  )
}

function CustomResizeHandle() {
  return (
    <PanelResizeHandle className="w-[1.5px] h-full bg-[#1e2a35] hover:bg-[#82aaff]/50 transition-colors group relative">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 bg-transparent group-hover:bg-[#82aaff]/30 rounded-full transition-all" />
    </PanelResizeHandle>
  )
}
