import Sidebar from "@/components/layout/Sidebar"
import TopNavigation from "@/components/layout/TopNavigation"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#02040a] overflow-hidden text-slate-200 selection:bg-emerald-500/30">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden relative z-10">
        <TopNavigation />
        <main className="flex-1 overflow-y-auto w-full p-6 z-0">
          {children}
        </main>
      </div>
    </div>
  )
}
