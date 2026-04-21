"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { askGemini } from "@/lib/gemini";
import { MessageCircle, Send, Bot, User, ArrowLeft, Sparkles, Loader2 } from "lucide-react";

const suggestedQueries = [
  "Can I vote if I moved recently?",
  "What ID do I need to vote?",
  "How does ranked choice voting work?",
  "What if I miss the registration deadline?",
];

export default function AIAssistant() {
  const { setCurrentStep, chatMessages, addChatMessage, userProfile, eligibilityResult } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = async (text?: string) => {
    const question = text || input.trim();
    if (!question || loading) return;

    const userMsg = { id: Date.now().toString(), role: "user" as const, content: question, timestamp: Date.now() };
    addChatMessage(userMsg);
    setInput("");
    setLoading(true);

    try {
      const response = await askGemini(question, {
        country: userProfile.country,
        region: userProfile.region,
        eligibility: eligibilityResult?.verdict || undefined,
      });
      addChatMessage({ id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: Date.now() });
    } catch {
      addChatMessage({ id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, I couldn't process that. Please try again.", timestamp: Date.now() });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full flex flex-col" style={{ height: "calc(100vh - 6rem)" }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4 shrink-0">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-3">
            <MessageCircle className="w-7 h-7 text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Votely AI Assistant</h2>
          <p className="text-sm text-slate-400">Ask anything about voting and elections</p>
        </motion.div>

        {/* Chat area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 scrollbar-thin">
          {chatMessages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-medium text-white">Try asking</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedQueries.map((q) => (
                    <button key={q} onClick={() => handleSend(q)}
                      className="text-left px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-violet-500/30 text-sm text-slate-300 transition-all cursor-pointer">
                      &ldquo;{q}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {chatMessages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-violet-400" />
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-violet-600 text-white rounded-br-md"
                  : "bg-white/[0.05] border border-white/10 text-slate-200 rounded-bl-md"
              }`}>
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-violet-400" />
              </div>
              <div className="bg-white/[0.05] border border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="shrink-0 space-y-3">
          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything about voting..."
              className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all" />
            <button onClick={() => handleSend()} disabled={!input.trim() || loading}
              className="px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-white/5 disabled:text-slate-600 text-white transition-all cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <button onClick={() => setCurrentStep("checklist")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm cursor-pointer">
              <ArrowLeft className="w-4 h-4" />Back to Checklist
            </button>
            <button onClick={() => setCurrentStep("welcome")} className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
