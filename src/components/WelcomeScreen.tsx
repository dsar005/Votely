"use client";

import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import {
  ClipboardCheck,
  Vote,
  CalendarCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const journeySteps = [
  {
    icon: ClipboardCheck,
    title: "Check Eligibility",
    desc: "Quick eligibility check",
    time: "1 min",
  },
  {
    icon: Vote,
    title: "Explore Your Ballot",
    desc: "See who's running",
    time: "1 min",
  },
  {
    icon: CalendarCheck,
    title: "Practice Voting",
    desc: "Try a mock ballot",
    time: "30 sec",
  },
  {
    icon: ShieldCheck,
    title: "Get Prepared",
    desc: "Your voting checklist",
    time: "30 sec",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const item: any = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function WelcomeScreen() {
  const { setCurrentStep } = useApp();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-slate-300">AI-Powered Assistant</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            Votely
          </h1>
          <p className="text-lg text-slate-400">
            Your Personal Election Assistant
          </p>
        </motion.div>

        {/* Main message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-10"
        >
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-2xl blur-xl" />
            <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-6 backdrop-blur-sm">
              <p className="text-xl sm:text-2xl font-medium text-white leading-relaxed">
                This takes{" "}
                <span className="text-violet-400 font-semibold">3 minutes</span>.
                <br />
                You&apos;ll know exactly what to do on election day.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Journey preview */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
        >
          {journeySteps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={item}
              className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-violet-500/30 rounded-xl p-4 transition-all duration-300"
            >
              <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-500">
                {String(i + 1).padStart(2, "0")}
              </div>
              <step.icon className="w-7 h-7 text-violet-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-semibold text-white mb-1">
                {step.title}
              </h3>
              <p className="text-xs text-slate-500">{step.desc}</p>
              <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono text-violet-400/70 bg-violet-400/10 px-2 py-0.5 rounded-full">
                {step.time}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentStep("eligibility")}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white text-lg overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative">Get Started</span>
          <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-4 text-xs text-slate-600"
        >
          No sign-up required · Free · Private
        </motion.p>
      </motion.div>
    </div>
  );
}
