"use client"

import Editor from "@monaco-editor/react"
import { Monitor, Cpu, Sparkles, Play } from "lucide-react"
import { useMiraiStore } from "@/lib/store"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface CodeEditorPanelProps {
  code: string;
  language: string;
  onChange: (value: string | undefined) => void;
}

export default function CodeEditorPanel({ code, language, onChange }: CodeEditorPanelProps) {
  const { personality, struggleScore, logKeyPress, logDelete, triggerExecution, setLastAction, triggerProactiveHint, lastActionTimestamp } = useMiraiStore()
  const editorRef = useRef<any>(null)
  const [currentLine, setCurrentLine] = useState(1)

  const handleEditorChange = (value: string | undefined) => {
    // Reset activity timer on any change
    setLastAction(currentLine, Date.now())
    
    if (value) {
      if (value.length < code.length) {
        logDelete()
      } else {
        logKeyPress(Date.now())
      }
    }
    onChange(value)
  }

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    
    // Listen for cursor position changes
    editor.onDidChangeCursorPosition((e: any) => {
      const newLine = e.position.lineNumber
      setCurrentLine(newLine)
      // Reset timer on cursor move
      setLastAction(newLine, Date.now())
    })
  }

  // 15-SECOND PROACTIVE HINT LOGIC
  useEffect(() => {
    const checkInactivity = setInterval(() => {
      const now = Date.now()
      const diff = now - lastActionTimestamp
      
      if (diff >= 15000 && diff < 16000) { // Check for the 15s window (prevent double firing)
        triggerProactiveHint(currentLine)
      }
    }, 1000)

    return () => clearInterval(checkInactivity)
  }, [lastActionTimestamp, currentLine])

  // Night Owl Theme Definition Logic
  const beforeMount = (monaco: any) => {
    monaco.editor.defineTheme('night-owl', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '637777', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c792ea' },
        { token: 'operator', foreground: 'c792ea' },
        { token: 'string', foreground: 'ecc48d' },
        { token: 'function', foreground: '82aaff' },
        { token: 'number', foreground: 'f78c6c' },
        { token: 'tag', foreground: '7fdbca' },
      ],
      colors: {
        'editor.background': '#011627',
        'editor.foreground': '#d6deeb',
        'editor.lineHighlightBackground': '#010e17',
        'editorCursor.foreground': '#80a4c2',
        'editorLineNumber.foreground': '#4b6479',
        'editor.selectionBackground': '#1d3b53',
        'editorIndentGuide.background': '#5e81ce52',
      }
    });
  }

  return (
    <div className="flex flex-col h-full bg-[#011627] relative overflow-hidden group border-x border-[#1e2a35]">
      
      <div className="flex items-center justify-between h-10 px-4 border-b border-white/5 bg-[#011627] z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Monitor className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{language}</span>
          </div>
          
          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <Cpu className="h-3 w-3 text-indigo-400" />
            <span className="text-[10px] text-slate-500 font-bold tracking-tight uppercase">
              Pulse: {personality}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {struggleScore > 70 && (
            <div className="flex items-center gap-2 px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded">
              <Sparkles className="h-3 w-3 text-rose-500 animate-pulse" />
              <span className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter">Struggle</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 w-full relative z-20">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="night-owl"
          beforeMount={beforeMount}
          loading={<div className="h-full w-full flex items-center justify-center text-[#4b6479] text-xs font-mono uppercase tracking-[0.3em]">Igniting Engine...</div>}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 },
            fontFamily: "'JetBrains Mono', monospace",
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            cursorStyle: 'line',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            }
          }}
        />
        
        {/* Floating Run Button */}
        <motion.button
          whileHover={{ scale: 1.05, x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={triggerExecution}
          className="absolute bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-[#82aaff] text-[#011627] rounded-full shadow-[0_10px_30px_rgba(130,170,255,0.3)] group hover:bg-[#a9c9ff] transition-colors"
        >
          <Play className="h-4 w-4 fill-current" />
          <span className="text-[11px] font-black uppercase tracking-widest overflow-hidden block max-w-0 group-hover:max-w-[100px] transition-all duration-500 whitespace-nowrap">
            Run Code
          </span>
        </motion.button>
      </div>
    </div>
  )
}
