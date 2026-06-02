import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();
  const [initialLoading, setInitialLoading] = useState(true);
  const [form, setForm] = useState({
    username: "",
    gender: "",
    collegeName: "",
    degree: "",
    branch: "",
    graduationYear: "",
    skills: "",
    bio: "",
    github: "",
    linkedin: "",
    x: "",
    portfolio: "",
    projects: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/profile", { credentials: "include" });
        if (!res.ok) {
          setInitialLoading(false);
          return;
        }

        const user = await res.json();
        if (!mounted) return;

        if (user.onboardingCompleted) {
          navigate("/");
          return;
        }

        setForm((s) => ({
          ...s,
          username: user.username || s.username,
          gender: user.gender || s.gender,
          collegeName: user.college?.collegeName || s.collegeName,
          degree: user.college?.degree || s.degree,
          branch: user.college?.branch || s.branch,
          graduationYear: user.college?.graduationYear || s.graduationYear,
          skills: Array.isArray(user.skills) ? user.skills.join(", ") : s.skills,
          bio: user.bio || s.bio,
          github: user.socials?.github || s.github,
          linkedin: user.socials?.linkedin || s.linkedin,
          x: user.socials?.x || s.x,
          portfolio: user.socials?.portfolio || s.portfolio,
          projects: Array.isArray(user.projects) ? user.projects.map(p=>p.title).join(", ") : s.projects,
        }));
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setInitialLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        username: form.username,
        gender: form.gender,
        college: {
          collegeName: form.collegeName,
          degree: form.degree,
          branch: form.branch,
          graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
        },
        skills: form.skills.split(",").map(s=>s.trim()).filter(Boolean),
        bio: form.bio,
        github: form.github,
        linkedin: form.linkedin,
        x: form.x,
        portfolio: form.portfolio,
        projects: form.projects.split(",").map(title=>({ title: title.trim() })).filter(Boolean),
      };

      const res = await fetch("/api/auth/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(()=>({}));
        throw new Error(data.message || "Onboarding failed");
      }

      navigate("/");
    } catch (err) {
      setError(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 p-6">
      <div className="w-full max-w-4xl bg-slate-900/60 backdrop-blur rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-2">Complete your profile</h2>
        <p className="text-slate-300 mb-6">Provide details so team creators can find you. This matches our backend schema.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300">Full name</label>
            <input name="username" value={form.username} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-slate-800 border border-slate-700" placeholder="username or handle" />
          </div>

          <div>
            <label className="block text-sm text-slate-300">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-slate-800 border border-slate-700">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-300">College</label>
            <input name="collegeName" value={form.collegeName} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-slate-800 border border-slate-700" />
          </div>

          <div>
            <label className="block text-sm text-slate-300">Degree</label>
            <input name="degree" value={form.degree} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-slate-800 border border-slate-700" />
          </div>

          <div>
            <label className="block text-sm text-slate-300">Branch</label>
            <input name="branch" value={form.branch} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-slate-800 border border-slate-700" />
          </div>

          <div>
            <label className="block text-sm text-slate-300">Graduation Year</label>
            <input name="graduationYear" value={form.graduationYear} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-slate-800 border border-slate-700" type="number" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-300">Skills (comma separated)</label>
            <input name="skills" value={form.skills} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-slate-800 border border-slate-700" placeholder="React, Node.js, Python" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-300">Short Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} className="mt-1 w-full rounded-md p-2 bg-slate-800 border border-slate-700" placeholder="A short intro about you"></textarea>
          </div>

          <div>
            <label className="block text-sm text-slate-300">GitHub</label>
            <input name="github" value={form.github} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-slate-800 border border-slate-700" />
          </div>

          <div>
            <label className="block text-sm text-slate-300">LinkedIn</label>
            <input name="linkedin" value={form.linkedin} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-slate-800 border border-slate-700" />
          </div>

          <div>
            <label className="block text-sm text-slate-300">X / Twitter</label>
            <input name="x" value={form.x} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-slate-800 border border-slate-700" />
          </div>

          <div>
            <label className="block text-sm text-slate-300">Portfolio</label>
            <input name="portfolio" value={form.portfolio} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-slate-800 border border-slate-700" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-300">Projects (comma separated - titles)</label>
            <input name="projects" value={form.projects} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-slate-800 border border-slate-700" placeholder="Project A, Project B" />
          </div>

          <div className="md:col-span-2 flex items-center gap-3 mt-4">
            <button type="submit" disabled={loading} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white">
              {loading ? "Saving..." : "Save and Continue"}
            </button>
            {error && <span className="text-rose-300">{error}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
