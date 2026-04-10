"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Hexagon, Mail, Lock, ArrowRight, User, Terminal, AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

export default function SignupPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [alias, setAlias] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      if (auth) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(userCredential.user, { displayName: name || alias })
        router.push('/dashboard')
      } else {
        setError("Firebase is not initialized.")
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign up.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (auth) {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider)
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || "Google signup failed.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-4 relative overflow-hidden selection:bg-cyan-500/30">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          {/* Internal Glow on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-700 pointer-events-none" />
          
          <div className="mb-10 flex flex-col items-center">
            <Link href="/" className="flex items-center gap-2 mb-6 group cursor-pointer inline-block">
              <div className="relative flex justify-center">
                <div className="absolute inset-0 bg-cyan-500/30 blur-md rounded-full" />
                <Hexagon className="relative h-10 w-10 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-black text-white leading-none">M</span>
                </div>
              </div>
            </Link>
            <h2 className="text-3xl font-black text-white text-center tracking-tight">Initialize Evolution</h2>
            <p className="text-sm text-slate-400 font-medium mt-2 text-center uppercase tracking-[0.2em]">Join the builder network</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4 relative z-20">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-4 py-3 rounded-xl flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
                  placeholder="First Name"
                />
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Terminal className="h-5 w-5 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
                  placeholder="Alias / Handle"
                />
              </div>
            </div>

            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" />
              </div>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
                placeholder="Secure Email Address"
              />
            </div>

            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" />
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
                placeholder="Encryption Key (Password)"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-white text-black font-black text-lg py-4 rounded-2xl hover:bg-cyan-400 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] mt-6"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Begin Execution Sequence</span>
                  <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#05060b] px-4 text-slate-500 font-bold tracking-widest">or continue with</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 group/google"
            >
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Relay via Google</span>
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-white/5">
            <p className="text-sm text-slate-400">
              Already initialized?{" "}
              <Link href="/login" className="text-white font-bold hover:text-cyan-400 transition-colors">
                Return to Node
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
