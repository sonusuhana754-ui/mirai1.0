import { create } from 'zustand'

export type PersonalityType = 'strict' | 'chill' | 'interviewer'
export type CognitiveMode = 'trial' | 'copy' | 'logical' | 'ai-dependent'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface MiraiState {
  personality: PersonalityType
  setPersonality: (p: PersonalityType) => void
  
  // Interview Agent State
  interviewHistory: ChatMessage[]
  addInterviewMessage: (msg: ChatMessage) => void
  resetInterview: () => void
  
  // User Profile / Skills
  skillScore: number
  skills: { name: string; value: number }[]
  updateSkillScore: (score: number) => void
  
  // Studio Lab State
  strugglePatterns: { concept: string; count: number }[]
  addStruggle: (concept: string) => void
  struggleScore: number
  setStruggleScore: (score: number) => void
  cognitiveMode: CognitiveMode
  setCognitiveMode: (mode: CognitiveMode) => void
  keystrokeLatency: number
  setKeystrokeLatency: (latency: number) => void
  deleteFrequency: number
  setDeleteFrequency: (freq: number) => void
  trialLoops: number
  setTrialLoops: (loops: number) => void
  
  lastKeystrokeTime: number
  logKeyPress: (timestamp: number) => void
  logDelete: () => void

  // Project Evolution
  evolutionLevel: number
  setEvolutionLevel: (level: number) => void
  projectConcept: string
  setProjectConcept: (concept: string) => void
  evolutionTree: { id: string; title: string; desc: string; unlocked: boolean }[]
  setEvolutionTree: (tree: { id: string; title: string; desc: string; unlocked: boolean }[]) => void
  
  // Failure Replay
  failureHistory: { code: string; timestamp: number; error?: string }[]
  addFailure: (failure: { code: string; timestamp: number; error?: string }) => void

  // Opportunities
  readinessScores: Record<string, number>
  setReadinessScore: (hackathonId: string, score: number) => void

  // Global Actions
  executionTrigger: number
  triggerExecution: () => void
  proactiveHintTrigger: number
  triggerProactiveHint: (line: number) => void
  
  // Activity Tracking
  lastActionLine: number
  lastActionTimestamp: number
  setLastAction: (line: number, timestamp: number) => void
  
  // Agent Memory
  agentInsights: { source: string; insight: string; timestamp: number }[]
  addAgentInsight: (source: string, insight: string) => void
}

export const useMiraiStore = create<MiraiState>((set) => ({
  agentInsights: [],
  addAgentInsight: (source, insight) => set((state) => ({
    agentInsights: [...state.agentInsights, { source, insight, timestamp: Date.now() }]
  })),
  executionTrigger: 0,
  triggerExecution: () => set((state) => ({ executionTrigger: state.executionTrigger + 1 })),
  proactiveHintTrigger: 0,
  triggerProactiveHint: (line) => set((state) => ({ 
    proactiveHintTrigger: state.proactiveHintTrigger + 1,
    lastActionLine: line 
  })),
  lastActionLine: 1,
  lastActionTimestamp: Date.now(),
  setLastAction: (line, timestamp) => set({ lastActionLine: line, lastActionTimestamp: timestamp }),
  personality: 'strict',
  setPersonality: (p) => set({ personality: p }),
  
  interviewHistory: [
    { role: 'assistant', content: "Welcome back. I've analyzed your recent projects in the Studio Lab. Let's dive into your Next.js expertise: How would you handle race conditions when pre-fetching data in a dynamic dashboard like Mirai?" }
  ],
  addInterviewMessage: (msg) => set((state) => ({ 
    interviewHistory: [...state.interviewHistory, msg] 
  })),
  resetInterview: () => set({ interviewHistory: [] }),
  
  skillScore: 65,
  skills: [
    { name: 'Next.js', value: 80 },
    { name: 'TypeScript', value: 75 },
    { name: 'TailwindCSS', value: 90 },
    { name: 'React', value: 85 }
  ],
  updateSkillScore: (score) => set({ skillScore: score }),
  
  strugglePatterns: [],
  addStruggle: (concept) => set((state) => {
    const existing = state.strugglePatterns.find(p => p.concept === concept);
    if (existing) {
      return {
        strugglePatterns: state.strugglePatterns.map(p => 
          p.concept === concept ? { ...p, count: p.count + 1 } : p
        )
      };
    }
    return { strugglePatterns: [...state.strugglePatterns, { concept, count: 1 }] };
  }),
  struggleScore: 12,
  setStruggleScore: (score) => set({ struggleScore: score }),
  cognitiveMode: 'logical',
  setCognitiveMode: (mode) => set({ cognitiveMode: mode }),
  keystrokeLatency: 120, // default ms delay
  setKeystrokeLatency: (latency) => set({ keystrokeLatency: latency }),
  deleteFrequency: 5,
  setDeleteFrequency: (freq) => set({ deleteFrequency: freq }),
  trialLoops: 0,
  setTrialLoops: (loops) => set({ trialLoops: loops }),
  
  lastKeystrokeTime: Date.now(),
  logKeyPress: (timestamp) => set((state) => {
    const latency = timestamp - state.lastKeystrokeTime;
    // Calculate a moving average of keystroke latency roughly to detect struggle
    const newLatency = state.keystrokeLatency === 0 ? latency : (state.keystrokeLatency * 0.8) + (latency * 0.2);
    // Spike struggle if latency is incredibly high (> 3000ms delay between keys while typing active)
    let newStruggle = state.struggleScore;
    if (latency > 3000 && latency < 10000) newStruggle = Math.min(100, newStruggle + 5);
    
    return { 
      lastKeystrokeTime: timestamp, 
      keystrokeLatency: newLatency,
      struggleScore: newStruggle
    };
  }),
  logDelete: () => set((state) => {
    const newFreq = state.deleteFrequency + 1;
    let newStruggle = state.struggleScore;
    if (newFreq > 20) newStruggle = Math.min(100, newStruggle + 3); // High delete frequency implies backtracking
    return { deleteFrequency: newFreq, struggleScore: newStruggle };
  }),
  
  evolutionLevel: 1,
  setEvolutionLevel: (level) => set({ evolutionLevel: level }),
  projectConcept: "",
  setProjectConcept: (concept) => set({ projectConcept: concept }),
  evolutionTree: [],
  setEvolutionTree: (tree) => set({ evolutionTree: tree }),
  
  failureHistory: [],
  addFailure: (failure) => set((state) => ({ 
    failureHistory: [...state.failureHistory, failure] 
  })),

  readinessScores: {},
  setReadinessScore: (hackathonId, score) => set((state) => ({
    readinessScores: { ...state.readinessScores, [hackathonId]: score }
  }))
}))
