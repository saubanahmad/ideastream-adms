import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import FeedSidebar from '../components/FeedSidebar';
import PostCard from '../components/PostCard';
import api from '../api/axios';
import editIcon from '../assets/icons/edit.svg';

const Profile = () => {
  const { user, login, updateUser } = useAuth();
  
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', username: '', bio: '' });
  const [editError, setEditError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProfileData = async () => {
      try {
        const [countsRes, postsRes, meRes] = await Promise.all([
          api.get(`/users/${user.id}/social-counts`),
          api.get(`/posts?authorId=${user.id}`),
          api.get('/auth/me')
        ]);
        
        setFollowersCount(countsRes.data.data.followers);
        setFollowingCount(countsRes.data.data.following);
        
        setPosts(postsRes.data.data);

        if (meRes.data && meRes.data.user) {
          updateUser(meRes.data.user);
        }
      } catch (err) {
        console.error("Failed to load profile data", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchProfileData();
  }, [user?.id]);

  const handleEditClick = () => {
    setEditForm({ fullName: user.fullName || '', username: user.username, bio: user.bio || '' });
    setEditError('');
    setIsEditing(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.fullName.trim()) {
      setEditError("Name cannot be empty");
      return;
    }
    if (!editForm.username.trim()) {
      setEditError("Username cannot be empty");
      return;
    }
    
    try {
      setIsSaving(true);
      setEditError('');
      const { data } = await api.patch('/auth/me', editForm);
      
      // Update global context natively
      login(data.user, data.token);
      
      setIsEditing(false);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background">
      <FeedSidebar />
      <Navbar />
      <main className="ml-20 pt-14 flex min-h-screen justify-center">
        <section className="flex-1 max-w-2xl px-6 py-6">
          {/* Profile Card */}
          <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            {/* Left side: Avatar & Info */}
            <div className="flex items-start gap-5 flex-1">
              <div className="w-20 h-20 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-brand-primary text-3xl font-display font-bold shrink-0">
                {user?.username?.[0]?.toUpperCase() || '?'}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="font-display text-brand-text text-2xl font-semibold flex items-center gap-2">
                      {user?.fullName || user?.username}
                      {!isEditing && (
                        <button 
                          onClick={handleEditClick}
                          className="hover:bg-brand-surface p-1.5 rounded-full transition-colors group flex items-center justify-center"
                          title="Edit Profile"
                        >
                          <img 
                            src={editIcon} 
                            alt="Edit Profile" 
                            className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" 
                          />
                        </button>
                      )}
                    </h1>
                    <p className="text-brand-muted text-sm">@{user?.username}</p>
                    <p className="text-brand-muted text-sm mb-3">{user?.email}</p>
                  </div>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveEdit} className="mt-4 bg-brand-surface border border-brand-border rounded-lg p-4">
                    <h3 className="text-brand-text text-sm font-semibold mb-3">Edit Profile</h3>
                    {editError && <div className="text-red-500 text-xs mb-3">{editError}</div>}
                    
                    <div className="mb-3">
                      <label className="block text-brand-muted text-xs mb-1">Name</label>
                      <input 
                        type="text" 
                        value={editForm.fullName}
                        onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                        className="w-full bg-brand-background border border-brand-border rounded-md px-3 py-1.5 text-sm text-brand-text focus:outline-none focus:border-brand-primary"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-brand-muted text-xs mb-1">Username</label>
                      <input 
                        type="text" 
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        className="w-full bg-brand-background border border-brand-border rounded-md px-3 py-1.5 text-sm text-brand-text focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-brand-muted text-xs mb-1">Bio</label>
                      <textarea 
                        value={editForm.bio}
                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                        placeholder="Write something about yourself..."
                        rows="3"
                        className="w-full bg-brand-background border border-brand-border rounded-md px-3 py-1.5 text-sm text-brand-text focus:outline-none focus:border-brand-primary resize-none"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-1.5 text-xs font-semibold rounded-full text-brand-muted hover:bg-brand-surface transition-colors border border-transparent"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isSaving}
                        className="px-4 py-1.5 text-xs font-semibold rounded-full bg-brand-primary text-brand-text hover:bg-brand-primaryHover transition-colors disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-1">
                    {user?.bio ? (
                      <p className="text-brand-text text-sm whitespace-pre-wrap">{user.bio}</p>
                    ) : (
                      <p className="text-brand-muted text-sm italic">No bio added yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Follow Stats */}
            <div className="flex gap-6 md:border-l border-brand-border md:pl-6 md:pr-4 shrink-0 md:justify-center justify-start items-center">
              <div className="text-center">
                <span className="block font-display text-2xl font-bold text-brand-text">{followersCount}</span>
                <span className="text-xs text-brand-muted uppercase tracking-wider font-semibold">Followers</span>
              </div>
              <div className="text-center">
                <span className="block font-display text-2xl font-bold text-brand-text">{followingCount}</span>
                <span className="text-xs text-brand-muted uppercase tracking-wider font-semibold">Following</span>
              </div>
            </div>

          </div>
        </div>

        {/* User Posts Section */}
        <div>
          <h2 className="font-display text-brand-text text-xl font-semibold mb-4 border-b border-brand-border pb-2">Your Ideas</h2>
          
          {loadingPosts ? (
            <div className="text-brand-muted text-center py-10">
              <span className="animate-pulse">Loading posts...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-brand-surface border border-brand-border rounded-xl px-4 py-8 text-brand-muted text-sm text-center">
              You haven't posted any ideas yet.
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
