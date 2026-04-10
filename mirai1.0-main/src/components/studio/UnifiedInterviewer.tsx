"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Mic, Video, Send, Loader2, Sparkles, X, Shield, Activity, Terminal, MessageSquare, Zap, Target, User as UserIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMiraiStore } from "@/lib/store"

export type ChatMessage = { role: "system" | "user" | "assistant", content: string }

type Persona = "architect" | "coach" | "peer"

export function UnifiedInterviewer() {
  const { addAgentInsight } = useMiraiStore()
  const [isActive, setIsActive] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [activePersona, setActivePersona] = useState<Persona>("architect")
  const [mode, setMode] = useState<"camera" | "screen" | "none">("camera")
  
  // Voice-to-Voice Interview State
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputVal, setInputVal] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const scrollRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const personaConfig = {
    architect: { label: "Lead Architect", icon: Shield, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", prompt: "You are a Lead Architect conducting a technical systems interview. Be concise, sharp, and evaluate scalability constraints." },
    coach: { label: "Behavioral Coach", icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", prompt: "You are a Behavioral Coach evaluating a candidate. Ask STAR method questions and keep replies under 3 sentences." },
    peer: { label: "Senior Peer", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", prompt: "You are a Senior Engineer peer programming with a candidate. Be friendly but ask tricky edge-case questions. Keep it brief." }
  }

  const startMedia = async () => {
    try {
        let newStream: MediaStream;
        if (mode === 'camera') {
            newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        } else if (mode === 'screen') {
            newStream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true, audio: false });
        } else {
            return null;
        }
        setStream(newStream);
        if (videoRef.current) {
            videoRef.current.srcObject = newStream;
        }
        return newStream;
    } catch (err) {
        console.error("Failed to start media:", err);
        return null;
    }
  }

  const stopMedia = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
    }
  }

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current && (mode === 'camera' || mode === 'screen')) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/jpeg', 0.8);
        }
    }
    return null;
  }

  const submitTurn = async (userText: string = "", isSystemCommand = false, audioB64: string | null = null) => {
    if ((!userText.trim() && !audioB64) || isTyping) return
    
    if (!isSystemCommand) {
        setMessages(prev => [...prev, { role: "user", content: userText || "[Voice Input]" }])
    }
    
    setIsTyping(true)
    setMessages(prev => [...prev, { role: "assistant", content: "Generating vocal response..." }])

    const imageB64 = captureFrame();

    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: personaConfig[activePersona].prompt,
          input: userText,
          image: imageB64,
          audio: audioB64
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Play the audio
      if (data.audioB64) {
        const audio = new Audio(`data:${data.mimeType};base64,${data.audioB64}`);
        audio.play().catch(e => console.error("Audio playback failed:", e));
      }

      setMessages(prev => {
        const newArr = [...prev]
        if (newArr.length > 0) {
            newArr[newArr.length - 1].content = data.text || "[Voice only transmission]"
        } else {
            newArr.push({ role: "assistant", content: data.text || "[Voice only transmission]" as string })
        }
        return newArr
      })
      
    } catch(e:any) {
      setMessages(prev => {
        const newArr = [...prev]
        if (newArr.length > 0) {
            newArr[newArr.length - 1].content = `[Connection Error: ${e.message}]`
        } else {
            newArr.push({ role: "assistant", content: `[Connection Error: ${e.message}]` as string })
        }
        return newArr
      })
    } finally {
      setIsTyping(false)
    }
  }

  // Handle Gemini Rest API Initialization
  const toggleSession = async () => {
    setIsStarting(true)
    try {
      if (isActive) {
        stopMedia();
        setIsActive(false)
        addAgentInsight("Unified Lab", "Interview session terminated.")
      } else {
        const newStream = await startMedia();
        setIsActive(true)
        setMessages([])
        addAgentInsight("Unified Lab", `Initialized ${activePersona} persona for interview.`)
        // Intelligently start the interview instead of remaining silent!
        submitTurn("The interview has now begun. Please formally introduce yourself as my interviewer and ask me the very first interview question.", true)
      }
    } catch (e: any) {
      console.warn(e.message)
    } finally {
      setIsStarting(false)
    }
  }

  const handleSend = () => {
    submitTurn(inputVal)
    setInputVal("")
  }

  // Initialize Audio Recording
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const initAudio = async () => {
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(audioStream);
                
                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        audioChunksRef.current.push(e.data);
                    }
                };

                recorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    audioChunksRef.current = [];
                    
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64 = reader.result as string;
                        submitTurn("", false, base64);
                    };
                    reader.readAsDataURL(audioBlob);
                };

                setAudioRecorder(recorder);
            } catch (err) {
                console.error("Mic initialization failed:", err);
            }
        };
        initAudio();
    }
    
    return () => {
        audioRecorder?.stream.getTracks().forEach(t => t.stop());
    }
  }, []);

  const toggleMic = () => {
      if (!audioRecorder) return;
      if (isListening) {
          audioRecorder.stop();
          setIsListening(false);
      } else {
          audioChunksRef.current = [];
          audioRecorder.start();
          setIsListening(true);
      }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex-1 flex overflow-hidden bg-[#020617] relative">
      <div className="flex-1 flex flex-col relative">
        
        {/* Header Bar */}
        <div className="h-14 border-b border-white/5 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-rose-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Neural Link v2.0</span>
            </div>
          </div>
          
          {!isActive && (
            <div className="flex items-center gap-2">
               {(["architect", "coach", "peer"] as Persona[]).map((p) => {
                 const Config = personaConfig[p]
                 return (
                   <button 
                     key={p}
                     onClick={() => setActivePersona(p)}
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                       activePersona === p 
                        ? `${Config.bg} ${Config.border} ${Config.color}` 
                        : "border-transparent text-slate-500 hover:text-slate-300"
                     }`}
                   >
                     <Config.icon className="h-3 w-3" />
                     {Config.label}
                   </button>
                 )
               })}
            </div>
          )}
        </div>

        {/* Main Stage */}
        <div className="flex-1 relative flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-[#020617] to-[#020617]">
          
          <AnimatePresence mode="wait">
            {!isActive ? (
              <motion.div 
                key="setup"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="max-w-md w-full text-center space-y-8"
              >
                 <div className="relative mx-auto w-32 h-32">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="relative h-full w-full rounded-full border-2 border-white/10 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl">
                       <Bot className="h-12 w-12 text-indigo-400" />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <h2 className="text-2xl font-black text-white tracking-tight italic">Initialize Unified Interview</h2>
                    <p className="text-slate-500 text-xs">Full multimodal immersion. The AI will see, hear, and analyze you in real-time.</p>
                 </div>

                 <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'camera', label: 'Webcam', icon: Video },
                        { id: 'screen', label: 'Screen', icon: Terminal },
                        { id: 'none', label: 'Voice Only', icon: Mic }
                    ].map((m) => (
                        <button 
                            key={m.id}
                            onClick={() => setMode(m.id as any)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                                mode === m.id 
                                    ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                                    : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                            }`}
                        >
                            <m.icon className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase">{m.label}</span>
                        </button>
                    ))}
                 </div>

                 <button 
                    onClick={toggleSession}
                    disabled={isStarting}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                 >
                    {isStarting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Sparkles className="h-5 w-5" /> Execute Synapse</>}
                 </button>
              </motion.div>
            ) : (
              <motion.div 
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex flex-col items-center justify-center gap-12"
              >
                  {/* Virtual Presence Ring / Video Feed */}
                  <div className="relative">
                    <div className="absolute -inset-12 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="relative h-64 w-64 rounded-full border-4 border-white/5 flex items-center justify-center overflow-hidden bg-slate-950/80 backdrop-blur-xl">
                       
                       {/* Video Feed */}
                       {mode !== 'none' && (
                         <video 
                           ref={videoRef}
                           autoPlay 
                           playsInline 
                           muted 
                           className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                         />
                       )}

                       {/* Animated Waveform Wrapper */}
                       <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                          <div className="flex items-center gap-1 h-20">
                             {[...Array(12)].map((_, i) => (
                               <motion.div 
                                 key={i}
                                 animate={{ height: isTyping ? [20, 40 + Math.random() * 60, 20] : 10 }}
                                 transition={{ repeat: Infinity, duration: 0.5 + Math.random() }}
                                 className={`w-1 rounded-full ${personaConfig[activePersona].color.replace("text-", "bg-")}`}
                               />
                             ))}
                          </div>
                       </div>
                       
                       {/* Floating Stats */}
                       <div className="absolute top-4 left-0 right-0 flex justify-center">
                          <div className={`px-3 py-1 ${personaConfig[activePersona].bg} border ${personaConfig[activePersona].border} rounded-full text-[8px] font-black ${personaConfig[activePersona].color} uppercase tracking-widest`}>
                             Persona: {activePersona}
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Hidden Canvas for Snapshots */}
                  <canvas ref={canvasRef} className="hidden" />

                  <div className="flex gap-4">
                     <button 
                       onClick={toggleSession}
                       className="px-8 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-500/20 transition-all"
                     >
                        Terminate Session
                     </button>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Persistence Log / Chat Sidebar */}
      <div className="w-[420px] border-l border-white/5 bg-slate-950/80 backdrop-blur-3xl flex flex-col z-20 h-full">
         <div className="h-14 shrink-0 border-b border-white/5 flex items-center justify-between px-6 bg-slate-950/20">
            <div className="flex items-center gap-2">
               <MessageSquare className="h-3 w-3 text-indigo-400" />
               <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Neural Transcript</span>
            </div>
         </div>

         <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide flex flex-col">
            {!isActive && messages.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <Bot className="h-12 w-12 mb-4" />
                  <p className="text-[10px] uppercase font-bold tracking-widest leading-relaxed">System Idle.<br/>Awaiting stream initialization.</p>
               </div>
            ) : (
               messages.map((m, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: m.role === 'user' ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                     <div className={`max-w-[85%] text-[12px] leading-relaxed font-medium p-3 rounded-2xl ${
                        m.role === 'user' 
                          ? 'bg-indigo-500 text-white rounded-br-sm' 
                          : 'bg-white/5 text-slate-300 border border-white/5 rounded-bl-sm'
                     }`}>
                        {m.content || <Loader2 className="h-4 w-4 animate-spin opacity-50" />}
                     </div>
                  </motion.div>
               ))
            )}
         </div>

         {/* Chat Input Input Field */}
         {isActive && (
           <div className="shrink-0 p-4 border-t border-white/5 bg-slate-950/60">
             <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-xl overflow-hidden focus-within:border-indigo-500/50 transition-colors">
               <input 
                 value={inputVal}
                 onChange={(e) => setInputVal(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="Transmit response..."
                 className="w-full bg-transparent pl-4 pr-12 py-3 text-[12px] font-medium text-white placeholder-slate-500 focus:outline-none"
               />
               <button
                 onClick={toggleMic}
                 disabled={isTyping}
                 className={`absolute right-12 p-2 rounded-lg transition-all ${isListening ? 'text-rose-500 bg-rose-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/10'}`}
               >
                 <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
               </button>
               <button 
                 onClick={handleSend} 
                 disabled={!inputVal.trim() || isTyping}
                 className="absolute right-2 p-2 hover:bg-white/10 rounded-lg text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
               >
                 <Send className="h-4 w-4" />
               </button>
             </div>
           </div>
         )}

         {/* Bottom Metrics */}
         <div className="shrink-0 p-6 border-t border-white/5 space-y-4 bg-slate-950/40">
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                  <div className="text-[8px] text-slate-500 font-bold uppercase mb-1">Struggle Depth</div>
                  <div className="text-sm font-black text-emerald-400">OPTIMAL</div>
               </div>
               <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                  <div className="text-[8px] text-slate-500 font-bold uppercase mb-1">Neural Sync</div>
                  <div className="text-sm font-black text-indigo-400">98.4%</div>
               </div>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 animate={{ width: isActive ? '80%' : '10%' }}
                 className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
               />
            </div>
         </div>
      </div>

    </div>
  )
}
