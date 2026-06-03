import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, setUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    username: user?.username || "",
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    gender: user?.gender || "",
    experienceLevel: user?.experienceLevel || "",
    availability: user?.availability || "",
    skills: Array.isArray(user?.skills) ? user.skills.join(", ") : "",
    college: {
      collegeName: user?.college?.collegeName || "",
      degree: user?.college?.degree || "",
      branch: user?.college?.branch || ""
    },
    location: {
      city: user?.location?.city || "",
      country: user?.location?.country || ""
    }
  });
  const [updating, setUpdating] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...profileForm,
          skills: profileForm.skills.split(",").map(s => s.trim()).filter(Boolean)
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        // Show success message or toast here
      }
    } catch (err) {
      console.error("Profile update error:", err);
    }
    setUpdating(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
            {user?.username?.[0]?.toUpperCase() || user?.fullName?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
            <p className="text-slate-400">Update your profile information and preferences</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Your username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input
                type="text"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Your full name"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
            <textarea
              value={profileForm.bio}
              onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              rows="4"
              placeholder="Tell others about yourself, your experience, and interests..."
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Skills</label>
            <input
              type="text"
              value={profileForm.skills}
              onChange={(e) => setProfileForm(prev => ({ ...prev, skills: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="React, Node.js, Python, Design, ML (comma-separated)"
            />
          </div>

          {/* Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Gender</label>
              <select
                value={profileForm.gender}
                onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Experience Level</label>
              <select
                value={profileForm.experienceLevel}
                onChange={(e) => setProfileForm(prev => ({ ...prev, experienceLevel: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Experience</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Availability</label>
              <select
                value={profileForm.availability}
                onChange={(e) => setProfileForm(prev => ({ ...prev, availability: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Availability</option>
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
                <option value="weekends">Weekends only</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          {/* College Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">College Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">College Name</label>
                <input
                  type="text"
                  value={profileForm.college.collegeName}
                  onChange={(e) => setProfileForm(prev => ({ 
                    ...prev, 
                    college: { ...prev.college, collegeName: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Your college/university"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Degree</label>
                <input
                  type="text"
                  value={profileForm.college.degree}
                  onChange={(e) => setProfileForm(prev => ({ 
                    ...prev, 
                    college: { ...prev.college, degree: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="B.Tech, B.Sc, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Branch/Major</label>
                <input
                  type="text"
                  value={profileForm.college.branch}
                  onChange={(e) => setProfileForm(prev => ({ 
                    ...prev, 
                    college: { ...prev.college, branch: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Computer Science, etc."
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                <input
                  type="text"
                  value={profileForm.location.city}
                  onChange={(e) => setProfileForm(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, city: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Your city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
                <input
                  type="text"
                  value={profileForm.location.country}
                  onChange={(e) => setProfileForm(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, country: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Your country"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={updating}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {updating ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Account Information */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-2xl p-8 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
            <div>
              <p className="text-white font-medium">Email Address</p>
              <p className="text-slate-400 text-sm">Your account email</p>
            </div>
            <span className="text-slate-300">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
            <div>
              <p className="text-white font-medium">Account Created</p>
              <p className="text-slate-400 text-sm">When you joined DevLink</p>
            </div>
            <span className="text-slate-300">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center py-3">
            <div>
              <p className="text-white font-medium">Profile Status</p>
              <p className="text-slate-400 text-sm">Your profile completion status</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}