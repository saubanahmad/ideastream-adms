import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FeedSidebar from '../components/FeedSidebar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import api from '../api/axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('latest');

  // Suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [suggestionsError, setSuggestionsError] = useState(null);
  const [followingId, setFollowingId] = useState(null);

  // Placeholder state for pending follow backs
  const [pendingFollowBacks, setPendingFollowBacks] = useState([]);
  const [isLoadingPending, setIsLoadingPending] = useState(false);
  const [pendingError, setPendingError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/posts?sort=${sort}`);
        setPosts(data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load posts from the server.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSuggestions = async () => {
      try {
        setIsLoadingSuggestions(true);
        const { data } = await api.get('/users/suggestions');
        console.log("FETCHED SUGGESTIONS FROM BACKEND:", data.data);
        setSuggestions(data.data || []);
        setSuggestionsError(null);
      } catch (err) {
        setSuggestionsError('Failed to load suggestions.');
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const fetchPendingFollowBacks = async () => {
      try {
        setIsLoadingPending(true);
        const { data } = await api.get('/users/pending-follow-backs');
        setPendingFollowBacks(data.data || []);
        setPendingError(null);
      } catch (err) {
        setPendingError('Failed to load pending follows.');
      } finally {
        setIsLoadingPending(false);
      }
    };

    fetchPosts();
    fetchSuggestions();
    fetchPendingFollowBacks();
  }, [sort]);

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleFollow = async (userId, isFollowBack = false) => {
    try {
      setFollowingId(userId);
      await api.post(`/users/${userId}/follow`);
      // Remove followed user from suggestions or pending
      if (isFollowBack) {
        setPendingFollowBacks((prev) => prev.filter((u) => u.id !== userId));
      } else {
        setSuggestions((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to follow user.');
    } finally {
      setFollowingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background">

      {/* Fixed elements */}
      <FeedSidebar />
      <Navbar />

      {/* Main content — offset for sidebar (80px) and navbar (56px) */}
      <main className="ml-20 pt-14 flex min-h-screen">

        {/* ── Center Feed (65%) ── */}
        <section className="flex-1 max-w-2xl px-6 py-6">



          {/* Create post area */}
          <CreatePost onPostCreated={handleNewPost} />

          {/* Feed Toggle (Latest / Trending) */}
          <div className="flex gap-3 mb-5">
            <button 
              onClick={() => setSort('latest')}
              className={`text-sm px-5 py-2 rounded-full transition-all ${sort === 'latest' ? 'bg-brand-primary text-brand-text font-semibold' : 'bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-text'}`}
            >
              Latest
            </button>
            <button 
              onClick={() => setSort('trending')}
              className={`text-sm px-5 py-2 rounded-full transition-all ${sort === 'trending' ? 'bg-brand-primary text-brand-text font-semibold' : 'bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-text'}`}
            >
              Trending
            </button>
          </div>

          {/* Feed States */}
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
              No posts found. Be the first to share an idea!
            </div>
          )}

          {/* Post list */}
          {!isLoading && !error && (
            <div>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onDelete={(id) => setPosts(prev => prev.filter(p => p._id !== id))} />
              ))}
            </div>
          )}
        </section>

        {/* ── Right Panel — "Who to Follow" (35%) ── */}
        <aside className="hidden lg:block w-80 px-4 py-6 shrink-0">
          <div className="sticky top-20">

            {/* Suggestions card */}
            <div className="card">
              <h3 className="font-display text-brand-text text-lg font-semibold mb-4">
                Who to Follow
              </h3>
              
              {isLoadingSuggestions && (
                <p className="text-brand-muted text-sm animate-pulse">Loading suggestions...</p>
              )}

              {suggestionsError && (
                <p className="text-red-500 text-sm">❌ {suggestionsError}</p>
              )}

              {!isLoadingSuggestions && !suggestionsError && suggestions.length === 0 && (
                <p className="text-brand-muted text-sm">No suggestions right now.</p>
              )}

              {!isLoadingSuggestions && !suggestionsError && suggestions.length > 0 && (
                <div className="space-y-3">
                  {suggestions.map((u) => (
                    <div key={u.id} className="flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <p className="text-brand-text font-display text-sm truncate font-semibold">{u.username}</p>
                        <p className="text-brand-muted text-xs truncate">{u.email || 'Idea creator'}</p>
                      </div>
                      <button 
                        onClick={() => handleFollow(u.id)}
                        disabled={followingId === u.id}
                        className={`text-xs px-3 py-1 rounded-full transition-colors duration-200 shrink-0 border ${
                          followingId === u.id
                            ? 'bg-brand-surface text-brand-muted border-transparent cursor-not-allowed'
                            : 'bg-brand-surface border-brand-border hover:bg-brand-border text-brand-text'
                        }`}>
                        {followingId === u.id ? '...' : 'Follow'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Followers You Don't Follow Back card */}
            <div className="card mt-4">
              <h3 className="font-display text-brand-text text-lg font-semibold mb-4">
                Followers You Don't Follow Back
              </h3>

              {isLoadingPending && (
                <p className="text-brand-muted text-sm animate-pulse">Loading...</p>
              )}

              {pendingError && (
                <p className="text-red-500 text-sm">{pendingError}</p>
              )}

              {!isLoadingPending && !pendingError && pendingFollowBacks.length === 0 && (
                <p className="text-brand-muted text-sm">No pending follow backs.</p>
              )}

              {!isLoadingPending && !pendingError && pendingFollowBacks.length > 0 && (
                <div className="space-y-3">
                  {pendingFollowBacks.map((u) => (
                    <div key={u.id} className="flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <p className="text-brand-text font-display text-sm truncate font-semibold">{u.username}</p>
                        <p className="text-brand-muted text-xs truncate">Follows you</p>
                      </div>
                      <button 
                        onClick={() => handleFollow(u.id, true)}
                        disabled={followingId === u.id}
                        className={`text-xs px-3 py-1 rounded-full transition-colors duration-200 shrink-0 border ${
                          followingId === u.id
                            ? 'bg-brand-surface text-brand-muted border-transparent cursor-not-allowed'
                            : 'bg-brand-surface border-brand-border hover:bg-brand-border text-brand-text'
                        }`}>
                        {followingId === u.id ? '...' : 'Follow Back'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </aside>

      </main>
    </div>
  );
};

export default Home;
