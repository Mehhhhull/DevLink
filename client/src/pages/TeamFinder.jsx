import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AIJudge from "./AIJudge";

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
  return <span className="inline-block text-xs px-2 py-1 mr-2 mb-2 bg-slate-700/40 rounded-full">{skill}</span>;
}

function Avatar({ name }) {
  const initials = name ? name.split(" ").map(s => s[0]).slice(0,2).join("") : "U";
  return <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold">{initials}</div>;
}

export default function TeamFinder() {
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
  const [activeTab, setActiveTab] = useState("teamMatching");
  const [matchingMode, setMatchingMode] = useState("browseTeams");
  const [profileForm, setProfileForm] = useState({
    username: "",
    fullName: "",
    bio: "",
    gender: "",
    experienceLevel: "",
    availability: "",
    collegeName: "",
    degree: "",
    branch: "",
    graduationYear: "",
    locationCity: "",
    locationCountry: "",
    skills: "",
    github: "",
    linkedin: "",
    x: "",
    portfolio: "",
  });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      username: user.username || "",
      fullName: user.fullName || user.name || "",
      bio: user.bio || "",
      gender: user.gender || "",
      experienceLevel: user.experienceLevel || "",
      availability: user.availability || "",
      collegeName: user.college?.collegeName || "",
      degree: user.college?.degree || "",
      branch: user.college?.branch || "",
      graduationYear: user.college?.graduationYear || "",
      locationCity: user.location?.city || "",
      locationCountry: user.location?.country || "",
      skills: Array.isArray(user.skills) ? user.skills.join(", ") : (typeof user.skills === "string" ? user.skills : ""),
      github: user.socials?.github || "",
      linkedin: user.socials?.linkedin || "",
      x: user.socials?.x || "",
      portfolio: user.socials?.portfolio || "",
    });

    const savedImage = window.localStorage.getItem("teamfinder_profile_image");
    if (savedImage) setProfileImage(savedImage);
  }, [user]);

  const setPreference = async (role) => {
    if (!user) return;
    setPrefUpdating(true);
    try {
      const res = await fetch('/api/team/preference', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ teamRole: role }) });
      if (!res.ok) {
        const d = await res.json().catch(()=>({}));
        throw new Error(d.message || 'Preference update failed');
      }
      setUser(prev => ({ ...(prev||{}), teamRole: role }));
      await loadData();
    } catch (e) {
      console.error(e);
      alert(e.message || 'Failed to update preference');
    } finally {
      setPrefUpdating(false);
    }
  };

  // loader used by handlers
  const loadData = async () => {
    setLoading(true);
    try {
      const s = await fetch("/api/team/seekers", { credentials: "include" });
      if (s.ok) {
        const data = await s.json();
        setSeekers(data.length ? data : demoSeekers);
      } else {
        setSeekers(demoSeekers);
      }

      const open = await fetch("/api/team/open", { credentials: "include" });
      if (open.ok) {
        const data = await open.json();
        setOpenTeams(data.length ? data : demoTeams);
      } else {
        setOpenTeams(demoTeams);
      }

      const t = await fetch("/api/team/my-teams", { credentials: "include" });
      if (t.ok) {
        const data = await t.json();
        if (data.length) {
          setMyTeams(data);
          setHasRealTeam(true);
          if (!selectedTeamId) setSelectedTeamId(data[0]._id);
        } else {
          setMyTeams(demoTeams);
          setHasRealTeam(false);
          setSelectedTeamId(null);
        }
      } else {
        setMyTeams(demoTeams);
        setHasRealTeam(false);
        setSelectedTeamId(null);
      }
    } catch (e) {
      const fallbackSeekers = [...demoSeekers];
      if (user?.teamRole === "find" && !fallbackSeekers.some(u=>u._id===user._id)) fallbackSeekers.unshift(user);
      setSeekers(fallbackSeekers);
      setMyTeams(demoTeams);
      setHasRealTeam(false);
    }
    setLoading(false);
  };

  const loadInvitations = async () => {
    try {
      const res = await fetch('/api/team/invitations', { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setInvitations({
        sentInvitations: data.sentInvitations || [],
        receivedInvitations: data.receivedInvitations || [],
      });
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
    loadInvitations();
  }, [creating, user]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredSeekers = seekers.filter((person) => {
    if (activeTab !== 'findTeammates') return false;
    const collegeValue = `${person.college?.collegeName || ''} ${person.college?.degree || ''} ${person.college?.branch || ''}`.toLowerCase();
    const skillValue = (person.skills || []).join(' ').toLowerCase();
    const locationValue = `${person.location?.city || ''} ${person.location?.country || ''}`.toLowerCase();
    const collegeMatch = filters.college.trim() ? collegeValue.includes(filters.college.trim().toLowerCase()) : true;
    const skillMatch = filters.skills.trim() ? filters.skills.trim().toLowerCase().split(',').every((term) => skillValue.includes(term.trim())) : true;
    const genderMatch = filters.gender ? person.gender === filters.gender : true;
    const locationMatch = filters.location.trim() ? locationValue.includes(filters.location.trim().toLowerCase()) : true;
    const experienceMatch = filters.experienceLevel ? person.experienceLevel === filters.experienceLevel : true;
    const availabilityMatch = filters.availability ? person.availability === filters.availability : true;
    return collegeMatch && skillMatch && genderMatch && locationMatch && experienceMatch && availabilityMatch;
  });

  const handleChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result;
      window.localStorage.setItem("teamfinder_profile_image", imageData);
      setProfileImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: profileForm.username,
        fullName: profileForm.fullName,
        bio: profileForm.bio,
        gender: profileForm.gender,
        experienceLevel: profileForm.experienceLevel,
        availability: profileForm.availability,
        college: {
          collegeName: profileForm.collegeName,
          degree: profileForm.degree,
          branch: profileForm.branch,
          graduationYear: profileForm.graduationYear ? Number(profileForm.graduationYear) : undefined,
        },
        location: {
          city: profileForm.locationCity,
          country: profileForm.locationCountry,
        },
        skills: profileForm.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        socials: {
          github: profileForm.github,
          linkedin: profileForm.linkedin,
          x: profileForm.x,
          portfolio: profileForm.portfolio,
        },
      };
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update profile");
      }
      const updatedUser = await res.json();
      setUser(updatedUser);
      alert("Profile saved successfully!");
    } catch (e) {
      alert(e.message || "Could not save profile");
    }
  };

  const handleInvite = async (teamId, userId) => {
    if (!teamId || !userId) return;
    try {
      const res = await fetch(`/api/team/${teamId}/invite`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Invite failed");
      }
      alert("Invite sent successfully!");
      await loadInvitations();
    } catch (e) {
      alert(e.message || "Could not send invite");
    }
  };

  const respondInvitation = async (invitationId, response) => {
    try {
      const res = await fetch(`/api/team/invitations/${invitationId}/respond`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Response failed");
      }
      await loadInvitations();
    } catch (e) {
      alert(e.message || "Could not update invitation");
    }
  };

  const handleDelete = async (teamId) => {
    if (!teamId) return;
    if (!confirm("Delete this team? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/team/${teamId}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Delete failed");
      }
      setMyTeams((current) => current.filter((team) => team._id !== teamId));
      alert("Team deleted successfully");
      await loadInvitations();
    } catch (e) {
      alert(e.message || "Could not delete team");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = { name: form.name, description: form.description, requiredSkills: form.requiredSkills.split(",").map(s=>s.trim()).filter(Boolean) };
      const res = await fetch("/api/team/create", { method: "POST", credentials: "include", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Create failed");
      setForm({ name: "", description: "", requiredSkills: "" });
      setCreating(false);
      await loadData();
    } catch (e) {
      console.error(e);
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              {activeTab === "settings" ? "Settings" : activeTab === "aiJudge" ? "DevLink AI Hackathon Judge" : "Team Finder"}
            </h1>
            <p className="text-slate-400 mt-1">
              {activeTab === "settings" 
                ? "Update your profile information" 
                : activeTab === "aiJudge"
                ? "Get instant AI feedback on your hackathon ideas."
                : "Discover hackathon teams and talented makers across India."}
            </p>
          </div>
          <div className="text-sm text-slate-300">Signed in as <span className="font-medium">{user?.username || user?.fullName || user?.email}</span></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-3 flex flex-col">
              <button
                type="button"
                onClick={() => setActiveTab("teamMatching")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === "teamMatching" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"}`}
              >Team Matching</button>
              <button
                type="button"
                onClick={() => setActiveTab("aiJudge")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === "aiJudge" ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"}`}
              >AI Judge</button>
              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition mt-auto ${activeTab === "settings" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"}`}
              >Settings</button>
            </div>
          </aside>

          <main className="lg:col-span-4 space-y-6">

            {activeTab === "aiJudge" ? (
              <div className="w-full">
                <AIJudge />
              </div>
            ) : activeTab === "settings" ? (
              <section className="bg-slate-900/70 p-6 rounded-2xl shadow-lg space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-32 h-32 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-700">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-slate-400">No image</span>
                    )}
                  </div>
                  <label className="block text-sm text-slate-300">
                    Upload profile image
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-2 block w-full text-sm text-slate-200" />
                  </label>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="space-y-2 text-sm text-slate-300">
                      Full name
                      <input name="fullName" value={profileForm.fullName} onChange={handleProfileChange} className="w-full rounded-md p-3 bg-slate-800 border border-slate-700" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      Username
                      <input name="username" value={profileForm.username} onChange={handleProfileChange} className="w-full rounded-md p-3 bg-slate-800 border border-slate-700" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      Gender
                      <select name="gender" value={profileForm.gender} onChange={handleProfileChange} className="w-full rounded-md p-3 bg-slate-800 border border-slate-700">
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      Experience level
                      <select name="experienceLevel" value={profileForm.experienceLevel} onChange={handleProfileChange} className="w-full rounded-md p-3 bg-slate-800 border border-slate-700">
                        <option value="">Any level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      Availability
                      <select name="availability" value={profileForm.availability} onChange={handleProfileChange} className="w-full rounded-md p-3 bg-slate-800 border border-slate-700">
                        <option value="">Any availability</option>
                        <option value="weekends">Weekends</option>
                        <option value="parttime">Part-time</option>
                        <option value="fulltime">Full-time</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
                      Bio
                      <textarea name="bio" value={profileForm.bio} onChange={handleProfileChange} className="w-full rounded-md p-3 bg-slate-800 border border-slate-700" rows={4} />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="space-y-2 text-sm text-slate-300">
                      College name
                      <input name="collegeName" value={profileForm.collegeName} onChange={handleProfileChange} className="w-full rounded-md p-3 bg-slate-800 border border-slate-700" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      Degree
                      <input name="degree" value={profileForm.degree} onChange={handleProfileChange} className="w-full rounded-md p-3 bg-slate-800 border border-slate-700" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      Branch
                      <input name="branch" value={profileForm.branch} onChange={handleProfileChange} className="w-full rounded-md p-3 bg-slate-800 border border-slate-700" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      Graduation year
                      <select name="graduationYear" value={profileForm.graduationYear} onChange={handleProfileChange} className="w-full rounded-md p-3 bg-slate-800 border border-slate-700">
                        <option value="">Select Year</option>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      City
                      <input name="locationCity" value={profileForm.locationCity} onChange={handleProfileChange} className="w-full rounded-md p-3 bg-slate-800 border border-slate-700" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      Country
                      <input name="locationCountry" value={profileForm.locationCountry} onChange={handleProfileChange} className="w-full rounded-md p-3 bg-slate-800 border border-slate-700" />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="space-y-2 text-sm text-slate-300">
                      Skills
                      <input name="skills" value={profileForm.skills} onChange={handleProfileChange} placeholder="React, Node.js, Figma" className="w-full rounded-md p-3 bg-slate-800 border border-slate-700" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      GitHub
                      <input name="github" value={profileForm.github} onChange={handleProfileChange} className="w-full rounded-md p-3 bg-slate-800 border border-slate-700" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      LinkedIn
                      <input name="linkedin" value={profileForm.linkedin} onChange={handleProfileChange} className="w-full rounded-md p-3 bg-slate-800 border border-slate-700" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      X / Twitter
                      <input name="x" value={profileForm.x} onChange={handleProfileChange} className="w-full rounded-md p-3 bg-slate-800 border border-slate-700" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
                      Portfolio
                      <input name="portfolio" value={profileForm.portfolio} onChange={handleProfileChange} className="w-full rounded-md p-3 bg-slate-800 border border-slate-700" />
                    </label>
                  </div>

                  <button type="submit" className="px-5 py-3 rounded-full bg-emerald-600 text-white">Save profile</button>
                </form>
              </section>
            ) : (
              <section className="space-y-6">
                <div className="flex gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setMatchingMode("browseTeams")}
                    className={`px-4 py-2 rounded-full ${matchingMode === "browseTeams" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-200"}`}
                  >Browse Teams</button>
                  <button
                    type="button"
                    onClick={() => setMatchingMode("findTeammates")}
                    className={`px-4 py-2 rounded-full ${matchingMode === "findTeammates" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-200"}`}
                  >Find Teammates</button>
                </div>

                {matchingMode === "browseTeams" ? (
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 p-6 rounded-2xl shadow-lg">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">Open teams</h2>
                        <p className="text-slate-400 mt-1">Browse teams currently looking for members.</p>
                      </div>
                    </div>
                    {loading ? <div className="text-slate-400">Loading...</div> : (
                      <div className="space-y-4">
                        {openTeams.map((team) => (
                          <div key={team._id} className="p-4 bg-slate-800/50 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-lg">{team.name}</div>
                                <div className="text-sm text-slate-300">{team.creator?.username || team.creator?.fullName || 'Team creator'}</div>
                              </div>
                              <div className="text-sm text-slate-400">{team.members?.length || 0}/{team.maxMembers || 4}</div>
                            </div>
                            <p className="text-slate-300 mt-2">{team.description}</p>
                            <div className="mt-3">{(team.requiredSkills || []).map(skill => <SkillBadge key={skill} skill={skill} />)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 p-6 rounded-2xl shadow-lg">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">People seeking teams</h2>
                        <p className="text-slate-400 mt-1">Filter by gender, location, experience, availability, and skills.</p>
                      </div>
                    </div>

                    {hasRealTeam && myTeams.length > 0 && (
                      <div className="mb-4">
                        <label className="space-y-2 text-sm text-slate-300">
                          Select a team to invite from
                          <select
                            value={selectedTeamId || ""}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="w-full rounded-md p-3 bg-slate-800 border border-slate-700 text-white"
                          >
                            <option value="">Choose a team...</option>
                            {myTeams.map((team) => (
                              <option key={team._id} value={team._id}>{team.name}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                    )}

                    <div className="flex flex-col gap-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label className="space-y-2 text-sm text-slate-300">
                          College / branch
                          <input
                            name="college"
                            value={filters.college}
                            onChange={handleFilterChange}
                            placeholder="e.g. IIT Bombay"
                            className="w-full rounded-md p-2 bg-slate-800 border border-slate-700"
                          />
                        </label>
                        <label className="space-y-2 text-sm text-slate-300">
                          Skills filter
                          <input
                            name="skills"
                            value={filters.skills}
                            onChange={handleFilterChange}
                            placeholder="e.g. React, ML"
                            className="w-full rounded-md p-2 bg-slate-800 border border-slate-700"
                          />
                        </label>
                        <label className="space-y-2 text-sm text-slate-300">
                          Gender
                          <select
                            name="gender"
                            value={filters.gender}
                            onChange={handleFilterChange}
                            className="w-full rounded-md p-2 bg-slate-800 border border-slate-700"
                          >
                            <option value="">Any gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                          </select>
                        </label>
                        <label className="space-y-2 text-sm text-slate-300">
                          Location
                          <input
                            name="location"
                            value={filters.location}
                            onChange={handleFilterChange}
                            placeholder="City or country"
                            className="w-full rounded-md p-2 bg-slate-800 border border-slate-700"
                          />
                        </label>
                        <label className="space-y-2 text-sm text-slate-300">
                          Experience level
                          <select
                            name="experienceLevel"
                            value={filters.experienceLevel}
                            onChange={handleFilterChange}
                            className="w-full rounded-md p-2 bg-slate-800 border border-slate-700"
                          >
                            <option value="">Any level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </label>
                        <label className="space-y-2 text-sm text-slate-300">
                          Availability
                          <select
                            name="availability"
                            value={filters.availability}
                            onChange={handleFilterChange}
                            className="w-full rounded-md p-2 bg-slate-800 border border-slate-700"
                          >
                            <option value="">Any availability</option>
                            <option value="weekends">Weekends</option>
                            <option value="parttime">Part-time</option>
                            <option value="fulltime">Full-time</option>
                            <option value="flexible">Flexible</option>
                          </select>
                        </label>
                      </div>
                      <div className="text-slate-400 text-sm">Filters are applied live to the people list below.</div>
                    </div>

                    {loading ? <div className="text-slate-400">Loading...</div> : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredSeekers.length > 0 ? filteredSeekers.map(s => (
                          <article key={s._id} className="p-4 bg-slate-800/50 rounded-xl flex items-start gap-4 hover:scale-[1.01] transition">
                            <Avatar name={s.fullName || s.username} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-lg">{s.username || s.fullName}</div>
                                  <div className="text-sm text-slate-300">{s.city}</div>
                                </div>
                                <div className="text-xs text-slate-400">Open to join</div>
                              </div>
                              <p className="text-slate-300 mt-2 text-sm">{s.bio}</p>
                              <div className="mt-3 text-xs text-slate-400 space-y-1">
                                <div>Gender: {s.gender || 'Any'}</div>
                                <div>Location: {s.location?.city || 'Unknown'}, {s.location?.country || 'Unknown'}</div>
                                <div>Experience: {s.experienceLevel || 'Not specified'}</div>
                                <div>Availability: {s.availability || 'Not specified'}</div>
                              </div>
                              <div className="mt-3">
                                {(Array.isArray(s.skills) ? s.skills : []).slice(0,4).map(skill => <SkillBadge key={skill} skill={skill} />)}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button
                                disabled={!hasRealTeam || !selectedTeamId}
                                onClick={() => handleInvite(selectedTeamId, s._id)}
                                className={`px-3 py-1 rounded text-white ${hasRealTeam && selectedTeamId ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-700 cursor-not-allowed'}`}>
                                {hasRealTeam ? (selectedTeamId ? 'Invite' : 'Select a team') : 'Create a team first'}
                              </button>
                            </div>
                          </article>
                        )) : (
                          <div className="text-slate-400">No people match these filters. Try broader skills or college names.</div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-6 rounded-2xl shadow-lg">
                    <h3 className="font-semibold mb-4">Create a team</h3>
                    <form onSubmit={handleCreate} className="space-y-3">
                      <input name="name" value={form.name} onChange={handleChange} placeholder="Team name" className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white" />
                      <input name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="Required skills (comma)" className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white" />
                      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short description" className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white" rows={4} />
                      <button type="submit" disabled={creating} className="w-full px-4 py-3 bg-indigo-600 rounded text-white hover:bg-indigo-500 disabled:opacity-50">{creating ? 'Creating...' : 'Create team'}</button>
                    </form>
                  </div>

                  <div className="bg-slate-900/50 p-6 rounded-2xl shadow-lg">
                    <h3 className="font-semibold mb-3">Invitation inbox</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {invitations.receivedInvitations.length === 0 ? (
                        <div className="text-slate-400 text-sm">No incoming invites yet.</div>
                      ) : (
                        invitations.receivedInvitations.map((invite) => (
                          <div key={invite._id} className="p-3 bg-slate-800 rounded-lg">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{invite.team?.name || 'Unknown team'}</div>
                                <div className="text-xs text-slate-400">From {invite.invitedBy?.username || invite.invitedBy?.fullName || 'someone'}</div>
                              </div>
                              <div className="flex gap-1">
                                <button onClick={() => respondInvitation(invite._id, 'accepted')} className="px-2 py-1 bg-emerald-600 rounded text-xs text-white hover:bg-emerald-500">Accept</button>
                                <button onClick={() => respondInvitation(invite._id, 'rejected')} className="px-2 py-1 bg-rose-600 rounded text-xs text-white hover:bg-rose-500">Reject</button>
                              </div>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">Status: {invite.status}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
