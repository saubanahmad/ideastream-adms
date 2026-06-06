import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FeedSidebar from '../components/FeedSidebar';
import PostCard from '../components/PostCard';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { username } = useParams();
  
  const [profile, setProfile] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  
  const { user } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return;
      try {
        setIsLoading(true);
        // fetch profile and posts together
        const [profileRes, postsRes] = await Promise.all([
          api.get(`/users/profile/${username}`),
          api.get(`/posts?authorUsername=${username}`)
        ]);
        
        const userData = profileRes.data.data;
        setProfile(userData);
        setPosts(postsRes.data.data);

        // fetch social counts using the user's fetched id
        const countsRes = await api.get(`/users/${userData.id}/social-counts`);
        setFollowersCount(countsRes.data.data.followers);
        setFollowingCount(countsRes.data.data.following);
        
        // fetch follow status if logged in and not viewing own profile
        if (user && user.username !== username) {
          try {
            const followingRes = await api.get(`/users/${userData.id}/is-following`);
            setIsFollowing(followingRes.data.isFollowing);
          } catch (err) {
            console.error('Failed to fetch follow status', err);
          }
        }
        
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user profile.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [username, user]);

  const handleFollowToggle = async () => {
    if (!profile) return;
    try {
      setLoadingFollow(true);
      if (isFollowing) {
        await api.delete(`/users/${profile.id}/follow`);
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
      } else {
        await api.post(`/users/${profile.id}/follow`);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update follow status.');
    } finally {
      setLoadingFollow(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background">
      <FeedSidebar />
      <Navbar />
      <main className="ml-20 pt-14 flex min-h-screen justify-center">
        <section className="flex-1 max-w-2xl px-6 py-6">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3 mb-4 text-red-700 text-sm font-sans text-center">
              ❌ {error}
            </div>
          )}

          {!isLoading && !error && profile && (
            <div className="card mb-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                {/* Left side: Avatar & Info */}
                <div className="flex items-start gap-5 flex-1">
                  <div className="w-20 h-20 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-brand-primary text-3xl font-display font-bold shrink-0">
                    {profile?.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="font-display text-brand-text text-2xl font-semibold flex items-center gap-2">
                          {profile?.fullName || profile?.username}
                        </h1>
                        <p className="text-brand-muted text-sm">@{profile?.username}</p>
                        <p className="text-brand-muted text-sm mb-3">{profile?.email}</p>
                      </div>
                    </div>

                    <div className="mt-1">
                      {profile?.bio ? (
                        <p className="text-brand-text text-sm whitespace-pre-wrap">{profile.bio}</p>
                      ) : (
                        <p className="text-brand-muted text-sm italic">No bio added yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Follow Stats & Action */}
                <div className="flex flex-col gap-4 md:border-l border-brand-border md:pl-6 md:pr-4 shrink-0 justify-center items-center">
                  <div className="flex gap-6">
                    <div className="text-center">
                      <span className="block font-display text-2xl font-bold text-brand-text">{followersCount}</span>
                      <span className="text-xs text-brand-muted uppercase tracking-wider font-semibold">Followers</span>
                    </div>
                    <div className="text-center">
                      <span className="block font-display text-2xl font-bold text-brand-text">{followingCount}</span>
                      <span className="text-xs text-brand-muted uppercase tracking-wider font-semibold">Following</span>
                    </div>
                  </div>

                  {user && user.username !== profile?.username && (
                    <button 
                      onClick={handleFollowToggle}
                      disabled={loadingFollow}
                      className={`w-full py-1.5 rounded-full text-sm font-semibold transition-colors border ${
                        loadingFollow 
                          ? 'bg-brand-surface text-brand-muted border-transparent cursor-not-allowed'
                          : isFollowing
                            ? 'bg-transparent border-brand-border text-brand-text hover:bg-brand-surface'
                            : 'bg-brand-primary border-brand-primary text-brand-text hover:bg-brand-primaryHover'
                      }`}
                    >
                      {loadingFollow ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* User Posts Section */}
          {isLoading ? (
            <div className="text-brand-muted text-center py-10 font-sans">
              <span className="animate-pulse">Loading profile...</span>
            </div>
          ) : !error && profile && (
            <div>
              <h2 className="font-display text-brand-text text-xl font-semibold mb-4 border-b border-brand-border pb-2">Posts by {profile.username}</h2>
              
              {posts.length === 0 ? (
                <div className="bg-brand-surface border border-brand-border rounded-xl px-4 py-8 text-brand-muted text-sm text-center">
                  This user hasn't posted anything yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map(post => (
                    <PostCard key={post._id} post={post} onDelete={(id) => setPosts(prev => prev.filter(p => p._id !== id))} />
                  ))}
                </div>
              )}
            </div>
          )}

        </section>
      </main>
    </div>
  );
};

export default UserProfile;
