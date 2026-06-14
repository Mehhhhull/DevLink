import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { SparklesIcon, ChartBarIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// Beautiful Score Bar Component
const ScoreBar = ({ label, score, maxScore = 10, color = "purple" }) => {
  const percentage = (score / maxScore) * 100;
  const colorClasses = {
    purple: "bg-purple-500",
    blue: "bg-blue-500", 
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500"
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "green";
    if (score >= 6) return "yellow";
    if (score >= 4) return "blue";
    return "red";
  };

  const scoreColor = getScoreColor(score);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-200 capitalize">{label}</span>
        <span className="text-sm font-bold text-white">{score}/{maxScore}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${colorClasses[scoreColor]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Enhanced Evaluation Display Component
const EvaluationDisplay = ({ result }) => {
  if (typeof result === 'string') {
    return <div className="text-slate-300 whitespace-pre-wrap">{result}</div>;
  }

  if (!result || typeof result !== 'object') {
    return <div className="text-slate-300">Evaluation complete</div>;
  }

  const { overallScore, evaluations, summary } = result;
  
  return (
    <div className="space-y-6">
      {/* Overall Score Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
            <ChartBarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Overall Score</h3>
            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {overallScore}/10
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      {evaluations && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            📊 Detailed Evaluation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(evaluations).map(([criteria, data]) => {
              if (data && !data.error) {
                return (
                  <div key={criteria} className="space-y-3">
                    <ScoreBar label={criteria} score={data.score} />
                    
                    {/* Reasoning */}
                    {data.judgeReasoning && (
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {data.judgeReasoning}
                        </p>
                      </div>
                    )}
                    
                    {/* Strengths */}
                    {data.strengths && data.strengths.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-green-400 flex items-center gap-1">
                          <CheckCircleIcon className="w-3 h-3" />
                          Strengths
                        </h5>
                        <ul className="space-y-1">
                          {data.strengths.slice(0, 2).map((strength, idx) => (
                            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Weaknesses */}
                    {data.weaknesses && data.weaknesses.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-yellow-400 flex items-center gap-1">
                          <ExclamationTriangleIcon className="w-3 h-3" />
                          Areas to Improve
                        </h5>
                        <ul className="space-y-1">
                          {data.weaknesses.slice(0, 2).map((weakness, idx) => (
                            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                              <span className="text-yellow-400 mt-1">•</span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

      {/* Judge Summary */}
      {summary && !summary.error && (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-xl p-6 border border-slate-600">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            🎯 Judge Summary
          </h4>
          <div className="space-y-4">
            {summary.overallVerdict && (
              <div>
                <h5 className="text-sm font-medium text-slate-300 mb-2">Verdict</h5>
                <p className="text-sm text-white bg-slate-700/50 rounded-lg p-3">{summary.overallVerdict}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summary.biggestStrength && (
                <div>
                  <h5 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-1">
                    💪 Biggest Strength
                  </h5>
                  <p className="text-xs text-slate-300 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    {summary.biggestStrength}
                  </p>
                </div>
              )}
              
              {summary.biggestWeakness && (
                <div>
                  <h5 className="text-sm font-medium text-yellow-400 mb-2 flex items-center gap-1">
                    🔧 Main Improvement
                  </h5>
                  <p className="text-xs text-slate-300 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    {summary.biggestWeakness}
                  </p>
                </div>
              )}
            </div>
            
            {summary.winningProbability && (
              <div>
                <h5 className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-1">
                  🏆 Winning Probability
                </h5>
                <p className="text-sm font-semibold text-white bg-purple-500/20 border border-purple-500/30 rounded-lg p-3">
                  {summary.winningProbability}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
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
        component: <EvaluationDisplay result={data.evaluationResult || data.message} />,
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
                    className={`max-w-[90%] ${
                      msg.type === "user"
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-2xl"
                        : msg.type === "error"
                        ? "bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-500/30 px-4 py-3 rounded-2xl"
                        : "w-full" // AI messages take full width for rich components
                    }`}
                  >
                    {msg.component ? (
                      msg.component
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                    )}
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
