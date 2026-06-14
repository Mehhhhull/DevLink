import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Notifications() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState({ sentInvitations: [], receivedInvitations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInvitations();
    }
  }, [user]);

  const fetchInvitations = async () => {
    try {
      const res = await fetch('/api/team/invitations', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setInvitations(data);
      }
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const respondToInvitation = async (invitationId, response) => {
    try {
      const res = await fetch(`/api/team/invitations/${invitationId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ response })
      });

      if (res.ok) {
        alert(`Invitation ${response}!`);
        fetchInvitations(); // Refresh the list
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to respond to invitation');
      }
    } catch (error) {
      console.error('Failed to respond to invitation:', error);
      alert('Network error occurred');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Notifications</h2>
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Notifications</h2>
        <div className="text-sm text-slate-400">
          {invitations.receivedInvitations.length} pending requests
        </div>
      </div>

      {/* Received Collaboration Requests */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span>📥</span>
          Collaboration Requests ({invitations.receivedInvitations.length})
        </h3>
        
        {invitations.receivedInvitations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🤝</div>
            <p className="text-slate-400">No collaboration requests yet</p>
            <p className="text-slate-500 text-sm mt-2">
              When someone sends you a collaboration request, it will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.receivedInvitations.map((invitation) => (
              <div key={invitation._id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                        {invitation.invitedBy?.fullName?.[0] || invitation.invitedBy?.username?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {invitation.invitedBy?.fullName || invitation.invitedBy?.username}
                        </p>
                        <p className="text-slate-400 text-sm">wants to collaborate with you</p>
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-500 mb-3">
                      {new Date(invitation.createdAt).toLocaleDateString()} at {new Date(invitation.createdAt).toLocaleTimeString()}
                    </div>

                    {invitation.status === 'pending' ? (
                      <div className="flex gap-3">
                        <button
                          onClick={() => respondToInvitation(invitation._id, 'accepted')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => respondToInvitation(invitation._id, 'rejected')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <div className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                        invitation.status === 'accepted' 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {invitation.status === 'accepted' ? '✅ Accepted' : '❌ Declined'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sent Collaboration Requests */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span>📤</span>
          Sent Requests ({invitations.sentInvitations.length})
        </h3>
        
        {invitations.sentInvitations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✉️</div>
            <p className="text-slate-400">No sent requests</p>
            <p className="text-slate-500 text-sm mt-2">
              Requests you send will appear here with their status
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.sentInvitations.map((invitation) => (
              <div key={invitation._id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm">
                      {invitation.user?.fullName?.[0] || invitation.user?.username?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {invitation.user?.fullName || invitation.user?.username}
                      </p>
                      <p className="text-slate-400 text-sm">
                        Sent {new Date(invitation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    invitation.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    invitation.status === 'accepted' ? 'bg-green-500/20 text-green-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {invitation.status === 'pending' ? '⏳ Pending' :
                     invitation.status === 'accepted' ? '✅ Accepted' :
                     '❌ Declined'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}