import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const demoSeekers = [
  { _id: "s1", username: "Aarav", fullName: "Aarav Sharma", bio: "Full-stack dev. Built 5+ hackathon projects.", skills: ["React", "Node.js", "Firebase"], gender: "male", location: { city: "Bengaluru", country: "India" }, college: { collegeName: "IIT Bombay", degree: "B.Tech", branch: "Computer Science" }, experienceLevel: "advanced", availability: "parttime" },
  { _id: "s2", username: "Isha", fullName: "Isha Patel", bio: "UI/UX designer and frontend engineer.", skills: ["Figma", "Tailwind", "React"], gender: "female", location: { city: "Ahmedabad", country: "India" }, college: { collegeName: "NID", degree: "Design", branch: "Interaction Design" }, experienceLevel: "intermediate", availability: "flexible" },
  { _id: "s3", username: "Kabir", fullName: "Kabir Khan", bio: "ML enthusiast, worked with PyTorch and TensorFlow.", skills: ["Python", "PyTorch", "ML"], gender: "male", location: { city: "Hyderabad", country: "India" }, college: { collegeName: "IIIT Hyderabad", degree: "M.Tech", branch: "Data Science" }, experienceLevel: "advanced", availability: "weekends" },
  { _id: "s4", username: "Nisha", fullName: "Nisha Verma", bio: "Mobile dev (Flutter), loves rapid prototyping.", skills: ["Flutter", "Dart", "Figma"], gender: "female", location: { city: "Mumbai", country: "India" }, college: { collegeName: "SIT", degree: "B.Tech", branch: "Information Technology" }, experienceLevel: "intermediate", availability: "fulltime" },
  { _id: "s5", username: "Rohit", fullName: "Rohit Singh", bio: "Backend engineer, scalable systems.", skills: ["Go", "Postgres", "Redis"], gender: "male", location: { city: "Delhi", country: "India" }, college: { collegeName: "NSUT", degree: "B.Tech", branch: "Computer Science" }, experienceLevel: "advanced", availability: "parttime" },
];

const demoTeams = [
  { _id: "t1", name: "ArogyaAI", description: "AI-powered health triage app for rural clinics.", requiredSkills: ["ML", "React", "Node.js"], members: ["Aarav", "Kabir"], maxMembers: 5, city: "Bengaluru" },
  { _id: "t2", name: "CampusConnect", description: "A platform to connect campus teams for hackathons.", requiredSkills: ["React", "Firebase", "UI"], members: ["Isha"], maxMembers: 4, city: "Ahmedabad" },
  { _id: "t3", name: "AgriSense", description: "Crop monitoring + alerts for small farmers.", requiredSkills: ["IoT", "ML", "Flutter"], members: ["Nisha"], maxMembers: 6, city: "Punjab" },
  { _id: "t4", name: "HackKart", description: "Logistics for pop-up hackathon events.", requiredSkills: ["Node.js", "Postgres", "Ops"], members: ["Rohit"], maxMembers: 4, city: "Delhi" },
];

function SkillBadge({ skill }) {
  return <span className="inline-block text-xs px-3 py-1 mr-2 mb-2 bg-slate-700/40 rounded-full text-slate-300">{skill}</span>;
}

function Avatar({ name }) {
  const initials = name ? name.split(" ").map(s => s[0]).slice(0,2).join("") : "U";
  return <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold">{initials}</div>;
}

