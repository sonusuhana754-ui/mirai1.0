"use client"

import { useMiraiStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, AlertCircle, CheckCircle, Bug, SearchCode, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface MentorProps {
  code: string;
}

export default function InlineCodeMentor({ code }: MentorProps) {
  const { struggleScore, personality } = useMiraiStore()
  const [feedback, setFeedback] = useState<{ line: number, message: string } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (struggleScore > 60 && code && !feedback && !isAnalyzing) {
      analyzeCode()
    }
  }, [struggleScore, code])

  const analyzeCode = async () => {
    setIsAnalyzing(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "system",
            content: `You are an inline code mentor. Analyze the user's code. If there's a logic error, bad practice, or missing feature based on HTML/CSS/JS, pinpoint it. Return ONLY a valid JSON object matching { "line": number, "message": "short 1 sentence feedback" }. The code is:\n\n${code}`
          }],
          model: "llama-3.3-70b-versatile",
          stream: false
        })
      });
      const data = await res.json();
      const content = data.choices[0].message.content;
      const jsonStr = content.slice(content.indexOf('{'), content.lastIndexOf('}') + 1);
      const parsed = JSON.parse(jsonStr);
      if (parsed.line && parsed.message) {
        setFeedback(parsed);
      }
    } catch {
      // silent catch for analysis failure
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (struggleScore < 60) return null

  const getPersonalityProps = () => {
    switch (personality) {
      case 'strict':
        return { 
          color: 'red', 
          border: 'border-red-500/30',
          bg: 'bg-red-500/10',
          textColor: 'text-red-400',
          icon: <AlertCircle className="h-4 w-4" />,
          message: "You're accumulating technical debt. De-couple this state block immediately."
        }
      case 'interviewer':
        return { 
          color: 'emerald', 
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-500/10',
          textColor: 'text-emerald-400',
          icon: <SearchCode className="h-4 w-4" />,
          message: "Are you sure this is O(1)? Walk me through your event loop logic."
        }
      case 'chill':
      default:
        return { 
          color: 'blue', 
          border: 'border-blue-500/30',
          bg: 'bg-blue-500/10',
          textColor: 'text-blue-400',
          icon: <Bug className="h-4 w-4" />,
          message: "Looks like a tricky bug! Check the dependency array in your React hook."
        }
    }
  }

  const props = getPersonalityProps()

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute z-[100] max-w-sm right-8"
        style={{ top: feedback?.line ? Math.min(Math.max((feedback.line * 19) - 10, 20), 400) + 'px' : '20px' }}
      >
        <div className={`backdrop-blur-md border ${props.border} ${props.bg} rounded-2xl p-4 shadow-2xl flex gap-3 relative`}>
          <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center border ${props.border} bg-[#0d0d0d] ${props.textColor} flex-shrink-0`}>
            {props.icon}
          </div>
          <div>
            <div className={`flex items-center gap-2 mb-1`}>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${props.textColor}`}>Mentor Intervention</span>
            </div>
            <p className="text-xs text-white leading-relaxed font-medium">
              {isAnalyzing ? <span className="flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin"/> Analyzing code logic...</span> : feedback ? feedback.message : props.message}
            </p>
            <div className="mt-3 flex gap-2">
              <button 
                onClick={analyzeCode}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-black bg-[#0d0d0d] border ${props.border} ${props.textColor} hover:bg-white/10 transition-colors`}
              >
                Forces Scan
              </button>
              <button onClick={() => setFeedback(null)} className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-black text-white hover:bg-white/10 transition-colors`}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
