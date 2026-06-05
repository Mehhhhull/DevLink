import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LightBulbIcon,
  HandThumbUpIcon,
  ChatBubbleLeftEllipsisIcon,
  SparklesIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const statusLabels = {
  open: "Open",
  "in progress": "In Progress",
  solved: "Solved",
};

const statusStyles = {
  open: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  "in progress": "bg-amber-500/10 text-amber-300 border-amber-500/20",
  solved: "bg-sky-500/10 text-sky-300 border-sky-500/20",
};

function Chip({ children }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-100 border border-slate-700/80">
      {children}
    </span>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function IdeaHub() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [filters, setFilters] = useState({ status: "all", search: "" });
  const [form, setForm] = useState({ title: "", summary: "", details: "", techStack: "" });
  const [commentForms, setCommentForms] = useState({});
  const [expandedIdeas, setExpandedIdeas] = useState({});

  const loadIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ideas", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load ideas");
      const data = await res.json();
      setIdeas(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message || "Unable to fetch ideas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesStatus = filters.status === "all" || idea.status === filters.status;
      const term = filters.search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        idea.title.toLowerCase().includes(term) ||
        idea.summary.toLowerCase().includes(term) ||
        idea.details.toLowerCase().includes(term) ||
        idea.techStack?.some((tag) => tag.toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [ideas, filters]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.summary.trim() || !form.details.trim()) {
      setMessage({ type: "error", text: "Title, summary, and details are required." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          summary: form.summary.trim(),
          details: form.details.trim(),
          techStack: form.techStack
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit idea.");
      setForm({ title: "", summary: "", details: "", techStack: "" });
      setMessage({ type: "success", text: "Idea created successfully." });
      await loadIdeas();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Could not submit idea." });
    } finally {
      setSaving(false);
    }
  };

  const toggleLike = async (ideaId) => {
    try {
      const res = await fetch(`/api/ideas/${ideaId}/like`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Unable to update like.");
      await loadIdeas();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to like idea." });
    }
  };

  const handleCommentChange = (ideaId, value) => {
    setCommentForms((prev) => ({
      ...prev,
      [ideaId]: { ...(prev[ideaId] || {}), text: value },
    }));
  };

  const handleCommentTypeChange = (ideaId, value) => {
    setCommentForms((prev) => ({
      ...prev,
      [ideaId]: { ...(prev[ideaId] || {}), type: value },
    }));
  };

  const submitComment = async (ideaId) => {
    const current = commentForms[ideaId] || {};
    if (!current.text?.trim()) {
      setMessage({ type: "error", text: "Please enter a comment or solution before posting." });
      return;
    }
    try {
      const res = await fetch(`/api/ideas/${ideaId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: current.text.trim(), type: current.type || "comment" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to post comment.");
      setCommentForms((prev) => ({ ...prev, [ideaId]: { text: "", type: "comment" } }));
      setMessage({ type: "success", text: "Your comment was posted." });
      await loadIdeas();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Could not post comment." });
    }
  };

  const toggleDetails = (ideaId) => {
    setExpandedIdeas((prev) => ({ ...prev, [ideaId]: !prev[ideaId] }));
  };

  const getCommentCount = (idea) => idea.comments?.length || 0;
  const getSolutionCount = (idea) => (idea.comments || []).filter((c) => c.type === "solution").length;

  return (
    <div className="space-y-8 pb-12">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl bg-slate-900/90 border border-slate-700/70 p-8 shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-4 py-2 text-sm text-slate-200 font-medium border border-slate-700/50">
                  <LightBulbIcon className="w-4 h-4 text-indigo-300" />
                  Idea Hub
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-white">Share your greatest product idea.</h1>
                <p className="mt-2 max-w-2xl text-slate-400">Submit a problem statement and proposed solution, get votes and community responses, and track whether it is solved.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 border border-slate-700/60 p-4 max-w-sm">
                <div className="flex items-center gap-3 text-slate-200">
                  <SparklesIcon className="w-6 h-6 text-pink-400" />
                  <div>
                    <p className="text-sm font-semibold">New feature ready</p>
                    <p className="text-xs text-slate-400">Submit ideas, upvote, comment, and post solutions.</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-300">
                  <div className="rounded-2xl bg-slate-900/80 border border-slate-700/50 p-3">
                    <p className="font-semibold">Created by</p>
                    <p className="text-slate-400">{user?.fullName || user?.username || user?.email}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/80 border border-slate-700/50 p-3">
                    <p className="font-semibold">Why this exists</p>
                    <p className="text-slate-400">Collect ideas that solve real problems and let the community validate them.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/80 p-4 border border-slate-700/60">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total ideas</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{ideas.length}</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-4 border border-slate-700/60">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Community value</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{ideas.reduce((sum, idea) => sum + (idea.likes || 0), 0)} upvotes</p>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-4 border border-slate-700/60">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Idea title</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleFormChange}
                      placeholder="Short, swipeable idea title"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Short explanation</label>
                    <textarea
                      name="summary"
                      value={form.summary}
                      onChange={handleFormChange}
                      rows={3}
                      placeholder="What problem does this solve?"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Detailed idea</label>
                    <textarea
                      name="details"
                      value={form.details}
                      onChange={handleFormChange}
                      rows={6}
                      placeholder="Explain the concept, users, workflow, and why it matters."
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Tech stack (optional)</label>
                    <input
                      name="techStack"
                      value={form.techStack}
                      onChange={handleFormChange}
                      placeholder="React, Node.js, PostgreSQL"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Ideas with strong writeups get more attention.</p>
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-indigo-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Posting..." : "Submit idea"}
                    </button>
                  </div>

                  {message ? (
                    <div className={`rounded-2xl border p-4 text-sm ${message.type === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-red-500/30 bg-red-500/10 text-red-200"}`}>
                      {message.text}
                    </div>
                  ) : null}
                </form>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-700/70 p-6 shadow-2xl shadow-slate-950/20">
            <div className="flex items-center gap-3 text-slate-200 mb-4">
              <ArrowPathIcon className="w-5 h-5 text-sky-400" />
              <h2 className="text-lg font-semibold">Live problem tracker</h2>
            </div>
            <div className="space-y-4 text-sm text-slate-400">
              <p>Users can post their problems, add full details, optionally list tech stack, and let the community upvote the best ideas.</p>
              <p>Each idea supports comments and solution posts, and solved ideas are marked clearly.</p>
              <p>Use the filters to focus on open ideas, those in progress, or solved prototypes.</p>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-900/90 border border-slate-700/70 p-6 shadow-2xl shadow-slate-950/20">
            <h3 className="text-base font-semibold text-white mb-3">Quick tips</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>• Keep titles short and benefit-focused.</li>
              <li>• Use summary to explain the problem in one sentence.</li>
              <li>• Add real tech stack only if it helps explain feasibility.</li>
              <li>• Mark a comment as solution when you’ve solved it.</li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="rounded-3xl bg-slate-900/90 border border-slate-700/70 p-6 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Ideas & discussions</h2>
            <p className="text-slate-400">Browse community ideas, upvote the strongest ones, and add comments or solution posts.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-3 text-sm text-slate-300">
              {filteredIdeas.length} matched ideas
            </div>
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  className="rounded-2xl border border-slate-700/70 bg-slate-950/90 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={filters.status}
                  onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="all">All statuses</option>
                  <option value="open">Open</option>
                  <option value="in progress">In progress</option>
                  <option value="solved">Solved</option>
                </select>
                <input
                  type="search"
                  placeholder="Search title, summary, stack"
                  className="rounded-2xl border border-slate-700/70 bg-slate-950/90 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {loading ? (
          <div className="rounded-3xl bg-slate-900/90 border border-slate-700/70 p-8 text-center text-slate-300">
            Loading ideas...
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-red-900/80 border border-red-700/70 p-8 text-center text-red-200">
            {error}
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="rounded-3xl bg-slate-900/90 border border-slate-700/70 p-8 text-center text-slate-300">
            No ideas match that filter yet. Try a broader search or create the first idea.
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredIdeas.map((idea) => {
              const currentUserId = user?._id || user?.id || "";
              const linked = idea.likedBy?.some((id) => String(id) === String(currentUserId));
              const expanded = Boolean(expandedIdeas[idea._id]);
              const commentForm = commentForms[idea._id] || { text: "", type: "comment" };

              return (
                <article key={idea._id} className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/20">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[idea.status] || statusStyles.open}`}>
                          <span className="h-2.5 w-2.5 rounded-full bg-current block"></span>
                          {statusLabels[idea.status] || statusLabels.open}
                        </span>
                        {idea.techStack?.length > 0 && <span className="text-xs uppercase tracking-[0.3em] text-slate-500">{idea.techStack.length} tech tags</span>}
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-2xl font-semibold text-white">{idea.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <span>{formatDate(idea.createdAt)}</span>
                          <span>•</span>
                          <span>{idea.createdByName || idea.createdBy?.fullName || idea.createdBy?.username || "Unknown"}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleLike(idea._id)}
                      className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${linked ? "border-pink-500 bg-pink-500/10 text-pink-300" : "border-slate-700 bg-slate-950/70 text-slate-200 hover:border-slate-500 hover:bg-slate-800"}`}
                    >
                      <HandThumbUpIcon className="w-5 h-5" />
                      {idea.likes || 0}
                    </button>
                  </div>

                  <p className="mt-4 text-slate-300 text-lg leading-relaxed">{idea.summary}</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-[1fr_0.75fr]">
                    <div className="space-y-3">
                      <div className="rounded-3xl bg-slate-950/80 border border-slate-700/60 p-4 text-sm text-slate-300">
                        <div className="font-semibold text-slate-100 mb-2">Details</div>
                        <p className={`whitespace-pre-wrap ${expanded ? "" : "max-h-28 overflow-hidden"}`}>{idea.details}</p>
                        {idea.details?.length > 260 ? (
                          <button
                            type="button"
                            onClick={() => toggleDetails(idea._id)}
                            className="mt-3 inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-white"
                          >
                            {expanded ? "Show less" : "Read more"}
                          </button>
                        ) : null}
                      </div>
                      {idea.techStack?.length ? (
                        <div className="rounded-3xl bg-slate-950/80 border border-slate-700/60 p-4">
                          <p className="text-sm font-semibold text-slate-200 mb-3">Tech stack</p>
                          <div className="flex flex-wrap gap-2">
                            {idea.techStack.map((tag) => (
                              <Chip key={tag}>{tag}</Chip>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-3xl bg-slate-950/80 border border-slate-700/60 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-slate-300 font-semibold">Activity</p>
                            <p className="text-slate-500 text-sm">Comments & solutions</p>
                          </div>
                          <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                            <ChatBubbleLeftEllipsisIcon className="w-4 h-4" /> {getCommentCount(idea)}
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
                            <div className="rounded-2xl bg-slate-900/80 p-3">Solutions: {getSolutionCount(idea)}</div>
                            <div className="rounded-2xl bg-slate-900/80 p-3">Status: {statusLabels[idea.status]}</div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl bg-slate-950/80 border border-slate-700/60 p-4">
                        <label className="text-sm font-semibold text-slate-200">Add a response</label>
                        <textarea
                          rows={4}
                          value={commentForm.text}
                          onChange={(e) => handleCommentChange(idea._id, e.target.value)}
                          placeholder="Share feedback or post a solution..."
                          className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <select
                            value={commentForm.type || "comment"}
                            onChange={(e) => handleCommentTypeChange(idea._id, e.target.value)}
                            className="rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="comment">Comment</option>
                            <option value="solution">Solution</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => submitComment(idea._id)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white hover:from-pink-600 hover:to-violet-700"
                          >
                            <ArrowDownTrayIcon className="w-4 h-4" /> Post
                          </button>
                        </div>
                      </div>

                      <div className="rounded-3xl bg-slate-950/80 border border-slate-700/60 p-4">
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-200">Recent responses</p>
                            <p className="text-slate-500 text-xs">Latest comments and solutions</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {idea.comments?.length ? (
                            idea.comments.slice(-3).reverse().map((comment, idx) => (
                              <div key={`${idea._id}-${idx}`} className="rounded-3xl border border-slate-700/60 bg-slate-900/90 p-3">
                                <div className="flex items-center justify-between gap-3 text-sm">
                                  <div>
                                    <p className="font-semibold text-slate-100">{comment.authorName || comment.authorEmail || "Anonymous"}</p>
                                    <p className="text-slate-500">{comment.type === "solution" ? "Solution" : "Comment"}</p>
                                  </div>
                                  <span className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{comment.type}</span>
                                </div>
                                <p className="mt-2 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">No responses yet. Be the first to comment.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
