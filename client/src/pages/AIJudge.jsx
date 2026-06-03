import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { SparklesIcon } from "@heroicons/react/24/outline";

// Helper function to format the AI evaluation result
const formatEvaluationResult = (result) => {
  if (typeof result === 'string') return result;
  if (!result || typeof result !== 'object') return "Evaluation complete";

  const { overallScore, evaluations, summary } = result;
  
  let formatted = `🏆 Overall Score: ${overallScore}/10\n\n`;
  
  if (evaluations) {
    formatted += "📊 Detailed Evaluation:\n\n";
    
    Object.entries(evaluations).forEach(([criteria, data]) => {
      if (data && !data.error) {
        formatted += `• ${criteria.toUpperCase()}: ${data.score}/10\n`;
        if (data.judgeReasoning) {
          formatted += `  ${data.judgeReasoning}\n`;
        }
        if (data.strengths && data.strengths.length > 0) {
          formatted += `  ✅ Strengths: ${data.strengths.join(', ')}\n`;
        }
        if (data.weaknesses && data.weaknesses.length > 0) {
          formatted += `  ⚠️ Areas to improve: ${data.weaknesses.join(', ')}\n`;
        }
        formatted += '\n';
      }
    });
  }
  
  if (summary && !summary.error) {
    formatted += "🎯 Judge Summary:\n\n";
    if (summary.overallVerdict) formatted += `Verdict: ${summary.overallVerdict}\n`;
    if (summary.biggestStrength) formatted += `💪 Biggest Strength: ${summary.biggestStrength}\n`;
    if (summary.biggestWeakness) formatted += `🔧 Main Improvement: ${summary.biggestWeakness}\n`;
    if (summary.winningProbability) formatted += `🏆 Winning Probability: ${summary.winningProbability}\n`;
  }
  
  return formatted;
};

export default function AIJudge() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-judge/evaluate-idea", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: input }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Evaluation failed");
      }

      const data = await res.json();
      const aiMessage = {
        type: "ai",
        text: formatEvaluationResult(data.evaluationResult || data.message || "Evaluation complete"),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        type: "error",
        text: `Error: ${err.message}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Judge Interface */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-slate-700/50 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Hackathon Judge</h2>
              <p className="text-slate-300 text-sm">Get expert feedback on your hackathon ideas</p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                    <SparklesIcon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Share Your Hackathon Idea</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Describe your project idea and I'll evaluate it across innovation, feasibility, 
                    technical depth, judge appeal, and scope - just like real hackathon judges would.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      msg.type === "user"
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                        : msg.type === "error"
                        ? "bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-500/30"
                        : "bg-slate-700/50 text-slate-100 border border-slate-600/30"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700/50 border border-slate-600/30 px-4 py-3 rounded-2xl">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="border-t border-slate-700/50 p-6">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your hackathon idea in detail..."
                disabled={loading}
                className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                {loading ? "Judging..." : "Evaluate"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>💡</span>
          Tips for Better Feedback
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs flex items-center justify-center font-medium mt-0.5">1</span>
              <div>
                <p className="text-slate-300 text-sm font-medium">Be Specific</p>
                <p className="text-slate-400 text-xs">Clearly explain what your project does and how it works</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs flex items-center justify-center font-medium mt-0.5">2</span>
              <div>
                <p className="text-slate-300 text-sm font-medium">Target Audience</p>
                <p className="text-slate-400 text-xs">Mention who will use it and what problem it solves</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs flex items-center justify-center font-medium mt-0.5">3</span>
              <div>
                <p className="text-slate-300 text-sm font-medium">Tech Stack</p>
                <p className="text-slate-400 text-xs">Include technologies, frameworks, or tools you plan to use</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs flex items-center justify-center font-medium mt-0.5">4</span>
              <div>
                <p className="text-slate-300 text-sm font-medium">Innovation Angle</p>
                <p className="text-slate-400 text-xs">Highlight what makes your approach unique or creative</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
