import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function NextActionHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-900 p-8 border border-white/10 shadow-2xl">
      <div className="absolute top-0 right-0 -mt-16 -mr-16 text-white/5">
        <Sparkles className="h-64 w-64" />
      </div>
      
      <div className="relative z-10 flex flex-col items-start gap-4">
        <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium border border-emerald-500/30 w-fit">
          <Sparkles className="h-4 w-4" />
          <span>Next Action Recommended by AI</span>
        </div>
        
        <h2 className="text-3xl font-bold text-white max-w-xl leading-tight">
          Continue building your AI Image Generator project.
        </h2>
        
        <p className="text-slate-300 max-w-lg">
          You are 65% complete. Next up is wiring the frontend input to the backend generation route.
        </p>

        <Link 
          href="/studio"
          className="mt-4 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-all text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg shadow-emerald-600/20"
        >
          Jump straight into Studio
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}
