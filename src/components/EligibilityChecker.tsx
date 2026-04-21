"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { MapPin, Calendar, Flag, ClipboardCheck, ArrowRight, ArrowLeft, CheckCircle2, XCircle, AlertCircle, ChevronDown } from "lucide-react";

const countries = ["United States","United Kingdom","Canada","Australia","India","Germany","France","Other"];

const questions = [
  { id: "country", question: "Where do you live?", icon: MapPin },
  { id: "age", question: "How old are you?", icon: Calendar },
  { id: "citizenship", question: "What is your citizenship status?", icon: Flag },
  { id: "registration", question: "Are you registered to vote?", icon: ClipboardCheck },
];

const verdictConfig = {
  eligible: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-300", label: "You're Eligible!" },
  "not-eligible": { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", badge: "bg-red-500/20 text-red-300", label: "Not Eligible" },
  maybe: { icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", badge: "bg-amber-500/20 text-amber-300", label: "Needs Confirmation" },
};

export default function EligibilityChecker() {
  const { userProfile, updateProfile, eligibilityResult, runEligibilityCheck, setCurrentStep } = useApp();
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleNext = () => {
    if (step < questions.length - 1) setStep(step + 1);
    else { runEligibilityCheck(); setShowResult(true); }
  };

  const handleBack = () => {
    if (showResult) setShowResult(false);
    else if (step > 0) setStep(step - 1);
    else setCurrentStep("welcome");
  };

  const canProceed = () => {
    if (step === 0) return userProfile.country !== "";
    if (step === 1) return userProfile.age !== null && userProfile.age > 0;
    if (step === 2) return userProfile.citizenship !== "";
    if (step === 3) return userProfile.registrationStatus !== "";
    return false;
  };

  const renderInput = () => {
    if (step === 0) return (
      <div className="space-y-2">
        <div className="relative">
          <select value={userProfile.country} onChange={(e) => updateProfile({ country: e.target.value })}
            className="w-full appearance-none bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-violet-500/50 transition-all cursor-pointer">
            <option value="" className="bg-slate-900">Select your country</option>
            {countries.map((c) => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
        </div>
        {userProfile.country && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
            <input type="text" placeholder="State / Region (optional)" value={userProfile.region}
              onChange={(e) => updateProfile({ region: e.target.value })}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all" />
          </motion.div>
        )}
      </div>
    );
    if (step === 1) return (
      <input type="number" min="1" max="150" placeholder="Enter your age" value={userProfile.age ?? ""}
        onChange={(e) => updateProfile({ age: e.target.value ? parseInt(e.target.value) : null })}
        className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all" />
    );
    if (step === 2) return (
      <div className="grid grid-cols-1 gap-2">
        {[{ value: "citizen", label: "Citizen", desc: "I am a citizen" },{ value: "permanent-resident", label: "Permanent Resident", desc: "I have permanent residency" },{ value: "non-citizen", label: "Non-Citizen", desc: "I am not a citizen" }].map((opt) => (
          <button key={opt.value} onClick={() => updateProfile({ citizenship: opt.value })}
            className={`text-left px-4 py-3 rounded-xl border transition-all cursor-pointer ${userProfile.citizenship === opt.value ? "bg-violet-500/10 border-violet-500/40 text-white" : "bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05]"}`}>
            <div className="font-medium">{opt.label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
          </button>
        ))}
      </div>
    );
    return (
      <div className="grid grid-cols-1 gap-2">
        {([{ value: "yes" as const, label: "Yes, I'm registered" },{ value: "no" as const, label: "No, I'm not registered" },{ value: "not-sure" as const, label: "I'm not sure" }]).map((opt) => (
          <button key={opt.value} onClick={() => updateProfile({ registrationStatus: opt.value })}
            className={`text-left px-4 py-3 rounded-xl border transition-all cursor-pointer ${userProfile.registrationStatus === opt.value ? "bg-violet-500/10 border-violet-500/40 text-white" : "bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05]"}`}>
            <div className="font-medium">{opt.label}</div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="flex items-center justify-center gap-2 mb-8">
          {questions.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i < step ? "w-8 bg-violet-500" : i === step && !showResult ? "w-8 bg-violet-400" : "w-4 bg-white/10"}`} />
          ))}
          <div className={`h-1.5 rounded-full transition-all duration-300 ${showResult ? "w-8 bg-violet-400" : "w-4 bg-white/10"}`} />
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div key={`q-${step}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
              <div className="text-center mb-8">
                {(() => { const Icon = questions[step].icon; return (
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-4"><Icon className="w-7 h-7 text-violet-400" /></div>
                ); })()}
                <h2 className="text-2xl font-bold text-white">{questions[step].question}</h2>
                <p className="text-sm text-slate-400 mt-1">Step {step + 1} of {questions.length}</p>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">{renderInput()}</div>
              <div className="flex items-center justify-between">
                <button onClick={handleBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer"><ArrowLeft className="w-4 h-4" />Back</button>
                <button onClick={handleNext} disabled={!canProceed()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${canProceed() ? "bg-violet-600 hover:bg-violet-500 text-white" : "bg-white/5 text-slate-600 cursor-not-allowed"}`}>
                  {step === questions.length - 1 ? "Check Eligibility" : "Continue"}<ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : eligibilityResult && eligibilityResult.verdict && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              <div className="text-center">
                {(() => { const cfg = verdictConfig[eligibilityResult.verdict]; const VI = cfg.icon; return (<>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
                    <VI className={`w-16 h-16 mx-auto mb-4 ${cfg.color}`} />
                  </motion.div>
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${cfg.badge}`}>{cfg.label}</div>
                </>); })()}
                <div className={`${verdictConfig[eligibilityResult.verdict].bg} border rounded-2xl p-6 mb-6 text-left`}>
                  {eligibilityResult.reasons.map((r, i) => <p key={i} className="text-white text-sm mb-2">{r}</p>)}
                  {eligibilityResult.nextSteps.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">Next Steps</p>
                      <ul className="space-y-2">
                        {eligibilityResult.nextSteps.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300"><ArrowRight className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <button onClick={handleBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer"><ArrowLeft className="w-4 h-4" />Edit Answers</button>
                  <button onClick={() => setCurrentStep("journey")} className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-violet-600 hover:bg-violet-500 text-white transition-all cursor-pointer">
                    Continue Journey<ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
