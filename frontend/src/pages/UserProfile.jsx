import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FeedSidebar from '../components/FeedSidebar';
import PostCard from '../components/PostCard';
import api from '../api/axios';

const UserProfile = () => {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/posts?authorUsername=${username}`);
        setPosts(data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user posts.');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUserPosts();
    }
  }, [username]);

  return (
    <div className="min-h-screen bg-brand-background">
      <FeedSidebar />
      <Navbar />
      <main className="ml-20 pt-14 flex min-h-screen">
        <section className="flex-1 max-w-2xl px-6 py-6">
          <div className="card mb-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center
                              text-brand-primary text-3xl font-display font-bold">
                {username?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <h1 className="font-display text-brand-text text-2xl font-semibold">
                  {username}
                </h1>
                <p className="text-brand-muted text-sm">@{username}</p>
              </div>
            </div>
          </div>

          <h2 className="font-display text-brand-text text-xl font-semibold mb-4">Posts by {username}</h2>

          {isLoading && (
            <div className="text-brand-muted text-center py-10 font-sans">
              <span className="animate-pulse">Loading posts...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3 mb-4 text-red-700 text-sm font-sans text-center">
              ❌ {error}
            </div>
          )}

          {!isLoading && !error && posts.length === 0 && (
            <div className="text-center py-10 text-brand-muted/80 font-sans">
              This user hasn't posted anything yet.
            </div>
          )}

          {!isLoading && !error && (
            <div>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
