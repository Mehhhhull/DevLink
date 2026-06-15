import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

// Comprehensive sample data covering ALL filter combinations
const demoTeammates = [
  // IIT Bombay - All experience levels & genders
  {
    _id: "demo1",
    fullName: "Amrit Thakur",
    username: "amrit_bits",
    bio: "React expert, building scalable web applications.",
    skills: ["React", "JavaScript", "Node.js, Mongo DB"],
    avatar: "AS",
    rating: 4.9,
    projectCount: 18,
    location: { city: "Kolkata", country: "IN" },
    college: { collegeName: "Bit kolkata" },
    experienceLevel: "advanced",
    gender: "male"
  },
  {
    _id: "demo2",
    fullName: "Priya Verma",
    username: "priya_iit",
    bio: "Python & AI/ML specialist, passionate about data science.",
    skills: ["Python", "AI/ML", "TensorFlow"],
    avatar: "PV",
    rating: 4.8,
    projectCount: 15,
    location: { city: "Mumbai", country: "IN" },
    college: { collegeName: "IIT Bombay" },
    experienceLevel: "intermediate",
    gender: "female"
  },
  {
    _id: "demo3",
    fullName: "Alex Chen",
    username: "alex_iit",
    bio: "Design enthusiast creating beautiful user experiences.",
    skills: ["Design", "Figma", "UI/UX"],
    avatar: "AC",
    rating: 4.6,
    projectCount: 8,
    location: { city: "Mumbai", country: "IN" },
    college: { collegeName: "IIT Bombay" },
    experienceLevel: "beginner",
    gender: "other"
  },

  // Delhi University - All combinations
  {
    _id: "demo4",
    fullName: "Ravi Kumar",
    username: "ravi_du",
    bio: "Mobile app developer specializing in cross-platform solutions.",
    skills: ["Mobile", "Flutter", "React Native"],
    avatar: "RK",
    rating: 4.7,
    projectCount: 12,
    location: { city: "Delhi", country: "IN" },
    college: { collegeName: "Delhi University" },
    experienceLevel: "advanced",
    gender: "male"
  },
  {
    _id: "demo5",
    fullName: "Sneha Patel",
    username: "sneha_du",
    bio: "Backend engineer focused on scalable microservices architecture.",
    skills: ["Backend", "Java", "Spring Boot"],
    avatar: "SP",
    rating: 4.5,
    projectCount: 10,
    location: { city: "Delhi", country: "IN" },
    college: { collegeName: "Delhi University" },
    experienceLevel: "intermediate",
    gender: "female"
  },
  {
    _id: "demo6",
    fullName: "Sam Wilson",
    username: "sam_du",
    bio: "Blockchain enthusiast working on DeFi applications.",
    skills: ["Blockchain", "Solidity", "Web3"],
    avatar: "SW",
    rating: 4.3,
    projectCount: 6,
    location: { city: "Delhi", country: "IN" },
    college: { collegeName: "Delhi University" },
    experienceLevel: "beginner",
    gender: "other"
  },

  // SRM University - All combinations
  {
    _id: "demo7",
    fullName: "Manish Singh",
    username: "manish_srm",
    bio: "DevOps engineer automating deployment pipelines.",
    skills: ["DevOps", "Docker", "Kubernetes"],
    avatar: "MS",
    rating: 4.8,
    projectCount: 14,
    location: { city: "Chennai", country: "IN" },
    college: { collegeName: "SRM University" },
    experienceLevel: "advanced",
    gender: "male"
  },
  {
    _id: "demo8",
    fullName: "Kavya Reddy",
    username: "kavya_srm",
    bio: "Full-stack developer with expertise in MERN stack.",
    skills: ["React", "Backend", "MongoDB"],
    avatar: "KR",
    rating: 4.4,
    projectCount: 9,
    location: { city: "Chennai", country: "IN" },
    college: { collegeName: "SRM University" },
    experienceLevel: "intermediate",
    gender: "female"
  },
  {
    _id: "demo9",
    fullName: "Jordan Lee",
    username: "jordan_srm",
    bio: "Python developer interested in machine learning applications.",
    skills: ["Python", "AI/ML", "Scikit-learn"],
    avatar: "JL",
    rating: 4.2,
    projectCount: 5,
    location: { city: "Chennai", country: "IN" },
    college: { collegeName: "SRM University" },
    experienceLevel: "beginner",
    gender: "other"
  },

  // NIT Surat - All combinations
  {
    _id: "demo10",
    fullName: "Vikash Gupta",
    username: "vikash_nit",
    bio: "Mobile developer creating innovative iOS and Android apps.",
    skills: ["Mobile", "Swift", "Kotlin"],
    avatar: "VG",
    rating: 4.6,
    projectCount: 11,
    location: { city: "Surat", country: "IN" },
    college: { collegeName: "NIT Surat" },
    experienceLevel: "advanced",
    gender: "male"
  },
  {
    _id: "demo11",
    fullName: "Anita Sharma",
    username: "anita_nit",
    bio: "Design professional focusing on user-centered design principles.",
    skills: ["Design", "Adobe XD", "Prototyping"],
    avatar: "AN",
    rating: 4.5,
    projectCount: 7,
    location: { city: "Surat", country: "IN" },
    college: { collegeName: "NIT Surat" },
    experienceLevel: "intermediate",
    gender: "female"
  },
  {
    _id: "demo12",
    fullName: "Taylor Smith",
    username: "taylor_nit",
    bio: "Blockchain developer exploring smart contract development.",
    skills: ["Blockchain", "Ethereum", "DApps"],
    avatar: "TS",
    rating: 4.1,
    projectCount: 4,
    location: { city: "Surat", country: "IN" },
    college: { collegeName: "NIT Surat" },
    experienceLevel: "beginner",
    gender: "other"
  },

  // COEP - All combinations
  {
    _id: "demo13",
    fullName: "Arjun Mehta",
    username: "arjun_coep",
    bio: "DevOps specialist with expertise in cloud infrastructure.",
    skills: ["DevOps", "AWS", "Terraform"],
    avatar: "AM",
    rating: 4.7,
    projectCount: 13,
    location: { city: "Pune", country: "IN" },
    college: { collegeName: "COEP" },
    experienceLevel: "advanced",
    gender: "male"
  },
  {
    _id: "demo14",
    fullName: "Ishita Jain",
    username: "ishita_coep",
    bio: "Backend developer with strong database optimization skills.",
    skills: ["Backend", "PostgreSQL", "Redis"],
    avatar: "IJ",
    rating: 4.4,
    projectCount: 8,
    location: { city: "Pune", country: "IN" },
    college: { collegeName: "COEP" },
    experienceLevel: "intermediate",
    gender: "female"
  },
  {
    _id: "demo15",
    fullName: "Satyam Singh",
    username: "satyam_coep",
    bio: "Python enthusiast learning about artificial intelligence.",
    skills: ["Python", "AI/ML", "Pandas"],
    avatar: "RJ",
    rating: 4.0,
    projectCount: 3,
    location: { city: "Pune", country: "IN" },
    college: { collegeName: "PNIT" },
    experienceLevel: "beginner",
    gender: "male"
  },

  // Additional talented team members for matching scenarios
  {
    _id: "demo16",
    fullName: "Nikhil Deshmukh",
    username: "nikhil_iitd",
    bio: "Full-stack engineer with expertise in React and Node.js.",
    skills: ["React", "Backend", "JavaScript"],
    avatar: "ND",
    rating: 4.8,
    projectCount: 16,
    location: { city: "Delhi", country: "IN" },
    college: { collegeName: "IIT Delhi" },
    experienceLevel: "advanced",
    gender: "male"
  },
  {
    _id: "demo17",
    fullName: "Divya Mishra",
    username: "divya_bits",
    bio: "UI/UX designer passionate about creating accessible interfaces.",
    skills: ["Design", "Figma", "Prototyping"],
    avatar: "DM",
    rating: 4.7,
    projectCount: 12,
    location: { city: "Goa", country: "IN" },
    college: { collegeName: "BITS Pilani" },
    experienceLevel: "advanced",
    gender: "female"
  },
  {
    _id: "demo18",
    fullName: "Harsh Patel",
    username: "harsh_vit",
    bio: "Cloud architect specializing in AWS and serverless solutions.",
    skills: ["DevOps", "AWS", "Serverless"],
    avatar: "HP",
    rating: 4.6,
    projectCount: 10,
    location: { city: "Vellore", country: "IN" },
    college: { collegeName: "VIT Vellore" },
    experienceLevel: "advanced",
    gender: "male"
  },
  {
    _id: "demo19",
    fullName: "Zara Khan",
    username: "zara_jmi",
    bio: "Database specialist with expertise in SQL optimization.",
    skills: ["Backend", "Database", "PostgreSQL"],
    avatar: "ZK",
    rating: 4.5,
    projectCount: 9,
    location: { city: "New Delhi", country: "IN" },
    college: { collegeName: "Jamia Millia Islamia" },
    experienceLevel: "intermediate",
    gender: "female"
  },
  {
    _id: "demo20",
    fullName: "Rohan Saxena",
    username: "rohan_iitm",
    bio: "Mobile app developer specializing in native iOS development.",
    skills: ["Mobile", "Swift", "iOS"],
    avatar: "RS",
    rating: 4.9,
    projectCount: 19,
    location: { city: "Chennai", country: "IN" },
    college: { collegeName: "IIT Madras" },
    experienceLevel: "advanced",
    gender: "male"
  },
  {
    _id: "demo21",
    fullName: "Meera Nair",
    username: "meera_amrita",
    bio: "Machine learning engineer building computer vision models.",
    skills: ["Python", "AI/ML", "TensorFlow"],
    avatar: "MN",
    rating: 4.7,
    projectCount: 14,
    location: { city: "Coimbatore", country: "IN" },
    college: { collegeName: "Amrita Vishwa Vidyapeetham" },
    experienceLevel: "advanced",
    gender: "female"
  },
  {
    _id: "demo22",
    fullName: "Aditya Singh",
    username: "aditya_jiit",
    bio: "Web developer keen on learning modern frameworks and tools.",
    skills: ["React", "JavaScript", "CSS"],
    avatar: "AS2",
    rating: 4.3,
    projectCount: 6,
    location: { city: "Noida", country: "IN" },
    college: { collegeName: "JIIT Noida" },
    experienceLevel: "intermediate",
    gender: "male"
  },
  {
    _id: "demo23",
    fullName: "Priyanka Ghosh",
    username: "priyanka_iitg",
    bio: "QA engineer passionate about automation testing frameworks.",
    skills: ["Testing", "Selenium", "JavaScript"],
    avatar: "PG",
    rating: 4.4,
    projectCount: 8,
    location: { city: "Guwahati", country: "IN" },
    college: { collegeName: "IIT Guwahati" },
    experienceLevel: "intermediate",
    gender: "female"
  },
  {
    _id: "demo24",
    fullName: "Vikram Kumar",
    username: "vikram_jecrc",
    bio: "Blockchain developer with DeFi and NFT project experience.",
    skills: ["Blockchain", "Solidity", "Web3"],
    avatar: "VK",
    rating: 4.6,
    projectCount: 11,
    location: { city: "Jaipur", country: "IN" },
    college: { collegeName: "JECRC" },
    experienceLevel: "advanced",
    gender: "male"
  },
  {
    _id: "demo25",
    fullName: "Shreya Banerjee",
    username: "shreya_kiit",
    bio: "GraphQL expert building scalable API architectures.",
    skills: ["Backend", "GraphQL", "Node.js"],
    avatar: "SB",
    rating: 4.5,
    projectCount: 9,
    location: { city: "Bhubaneswar", country: "IN" },
    college: { collegeName: "KIIT University" },
    experienceLevel: "intermediate",
    gender: "female"
  }
];