export default function TeamMatching() {
  const { user, setUser } = useAuth();
  const [seekers, setSeekers] = useState([]);
  const [openTeams, setOpenTeams] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [invitations, setInvitations] = useState({ sentInvitations: [], receivedInvitations: [] });
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [filters, setFilters] = useState({ college: "", skills: "", gender: "", location: "", experienceLevel: "", availability: "" });
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", requiredSkills: "" });
  const [prefUpdating, setPrefUpdating] = useState(false);
  const [hasRealTeam, setHasRealTeam] = useState(false);
  const [matchingMode, setMatchingMode] = useState("browseTeams");

  useEffect(() => {
    fetchSeekers();
    fetchOpenTeams();
    fetchMyTeams();
    fetchInvitations();
  }, []);

  const fetchSeekers = async () => {
    try {
      const res = await fetch("/api/team/seekers", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSeekers(data.length > 0 ? data : demoSeekers);
      } else {
        setSeekers(demoSeekers);
      }
    } catch (err) {
      setSeekers(demoSeekers);
    }
  };

  const fetchOpenTeams = async () => {
    try {
      const res = await fetch("/api/team/open", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setOpenTeams(data.length > 0 ? data : demoTeams);
      } else {
        setOpenTeams(demoTeams);
      }
    } catch (err) {
      setOpenTeams(demoTeams);
    }
  };

  const fetchMyTeams = async () => {
    try {
      const res = await fetch("/api/team/my-teams", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setMyTeams(data);
        setHasRealTeam(data.length > 0);
      }
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    }
  };

  const fetchInvitations = async () => {
    try {
      const res = await fetch("/api/team/invitations", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setInvitations(data);
      }
    } catch (err) {
      console.error("Failed to fetch invitations:", err);
    }
  };

  const filteredSeekers = seekers.filter((person) => {
    if (matchingMode !== 'findTeammates') return false;
    const collegeValue = `${person.college?.collegeName || ''} ${person.college?.degree || ''} ${person.college?.branch || ''}`.toLowerCase();
    const skillValue = (person.skills || []).join(' ').toLowerCase();
    const locationValue = `${person.location?.city || ''} ${person.location?.country || ''}`.toLowerCase();
    
    return (
      (!filters.college || collegeValue.includes(filters.college.toLowerCase())) &&
      (!filters.skills || skillValue.includes(filters.skills.toLowerCase())) &&
      (!filters.gender || person.gender === filters.gender) &&
      (!filters.location || locationValue.includes(filters.location.toLowerCase())) &&
      (!filters.experienceLevel || person.experienceLevel === filters.experienceLevel) &&
      (!filters.availability || person.availability === filters.availability)
    );
  });

  const createTeam = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          requiredSkills: form.requiredSkills.split(",").map(s => s.trim()).filter(Boolean)
        }),
      });

      if (res.ok) {
        setForm({ name: "", description: "", requiredSkills: "" });
        fetchMyTeams();
        fetchOpenTeams();
      }
    } catch (err) {
      console.error("Create team error:", err);
    }
    setCreating(false);
  };

  const updateTeamPreference = async () => {
    if (!selectedTeamId) return;
    setPrefUpdating(true);
    try {
      const res = await fetch("/api/team/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ teamRole: selectedTeamId }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error("Update preference error:", err);
    }
    setPrefUpdating(false);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setMatchingMode("browseTeams")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              matchingMode === "browseTeams"
                ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg"
                : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white"
            }`}
          >
            Browse Teams
          </button>
          <button
            onClick={() => setMatchingMode("findTeammates")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              matchingMode === "findTeammates"
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white"
            }`}
          >
            Find Teammates
          </button>
          <button
            onClick={() => setMatchingMode("myTeams")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              matchingMode === "myTeams"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white"
            }`}
          >
            My Teams
          </button>
        </div>
      </div>

      {matchingMode === "browseTeams" && (
        <div className="space-y-6">
          {/* Team Creation Form */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Create New Team</h3>
            <form onSubmit={createTeam} className="space-y-4">
              <input
                type="text"
                placeholder="Team name"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Team description"
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows="3"
              />
              <input
                type="text"
                placeholder="Required skills (comma-separated)"
                value={form.requiredSkills}
                onChange={(e) => setForm(prev => ({ ...prev, requiredSkills: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={creating}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl hover:from-indigo-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                {creating ? "Creating..." : "Create Team"}
              </button>
            </form>
          </div>

          {/* Open Teams */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6">Open Teams</h3>
            <div className="grid gap-4">
              {openTeams.map((team) => (
                <div key={team._id} className="bg-slate-700/30 rounded-xl p-5 hover:bg-slate-700/50 transition-all duration-200 border border-slate-600/30">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{team.name}</h4>
                      <p className="text-slate-300 text-sm mt-1">{team.description}</p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full">
                      {team.members?.length || 0}/{team.maxMembers} members
                    </span>
                  </div>
                  <div className="mb-3">
                    {team.requiredSkills?.map(skill => (
                      <SkillBadge key={skill} skill={skill} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-slate-400 text-sm">📍 {team.city}</p>
                    <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">
                      Join Team
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {matchingMode === "findTeammates" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Filter Teammates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="College"
                value={filters.college}
                onChange={(e) => setFilters(prev => ({ ...prev, college: e.target.value }))}
                className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Skills"
                value={filters.skills}
                onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <select
                value={filters.experienceLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
                className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Experience Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Teammates Grid */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6">Available Teammates</h3>
            <div className="grid gap-4">
              {filteredSeekers.map((person) => (
                <div key={person._id} className="bg-slate-700/30 rounded-xl p-5 hover:bg-slate-700/50 transition-all duration-200 border border-slate-600/30">
                  <div className="flex items-start gap-4">
                    <Avatar name={person.fullName} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{person.fullName}</h4>
                          <p className="text-slate-400 text-sm">@{person.username}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          person.experienceLevel === 'advanced' ? 'bg-emerald-500/20 text-emerald-300' :
                          person.experienceLevel === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {person.experienceLevel}
                        </span>
                      </div>
                      <p className="text-slate-300 mb-3">{person.bio}</p>
                      <div className="mb-3">
                        {person.skills?.map(skill => (
                          <SkillBadge key={skill} skill={skill} />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-slate-400 text-sm">
                          <span>📍 {person.location?.city}, {person.location?.country}</span>
                          <span className="ml-4">🎓 {person.college?.collegeName}</span>
                        </div>
                        <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">
                          Invite
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {matchingMode === "myTeams" && (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6">My Teams</h3>
          {myTeams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">You haven't created any teams yet.</p>
              <button
                onClick={() => setMatchingMode("browseTeams")}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 font-medium"
              >
                Create Your First Team
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {myTeams.map((team) => (
                <div key={team._id} className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
                  <h4 className="text-lg font-semibold text-white mb-2">{team.name}</h4>
                  <p className="text-slate-300 mb-3">{team.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">
                      {team.members?.length || 0}/{team.maxMembers} members
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      team.status === 'open' ? 'bg-emerald-500/20 text-emerald-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {team.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}