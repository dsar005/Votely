"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { getQuickChecklist, getDaysUntilDeadline } from "@/lib/checklist-data";
import { ArrowRight, ArrowLeft, CheckCircle2, Circle, Clock, AlertTriangle, ListChecks, Zap, ChevronDown, ChevronUp } from "lucide-react";

const categoryLabels = { registration: "Registration", documents: "Documents", preparation: "Voting Day Prep" };
const categoryIcons = { registration: ListChecks, documents: ListChecks, preparation: ListChecks };

export default function SmartChecklist() {
  const { checklist, toggleChecklistItem, setCurrentStep } = useApp();
  const [mode, setMode] = useState<"quick" | "full">("quick");
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const quickItems = getQuickChecklist(checklist);
  const completedCount = checklist.filter((i) => i.completed).length;
  const totalCount = checklist.length;
  const pct = Math.round((completedCount / totalCount) * 100);

  const categories = ["registration", "documents", "preparation"] as const;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-4">
            <ListChecks className="w-7 h-7 text-violet-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Smart Checklist</h2>
          <p className="text-slate-400">Everything you need before election day</p>
        </motion.div>

        {/* Progress ring */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex items-center justify-center mb-6">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <circle cx="40" cy="40" r="35" fill="none" stroke="url(#grad)" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 35}`} strokeDashoffset={`${2 * Math.PI * 35 * (1 - pct / 100)}`}
                className="transition-all duration-700" />
              <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#6366f1" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{pct}%</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-white font-medium">{completedCount} of {totalCount} done</p>
            <p className="text-xs text-slate-500">{totalCount - completedCount} remaining</p>
          </div>
        </motion.div>

        {/* Mode toggle */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button onClick={() => setMode("quick")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${mode === "quick" ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
            <Zap className="w-3.5 h-3.5" />Quick View
          </button>
          <button onClick={() => setMode("full")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${mode === "full" ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
            <ListChecks className="w-3.5 h-3.5" />Full List
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "quick" ? (
            <motion.div key="quick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium">Top Priority Tasks</p>
              {quickItems.length === 0 ? (
                <div className="text-center py-8 bg-white/[0.03] border border-white/10 rounded-xl">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="text-white font-medium">All high-priority tasks done!</p>
                  <p className="text-xs text-slate-500 mt-1">Switch to full list for remaining items</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {quickItems.map((item, i) => {
                    const days = getDaysUntilDeadline(item.deadline);
                    return (
                      <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                        <button onClick={() => toggleChecklistItem(item.id)}
                          className="w-full flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all text-left cursor-pointer">
                          {item.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" /> : <Circle className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" />}
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${item.completed ? "text-slate-500 line-through" : "text-white"}`}>{item.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                            {days !== null && days > 0 && !item.completed && (
                              <div className="flex items-center gap-1 mt-1.5">
                                {days <= 14 ? <AlertTriangle className="w-3 h-3 text-amber-400" /> : <Clock className="w-3 h-3 text-slate-500" />}
                                <span className={`text-xs font-medium ${days <= 14 ? "text-amber-400" : "text-slate-500"}`}>
                                  {days <= 14 ? `Deadline in ${days} days` : `${days} days left`}
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-3">
                {categories.map((cat) => {
                  const items = checklist.filter((i) => i.category === cat);
                  const catDone = items.filter((i) => i.completed).length;
                  const isExpanded = expandedCat === cat || expandedCat === null;
                  const CatIcon = categoryIcons[cat];
                  return (
                    <div key={cat} className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                      <button onClick={() => setExpandedCat(isExpanded && expandedCat !== null ? null : cat)}
                        className="w-full flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-2">
                          <CatIcon className="w-4 h-4 text-violet-400" />
                          <span className="text-sm font-semibold text-white">{categoryLabels[cat]}</span>
                          <span className="text-xs text-slate-500">{catDone}/{items.length}</span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                            <div className="px-3 pb-3 space-y-1">
                              {items.map((item) => (
                                <button key={item.id} onClick={() => toggleChecklistItem(item.id)}
                                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-all text-left cursor-pointer">
                                  {item.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /> : <Circle className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />}
                                  <div>
                                    <p className={`text-sm ${item.completed ? "text-slate-500 line-through" : "text-white"}`}>{item.label}</p>
                                    <p className="text-xs text-slate-500">{item.description}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8">
          <button onClick={() => setCurrentStep("practice")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />Back
          </button>
          <button onClick={() => setCurrentStep("assistant")} className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-violet-600 hover:bg-violet-500 text-white transition-all cursor-pointer">
            AI Assistant<ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
