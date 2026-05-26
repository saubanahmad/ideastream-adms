/**
 * src/pages/Following.jsx — Following / Followers Page
 * Shows users the logged-in user follows, followers, and recommendations.
 * Implementation: Phase 4 (Neo4j follow system)
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import FeedSidebar from '../components/FeedSidebar';
import api from '../api/axios';

const Following = () => {
  const { user } = useAuth();
  
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingActionId, setLoadingActionId] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [followingRes, followersRes] = await Promise.all([
          api.get(`/users/${user.id}/following`),
          api.get(`/users/${user.id}/followers`)
        ]);
        setFollowing(followingRes.data.data || []);
        setFollowers(followersRes.data.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to load social graph data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleFollow = async (targetId) => {
    try {
      setLoadingActionId(targetId);
      await api.post(`/users/${targetId}/follow`);
      // Add target to following list using existing user object from followers if available
      const targetUser = followers.find(u => u.id === targetId);
      if (targetUser) {
        setFollowing(prev => [...prev, targetUser]);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to follow user.');
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleUnfollow = async (targetId) => {
    try {
      setLoadingActionId(targetId);
      await api.delete(`/users/${targetId}/follow`);
      setFollowing(prev => prev.filter(u => u.id !== targetId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unfollow user.');
    } finally {
      setLoadingActionId(null);
    }
  };

  const isFollowingUser = (targetId) => following.some(u => u.id === targetId);

  const renderUserList = (usersList) => {
    if (isLoading) return <p className="text-brand-cream/70 text-sm animate-pulse">Loading...</p>;
    if (error) return <p className="text-red-300 text-sm">❌ {error}</p>;
    if (usersList.length === 0) return <p className="text-brand-cream/50 text-sm">No users found.</p>;

    return (
      <div className="space-y-4">
        {usersList.map(u => (
          <div key={u.id} className="flex items-center justify-between bg-brand-dark/20 p-3 rounded-xl border border-brand-cream/10">
            <div className="min-w-0 pr-4">
              <p className="text-brand-cream font-display text-sm truncate font-semibold">{u.username}</p>
              <p className="text-brand-cream/50 text-xs truncate">{u.email || 'Idea creator'}</p>
            </div>
            {u.id !== user?.id && (
              <button 
                onClick={() => isFollowingUser(u.id) ? handleUnfollow(u.id) : handleFollow(u.id)}
                disabled={loadingActionId === u.id}
                className={`text-xs px-4 py-1.5 rounded-full transition-colors duration-200 shrink-0 font-medium border ${
                  loadingActionId === u.id
                    ? 'bg-brand-light/50 text-brand-cream/70 border-transparent cursor-not-allowed'
                    : isFollowingUser(u.id)
                      ? 'bg-transparent border-brand-cream/30 hover:border-red-400 hover:text-red-400 text-brand-cream'
                      : 'bg-brand-primary border-brand-primary hover:bg-brand-light text-brand-cream'
                }`}>
                {loadingActionId === u.id ? '...' : isFollowingUser(u.id) ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <FeedSidebar />
      <Navbar />
      <main className="ml-20 pt-14 px-6 py-6 max-w-4xl mx-auto">
        <div className="bg-brand-accent rounded-2xl p-6 mb-6 shadow-md">
          <h1 className="font-display text-brand-cream text-2xl font-semibold">
            👥 Social Graph
          </h1>
          <p className="text-brand-cream/70 text-sm mt-1">
            Manage your network and connections.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Following List */}
          <div className="bg-brand-accent/90 rounded-2xl p-5 shadow-lg border border-brand-cream/5">
            <h2 className="font-display text-brand-cream text-lg mb-4 border-b border-brand-cream/10 pb-2">
              Following ({following.length})
            </h2>
            {renderUserList(following)}
          </div>

          {/* Followers List */}
          <div className="bg-brand-accent/90 rounded-2xl p-5 shadow-lg border border-brand-cream/5">
            <h2 className="font-display text-brand-cream text-lg mb-4 border-b border-brand-cream/10 pb-2">
              Followers ({followers.length})
            </h2>
            {renderUserList(followers)}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Following;
