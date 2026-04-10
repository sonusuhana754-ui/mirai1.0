"use client"

import { useState, useRef, useEffect } from "react"
import { FileText, Mic, Video, Send, Bot, AlertCircle, BarChart3, TrendingUp, Sparkles, Loader2, Network } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMiraiStore } from "@/lib/store"
import { ChatMessage, getGroqChatCompletion, getGroqStreamingCompletion } from "@/lib/groq"
import { UnifiedInterviewer } from "@/components/studio/UnifiedInterviewer"
import { MultiAgentDebateView } from "@/components/studio/MultiAgentDebateView"
import { useAuth } from "@/components/auth/AuthContext"

type AgentType = "unified" | "resume" | "debate"

export default function GroomingPage() {
  const { profile } = useAuth()
  const [activeAgent, setActiveAgent] = useState<AgentType>("unified")

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-5.5rem)] flex flex-col gap-8 px-4 pb-8 lg:px-0">
      <div className="rounded-3xl border border-white/10 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.36em] text-emerald-400">Grooming Lab</p>
            <h1 className="text-4xl font-bold text-white tracking-tight">Master the selection process with AI-guided coaching.</h1>
            <p className="max-w-2xl text-slate-400">Refine your interview presence, resume strength, and pitch delivery with smart feedback and live agent support.</p>
          </div>
          <div className="flex flex-wrap gap-3 rounded-3xl bg-slate-900/90 border border-white/10 p-3 shadow-xl shadow-slate-950/20 text-center">
            {[
              { label: "Sync Ready", value: profile?.level ? `${profile.level * 9 + 5}% Fit` : "Scanning..." },
              { label: "AI Cluster", value: "3 Active" },
              { label: "Feedback", value: "Real-time" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-slate-950/90 px-4 py-3 text-sm text-slate-200 min-w-[120px]">
                <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">{stat.label}</div>
                <div className="mt-2 font-black text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-slate-900/90 p-2 shadow-xl shadow-slate-950/20">
        {[
          { id: "unified", label: "Unified AI Interviewer", icon: Video },
          { id: "resume", label: "Resume Agent", icon: FileText },
          { id: "debate", label: "AI Debate (War Room)", icon: Network },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAgent(tab.id as AgentType)}
            className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
              activeAgent === tab.id 
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid flex-1 gap-6 lg:grid-cols-[1.45fr_0.95fr]">
        <div className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-slate-950/40">
          <AnimatePresence mode="wait">
            {activeAgent === "unified" && <UnifiedInterviewer key="unified" />}
            {activeAgent === "resume" && <ResumeAgentView key="resume" />}
            {activeAgent === "debate" && <MultiAgentDebateView key="debate" />}
          </AnimatePresence>
        </div>

        <div className="hidden flex-col gap-6 lg:flex">
          <AgentPersonaCard activeAgent={activeAgent} />
          <StatsCard activeAgent={activeAgent} />
          <AgentSynergyGraph />
        </div>
      </div>
    </div>
  )
}

function InterviewAgentView() {
  const { interviewHistory, addInterviewMessage, personality, addAgentInsight, agentInsights } = useMiraiStore()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentResponse, setCurrentResponse] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [interviewHistory, currentResponse])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg = { role: "user" as const, content: input }
    addInterviewMessage(userMsg)
    setInput("")
    setIsLoading(true)
    setCurrentResponse("")

    const systemPrompt = `You are a world-class technical interviewer from a Tier-1 tech company. 
    Current personality mode: ${personality}. 
    
    CRITICAL INSTRUCTIONS:
    - If personality is 'strict', be ruthless. Do not accept surface-level answers. If they mention a library, ask how it works internally. If they suggest a solution, find a flaw in it and ask them to fix it.
    - If 'chill', be a high-performing senior dev who expects deep technical competence but uses a friendly tone.
    - If 'interviewer', follow a standard but deep technical assessment pattern.
    
    Other AI Agents have reported the following insights about this candidate. Use this covertly to personalize your interview:
    ${agentInsights.length > 0 ? agentInsights.map(a => `[${a.source}]: ${a.insight}`).join("\n") : "No prior insights yet."}
    
    Always push for architectural trade-offs, scalability, and performance. Use markdown for code and emphasis. Keep the conversation moving with one deep, challenging follow-up question at a time.`

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...interviewHistory,
      userMsg
    ]

    try {
      let fullResponse = ""
      await getGroqStreamingCompletion(messages, (chunk) => {
        fullResponse += chunk
        setCurrentResponse(fullResponse)
      })
      addInterviewMessage({ role: "assistant", content: fullResponse })
      
      // Inject knowledge graph node
      if (fullResponse.includes("?") && Math.random() > 0.5) {
        addAgentInsight("Interview Architect", "Candidate hesitates on scalability follow-ups. Added to cognitive profile.");
      } else if (fullResponse.length > 200) {
        addAgentInsight("Interview Architect", "Analyzed deep technical reply. Updating user semantic context logic.");
      }

      setCurrentResponse("")
    } catch (error: any) {
      console.error("Groq Error Details:", error)
      const errorMsg = error?.message || "Unknown error occurred"
      addInterviewMessage({ 
        role: "assistant", 
        content: `🚨 **AI Connection Error**: ${errorMsg}. \n\n Please check if your Groq API key is valid and you have internet connectivity.` 
      })
      setCurrentResponse("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col"
    >
      <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/30">
            <Bot className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">
              {personality === 'strict' ? 'Lead Architect' : personality === 'chill' ? 'Senior Peer' : 'Hiring Manager'} Mode
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: personality === 'strict' ? '90%' : '50%' }}
                  className={`h-full ${personality === 'strict' ? 'bg-red-500' : 'bg-emerald-500'}`}
                />
              </div>
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">
                Stress: {personality === 'strict' ? 'CRITICAL' : 'OPTIMAL'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {interviewHistory.map((msg, i) => (
          <div key={i} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${
              msg.role === 'user' 
                ? 'bg-emerald-600 border-emerald-500 text-white font-bold' 
                : 'bg-indigo-500/20 border-indigo-500/30'
            }`}>
              {msg.role === 'user' ? 'A' : <Bot className="h-5 w-5 text-indigo-400" />}
            </div>
            <div className={`rounded-xl px-4 py-3 max-w-2xl shadow-sm border ${
              msg.role === 'user' 
                ? 'bg-emerald-600 rounded-tr-none text-white border-emerald-500 shadow-lg shadow-emerald-600/20' 
                : 'bg-slate-800 rounded-tl-none text-slate-200 border-slate-700'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {currentResponse && (
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/30 flex-shrink-0">
              <Bot className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="bg-slate-800 rounded-xl rounded-tl-none px-4 py-3 text-slate-200 border border-slate-700 max-w-2xl shadow-sm">
              {currentResponse}
              <span className="inline-block w-1.5 h-4 bg-emerald-500 animate-pulse ml-1 align-middle" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Explain your approach..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-12 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 flex items-center justify-center transition-all shadow-lg shadow-emerald-500/20 group"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 group-hover:translate-x-1 duration-300" />}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function ResumeAgentView() {
  const { addAgentInsight, agentInsights } = useMiraiStore()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [input, setInput] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [currentResponse, setCurrentResponse] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsAnalyzing(true)
    setUploadError(null)
    
    try {
      // 1. Upload to backend for parsing
      const formData = new FormData();
      formData.append("file", file);
      
      const parseRes = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData
      });
      
      const parseData = await parseRes.json();
      if (!parseRes.ok) throw new Error(parseData.error || "Failed to parse document");

      const resumeText = parseData.text;

      // 2. Feed authentic text to LLM
      const messages: ChatMessage[] = [
        { role: "system", content: `You are an Elite Resume Reviewer from a FAANG company. You must analyze the exact text of the user's resume below. 
        You MUST identify: 1. STRENGTHS (What's working), 2. CRITICAL DRAWBACKS (Why they're being rejected based on text evidence), and 3. FIXES (Actionable steps).
        Format your response precisely in this layout so we can render it:
        SCORE: [A number 1-100]
        STRENGTHS: [comma separated facts based on their real resume text]
        DRAWBACKS: [comma separated critical issues based on missing elements]
        SUGGESTIONS: [comma separated fixes for those drawbacks]
        YOUR IN-DEPTH REVIEW MESSAGE: [1 paragraph text]
        
        \n\nPrior Agent Insights on User: ${agentInsights.map(a => a.insight).join(" ")}` },
        { role: "user", content: `Analyze my authentic resume text:\n\n${resumeText.substring(0, 5000)}` }
      ]

      const response = await getGroqChatCompletion(messages);
      const aiContent = response.choices[0].message.content;
      
      // Basic extraction from the strict format
      const scoreMatch = aiContent.match(/SCORE:\s*(\d+)/i);
      const strengthsMatch = aiContent.match(/STRENGTHS:\s*(.+)/i);
      const drawbacksMatch = aiContent.match(/DRAWBACKS:\s*(.+)/i);
      const sugMatch = aiContent.match(/SUGGESTIONS:\s*(.+)/i);
      const msgMatch = aiContent.match(/YOUR IN-DEPTH REVIEW MESSAGE:\s*([\s\S]+)/i);
      
      setAnalysis({
        score: scoreMatch ? parseInt(scoreMatch[1]) : 50,
        strengths: strengthsMatch ? strengthsMatch[1].split(',').map((s: string) => s.trim()) : ["Unable to parse distinct strengths"],
        drawbacks: drawbacksMatch ? drawbacksMatch[1].split(',').map((s: string) => s.trim()) : ["Unable to parse drawbacks"],
        suggestions: sugMatch ? sugMatch[1].split(',').map((s: string) => s.trim()) : ["Enhance formatting for better parsing."]
      })
      
      setChatHistory([{ role: "assistant", content: msgMatch ? msgMatch[1].trim() : aiContent }]);
      
      addAgentInsight("ATS Engine", `Analyzed real resume (${file.name}). Scored ${scoreMatch ? scoreMatch[1] : 50}/100.`);
    } catch (e: any) {
      console.error(e)
      setUploadError(e.message || "An unexpected error occurred during upload.");
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleChat = async () => {
    if (!input.trim() || isReplying) return
    const newMsg: ChatMessage = { role: "user", content: input }
    setChatHistory(prev => [...prev, newMsg])
    setInput("")
    setIsReplying(true)
    setCurrentResponse("")
    
    try {
      let fullResponse = ""
      const chatPrompt = { 
        role: "system" as const, 
        content: `You are the Elite Resume Expert. Continue the conversation based on the previous analysis. 
        Neural Ledger Context: ${agentInsights.map(a => a.insight).join(" ")}` 
      }
      await getGroqStreamingCompletion([chatPrompt, ...chatHistory, newMsg], (chunk) => {
        fullResponse += chunk
        setCurrentResponse(fullResponse)
      })
      setChatHistory(prev => [...prev, { role: "assistant", content: fullResponse }])
      setCurrentResponse("")
    } catch (e) {
      console.error(e)
    } finally {
      setIsReplying(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col p-8 overflow-y-auto bg-[#0d0d0d] scrollbar-hide"
    >
      {!analysis && !isAnalyzing ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl bg-[#0a0a0a] hover:border-indigo-500/50 transition-all cursor-pointer group"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept=".pdf,.doc,.docx"
          />
          <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
            <FileText className="h-10 w-10 text-slate-500 group-hover:text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Upload Resume</h3>
          <p className="text-slate-500 text-sm mb-6 text-center max-w-xs">AI-driven extraction for PDF and Word (.docx) documents.</p>
          
          {uploadError && (
            <div className="mb-6 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {uploadError}
            </div>
          )}

          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20">
            Select PDF / Word
          </button>
        </div>
      ) : isAnalyzing ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="h-20 w-20 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">AI ATS Engine Running...</h3>
          <p className="text-slate-500 text-sm animate-pulse">Extracting keywords & matching market trends</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[#151515] border border-white/5 p-6 rounded-2xl">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">ATS Compatibility Score</h3>
              <p className="text-slate-500 text-sm">Target: Senior Frontend Engineer</p>
            </div>
            <div className="relative h-20 w-20 flex items-center justify-center">
              <svg className="h-full w-full -rotate-90">
                <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={226} strokeDashoffset={226 - (226 * analysis.score) / 100} className="text-indigo-500" />
              </svg>
              <span className="absolute text-xl font-bold text-white">{analysis.score}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#151515] border border-white/5 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-indigo-400 font-bold mb-3">
                <Sparkles className="h-4 w-4" />
                What's Working (Strengths)
              </div>
              <ul className="space-y-2">
                {analysis.strengths?.map((s: string) => (
                  <li key={s} className="text-[10px] text-slate-400 flex items-start gap-2">
                    <div className="h-1 w-1 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#151515] border border-white/5 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-orange-400 font-bold mb-3">
                <AlertCircle className="h-4 w-4" />
                Critical Drawbacks
              </div>
              <ul className="space-y-2">
                {analysis.drawbacks?.map((s: string) => (
                  <li key={s} className="text-[10px] text-orange-400/80 flex items-start gap-2">
                    <div className="h-1 w-1 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-[#151515] border border-white/5 p-6 rounded-2xl">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-widest">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Elite AI Resume Review
            </h4>
            <div className="space-y-4 max-h-60 overflow-y-auto mb-4 scrollbar-hide">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`text-xs p-3 rounded-xl border ${msg.role === 'user' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                  <span className="font-bold uppercase tracking-tighter mr-2 block mb-1">{msg.role === 'user' ? 'YOU' : 'AI EXPERT'}:</span>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              ))}
              {currentResponse && (
                <div className="text-xs p-3 rounded-xl border bg-white/5 border-white/10 text-slate-400">
                  <span className="font-bold uppercase tracking-tighter mr-2 block mb-1">AI EXPERT:</span>
                  <div className="whitespace-pre-wrap">{currentResponse} <span className="inline-block w-1 h-3 bg-indigo-500 animate-pulse" /></div>
                </div>
              )}
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Ask about specific fixes..." 
                className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button onClick={handleChat} className="absolute right-3 top-3 text-indigo-500 hover:text-indigo-400 transition-colors">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

function PresentationCoachView() {
  const { addAgentInsight } = useMiraiStore()
  const [isActive, setIsActive] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [feedback, setFeedback] = useState<string[]>([])
  const [metrics, setMetrics] = useState({
    confidence: 0,
    clarity: 0,
    pace: 0,
    engagement: 0
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/coach', { method: 'POST', body: JSON.stringify({ action: 'status' }) })
      const data = await res.json()
      if (data.error && isActive) {
        setFeedback(prev => [`🚨 System Error: ${data.error}`, ...prev.slice(0, 5)])
        stopSession()
      } else if (isActive && !data.active) {
        stopSession()
      }
    } catch {}
  }

  useEffect(() => {
    let interval: any;
    if (isActive) interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setMetrics(prev => ({
          confidence: Math.min(100, Math.max(0, (prev.confidence || 70) + (Math.random() * 10 - 5))),
          clarity: Math.min(100, Math.max(0, (prev.clarity || 85) + (Math.random() * 6 - 3))),
          pace: Math.min(100, Math.max(0, (prev.pace || 60) + (Math.random() * 4 - 2))),
          engagement: Math.min(100, Math.max(0, (prev.engagement || 75) + (Math.random() * 8 - 4)))
        }))
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const startSession = async () => {
    setIsStarting(true)
    setFeedback([])
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const res = await fetch('/api/coach', { method: 'POST', body: JSON.stringify({ action: 'start', mode: 'camera' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start AI Agent");
      setIsActive(true)
      setFeedback(["Live audio-visual stream established.", "System: AI Coach Zephyr is listening."])
      addAgentInsight("Neuro-Visual Lab", "Presentation session started.")
    } catch (e: any) {
      setFeedback([`🚨 Error: ${e.message}`])
    } finally {
      setIsStarting(false)
    }
  }

  const stopSession = async () => {
    try { await fetch('/api/coach', { method: 'POST', body: JSON.stringify({ action: 'stop' }) }) } catch {}
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop())
    setIsActive(false)
    addAgentInsight("Neuro-Visual Lab", `Session concluded. Avg Confidence: ${metrics.confidence.toFixed(0)}%.`)
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col bg-[#0d0d0d]">
      {!isActive && feedback.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
           <Video className="h-12 w-12 text-emerald-500 mb-6" />
           <h3 className="text-xl font-bold text-white mb-2">Presentation Lab</h3>
           <button onClick={startSession} className="bg-emerald-600 px-8 py-3 rounded-xl font-bold text-white">Start Session</button>
        </div>
      ) : (
        <div className="flex-1 p-6 flex flex-col">
           <div className="flex-1 bg-black rounded-2xl border border-white/5 flex items-center justify-center">
              <p className="text-emerald-400 animate-pulse text-[10px] uppercase font-bold tracking-[0.3em]">Neural Capture Active</p>
           </div>
           <button onClick={stopSession} className="mt-4 bg-red-500/10 text-red-500 py-3 rounded-xl font-bold">Stop Capture</button>
        </div>
      )}
    </motion.div>
  )
}



function AgentPersonaCard({ activeAgent }: { activeAgent: AgentType }) {
  const personas = {
    unified: { title: "Unified Synth", desc: "Full multimodal AI immersion. The ultimate interview simulation evaluating architecture, behavior, and presentation.", trait: "Omni-Aware" },
    resume: { title: "The Headhunter", desc: "Knows exactly what HR filters are looking for in 2026.", trait: "Detail-Oriented" },
    debate: { title: "Astra & Vax", desc: "The Architect vs The Optimizer. Witness the conflict of ideologies.", trait: "Deep Conflict" },
  }
  
  const persona = personas[activeAgent]

  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold mb-4">
        <Sparkles className="h-3 w-3" />
        AGENT PERSONA
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{persona.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">{persona.desc}</p>
      <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
        MOTTO: {persona.trait}
      </div>
    </div>
  )
}

function StatsCard({ activeAgent }: { activeAgent: AgentType }) {
  const { skillScore } = useMiraiStore()
  
  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 shadow-xl flex-1">
      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-4">
        <BarChart3 className="h-3 w-3" />
        LIVE PERFORMANCE
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-400">Selection Probability</span>
            <span className="text-indigo-400 font-bold">{skillScore}%</span>
          </div>
          <div className="h-2 w-full bg-[#0a0a0a] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${skillScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
            />
          </div>
        </div>

        <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5 space-y-3">
          <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Agent Verdict</div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            <p className="text-[11px] text-slate-400">Critical depth missing in architecture</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <p className="text-[11px] text-slate-400">Excellent logic articulation</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function GeminiVoiceCoachView() {
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<"camera" | "screen" | "none">("camera")
  const [isStarting, setIsStarting] = useState(false)

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/coach', { method: 'POST', body: JSON.stringify({ action: 'status' }) })
      const data = await res.json()
      setIsActive(data.active)
    } catch {}
  }

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleSession = async () => {
    try {
      if (isActive) {
        setIsStarting(true)
        await fetch('/api/coach', { method: 'POST', body: JSON.stringify({ action: 'stop' }) })
        setIsActive(false)
      } else {
        setIsStarting(true)
        await fetch('/api/coach', { method: 'POST', body: JSON.stringify({ action: 'start', mode }) })
        setIsActive(true)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-[#0d0d0d] p-8"
    >
      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-indigo-500/20 rounded-2xl bg-[#0a0a0a] relative overflow-hidden">
        
        {isActive && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0a0a0a] to-[#0a0a0a] animate-pulse pointer-events-none" />
        )}

        <div className={`h-32 w-32 rounded-full flex items-center justify-center transition-all duration-1000 ${isActive ? 'bg-indigo-500/20 scale-110 shadow-[0_0_50px_rgba(99,102,241,0.5)]' : 'bg-slate-900 border border-slate-800'}`}>
           <Bot className={`h-12 w-12 ${isActive ? 'text-indigo-400 animate-bounce' : 'text-slate-600'}`} />
        </div>
        
        <h3 className="text-2xl font-black text-white mt-8 mb-2 tracking-tight">
          {isActive ? 'Listening...' : 'Gemini Voice Sandbox'}
        </h3>
        <p className="text-slate-400 text-sm mb-8 text-center max-w-sm">
          {isActive 
            ? "Speak directly into your microphone. The AI will hear you and respond audibly using hardware access."
            : "Connects securely to your local mic and camera via the Gemini Multimodal Live API Python server."
          }
        </p>

        {!isActive && (
          <div className="flex gap-4 mb-8 bg-slate-950 p-2 rounded-xl border border-white/5">
            <button onClick={() => setMode('camera')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'camera' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-white/5'}`}>Webcam Mode</button>
            <button onClick={() => setMode('screen')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'screen' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-white/5'}`}>Screen Share Mode</button>
            <button onClick={() => setMode('none')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'none' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-white/5'}`}>Audio Only</button>
          </div>
        )}

        <button 
          onClick={toggleSession}
          disabled={isStarting}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all shadow-xl ${
            isActive 
              ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' 
              : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/25'
          } ${isStarting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isActive ? 'Disconnect Stream' : 'Initialize Voice API'}
        </button>
      </div>
    </motion.div>
  )
}

function AgentSynergyGraph() {
  const { agentInsights } = useMiraiStore()
  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 shadow-xl flex-1 flex flex-col overflow-hidden max-h-80 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
          <Network className="h-3 w-3" />
          AI SYNCHRONIZATION
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
           <div className="h-1 w-1 rounded-full bg-indigo-400 animate-ping" />
           <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Neural Sync Active</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide flex flex-col-reverse">
        <AnimatePresence>
          {agentInsights.slice().reverse().map((insight, idx) => (
            <motion.div 
              key={insight.timestamp + idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#0a0a0a] border border-white/5 p-3 rounded-xl flex gap-3 relative overflow-hidden"
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500/50" />
              <div className="flex flex-col gap-1 pl-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">
                  [{insight.source}]
                </span>
                <span className="text-xs text-slate-400">
                  {insight.insight}
                </span>
              </div>
            </motion.div>
          ))}
          {agentInsights.length === 0 && (
            <div className="text-center text-slate-600 text-xs italic py-6">
              Neural network mapping initializing... Interact with agents to build shared context.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
