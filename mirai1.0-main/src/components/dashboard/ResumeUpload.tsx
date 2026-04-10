"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FileText, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  X,
  FileCode,
  Sparkles
} from "lucide-react"
import { useAuth } from "@/components/auth/AuthContext"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default function ResumeUpload({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.type === "text/plain")) {
      setFile(droppedFile)
      setError(null)
    } else {
      setError("Please upload a PDF or Text file.")
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const processResume = async () => {
    if (!file || !user) return
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.error || "Failed to parse resume")

      const { data } = result

      // Update Firestore with AI-extracted data
      if (!db) throw new Error("Firestore DB not initialized")
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        displayName: data.displayName || user.displayName,
        title: data.title,
        bio: data.bio,
        skills: data.skills,
        experienceYears: data.experienceYears,
        primaryStack: data.primaryStack,
        level: data.level,
        resumeText: data.rawText,
        hasSeenOnboarding: true
      })

      setIsSuccess(true)
      setTimeout(() => onComplete(), 1500)

    } catch (err: any) {
      console.error("Upload failed:", err)
      setError(err.message || "Neural processing failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="text-center mb-10">
        <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
          <FileCode className="h-8 w-8 text-indigo-400" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2">Initialize Profile via Resume</h3>
        <p className="text-slate-400 max-w-sm mx-auto">Upload your neural blueprint. Our AI will automatically configure your Mirai dashboard environment.</p>
      </div>

      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
          file 
            ? 'border-emerald-500/50 bg-emerald-500/5' 
            : 'border-white/10 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02]'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.txt"
        />

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <CheckCircle2 className="h-12 w-12 text-emerald-400" />
              <p className="text-emerald-400 font-bold">Neural Sync Complete</p>
            </motion.div>
          ) : isUploading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                 <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
                 <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-indigo-300 animate-pulse" />
              </div>
              <p className="text-slate-300 font-medium tracking-wide">Deconstructing Resume...</p>
            </motion.div>
          ) : file ? (
            <motion.div 
              key="file"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="bg-emerald-500/20 p-4 rounded-2xl border border-emerald-500/30">
                <FileText className="h-10 w-10 text-emerald-400" />
              </div>
              <p className="text-white font-bold">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="mt-2 text-slate-500 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center mb-2">
                <Upload className="h-6 w-6 text-slate-500" />
              </div>
              <p className="text-white font-bold">Drag & drop or <span className="text-indigo-400">browse</span></p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">PDF or TEXT only</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </motion.div>
      )}

      {file && !isUploading && !isSuccess && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={processResume}
          className="w-full mt-8 bg-white text-black font-black py-4 rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-emerald-500/20"
        >
          <span>Begin Neural Analysis</span>
          <Sparkles className="h-5 w-5" />
        </motion.button>
      )}
    </div>
  )
}
