"use client"

import AIPersonalitySwitcher from "./AIPersonalitySwitcher"
import { Bell, Search, Flame } from "lucide-react"

export default function TopNavigation() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/90 px-6 backdrop-blur-xl shadow-sm shadow-slate-950/20 w-full">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="relative w-full max-w-xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-500" aria-hidden="true" />
          </div>
          <input
            id="search"
            className="block w-full rounded-3xl border-0 bg-slate-900/95 py-2 pl-10 pr-3 text-slate-200 ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6"
            placeholder="Search projects, skills, or goals..."
            type="search"
            name="search"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-3xl bg-slate-900/90 border border-white/10 px-4 py-2 text-sm text-slate-200 shadow-sm shadow-slate-950/20">
            <span className="text-slate-400">Release status</span>
            <div className="mt-1 font-semibold text-white">Beta ready</div>
          </div>

          <AIPersonalitySwitcher />

          <div className="flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-300 border border-orange-500/20 shadow-sm">
            <Flame className="h-4 w-4" />
            <span>12 Day Streak</span>
          </div>

          <button type="button" className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/95 text-slate-300 transition hover:border-emerald-400 hover:text-white">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.35)]"></span>
          </button>
        </div>
      </div>
    </header>
  )
}

