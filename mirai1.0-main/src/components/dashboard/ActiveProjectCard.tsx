import { Code2, Play } from "lucide-react"
import ProjectEvolutionTree from "./ProjectEvolutionTree"

export default function ActiveProjectCard() {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col shadow-lg transition hover:border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/30">
            <Code2 className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Image Generator</h3>
            <p className="text-sm text-slate-400">Next.js • Tailwind • Gemini API</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Progress</span>
            <span className="text-emerald-400 font-medium">65%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-[65%]" />
          </div>
        </div>
        
        <button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition">
          <Play className="h-4 w-4" />
          Resume Coding
        </button>

        <ProjectEvolutionTree />
      </div>
    </div>
  )
}
