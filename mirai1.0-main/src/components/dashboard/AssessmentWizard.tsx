"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Cpu, 
  Terminal, 
  Layers, 
  Target, 
  Rocket, 
  ArrowRight, 
  Monitor, 
  Shield, 
  Database,
  Loader2,
  CheckCircle2
} from "lucide-react"
import { useAuth } from "@/components/auth/AuthContext"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

const steps = [
  {
    id: "stack",
    title: "Primary Neural Protocol",
    subtitle: "What is your primary architectural focus?",
    options: [
      { id: "frontend", label: "Frontend / Creative", icon: Monitor, desc: "React, Vue, WebGL, Design Ops" },
      { id: "backend", label: "Backend / Distributed", icon: Database, desc: "Node.js, Go, Rust, System Design" },
      { id: "fullstack", label: "Polyglot / Full Stack", icon: Layers, desc: "End-to-end product execution" },
      { id: "ai", label: "AI / Neural Engineering", icon: Cpu, desc: "LLMs, Vector DBs, Agents" }
    ]
  },
  {
    id: "proficiency",
    title: "Current Struggle Threshold",
    subtitle: "How would you rate your expertise in complex building?",
    options: [
      { id: "beginner", level: 2, label: "Apprentice", icon: Terminal, desc: "Mastering the syntax and core loops" },
      { id: "intermediate", level: 5, label: "Standardized", icon: Shield, desc: "Building production-ready systems" },
      { id: "senior", level: 8, label: "Lead Architect", icon: Rocket, desc: "Defining patterns and optimizing scale" }
    ]
  },
  {
    id: "goal",
    title: "Mission Objective",
    subtitle: "Global priority for your Mirai instance.",
    options: [
      { id: "career", label: "Industrial Placement", icon: Target, desc: "Landing elite roles in Big Tech" },
      { id: "startup", label: "Founder Mode", icon: Rocket, desc: "Rapidly prototyping and launching products" },
      { id: "learning", label: "Pure Evolution", icon: Cpu, desc: "Deepening theoretical & practical mastery" }
    ]
  }
]

export default function AssessmentWizard({ onComplete }: { onComplete: () => void }) {
  const { user, profile } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [isFinalizing, setIsFinalizing] = useState(false)

  const handleSelect = (optionId: string) => {
    setSelections(prev => ({ ...prev, [steps[currentStep].id]: optionId }))
  }

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      finalize()
    }
  }

  const finalize = async () => {
    if (!user || !profile) return
    setIsFinalizing(true)
    
    // Calculate level based on proficiency
    const profOption = steps[1].options.find(o => o.id === selections.proficiency) as any
    const level = profOption?.level || 1

    // Update Firestore
    try {
      if (!db) throw new Error("Firestore DB not initialized")
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        primaryStack: selections.stack,
        level: level,
        title: `${selections.proficiency.charAt(0).toUpperCase() + selections.proficiency.slice(1)} ${selections.stack.charAt(0).toUpperCase() + selections.stack.slice(1)}`,
        hasSeenOnboarding: true
      })
      onComplete()
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsFinalizing(false)
    }
  }

  const step = steps[currentStep]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#02040a]/90 backdrop-blur-2xl p-6">
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl relative"
      >
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-12 px-2">
          {steps.map((_, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className={`h-2 w-2 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-slate-800'}`} />
              <div className={`h-[1px] flex-1 mx-2 transition-all duration-500 ${i < currentStep ? 'bg-emerald-400' : 'bg-slate-800'}`} />
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <motion.p 
            key={`${currentStep}-title`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.4em] text-emerald-400 font-bold mb-3"
          >
            Phase 0{currentStep + 1} // Neural Mapping
          </motion.p>
          <motion.h2 
            key={`${currentStep}-h2`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-white tracking-tight mb-4"
          >
            {step.title}
          </motion.h2>
          <motion.p 
            key={`${currentStep}-subtitle`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-400 text-lg"
          >
            {step.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="wait">
            {step.options.map((option) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.03)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(option.id)}
                className={`relative group flex items-start gap-4 p-6 rounded-3xl border transition-all text-left overflow-hidden ${
                  selections[step.id] === option.id 
                    ? 'bg-white/5 border-emerald-500/50 shadow-[0_0_20px_rgba(52,211,153,0.1)]' 
                    : 'bg-white/[0.01] border-white/10 hover:border-white/20'
                }`}
              >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all ${
                  selections[step.id] === option.id 
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                    : 'bg-slate-900 border-white/5 text-slate-500 group-hover:text-slate-300'
                }`}>
                  <option.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className={`font-bold tracking-tight mb-1 transition-colors ${
                    selections[step.id] === option.id ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {option.label}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{option.desc}</p>
                </div>
                {selections[step.id] === option.id && (
                  <motion.div 
                    layoutId="active-check"
                    className="absolute top-4 right-4"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={nextStep}
            disabled={!selections[step.id] || isFinalizing}
            className="group relative flex items-center justify-center px-12 py-4 bg-white text-black font-black rounded-2xl disabled:opacity-30 disabled:grayscale transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(52,211,153,0.4)]"
          >
            {isFinalizing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>{currentStep === steps.length - 1 ? "Initialize Experience" : "Confirm Choice"}</span>
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
