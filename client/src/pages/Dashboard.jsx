import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import TeamMatching from "../components/TeamMatching";
import Settings from "../components/Settings";
import AIJudge from "./AIJudge";
import IdeaHub from "./IdeaHub";
import { 
  HomeIcon,
  LightBulbIcon,
  UsersIcon, 
  SparklesIcon,
  ChatBubbleLeftEllipsisIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: HomeIcon },
    { id: "ideaHub", label: "Ideas Hub", icon: LightBulbIcon },
    { id: "teamMatching", label: "Team Matching", icon: UsersIcon },
    { id: "community", label: "Community", icon: ChatBubbleLeftEllipsisIcon },
    { id: "aiJudge", label: "AI Judge", icon: SparklesIcon }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome setActiveTab={setActiveTab} />;
      case "ideaHub":
        return <IdeaHub />;
      case "teamMatching":
        return <TeamMatching />;
      case "community":
        return <CommunityHub />;
      case "aiJudge":
        return <AIJudge />;
      case "profile":
        return <Settings />;
      default:
        return <DashboardHome setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-start gap-1">
                <h1 className="text-xl font-bold tracking-tight text-white">DevLink</h1>
                <div className="flex items-center rounded-full border border-indigo-400/30 bg-slate-900/70 px-2 py-1 text-xs font-semibold text-slate-100">
                  <span className="mr-1 text-indigo-200">Backed by</span>
                  <span className="text-white">Nerds</span>
                </div>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab("profile")}
                className={`hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === "profile" 
                    ? "bg-indigo-600" 
                    : "hover:bg-slate-800"
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                  {user?.username?.[0]?.toUpperCase() || user?.fullName?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-slate-200 text-sm font-medium">
                  {user?.username || user?.fullName}
                </span>
              </button>
              
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all duration-200"
                title="Sign Out"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderActiveComponent()}
      </main>
    </div>
  );
}

// Dashboard Home Component
function DashboardHome({ setActiveTab }) {
  const features = [
    {
      id: "ideaHub",
      title: "Ideas Hub", 
      description: "Discover and share innovative project ideas",
      icon: LightBulbIcon,
      stats: "24 ideas"
    },
    {
      id: "teamMatching", 
      title: "Team Matching",
      description: "Find the perfect teammates for your projects", 
      icon: UsersIcon,
      stats: "156 developers"
    },
    {
      id: "community",
      title: "Community",
      description: "Connect and collaborate with fellow developers",
      icon: ChatBubbleLeftEllipsisIcon, 
      stats: "89 members"
    },
    {
      id: "aiJudge",
      title: "AI Judge",
      description: "Get expert feedback on your hackathon ideas",
      icon: SparklesIcon,
      stats: "12 evaluations"
    }
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="text-center space-y-4 pt-8">
        <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
          Build balanced teams, pitch stronger ideas, and launch better projects
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          DevLink helps hackathon teams discover compatible teammates, validate ideas, and shape winning MVPs with AI-powered matchmaking.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          
          return (
            <button
              key={feature.id}
              onClick={() => setActiveTab(feature.id)}
              className="group bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-all duration-200 text-left"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-3">
                    {feature.description}
                  </p>
                  <div className="text-xs text-slate-500 font-medium">
                    {feature.stats}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Active Ideas", value: "24" },
          { label: "Team Members", value: "156" },
          { label: "Community Posts", value: "89" },
          { label: "AI Evaluations", value: "12" }
        ].map((stat, index) => (
          <div key={index} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Placeholder Community Component
function CommunityHub() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Community Hub</h2>
        <p className="text-slate-400">Connect and collaborate with fellow developers</p>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
        <ChatBubbleLeftEllipsisIcon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
        <p className="text-slate-400">
          Community features are under development. Stay tuned for discussions, forums, and collaboration tools.
        </p>
      </div>
    </div>
  );
}