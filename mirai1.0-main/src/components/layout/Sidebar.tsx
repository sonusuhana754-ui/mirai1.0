"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Code, Briefcase, GraduationCap, LayoutDashboard, Hexagon, Settings, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/AuthContext"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Studio", href: "/studio", icon: Code },
  { name: "Opportunities", href: "/opportunities", icon: Briefcase },
  { name: "Grooming Lab", href: "/grooming", icon: GraduationCap },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { profile, user } = useAuth()

  const userInitials = profile?.displayName
    ? profile.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : user?.email?.[0].toUpperCase() || 'B'

  return (
    <aside className="relative z-20 flex h-screen flex-col border-r border-white/10 bg-slate-950/95 text-slate-300 w-72 backdrop-blur-xl shadow-2xl shadow-slate-950/20">
      <div className="flex h-16 items-center px-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl hover:text-emerald-400 transition-colors group">
          <Hexagon className="h-6 w-6 text-emerald-500 group-hover:rotate-90 transition-transform duration-500" />
          <span className="tracking-tighter">MIRAI</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-5 px-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? "bg-white/5 text-white shadow-xl shadow-slate-950/20 border border-white/5"
                    : "text-slate-500 hover:bg-white/[0.02] hover:text-slate-300",
                  "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-400",
                      "h-5 w-5 flex-shrink-0 transition-colors"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </div>
                {isActive && (
                  <div className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 space-y-4">
        <div className="rounded-[2rem] bg-slate-900/50 border border-white/5 p-4 group hover:border-white/10 transition-all">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-12 w-12 rounded-2xl border border-white/10 flex items-center justify-center text-white font-black text-lg shadow-inner transition-transform group-hover:scale-105",
              profile?.avatarColor || "bg-emerald-600"
            )}>
              {userInitials}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">{profile?.displayName || 'Builder'}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Sparkles className="h-3 w-3 text-emerald-400" />
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500/80">Lvl {profile?.level || 1} Sync</span>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-slate-950/50 p-3 text-[10px] text-slate-500 border border-white/5 italic leading-relaxed">
            "{profile?.bio?.substring(0, 60)}..."
          </div>
        </div>

        <Link 
          href="/settings"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings className="h-3 w-3" />
          Node Settings
        </Link>
      </div>
    </aside>
  )
}

