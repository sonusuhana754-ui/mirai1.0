"use client"

import { Briefcase, Calendar, MapPin, Building, ChevronRight, Target, Sparkles, ArrowRight } from "lucide-react"
import { useMiraiStore } from "@/lib/store"
import OpportunityRadar from "@/components/dashboard/OpportunityRadar"

export default function OpportunitiesPage() {
  const { skillScore } = useMiraiStore()

  const internships = [
    { 
      title: "SWE Intern 2027", 
      company: "Google", 
      location: "Remote", 
      readiness: 85, 
      skills: [
        { name: "Algorithms", value: 40 },
        { name: "System Design", value: 25 },
        { name: "Next.js", value: 45 },
        { name: "Cloud", value: 30 }
      ],
      gap: ["Redis", "System Design"],
      iconColor: "text-blue-500", 
      bgColor: "bg-blue-500/10",
      link: "https://buildyourfuture.withgoogle.com/internships"
    },
    { 
      title: "Frontend Intern", 
      company: "Vercel", 
      location: "San Francisco", 
      readiness: 72, 
      skills: [
        { name: "React", value: 48 },
        { name: "Tailwind", value: 45 },
        { name: "SEO", value: 20 },
        { name: "A/B Testing", value: 15 }
      ],
      gap: ["Advanced Next.js", "Edge Functions"],
      iconColor: "text-neutral-200", 
      bgColor: "bg-neutral-800",
      link: "https://vercel.com/careers"
    },
  ]
  const hackathons = [
    { 
      title: "Google Solutions Challenge", 
      time: "Ends Oct 30", 
      prize: "$10k + Swag", 
      readiness: 92, 
      skills: [
        { name: "Innovation", value: 45 },
        { name: "Scalability", value: 40 },
        { name: "Impact", value: 48 },
        { name: "AI", value: 35 }
      ],
      iconColor: "text-green-500", 
      bgColor: "bg-green-500/10", 
      link: "https://developers.google.com/community/solutions-challenge" 
    },
    { 
      title: "AI Builder Jam", 
      time: "Starts Tomorrow", 
      prize: "$5k", 
      readiness: 65, 
      skills: [
        { name: "LLMs", value: 30 },
        { name: "Inference", value: 20 },
        { name: "UX", value: 40 },
        { name: "Data", value: 25 }
      ],
      iconColor: "text-purple-500", 
      bgColor: "bg-purple-500/10", 
      link: "https://devpost.com/hackathons" 
    },
  ]

  const handleApply = (link: string) => {
    window.open(link, '_blank');
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-indigo-300">Opportunity engine</div>
          <h1 className="mt-5 text-4xl font-bold text-white tracking-tight">Opportunities</h1>
          <p className="mt-4 max-w-2xl text-slate-400">Personalized readiness scores powered by your Studio progress, skill lab metrics, and launch growth direction.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {['All', 'Internships', 'Hackathons', 'Launch-ready'].map((item) => (
              <button key={item} className="rounded-full border border-white/10 bg-slate-900/90 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition">{item}</button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-xl shadow-slate-950/20">
            <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-[0.28em] font-bold mb-4">
              <span>Market match</span>
              <span>Live update</span>
            </div>
            <div className="text-3xl font-extrabold text-white">{skillScore}%</div>
            <p className="mt-3 text-sm text-slate-400">Your current readiness is aligned with internships and hackathon milestones.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-xl shadow-slate-950/20">
            <div className="text-slate-400 text-xs uppercase tracking-[0.28em] font-bold mb-3">Launch indicator</div>
            <div className="space-y-3">
              <div className="rounded-3xl bg-slate-950/90 border border-white/10 p-4 text-sm text-slate-300">Your profile is trending toward higher-value technical roles with each Studio session.</div>
              <div className="flex items-center justify-between text-xs text-slate-500 uppercase tracking-[0.24em]"><span>Project traction</span><span>Strong</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">Internships</h2>
              <p className="mt-2 text-slate-400">Highly curated roles matched to the skills you’re building now.</p>
            </div>
            <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-slate-400">2 new</span>
          </div>
          <div className="space-y-6">
            {internships.map(job => (
              <div 
                key={job.company} 
                onClick={() => handleApply(job.link)}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/20 transition-all hover:border-indigo-500/30 hover:shadow-indigo-500/15"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex gap-5 mb-6 items-start">
                      <div className={`h-16 w-16 rounded-3xl ${job.bgColor} flex items-center justify-center border border-white/10 shadow-inner`}>
                        <Building className={`h-8 w-8 ${job.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{job.title}</h3>
                        <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-400">
                          <span className="font-semibold text-slate-200">{job.company}</span>
                          <span className="inline-flex items-center gap-1 opacity-70"><MapPin className="h-3 w-3" />{job.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">
                        <Sparkles className="h-3 w-3" />
                        Actionable Improvement Gap
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.gap.map(g => (
                          <span key={g} className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-orange-300">{g}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-[240px] flex-shrink-0 rounded-3xl bg-[#0a0a0a] border border-white/10 p-4">
                    <OpportunityRadar score={job.readiness} skills={job.skills} color={job.readiness > 80 ? '#6366f1' : '#f97316'} />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  <span>Matched via Studio Progress</span>
                  <span className="flex items-center gap-2 text-white group-hover:text-indigo-400">Quick Apply <ArrowRight className="h-4 w-4" /></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">Hackathons</h2>
              <p className="mt-2 text-slate-400">High-impact competitions where your current skill mix has maximum leverage.</p>
            </div>
            <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-slate-400">High Stakes</span>
          </div>
          <div className="space-y-6">
            {hackathons.map(hack => (
              <div 
                key={hack.title} 
                onClick={() => handleApply(hack.link)}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-xl shadow-slate-950/20 transition-all hover:border-emerald-500/30 hover:shadow-emerald-500/10"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`h-14 w-14 rounded-3xl ${hack.bgColor} flex items-center justify-center border border-white/10`}>
                      <Calendar className={`h-7 w-7 ${hack.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{hack.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{hack.time} • <span className="font-black text-emerald-500">{hack.prize}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="w-32 h-32"><OpportunityRadar score={hack.readiness} skills={hack.skills} color="#10b981" /></div>
                    <ChevronRight className="h-6 w-6 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

