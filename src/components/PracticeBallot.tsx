"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { getMockBallotData } from "@/lib/civic-api";
import { ArrowRight, ArrowLeft, Vote, BarChart3, Trophy, RotateCcw, GripVertical } from "lucide-react";

type VotingSystem = "fptp" | "ranked";
interface Selection { [office: string]: string | string[]; }
interface SimResult { name: string; party: string; votes: number; pct: number; winner: boolean; }

const mockVoters = [
  { President: "Alex Johnson", Senator: "Jordan Lee", Representative: "Riley Garcia" },
  { President: "Morgan Smith", Senator: "Taylor Brown", Representative: "Avery Martinez" },
  { President: "Alex Johnson", Senator: "Taylor Brown", Representative: "Riley Garcia" },
  { President: "Morgan Smith", Senator: "Jordan Lee", Representative: "Quinn Davis" },
  { President: "Casey Williams", Senator: "Jordan Lee", Representative: "Avery Martinez" },
  { President: "Alex Johnson", Senator: "Taylor Brown", Representative: "Riley Garcia" },
  { President: "Morgan Smith", Senator: "Jordan Lee", Representative: "Quinn Davis" },
  { President: "Casey Williams", Senator: "Taylor Brown", Representative: "Avery Martinez" },
  { President: "Alex Johnson", Senator: "Jordan Lee", Representative: "Riley Garcia" },
];

