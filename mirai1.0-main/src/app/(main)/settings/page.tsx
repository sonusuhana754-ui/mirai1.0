"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  User, 
  Shield, 
  Bell, 
  Zap, 
  LogOut, 
  Check, 
  ChevronRight, 
  CreditCard,
  Trash2,
  Mail,
  Edit2,
  Globe,
  Settings as SettingsIcon,
  Loader2,
  Terminal,
  Trophy
} from "lucide-react"
import { useAuth } from "@/components/auth/AuthContext"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default function SettingsPage() {
  const { profile, user, logout, deleteAccount } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'billing'>('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [isLogoutLoading, setIsLogoutLoading] = useState(false)
  
  // Local state for editing
  const [displayName, setDisplayName] = useState(profile?.displayName || "")
  const [title, setTitle] = useState(profile?.title || "")
  const [bio, setBio] = useState(profile?.bio || "")

  const handleSave = async () => {
    if (!user || !db) return
    setIsSaving(true)
    try {
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        displayName,
        title,
        bio
      })
      // No need to manually refresh, listener in AuthContext handles it
    } catch (error) {
      console.error("Save failed:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    setIsLogoutLoading(true)
    await logout()
    setIsLogoutLoading(false)
  }

  const tabs = [
    { id: 'profile', label: 'Builder Profile', icon: User },
    { id: 'security', label: 'Security Node', icon: Shield },
    { id: 'billing', label: 'Fuel & Subscriptions', icon: CreditCard },
  ]

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tight">System Configuration</h1>
        <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-bold italic">Node ID: {user?.uid.substring(0, 12)}...</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 flex-1">
        {/* Sidebar Nav */}
        <div className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-white/5 border border-white/10 text-white shadow-xl shadow-slate-950/20' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-emerald-400' : ''}`} />
                <span className="font-bold text-sm tracking-tight">{tab.label}</span>
              </div>
              <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === tab.id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
            </button>
          ))}

          <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-4">
            <button 
              onClick={handleLogout}
              disabled={isLogoutLoading}
              className="flex items-center gap-3 p-4 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all font-bold text-sm group"
            >
              {isLogoutLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />}
              <span>Terminate Session</span>
            </button>
            <button 
              onClick={() => { if(confirm("Are you sure? This action is irreversible.")) deleteAccount(); }}
              className="flex items-center gap-3 p-4 rounded-2xl text-slate-600 hover:text-rose-700 hover:bg-rose-950/20 transition-all font-bold text-[11px] uppercase tracking-widest"
            >
              <Trash2 className="h-4 w-4" />
              <span>Purge Neural Record</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          {activeTab === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Identity Overlay</h2>
                  <p className="text-sm text-slate-500">Manage how you appear in the builder network.</p>
                </div>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  <span>Save Changes</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Universal Tag (Full Name)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600">
                      <User className="h-4 w-4" />
                    </div>
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Professional Designation</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600">
                      <Terminal className="h-4 w-4" />
                    </div>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Neural Narrative (Bio)</label>
                <textarea 
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
                  placeholder="Describe your architectural ideology..."
                />
              </div>

              <div className="pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                  <div className="text-[9px] font-black text-slate-600 uppercase mb-2">Primary Sync</div>
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Mail className="h-4 w-4 text-emerald-500" />
                    {user?.email}
                  </div>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                  <div className="text-[9px] font-black text-slate-600 uppercase mb-2">Protocol Stack</div>
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Globe className="h-4 w-4 text-indigo-500" />
                    {profile?.primaryStack || "Neutral"}
                  </div>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                  <div className="text-[9px] font-black text-slate-600 uppercase mb-2">Struggle Level</div>
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    LVL {profile?.level || 1}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center opacity-40">
              <Shield className="h-16 w-16 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Encrypted Records Locked</h3>
              <p className="text-sm max-w-xs">Security protocols are managed via the Firebase Auth relay. Password resets are handled via your primary neural link (Email).</p>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="border-b border-white/5 pb-6">
                <h2 className="text-2xl font-bold text-white mb-1">Fuel Consumption</h2>
                <p className="text-sm text-slate-500">Manage your builder evolution plan.</p>
              </div>

              <div className="bg-indigo-600 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-indigo-600/20">
                <div className="absolute top-0 right-0 p-8">
                   <Zap className="h-20 w-20 text-white/10" />
                </div>
                <div className="relative z-10">
                  <div className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Current Protocol</div>
                  <h3 className="text-3xl font-black text-white mb-6 uppercase italic">Builder {profile?.plan || 'Free'}</h3>
                  <div className="flex items-center gap-8">
                    <div>
                      <div className="text-[10px] font-bold text-white/60 uppercase mb-1">Neural Tokens</div>
                      <div className="text-xl font-black text-white">∞ Unlimited</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white/60 uppercase mb-1">Reset Date</div>
                      <div className="text-xl font-black text-white">-- / --</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
                  <Trophy className="h-6 w-6 text-yellow-500 mb-4" />
                  <h4 className="text-white font-bold mb-1">Evolution Credits</h4>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">Earn credits by completing difficult Studio loops without AI assistance.</p>
                  <div className="text-2xl font-black text-white">0.00 MIRAI</div>
                </div>
                <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center">
                  <button className="bg-white text-black px-8 py-3 rounded-xl font-black hover:bg-emerald-400 transition-all shadow-xl">
                    Upgrade Protocol
                  </button>
                  <p className="mt-3 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Evolve to Elite Mode</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
