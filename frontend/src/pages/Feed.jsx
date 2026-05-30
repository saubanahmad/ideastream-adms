import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FeedSidebar from '../components/FeedSidebar';
import PostCard from '../components/PostCard';
import api from '../api/axios';
import { getFeedBySlug } from '../utils/feedList';

const Feed = () => {
  const { feedId } = useParams();
  const feed = getFeedBySlug(feedId);

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedPosts = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/posts?feed=${feed?.apiValue || feedId}`);
        setPosts(data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load feed posts.');
      } finally {
        setIsLoading(false);
      }
    };

    if (feedId) {
      fetchFeedPosts();
    }
  }, [feedId]);

  return (
    <div className="min-h-screen bg-brand-background">
      <FeedSidebar />
      <Navbar />
      <main className="ml-20 pt-14 flex min-h-screen justify-center">
        <section className="flex-1 max-w-2xl px-6 py-6">
          <div className="card mb-6">
            <h1 className="font-display text-brand-text text-3xl font-semibold">
              {feed?.emoji ? `${feed.emoji} ` : ''}{feed?.label || feedId}
            </h1>
            <p className="text-brand-muted text-sm mt-1">{feed?.description}</p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-10 text-brand-muted font-sans animate-pulse">
              Loading {feed?.label} ideas...
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3 mb-4 text-red-700 text-sm font-sans text-center">
              ❌ {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-brand-surface border border-brand-border rounded-xl px-4 py-8 text-brand-surfaceText text-sm text-center">
              No {feed?.label} ideas yet.
            </div>
          ) : (
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

export default Feed;
