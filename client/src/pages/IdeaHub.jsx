import { useState, useEffect } from "react";
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  SparklesIcon,
  StarIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

// Extended sample ideas with detailed problem statements from all domains
const sampleIdeas = [
  {
    _id: "1",
    title: "AI-Powered Code Review Assistant",
    summary: "AI-driven assistant for faster code reviews and error-free code reviews.",
    details: "Problem Statement:\nManual code reviews are slow, inconsistent, and error-prone, making it difficult to maintain quality and scalability in large teams. Developers spend hours reviewing code, missing critical bugs, and providing inconsistent feedback.\n\nExpected Solution:\nAn AI-driven assistant that analyzes code for bugs, vulnerabilities, and style issues while suggesting optimizations and ensuring compliance with best practices. Works with GitHub/GitLab to provide real-time inline feedback and learns from developer preferences over time.\n\nTechnologies Used:\nLLMs (GPT-4/5, CodeLlama/CodeT5+), static analysis tools (ESLint, SonarQube, Pylint), Python/Node.js backend, React.js dashboard, GitHub Actions/GitLab CI, Docker/Kubernetes, PostgreSQL/MongoDB, OAuth2 guidelines.",
    techStack: ["React", "Python", "OpenAI"],
    createdByName: "Mehul Kumar Singh",
    likes: 24,
    comments: 2,
    category: "AI/ML"
  },
  {
    _id: "2", 
    title: "Real-Time Collaboration Workspace",
    summary: "Seamless real-time collaboration platform for distributed teams.",
    details: "Problem Statement:\nRemote teams struggle with fragmented communication across multiple tools, leading to context switching, lost productivity, and miscommunication. Current solutions lack real-time synchronization and intuitive collaboration features.\n\nExpected Solution:\nA unified workspace combining video calls, document editing, whiteboarding, and project management with real-time synchronization. Features include live cursors, instant messaging, screen sharing, and persistent workspaces.\n\nTechnologies Used:\nWebRTC for real-time communication, WebSockets for live collaboration, React with TypeScript, Node.js backend, MongoDB for data persistence, Redis for session management.",
    techStack: ["React", "WebRTC", "Node.js"],
    createdByName: "Sarah Chen", 
    likes: 32,
    comments: 5,
    category: "Web Dev"
  },
  {
    _id: "3",
    title: "Smart Personal Finance Manager",
    summary: "AI-powered personal finance app with automated budgeting and investment advice.",
    details: "Problem Statement:\nPeople struggle with personal finance management, often overspending, missing savings goals, and making poor investment decisions. Current apps are either too complex or lack personalized insights.\n\nExpected Solution:\nAn intelligent finance app that automatically categorizes expenses, predicts spending patterns, suggests budget optimizations, and provides personalized investment advice based on user goals and risk tolerance.\n\nTechnologies Used:\nReact Native for cross-platform mobile, machine learning for expense prediction, bank API integrations, secure data encryption, cloud-based backend with real-time notifications.",
    techStack: ["React Native", "ML", "Banking APIs"],
    createdByName: "David Kim",
    likes: 45,
    comments: 8,
    category: "Mobile"
  },
  {
    _id: "4",
    title: "Decentralized Identity Verification",
    summary: "Blockchain-based identity system for secure, privacy-preserving verification.",
    details: "Problem Statement:\nCentralized identity systems are vulnerable to data breaches, lack user control, and create privacy concerns. Users have no ownership over their identity data and must trust multiple third parties.\n\nExpected Solution:\nA decentralized identity platform where users control their credentials through blockchain technology. Features zero-knowledge proofs for privacy, interoperable identity across platforms, and secure credential sharing.\n\nTechnologies Used:\nEthereum blockchain, Solidity smart contracts, IPFS for decentralized storage, zero-knowledge proof protocols, Web3 wallet integration, React frontend.",
    techStack: ["Solidity", "Ethereum", "ZK-Proofs"],
    createdByName: "Alice Johnson",
    likes: 38,
    comments: 12,
    category: "Blockchain"
  },
  {
    _id: "5",
    title: "Smart Home Energy Optimizer",
    summary: "IoT system to optimize household energy consumption automatically.",
    details: "Problem Statement:\nHomeowners face high energy bills due to inefficient device usage, lack of real-time consumption data, and inability to optimize usage patterns. Traditional smart home systems are expensive and complex to set up.\n\nExpected Solution:\nAn affordable IoT system that monitors energy consumption of individual devices, learns usage patterns, and automatically optimizes energy usage. Features include remote control, usage analytics, and integration with renewable energy sources.\n\nTechnologies Used:\nArduino and Raspberry Pi for hardware, MQTT for device communication, Node.js backend, React dashboard, machine learning for pattern recognition, mobile app for remote control.",
    techStack: ["Arduino", "Node.js", "IoT"],
    createdByName: "Mike Rodriguez",
    likes: 28,
    comments: 3,
    category: "IoT"
  },
  {
    _id: "6",
    title: "Virtual Reality Learning Platform",
    summary: "Immersive VR education platform for interactive learning experiences.",
    details: "Problem Statement:\nTraditional education methods fail to engage students effectively, especially in complex subjects like science, history, and medicine. Students struggle to visualize abstract concepts and retain information.\n\nExpected Solution:\nA VR platform that creates immersive educational experiences, allowing students to explore historical events, conduct virtual experiments, and interact with 3D models. Features collaborative virtual classrooms and progress tracking.\n\nTechnologies Used:\nUnity3D game engine, C# programming, VR SDKs (Oculus, HTC Vive), 3D modeling tools, cloud-based content delivery, multiplayer networking for collaborative experiences.",
    techStack: ["Unity", "C#", "VR SDKs"],
    createdByName: "Emma Wilson",
    likes: 51,
    comments: 9,
    category: "Game Dev"
  },
  {
    _id: "7",
    title: "Automated Code Documentation Generator",
    summary: "AI tool that automatically generates comprehensive code documentation.",
    details: "Problem Statement:\nDevelopers often neglect documentation due to time constraints, leading to poor code maintainability and knowledge transfer issues. Existing documentation tools require manual effort and become outdated quickly.\n\nExpected Solution:\nAn AI-powered tool that analyzes codebases and automatically generates comprehensive documentation including API docs, code comments, architecture diagrams, and usage examples. Updates documentation as code changes.\n\nTechnologies Used:\nAbstract Syntax Tree parsing, natural language processing, React frontend, Node.js backend, integration with Git repositories, automated CI/CD pipeline integration.",
    techStack: ["React", "NLP", "AST"],
    createdByName: "James Parker",
    likes: 29,
    comments: 6,
    category: "Web Dev"
  },
  {
    _id: "8",
    title: "Mental Health Companion App",
    summary: "AI-powered mental health support with mood tracking and therapy suggestions.",
    details: "Problem Statement:\nMental health issues are rising, but access to professional help is limited and expensive. People need daily support for mood tracking, stress management, and early intervention before crises occur.\n\nExpected Solution:\nA companion app that provides daily mood tracking, personalized coping strategies, guided meditation, crisis detection, and connections to professional help when needed. Uses AI to provide empathetic responses and track progress.\n\nTechnologies Used:\nReact Native for mobile development, machine learning for mood analysis, natural language processing for chat features, secure health data storage, integration with telemedicine platforms.",
    techStack: ["React Native", "AI", "Healthcare"],
    createdByName: "Dr. Sarah Ahmed",
    likes: 67,
    comments: 14,
    category: "Mobile"
  },
  {
    _id: "9",
    title: "Supply Chain Transparency Platform",
    summary: "Blockchain solution for end-to-end supply chain tracking and verification.",
    details: "Problem Statement:\nConsumers lack visibility into product origins, ethical sourcing, and supply chain practices. Companies struggle with counterfeit products, compliance tracking, and supplier verification across complex global supply chains.\n\nExpected Solution:\nA blockchain platform that tracks products from origin to consumer, providing immutable records of each step. Features QR code scanning for consumer verification, automated compliance reporting, and supplier reputation scoring.\n\nTechnologies Used:\nHyperledger Fabric blockchain, smart contracts, IoT sensors for tracking, React web dashboard, mobile app with QR scanning, integration with existing ERP systems.",
    techStack: ["Hyperledger", "IoT", "React"],
    createdByName: "Carlos Martinez",
    likes: 41,
    comments: 7,
    category: "Blockchain"
  },
  {
    _id: "10",
    title: "Smart Agriculture Monitoring System",
    summary: "IoT-based precision farming solution for crop optimization.",
    details: "Problem Statement:\nFarmers face unpredictable crop yields due to inadequate monitoring of soil conditions, weather patterns, and plant health. Traditional farming methods waste resources and fail to optimize growing conditions.\n\nExpected Solution:\nA comprehensive IoT system that monitors soil moisture, temperature, pH levels, and weather conditions. Provides automated irrigation, pest detection through image analysis, and yield prediction using machine learning.\n\nTechnologies Used:\nArduino sensors, LoRaWAN for long-range communication, edge computing for real-time processing, machine learning for predictive analytics, mobile dashboard for farmers.",
    techStack: ["Arduino", "LoRaWAN", "ML"],
    createdByName: "Priya Patel",
    likes: 33,
    comments: 4,
    category: "IoT"
  },
  {
    _id: "11",
    title: "Multiplayer Strategy Game with AI",
    summary: "Real-time strategy game featuring advanced AI opponents and cooperative gameplay.",
    details: "Problem Statement:\nCurrent strategy games lack sophisticated AI opponents that adapt to player strategies, leading to predictable gameplay. Players also want more cooperative options and dynamic storylines that respond to their choices.\n\nExpected Solution:\nA strategy game with machine learning-powered AI that learns from player behavior, dynamic storylines that change based on decisions, and seamless multiplayer cooperation with voice chat and shared objectives.\n\nTechnologies Used:\nUnity3D engine, C# programming, machine learning for AI behavior, Photon networking for multiplayer, voice chat integration, procedural content generation for dynamic maps.",
    techStack: ["Unity", "ML", "Photon"],
    createdByName: "Alex Turner",
    likes: 58,
    comments: 11,
    category: "Game Dev"
  },
  {
    _id: "12",
    title: "Progressive Web App Builder",
    summary: "No-code platform for creating advanced progressive web applications.",
    details: "Problem Statement:\nSmall businesses and individuals want mobile-like web experiences but lack the technical skills or budget to develop progressive web apps. Existing no-code tools produce basic websites without PWA capabilities.\n\nExpected Solution:\nA visual builder that enables creation of sophisticated PWAs with offline functionality, push notifications, app-like navigation, and performance optimization. Features drag-and-drop interface and integration marketplace.\n\nTechnologies Used:\nReact framework, service workers for offline functionality, WebAssembly for performance, visual editor built with React DnD, automated PWA optimization, cloud hosting integration.",
    techStack: ["React", "PWA", "WebAssembly"],
    createdByName: "Maria Santos",
    likes: 44,
    comments: 8,
    category: "Web Dev"
  }
];

