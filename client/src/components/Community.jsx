import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

// Sample channels data
const defaultChannels = [
  { id: 'general', name: 'general', description: 'General discussion', memberCount: 1247, unread: 0 },
  { id: 'announcements', name: 'announcements', description: 'Important updates', memberCount: 1247, unread: 2 },
  { id: 'web-dev', name: 'web-dev', description: 'Web development chat', memberCount: 892, unread: 0 },
  { id: 'ai-ml', name: 'ai-ml', description: 'AI/ML discussions', memberCount: 634, unread: 5 },
  { id: 'mobile-dev', name: 'mobile-dev', description: 'Mobile app development', memberCount: 445, unread: 0 },
  { id: 'blockchain', name: 'blockchain', description: 'Blockchain & Web3', memberCount: 298, unread: 1 },
  { id: 'career', name: 'career', description: 'Career advice & opportunities', memberCount: 756, unread: 0 },
  { id: 'random', name: 'random', description: 'Random discussions', memberCount: 523, unread: 3 }
];

// Sample Indian members for realistic feel
const sampleMembers = [
  { id: 'arjun_dev', name: 'Arjun Sharma', avatar: 'AS', status: 'online', role: 'Developer' },
  { id: 'priya_ui', name: 'Priya Patel', avatar: 'PP', status: 'online', role: 'Designer' },
  { id: 'rahul_ml', name: 'Rahul Gupta', avatar: 'RG', status: 'away', role: 'ML Engineer' },
  { id: 'sneha_pm', name: 'Sneha Singh', avatar: 'SS', status: 'online', role: 'Product Manager' },
  { id: 'vikash_fe', name: 'Vikash Kumar', avatar: 'VK', status: 'offline', role: 'Frontend Dev' },
  { id: 'kavya_be', name: 'Kavya Reddy', avatar: 'KR', status: 'online', role: 'Backend Dev' },
  { id: 'ankit_ds', name: 'Ankit Jain', avatar: 'AJ', status: 'away', role: 'Data Scientist' },
  { id: 'ishita_qa', name: 'Ishita Mehta', avatar: 'IM', status: 'online', role: 'QA Engineer' }
];

// Sample messages for different channels
const defaultMessages = {
  general: [
    {
      id: '1',
      user: 'arjun_dev',
      message: 'Hey everyone! Just joined DevLink. Excited to connect with fellow developers! 🚀',
      timestamp: Date.now() - 1800000, // 30 mins ago
      reactions: [{ emoji: '👋', count: 5, users: ['priya_ui', 'rahul_ml', 'sneha_pm', 'kavya_be', 'ishita_qa'] }]
    },
    {
      id: '2', 
      user: 'priya_ui',
      message: 'Welcome to the community @arjun_dev! This is such an amazing platform for finding teammates.',
      timestamp: Date.now() - 1740000, // 29 mins ago
      reactions: [{ emoji: '💯', count: 3, users: ['arjun_dev', 'sneha_pm', 'kavya_be'] }]
    },
    {
      id: '3',
      user: 'rahul_ml',
      message: 'Anyone working on ML projects for the upcoming hackathon? Would love to collaborate!',
      timestamp: Date.now() - 900000, // 15 mins ago
      reactions: [{ emoji: '🤖', count: 4, users: ['ankit_ds', 'kavya_be', 'arjun_dev', 'ishita_qa'] }]
    }
  ],
  announcements: [
    {
      id: 'ann1',
      user: 'admin',
      message: '📢 Hackathon Alert! Major League Hacking is organizing a 48-hour hackathon next weekend. Registration opens tomorrow!',
      timestamp: Date.now() - 3600000, // 1 hour ago
      reactions: [{ emoji: '🔥', count: 12, users: ['arjun_dev', 'priya_ui', 'rahul_ml'] }]
    },
    {
      id: 'ann2',
      user: 'admin', 
      message: '🎉 DevLink crossed 1000+ users! Thank you for making this community amazing. New features coming soon!',
      timestamp: Date.now() - 7200000, // 2 hours ago
      reactions: [{ emoji: '🎊', count: 25, users: ['priya_ui', 'sneha_pm', 'kavya_be'] }]
    }
  ],
  'web-dev': [
    {
      id: 'web1',
      user: 'vikash_fe',
      message: 'Just deployed my React app on Vercel! The build optimization reduced bundle size by 40% 📈',
      timestamp: Date.now() - 2700000, // 45 mins ago
      reactions: [{ emoji: '⚡', count: 8, users: ['arjun_dev', 'priya_ui'] }]
    }
  ],
  'ai-ml': [
    {
      id: 'ai1',
      user: 'ankit_ds',
      message: 'Working on a computer vision project for crop disease detection. Using YOLOv8 with 94% accuracy so far! 🌾',
      timestamp: Date.now() - 1200000, // 20 mins ago
      reactions: [{ emoji: '🧠', count: 6, users: ['rahul_ml', 'kavya_be'] }]
    },
    {
      id: 'ai2',
      user: 'rahul_ml',
      message: 'That\'s impressive @ankit_ds! Have you tried data augmentation? I got 97% accuracy on similar dataset.',
      timestamp: Date.now() - 600000, // 10 mins ago
      reactions: [{ emoji: '🔬', count: 3, users: ['ankit_ds', 'ishita_qa'] }]
    }
  ]
};

