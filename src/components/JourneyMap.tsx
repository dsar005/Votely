"use client";

import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { ClipboardList, FileText, Vote, PartyPopper, ArrowRight, ArrowLeft, Clock } from "lucide-react";

const stages = [
  { key: "registration", title: "Your Registration", description: "Verify or complete your voter registration", timeEstimate: "5 min", icon: ClipboardList, step: "ballot" as const },
  { key: "ballot", title: "What's on Your Ballot", description: "See the candidates and issues you'll vote on", timeEstimate: "3 min", icon: FileText, step: "ballot" as const },
  { key: "voting", title: "Your Voting Day", description: "Practice voting and get comfortable with the process", timeEstimate: "2 min", icon: Vote, step: "practice" as const },
  { key: "after", title: "After You Vote", description: "Track your ballot and know your rights", timeEstimate: "1 min", icon: PartyPopper, step: "checklist" as const },
];

export default function JourneyMap() {
  const { setCurrentStep } = useApp();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Your Election Journey</h2>
          <p className="text-slate-400">Four simple steps to be fully prepared</p>
        </motion.div>

        {/* Progress line */}
        <div className="relative mb-8">
          <div className="absolute top-5 left-8 right-8 h-0.5 bg-white/10 rounded-full" />
          <div className="flex justify-between relative">
            {stages.map((_, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 + 0.2 }}
                className="w-10 h-10 rounded-full bg-violet-500/20 border-2 border-violet-500/50 flex items-center justify-center text-sm font-bold text-violet-300 z-10">
                {i + 1}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stage cards */}
        <div className="grid gap-3">
          {stages.map((stage, i) => (
            <motion.button key={stage.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              onClick={() => setCurrentStep(stage.step)}
              className="group w-full text-left bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-violet-500/30 rounded-xl p-5 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 group-hover:bg-violet-500/20 transition-colors">
                  <stage.icon className="w-6 h-6 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold mb-0.5">{stage.title}</h3>
                  <p className="text-sm text-slate-400">{stage.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {stage.timeEstimate}
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-8">
          <button onClick={() => setCurrentStep("eligibility")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />Back
          </button>
          <button onClick={() => setCurrentStep("ballot")} className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-violet-600 hover:bg-violet-500 text-white transition-all cursor-pointer">
            Start with Ballot<ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
