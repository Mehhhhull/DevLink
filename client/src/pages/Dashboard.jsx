import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import TeamMatching from "../components/TeamMatching";
import Settings from "../components/Settings";
import AIJudge from "./AIJudge";
import IdeaHub from "./IdeaHub";
import { 
  UsersIcon, 
  CogIcon, 
  SparklesIcon,
  LightBulbIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("teamMatching");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    {
      id: "teamMatching",
      label: "Team Matching",
      icon: UsersIcon,
      description: "Find teams & teammates",
      gradient: "from-indigo-500 to-blue-600"
    },
    {
      id: "aiJudge", 
      label: "AI Judge",
      icon: SparklesIcon,
      description: "Get feedback on ideas",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      id: "ideaHub",
      label: "Idea Hub",
      icon: LightBulbIcon,
      description: "Post ideas, upvote, and solve problems",
      gradient: "from-emerald-500 to-teal-600"
    }
  ];

  const settingsItem = {
    id: "settings",
    label: "Settings", 
    icon: CogIcon,
    description: "Profile & preferences",
    gradient: "from-emerald-500 to-teal-600"
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "teamMatching":
        return <TeamMatching />;
      case "aiJudge":
        return <AIJudge />;
      case "ideaHub":
        return <IdeaHub />;
      case "settings":
        return <Settings />;
      default:
        return <TeamMatching />;
    }
  };

  const getPageInfo = () => {
    const item = navigationItems.find(item => item.id === activeTab) || 
                 (activeTab === "settings" ? settingsItem : null);
    return {
      title: item?.label || "Dashboard",
      description: item?.description || "Welcome to DevLink"
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="flex">
        {/* Enhanced Sidebar Navigation */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-20'} min-h-screen bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50 transition-all duration-300 relative`}>
          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white transition-all duration-200"
          >
            {sidebarOpen ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <Bars3Icon className="w-5 h-5" />
            )}
          </button>

          {/* Logo & User Section */}
          <div className="p-6 border-b border-slate-700/50">
            {sidebarOpen ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xl font-bold text-white">DevLink</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                    {user?.username?.[0]?.toUpperCase() || user?.fullName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{user?.username || user?.fullName}</p>
                    <p className="text-slate-400 text-sm">{user?.email}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex justify-center pt-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {user?.username?.[0]?.toUpperCase() || user?.fullName?.[0]?.toUpperCase() || "U"}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className={`p-6 space-y-3 ${!sidebarOpen ? 'px-3' : ''}`}>
            {sidebarOpen && (
              <h3 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-4">
                Navigation
              </h3>
            )}
            
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full group relative overflow-hidden rounded-xl ${sidebarOpen ? 'p-4' : 'p-3'} transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-indigo-500/25` 
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                  title={!sidebarOpen ? item.label : ''}
                >
                  {sidebarOpen ? (
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? "bg-white/20" 
                          : "bg-slate-700/50 group-hover:bg-slate-600/50"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className={`text-xs transition-all duration-300 ${
                          isActive ? "text-white/80" : "text-slate-400"
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Settings & Logout at Bottom */}
          <div className={`absolute bottom-6 left-6 right-6 space-y-3 ${!sidebarOpen ? 'left-3 right-3' : ''}`}>
            {/* Settings Button */}
            {(() => {
              const Icon = settingsItem.icon;
              const isActive = activeTab === settingsItem.id;
              
              return (
                <button
                  onClick={() => setActiveTab(settingsItem.id)}
                  className={`w-full group relative overflow-hidden rounded-xl ${sidebarOpen ? 'p-4' : 'p-3'} transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-r ${settingsItem.gradient} text-white shadow-lg shadow-emerald-500/25` 
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                  title={!sidebarOpen ? settingsItem.label : ''}
                >
                  {sidebarOpen ? (
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? "bg-white/20" 
                          : "bg-slate-700/50 group-hover:bg-slate-600/50"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{settingsItem.label}</div>
                        <div className={`text-xs transition-all duration-300 ${
                          isActive ? "text-white/80" : "text-slate-400"
                        }`}>
                          {settingsItem.description}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50" />
                  )}
                </button>
              );
            })()}

            {/* Sign Out Button */}
            <button
              onClick={logout}
              className={`w-full ${sidebarOpen ? 'p-3' : 'p-3'} text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all duration-200 text-sm`}
              title={!sidebarOpen ? 'Sign Out' : ''}
            >
              {sidebarOpen ? 'Sign Out' : '↩'}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-h-screen">
          {/* Header */}
          <header className="bg-slate-900/30 backdrop-blur-sm border-b border-slate-700/50 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">
                    {getPageInfo().title}
                  </h1>
                  <p className="text-slate-400">
                    {getPageInfo().description}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-slate-300 text-sm">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {renderActiveComponent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}