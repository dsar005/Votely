"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { getMockBallotData } from "@/lib/civic-api";
import { ArrowRight, ArrowLeft, Users, Building2, Search } from "lucide-react";

export default function BallotInfo() {
  const { contests, setContests, setCurrentStep, userProfile } = useApp();
  const [address, setAddress] = useState(userProfile.region || "");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (contests.length === 0) {
      setContests(getMockBallotData());
    }
  }, [contests.length, setContests]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { fetchBallotInfo } = await import("@/lib/civic-api");
      const data = await fetchBallotInfo(address);
      setContests(data);
    } catch {
      setContests(getMockBallotData());
    }
    setLoading(false);
    setSearched(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-4">
            <Building2 className="w-7 h-7 text-violet-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">What&apos;s on Your Ballot</h2>
          <p className="text-slate-400">See the offices and candidates you&apos;ll vote on</p>
        </motion.div>

        {/* Address search */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex gap-2">
            <input type="text" placeholder="Enter your address for real ballot data..." value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all" />
            <button onClick={handleSearch} disabled={loading || !address}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-white/5 disabled:text-slate-600 text-white text-sm font-medium transition-all cursor-pointer">
              <Search className="w-4 h-4" />{loading ? "..." : "Search"}
            </button>
          </div>
          {!searched && <p className="text-xs text-slate-500 mt-2">Sample ballot data is shown below. Search your address for real data.</p>}
        </motion.div>

        {/* Contests */}
        <div className="space-y-3">
          {contests.map((contest, i) => (
            <motion.div key={contest.office} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 + 0.3 }}
              className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-white">{contest.office}</h3>
              </div>
              <div className="p-3 space-y-1.5">
                {contest.candidates.map((candidate) => (
                  <div key={candidate.name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-violet-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{candidate.name}</p>
                      <p className="text-xs text-slate-500">{candidate.party}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-8">
          <button onClick={() => setCurrentStep("journey")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />Back
          </button>
          <button onClick={() => setCurrentStep("practice")} className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-violet-600 hover:bg-violet-500 text-white transition-all cursor-pointer">
            Practice Voting<ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