export default function IdeaHub() {
  const [ideas, setIdeas] = useState(sampleIdeas);
  const [filteredIdeas, setFilteredIdeas] = useState(sampleIdeas);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [userLikes, setUserLikes] = useState({});
  const [userStars, setUserStars] = useState({});

  // Load saved likes and stars from localStorage
  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('ideaLikes') || '{}');
    const savedStars = JSON.parse(localStorage.getItem('ideaStars') || '{}');
    setUserLikes(savedLikes);
    setUserStars(savedStars);
  }, []);

  const categories = [
    "All", "Web Dev", "Mobile", "AI/ML", "Blockchain", "IoT", "Game Dev"
  ];

  // Filter ideas based on category and search
  useEffect(() => {
    let filtered = ideas;
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(idea => idea.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(idea => 
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredIdeas(filtered);
  }, [ideas, selectedCategory, searchQuery]);

  const toggleLike = (ideaId, e) => {
    e.stopPropagation();
    const newUserLikes = { ...userLikes };
    const wasLiked = newUserLikes[ideaId];
    
    newUserLikes[ideaId] = !wasLiked;
    setUserLikes(newUserLikes);
    localStorage.setItem('ideaLikes', JSON.stringify(newUserLikes));
    
    // Update the ideas array to reflect the like change
    setIdeas(prevIdeas => 
      prevIdeas.map(idea => 
        idea._id === ideaId 
          ? { ...idea, likes: wasLiked ? idea.likes - 1 : idea.likes + 1 }
          : idea
      )
    );
  };

  const toggleStar = (ideaId, e) => {
    if (e) e.stopPropagation();
    const newUserStars = { ...userStars };
    newUserStars[ideaId] = !newUserStars[ideaId];
    setUserStars(newUserStars);
    localStorage.setItem('ideaStars', JSON.stringify(newUserStars));
  };

  const isLiked = (ideaId) => userLikes[ideaId] || false;
  const isStarred = (ideaId) => userStars[ideaId] || false;

  const addComment = () => {
    if (!newComment.trim() || !selectedIdea) return;
    
    const savedComments = JSON.parse(localStorage.getItem('ideaComments') || '{}');
    if (!savedComments[selectedIdea._id]) {
      savedComments[selectedIdea._id] = [];
    }
    
    savedComments[selectedIdea._id].push({
      text: newComment,
      authorName: "You",
      createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('ideaComments', JSON.stringify(savedComments));
    setNewComment("");
    
    // Update the comment count
    setIdeas(prevIdeas =>
      prevIdeas.map(idea =>
        idea._id === selectedIdea._id
          ? { ...idea, comments: idea.comments + 1 }
          : idea
      )
    );
  };

  const getComments = (ideaId) => {
    const savedComments = JSON.parse(localStorage.getItem('ideaComments') || '{}');
    return savedComments[ideaId] || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            Ideas Hub 💡
          </h1>
          <p className="text-slate-400 mt-1">Discover and share innovative project ideas</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {/* Keep blank for now */}}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 transition-colors"
          >
            <SparklesIcon className="w-4 h-4" />
            Generate New Ideas
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add New Idea
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-white text-black"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea) => (
          <div
            key={idea._id}
            onClick={() => setSelectedIdea(idea)}
            className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded">
                {idea.category}
              </span>
              <button
                onClick={(e) => toggleStar(idea._id, e)}
                className="text-slate-400 hover:text-yellow-400 transition-colors"
              >
                {isStarred(idea._id) ? (
                  <StarIconSolid className="w-5 h-5 text-yellow-400" />
                ) : (
                  <StarIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
              {idea.title}
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              {idea.summary}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {idea.techStack.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">by {idea.createdByName}</span>
              <div className="flex items-center gap-3 text-slate-400">
                <button
                  onClick={(e) => toggleLike(idea._id, e)}
                  className={`flex items-center gap-1 hover:text-red-400 transition-colors ${
                    isLiked(idea._id) ? 'text-red-400' : 'text-slate-400'
                  }`}
                >
                  {isLiked(idea._id) ? (
                    <HeartIconSolid className="w-4 h-4" />
                  ) : (
                    <HeartIcon className="w-4 h-4" />
                  )}
                  {idea.likes}
                </button>
                <span className="flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  {idea.comments + getComments(idea._id).length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded">
                      {selectedIdea.category}
                    </span>
                    <button
                      onClick={() => toggleStar(selectedIdea._id)}
                      className="text-slate-400 hover:text-yellow-400 transition-colors"
                    >
                      {isStarred(selectedIdea._id) ? (
                        <StarIconSolid className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <StarIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedIdea.title}
                  </h2>
                  <p className="text-slate-400 mb-4">By {selectedIdea.createdByName}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedIdea.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedIdea(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Problem Statement */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Problem Statement:</h3>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-slate-300 whitespace-pre-line">{selectedIdea.details}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-red-400">
                    <HeartIconSolid className="w-5 h-5" />
                    <span>{selectedIdea.likes} Likes</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    <span>{selectedIdea.comments + getComments(selectedIdea._id).length} Comments</span>
                  </div>
                </div>

                {/* Comments Section */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Comments</h3>
                  
                  {/* Local Storage Comments */}
                  <div className="space-y-3 mb-4">
                    {getComments(selectedIdea._id).map((comment, index) => (
                      <div key={index} className="bg-slate-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">{comment.authorName}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm">{comment.text}</p>
                      </div>
                    ))}
                    
                    {/* Default comments */}
                    {selectedIdea._id === "1" && (
                      <>
                        <div className="bg-slate-800 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white">Anonymous</span>
                          </div>
                          <p className="text-slate-300 text-sm">This is great!</p>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white">Anonymous</span>
                          </div>
                          <p className="text-slate-300 text-sm">Can it work with Java?</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Add Comment */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      onKeyDown={(e) => e.key === 'Enter' && addComment()}
                    />
                    <button
                      onClick={addComment}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Idea Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Add New Idea</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center py-8">
              <p className="text-slate-400">Add new idea form coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}