export default function Community() {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState('general');
  const [channels, setChannels] = useState(defaultChannels);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [onlineMembers] = useState(sampleMembers.filter(m => m.status === 'online'));
  const messagesEndRef = useRef(null);

  // Initialize messages from localStorage or defaults
  useEffect(() => {
    const stored = localStorage.getItem('devlink_community_messages');
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      setMessages(defaultMessages);
      localStorage.setItem('devlink_community_messages', JSON.stringify(defaultMessages));
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel]);

  // Save messages to localStorage
  const saveMessages = (newMessages) => {
    setMessages(newMessages);
    localStorage.setItem('devlink_community_messages', JSON.stringify(newMessages));
  };

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      user: user?.username || 'guest_user',
      message: newMessage.trim(),
      timestamp: Date.now(),
      reactions: []
    };

    const updatedMessages = {
      ...messages,
      [activeChannel]: [...(messages[activeChannel] || []), message]
    };

    saveMessages(updatedMessages);
    setNewMessage('');
  };

  // Add reaction
  const addReaction = (messageId, emoji) => {
    const userId = user?.username || 'guest_user';
    const channelMessages = messages[activeChannel] || [];
    
    const updatedChannelMessages = channelMessages.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          if (existingReaction.users.includes(userId)) {
            // Remove user's reaction
            return {
              ...msg,
              reactions: msg.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count - 1, users: r.users.filter(u => u !== userId) }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            // Add user's reaction
            return {
              ...msg,
              reactions: msg.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count + 1, users: [...r.users, userId] }
                  : r
              )
            };
          }
        } else {
          // New reaction
          return {
            ...msg,
            reactions: [...(msg.reactions || []), { emoji, count: 1, users: [userId] }]
          };
        }
      }
      return msg;
    });

    const updatedMessages = {
      ...messages,
      [activeChannel]: updatedChannelMessages
    };

    saveMessages(updatedMessages);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  // Get member info
  const getMember = (userId) => {
    if (userId === 'admin') return { name: 'DevLink Bot', avatar: 'DB', status: 'online', role: 'Bot' };
    if (userId === user?.username) return { name: user?.fullName || user?.username, avatar: user?.username?.[0]?.toUpperCase() || 'U', status: 'online', role: 'You' };
    return sampleMembers.find(m => m.id === userId) || { name: userId, avatar: userId[0]?.toUpperCase() || 'U', status: 'offline', role: 'Member' };
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-slate-900">
      {/* Sidebar */}
      <div className="w-72 bg-slate-800 flex flex-col border-r border-slate-700">
        {/* Community Header */}
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">DevLink Community</h2>
          <p className="text-sm text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            {onlineMembers.length} members online
          </p>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Channels</h3>
          <div className="space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-all ${
                  activeChannel === channel.id
                    ? 'bg-slate-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">#</span>
                  <span className="text-sm font-medium">{channel.name}</span>
                </div>
                {channel.unread > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {channel.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Online Members */}
        <div className="p-4 border-t border-slate-700">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Online — {onlineMembers.length}
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {onlineMembers.slice(0, 6).map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                    {member.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{member.name}</p>
                  <p className="text-xs text-slate-400 truncate">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xl">#</span>
            <div>
              <h2 className="text-xl font-bold text-white">
                {channels.find(c => c.id === activeChannel)?.name}
              </h2>
              <p className="text-sm text-slate-400">
                {channels.find(c => c.id === activeChannel)?.memberCount} members
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {(messages[activeChannel] || []).map((message) => {
            const member = getMember(message.user);
            return (
              <div key={message.id} className="group hover:bg-slate-800/30 p-3 rounded">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{member.name}</span>
                      <span className="text-xs text-slate-500">{formatTime(message.timestamp)}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{message.message}</p>
                    
                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.reactions.map((reaction) => (
                          <button
                            key={reaction.emoji}
                            onClick={() => addReaction(message.id, reaction.emoji)}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-all ${
                              reaction.users.includes(user?.username || 'guest_user')
                                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-xs">{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Quick reactions (show on hover) */}
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1 mt-2 transition-opacity">
                      {['👍', '❤️', '😂', '🚀', '🔥'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => addReaction(message.id, emoji)}
                          className="p-1 hover:bg-slate-700 rounded text-sm"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-slate-700 bg-slate-800">
          <form onSubmit={sendMessage} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message #${activeChannel}`}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                <button type="button" className="text-slate-400 hover:text-slate-300 text-sm">😊</button>
                <button type="button" className="text-slate-400 hover:text-slate-300 text-sm">📎</button>
              </div>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}