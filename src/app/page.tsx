"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AppProvider, useApp } from "@/context/AppContext";
import WelcomeScreen from "@/components/WelcomeScreen";
import EligibilityChecker from "@/components/EligibilityChecker";
import JourneyMap from "@/components/JourneyMap";
import BallotInfo from "@/components/BallotInfo";
import PracticeBallot from "@/components/PracticeBallot";
import SmartChecklist from "@/components/SmartChecklist";
import AIAssistant from "@/components/AIAssistant";

const stepLabels: Record<string, string> = {
  welcome: "Welcome",
  eligibility: "Eligibility",
  journey: "Journey",
  ballot: "Ballot",
  practice: "Practice",
  checklist: "Checklist",
  assistant: "AI Assistant",
};

function TopNav() {
  const { currentStep, setCurrentStep, progress } = useApp();

  if (currentStep === "welcome") return null;

  const steps = ["eligibility", "journey", "ballot", "practice", "checklist", "assistant"] as const;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
      {/* Progress bar */}
      <div className="h-0.5 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setCurrentStep("welcome")}
          className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent cursor-pointer"
        >
          Votely
        </button>

        <div className="hidden sm:flex items-center gap-1">
          {steps.map((s) => (
            <button
              key={s}
              onClick={() => setCurrentStep(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                currentStep === s
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              {stepLabels[s]}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-slate-500">
          {progress}%
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { currentStep } = useApp();

  const screens: Record<string, React.ReactNode> = {
    welcome: <WelcomeScreen />,
    eligibility: <EligibilityChecker />,
    journey: <JourneyMap />,
    ballot: <BallotInfo />,
    practice: <PracticeBallot />,
    checklist: <SmartChecklist />,
    assistant: <AIAssistant />,
  };

  return (
    <>
      <TopNav />
      <div className={currentStep !== "welcome" ? "pt-12" : ""}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {screens[currentStep]}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