export default function PracticeBallot() {
  const { setCurrentStep, contests } = useApp();
  const ballotData = contests.length > 0 ? contests.slice(0, 3) : getMockBallotData().slice(0, 3);
  const [system, setSystem] = useState<VotingSystem>("fptp");
  const [selections, setSelections] = useState<Selection>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (office: string, candidate: string) => {
    if (system === "fptp") {
      setSelections((p) => ({ ...p, [office]: candidate }));
    } else {
      const current = (selections[office] as string[]) || [];
      if (current.includes(candidate)) {
        setSelections((p) => ({ ...p, [office]: current.filter((c) => c !== candidate) }));
      } else {
        setSelections((p) => ({ ...p, [office]: [...current, candidate] }));
      }
    }
  };

  const isSelected = (office: string, candidate: string) => {
    const sel = selections[office];
    if (!sel) return false;
    return Array.isArray(sel) ? sel.includes(candidate) : sel === candidate;
  };

  const getRank = (office: string, candidate: string) => {
    const sel = selections[office];
    if (!Array.isArray(sel)) return 0;
    return sel.indexOf(candidate) + 1;
  };

  const allSelected = ballotData.every((c) => {
    const sel = selections[c.office];
    return system === "fptp" ? !!sel : Array.isArray(sel) && sel.length > 0;
  });

  const results = useMemo(() => {
    if (!showResults) return {};
    const res: { [office: string]: SimResult[] } = {};
    ballotData.forEach((contest) => {
      const officeKey = contest.office.includes("President") ? "President" : contest.office.includes("Senator") ? "Senator" : "Representative";
      const voteCounts: { [name: string]: number } = {};
      contest.candidates.forEach((c) => { voteCounts[c.name] = 0; });
      mockVoters.forEach((v) => {
        const pick = v[officeKey as keyof typeof v];
        if (pick && voteCounts[pick] !== undefined) voteCounts[pick]++;
      });
      const userPick = system === "fptp" ? selections[contest.office] as string : (selections[contest.office] as string[])?.[0];
      if (userPick && voteCounts[userPick] !== undefined) voteCounts[userPick]++;
      const total = Object.values(voteCounts).reduce((a, b) => a + b, 0);
      const maxVotes = Math.max(...Object.values(voteCounts));
      res[contest.office] = contest.candidates.map((c) => ({
        name: c.name, party: c.party, votes: voteCounts[c.name],
        pct: total > 0 ? Math.round((voteCounts[c.name] / total) * 100) : 0,
        winner: voteCounts[c.name] === maxVotes,
      })).sort((a, b) => b.votes - a.votes);
    });
    return res;
  }, [showResults, ballotData, selections, system]);

  const userContribution = useMemo(() => {
    if (!showResults) return 0;
    const totalVoters = mockVoters.length + 1;
    return Math.round((1 / totalVoters) * 100);
  }, [showResults]);

  const handleReset = () => { setSelections({}); setShowResults(false); };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-4">
            <Vote className="w-7 h-7 text-violet-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Practice Ballot</h2>
          <p className="text-slate-400">Try voting in a simulated election</p>
        </motion.div>

        {/* Voting system toggle */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-6">
          {[{ key: "fptp" as const, label: "First Past the Post" }, { key: "ranked" as const, label: "Ranked Choice" }].map((s) => (
            <button key={s.key} onClick={() => { setSystem(s.key); setSelections({}); setShowResults(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${system === s.key ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
              {s.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div key="ballot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-4 mb-6">
                {ballotData.map((contest, ci) => (
                  <motion.div key={contest.office} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 + 0.2 }}
                    className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/5">
                      <h3 className="text-sm font-semibold text-white">{contest.office}</h3>
                      <p className="text-xs text-slate-500">{system === "fptp" ? "Select one candidate" : "Rank candidates by preference"}</p>
                    </div>
                    <div className="p-3 space-y-1.5">
                      {contest.candidates.map((cand) => (
                        <button key={cand.name} onClick={() => handleSelect(contest.office, cand.name)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left cursor-pointer ${isSelected(contest.office, cand.name) ? "bg-violet-500/10 border-violet-500/40" : "bg-white/[0.02] border-transparent hover:bg-white/[0.05]"}`}>
                          {system === "ranked" && isSelected(contest.office, cand.name) && (
                            <div className="w-6 h-6 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                              {getRank(contest.office, cand.name)}
                            </div>
                          )}
                          {system === "ranked" && !isSelected(contest.office, cand.name) && <GripVertical className="w-4 h-4 text-slate-600 shrink-0" />}
                          {system === "fptp" && (
                            <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${isSelected(contest.office, cand.name) ? "border-violet-500 bg-violet-500" : "border-white/20"}`}>
                              {isSelected(contest.office, cand.name) && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{cand.name}</p>
                            <p className="text-xs text-slate-500">{cand.party}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <button onClick={() => setCurrentStep("ballot")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                  <ArrowLeft className="w-4 h-4" />Back
                </button>
                <button onClick={() => setShowResults(true)} disabled={!allSelected}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${allSelected ? "bg-violet-600 hover:bg-violet-500 text-white" : "bg-white/5 text-slate-600 cursor-not-allowed"}`}>
                  Cast Vote<Vote className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              {/* Contribution insight */}
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-xl p-4 mb-6 text-center">
                <BarChart3 className="w-6 h-6 text-violet-400 mx-auto mb-2" />
                <p className="text-white font-medium">Your vote contributed <span className="text-violet-400 font-bold">{userContribution}%</span> to the outcome</p>
                <p className="text-xs text-slate-400 mt-1">In a pool of {mockVoters.length + 1} voters</p>
              </motion.div>

              <div className="space-y-4 mb-6">
                {Object.entries(results).map(([office, candidates], oi) => (
                  <motion.div key={office} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: oi * 0.1 + 0.3 }}
                    className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/5">
                      <h3 className="text-sm font-semibold text-white">{office}</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {candidates.map((c) => (
                        <div key={c.name}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {c.winner && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                              <span className={`text-sm ${c.winner ? "text-white font-semibold" : "text-slate-400"}`}>{c.name}</span>
                            </div>
                            <span className="text-sm font-mono text-slate-400">{c.pct}%</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 0.8, delay: 0.5 }}
                              className={`h-full rounded-full ${c.winner ? "bg-gradient-to-r from-violet-500 to-indigo-500" : "bg-white/20"}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button onClick={handleReset} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                  <RotateCcw className="w-4 h-4" />Try Again
                </button>
                <button onClick={() => setCurrentStep("checklist")} className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-violet-600 hover:bg-violet-500 text-white transition-all cursor-pointer">
                  View Checklist<ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
