"use client"

import { useState } from "react"
import NextActionHero from "@/components/dashboard/NextActionHero"
import WeeklyPlanner from "@/components/dashboard/WeeklyPlanner"
import ActiveProjectCard from "@/components/dashboard/ActiveProjectCard"
import SkillDNAGraph from "@/components/dashboard/SkillDNAGraph"
import { Briefcase, Trophy, ArrowRight, Sparkles, FileText, Terminal, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth/AuthContext"
import ResumeUpload from "@/components/dashboard/ResumeUpload"
import AssessmentWizard from "@/components/dashboard/AssessmentWizard"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardPage() {
  const { profile, loading } = useAuth()
  const [initMode, setInitMode] = useState<'choice' | 'resume' | 'assessment'>('choice')

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  // If new user, show Initialization
  if (profile && !profile.hasSeenOnboarding) {
    return (
      <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto py-12 px-6">
        <AnimatePresence mode="wait">
          {initMode === 'choice' && (
            <motion.div 
              key="choice"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
                  Welcome to Mirai
                </div>
                <h1 className="text-5xl font-black text-white tracking-tight">Initialize Your Profile</h1>
                <p className="text-slate-400 text-lg max-w-xl mx-auto">Establish your technical baseline to unlock personalized projects, AI coaching, and elite job matches.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => setInitMode('resume')}
                  className="group relative p-8 rounded-[2.5rem] bg-slate-900/50 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="h-7 w-7 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Sync via Resume</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">Our AI will deconstruct your resume and establish your neural profile instantly.</p>
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                    Recommended <ArrowRight className="h-3 w-3" />
                  </div>
                </button>

                <button 
                  onClick={() => setInitMode('assessment')}
                  className="group relative p-8 rounded-[2.5rem] bg-slate-900/50 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left overflow-hidden"
                >
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Terminal className="h-7 w-7 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Live Assessment</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">Answer a few architectural questions to manual configure your environment.</p>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                    Manual Config <ArrowRight className="h-3 w-3" />
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {initMode === 'resume' && (
            <motion.div 
              key="resume"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <ResumeUpload onComplete={() => location.reload()} />
              <button 
                onClick={() => setInitMode('choice')}
                className="mt-6 text-slate-500 hover:text-white text-sm font-bold flex items-center gap-2 transition-colors mx-auto"
              >
                Go Back
              </button>
            </motion.div>
          )}

          {initMode === 'assessment' && (
            <AssessmentWizard onComplete={() => location.reload()} />
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Active Dashboard
  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-emerald-400 font-bold mb-2">Neural Node: Active</p>
            <h1 className="text-4xl font-black text-white tracking-tight">Welcome back, {profile?.displayName.split(' ')[0]}.</h1>
          </div>
          <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-4 shadow-xl shadow-emerald-500/5 backdrop-blur-md">
            <div className="text-[10px] uppercase tracking-[0.32em] text-slate-500 font-bold">Evolution Readiness Index</div>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-4xl font-black text-white tracking-tighter">
                {profile?.level ? Math.min(100, profile.level * 10 + 20) : 0}
              </span>
              <span className="text-sm font-bold text-emerald-400">/100</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500 max-w-[240px] leading-relaxed">Your profile is {profile?.level ? 'configured' : 'optimizing'} for {profile?.primaryStack || 'neutral'} growth loops.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/30">
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500 font-bold">Studio Match</p>
            <div className="mt-3 text-3xl font-black text-white">{profile?.level ? profile.level * 8 + 10 : 0}%</div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">Project quality and AI synergy index.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/30">
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500 font-bold">Project Momentum</p>
            <div className="mt-3 text-3xl font-black text-white">+{profile?.experienceYears || 1} Loop</div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">Estimated weekly architectural progression.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/30">
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500 font-bold">Struggle Score</p>
            <div className="mt-3 text-3xl font-black text-emerald-400">OPTIMAL</div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">Cognitive load balanced for maximum learning efficiency.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Hero spans 2 columns */}
        <div className="md:col-span-2">
          <NextActionHero />
        </div>
        
        {/* Weekly planner and Skill DNA Graph */}
        <div className="md:col-span-1 md:row-span-2 flex flex-col gap-6">
          <SkillDNAGraph />
          <WeeklyPlanner />
        </div>

        {/* Active Project underneath Hero */}
        <div className="md:col-span-1">
          <ActiveProjectCard />
        </div>

        {/* Opportunities Teaser */}
        <div className="md:col-span-1 border border-slate-800 bg-slate-900 rounded-2xl p-6 flex flex-col gap-4 hover:border-indigo-500/30 transition-all cursor-pointer group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3">
             <div className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-tighter">
               Neural Match
             </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 shrink-0 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 shadow-inner">
              <Briefcase className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                {profile?.primaryStack ? `${profile.primaryStack} Architect` : 'SWE Associate'}
              </h4>
              <p className="text-[11px] text-slate-400 leading-tight">Matched based on your {profile?.skills?.[0]?.name || 'System Design'} profile.</p>
            </div>
          </div>
          
          <div className="mt-2 bg-black/40 rounded-xl p-3 border border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Readiness Index</span>
              <span className="text-sm font-black text-white">{(profile?.level || 1) * 7 + 60}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            Review Readiness Graph <ArrowRight className="h-3 w-3" />
          </div>
        </div>

      </div>

      {/* Badges Section */}
      <h3 className="text-xl font-black text-white mt-8 mb-4 tracking-tight uppercase">Your Neural Badges</h3>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl pr-8">
          <div className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <Trophy className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Active Builder</div>
            <div className="text-[10px] text-slate-500 uppercase font-black">Level {profile?.level || 1}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl pr-8">
          <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <Trophy className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Neural Sink</div>
            <div className="text-[10px] text-slate-500 uppercase font-black">Profile Synced</div>
          </div>
        </div>
      </div>

    </div>
  )
}