function SkillBadge({ skill }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 mr-2 mb-2">
      {skill}
    </span>
  );
}

function Avatar({ initials }) {
  const colors = {
    // Original colors
    RS: "bg-gradient-to-br from-blue-500 to-purple-600",
    MP: "bg-gradient-to-br from-purple-500 to-pink-600", 
    PS: "bg-gradient-to-br from-pink-500 to-red-500",
    AM: "bg-gradient-to-br from-green-500 to-blue-500",
    SP: "bg-gradient-to-br from-yellow-500 to-orange-500",
    RK: "bg-gradient-to-br from-red-500 to-pink-500",
    AG: "bg-gradient-to-br from-emerald-500 to-teal-500",
    VS: "bg-gradient-to-br from-violet-500 to-purple-500",
    KR: "bg-gradient-to-br from-cyan-500 to-blue-500",
    AT: "bg-gradient-to-br from-amber-500 to-orange-500",
    SJ: "bg-gradient-to-br from-lime-500 to-green-500",
    // New colors for additional users
    AS: "bg-gradient-to-br from-indigo-500 to-blue-600",
    PV: "bg-gradient-to-br from-rose-500 to-pink-600",
    AC: "bg-gradient-to-br from-teal-500 to-cyan-500",
    MS: "bg-gradient-to-br from-orange-500 to-red-500",
    JL: "bg-gradient-to-br from-purple-600 to-indigo-600",
    VG: "bg-gradient-to-br from-green-600 to-emerald-600",
    AN: "bg-gradient-to-br from-pink-600 to-rose-600",
    TS: "bg-gradient-to-br from-blue-600 to-cyan-600",
    IJ: "bg-gradient-to-br from-violet-600 to-purple-600",
    RJ: "bg-gradient-to-br from-emerald-600 to-teal-600",
    SW: "bg-gradient-to-br from-slate-600 to-gray-600",
    // New avatar colors
    ND: "bg-gradient-to-br from-sky-500 to-blue-600",
    DM: "bg-gradient-to-br from-fuchsia-500 to-pink-600",
    HP: "bg-gradient-to-br from-lime-600 to-green-600",
    ZK: "bg-gradient-to-br from-rose-600 to-red-600",
    "RS": "bg-gradient-to-br from-orange-600 to-amber-600",
    MN: "bg-gradient-to-br from-cyan-600 to-teal-600",
    "AS2": "bg-gradient-to-br from-purple-600 to-pink-600",
    PG: "bg-gradient-to-br from-yellow-600 to-orange-600",
    VK: "bg-gradient-to-br from-indigo-600 to-purple-600",
    SB: "bg-gradient-to-br from-green-600 to-teal-600"
  };

  return (
    <div className={`w-12 h-12 rounded-full ${colors[initials] || 'bg-gradient-to-br from-indigo-500 to-purple-600'} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
      {initials}
    </div>
  );
}

export default function TeamMatching() {
  const { user } = useAuth();
  const [teammates, setTeammates] = useState(demoTeammates);
  const [filteredTeammates, setFilteredTeammates] = useState(demoTeammates);
  const [filters, setFilters] = useState({
    skills: [],
    college: "Any College",
    experienceLevel: "Any Level", 
    gender: "Any Gender"
  });

  const skillOptions = ["React", "Python", "AI/ML", "Design", "Mobile", "Backend", "Blockchain", "DevOps"];
  const collegeOptions = ["Any College", "IIT Bombay", "Delhi University", "SRM University", "NIT Surat", "COEP"];
  const experienceLevels = ["Any Level", "beginner", "intermediate", "advanced"];
  const genderOptions = ["Any Gender", "male", "female", "other"];

  useEffect(() => {
    fetchTeammates();
  }, []);

  const fetchTeammates = async () => {
    try {
      console.log("Fetching teammates...");
      const res = await fetch("/api/team/teammates", { credentials: "include" });
      
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched teammates:", data.length, "real teammates");
        
        // Always combine: real users first, then demo users
        const combinedData = [...data, ...demoTeammates];
        setTeammates(combinedData);
        setFilteredTeammates(combinedData);
        
        console.log("Total teammates:", combinedData.length, "(", data.length, "real +", demoTeammates.length, "demo)");
      } else {
        console.log("API call failed, using demo data only");
        const errorData = await res.json().catch(() => ({}));
        console.error("API error:", errorData);
        setTeammates(demoTeammates);
        setFilteredTeammates(demoTeammates);
      }
    } catch (err) {
      console.error("Network error:", err);
      setTeammates(demoTeammates);
      setFilteredTeammates(demoTeammates);
    }
  };

  const handleSkillToggle = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    let filtered = teammates;

    if (filters.skills.length > 0) {
      filtered = filtered.filter(teammate => 
        filters.skills.some(skill => teammate.skills.includes(skill))
      );
    }

    if (filters.college !== "Any College") {
      filtered = filtered.filter(teammate => 
        teammate.college?.collegeName === filters.college
      );
    }

    if (filters.experienceLevel !== "Any Level") {
      filtered = filtered.filter(teammate => 
        teammate.experienceLevel === filters.experienceLevel
      );
    }

    if (filters.gender !== "Any Gender") {
      filtered = filtered.filter(teammate => 
        teammate.gender === filters.gender
      );
    }

    setFilteredTeammates(filtered);
  }, [filters, teammates]);

  const sendCollaborationRequest = async (teammateId) => {
    try {
      console.log("Sending collaboration request to:", teammateId);
      
      const res = await fetch(`/api/team/collaborate/${teammateId}`, {
        method: "POST",
        credentials: "include"
      });
      
      const data = await res.json();
      console.log("Response:", data);
      
      if (res.ok && data.success) {
        alert("Collaboration request sent successfully! 🎉");
      } else {
        alert(data.message || "Failed to send collaboration request");
      }
    } catch (err) {
      console.error("Failed to send collaboration request:", err);
      alert("Network error: Failed to send collaboration request");
    }
  };

  return (
    <div className="flex h-full bg-slate-900 text-white">
      {/* Sidebar Filters */}
      <div className="w-80 bg-slate-800 p-6 border-r border-slate-700">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Find Teammates</h2>
        </div>

        {/* Skills Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skillOptions.map(skill => (
              <button
                key={skill}
                onClick={() => handleSkillToggle(skill)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  filters.skills.includes(skill)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* College Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-slate-200">College</h3>
          <select
            value={filters.college}
            onChange={(e) => handleFilterChange('college', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {collegeOptions.map(college => (
              <option key={college} value={college}>{college}</option>
            ))}
          </select>
        </div>

        {/* Experience Level Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-slate-200">Experience Level</h3>
          <select
            value={filters.experienceLevel}
            onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {experienceLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-slate-200">Gender</h3>
          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {genderOptions.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-3xl font-bold">Team Matching 🤝</h1>
          </div>
          <p className="text-slate-400">Connect with talented individuals for your next project</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">
            All Available Teammates ({filteredTeammates.length} found)
          </h2>
          <div className="grid gap-4">
            {filteredTeammates.map((teammate) => (
              <div key={teammate._id} className="bg-slate-800 rounded-xl p-6 hover:bg-slate-750 transition-all duration-200 border border-slate-700">
                <div className="flex items-start gap-4">
                  <Avatar initials={teammate.avatar} />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white">{teammate.fullName}</h3>
                        <p className="text-slate-400 text-sm">
                          @{teammate.username} • {teammate.experienceLevel || 'Not specified'} level
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="font-semibold">{teammate.rating}</span>
                        </div>
                        <div className="text-sm text-slate-400">
                          {teammate.projectCount} projects
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <span>📍</span>
                        <span>{teammate.location?.city || 'Location not set'}, {teammate.location?.country || 'IN'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🎓</span>
                        <span>{teammate.college?.collegeName || 'College not set'}</span>
                      </div>
                      {teammate.gender && (
                        <div className="flex items-center gap-1">
                          <span>👤</span>
                          <span className="capitalize">{teammate.gender}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-slate-300 mb-4 leading-relaxed">
                      {teammate.bio || 'No bio available'}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {(teammate.skills || []).map(skill => (
                        <SkillBadge key={skill} skill={skill} />
                      ))}
                      {(!teammate.skills || teammate.skills.length === 0) && (
                        <span className="text-slate-500 text-sm">No skills listed</span>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => sendCollaborationRequest(teammate._id)}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                      >
                        <span>📤</span>
                        Request Collaboration
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredTeammates.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-300 mb-2">No teammates found</h3>
                <p className="text-slate-500">Try adjusting your filters to find more matches</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}