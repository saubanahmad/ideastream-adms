import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import FeedSidebar from '../components/FeedSidebar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import api from '../api/axios';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get('/posts');
        setPosts(data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load posts from the server.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div className="min-h-screen bg-brand-cream">

      {/* Fixed elements */}
      <FeedSidebar />
      <Navbar />

      {/* Main content — offset for sidebar (80px) and navbar (56px) */}
      <main className="ml-20 pt-14 flex min-h-screen">

        {/* ── Center Feed (65%) ── */}
        <section className="flex-1 max-w-2xl px-6 py-6">

          {/* Welcome banner */}
          <div className="bg-brand-accent rounded-2xl p-5 mb-6 shadow-md">
            <h2 className="font-display text-brand-cream text-2xl font-semibold">
              Welcome back, {user?.username}! 👋
            </h2>
            <p className="text-brand-cream/70 text-sm mt-1 font-sans">
              Here are the latest ideas from all communities.
            </p>
          </div>

          {/* Create post area */}
          <CreatePost onPostCreated={handleNewPost} />

          {/* Feed Toggle (Latest / Trending) */}
          <div className="flex gap-3 mb-5">
            <button className="btn-primary text-sm px-5 py-2">
              ⏱ Latest
            </button>
            <button className="btn-secondary text-sm px-5 py-2">
              🔥 Trending
            </button>
          </div>

          {/* Feed States */}
          {isLoading && (
            <div className="text-brand-primary text-center py-10 font-sans">
              <span className="animate-pulse">Loading posts...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3 mb-4 text-red-700 text-sm font-sans text-center">
              ❌ {error}
            </div>
          )}

          {!isLoading && !error && posts.length === 0 && (
            <div className="text-center py-10 text-brand-primary/60 font-sans">
              No posts found. Be the first to share an idea!
            </div>
          )}

          {/* Post list */}
          {!isLoading && !error && (
            <div>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* ── Right Panel — "Who to Follow" (35%) ── */}
        <aside className="hidden lg:block w-80 px-4 py-6 shrink-0">
          <div className="sticky top-20">

            {/* Suggestions card */}
            <div className="bg-brand-accent rounded-2xl p-5 shadow-md">
              <h3 className="font-display text-brand-cream text-lg font-semibold mb-4">
                👥 Who to Follow
              </h3>
              <div className="space-y-3">
                {['alice_builds', 'robo_raj', 'farm_frank'].map((u) => (
                  <div key={u} className="flex items-center justify-between">
                    <div>
                      <p className="text-brand-cream font-display text-sm">{u}</p>
                      <p className="text-brand-cream/50 text-xs">Idea creator</p>
                    </div>
                    <button className="text-xs bg-brand-primary hover:bg-brand-light
                                       text-brand-cream px-3 py-1 rounded-full
                                       transition-colors duration-200">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-brand-cream/40 text-xs mt-4 font-sans">
                Follow recommendations from Neo4j coming in Phase 4.
              </p>
            </div>

            {/* Platform stats card */}
            <div className="bg-brand-primary rounded-2xl p-5 shadow-md mt-4">
              <h3 className="font-display text-brand-cream text-base font-semibold mb-3">
                🌐 Active Communities
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {['💡', '🌱', '💻', '🚗', '🚀', '🧬', '🎮', '🤖', '🏙️'].map((emoji, i) => (
                  <div key={i}
                    className="bg-brand-dark/40 rounded-lg p-2 text-center text-xl
                                hover:bg-brand-accent/60 transition-colors cursor-pointer">
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </aside>

      </main>
    </div>
  );
};

export default Home;
