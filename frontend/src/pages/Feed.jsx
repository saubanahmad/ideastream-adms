/**
 * src/pages/Feed.jsx — Platform-specific feed page
 * Shows posts filtered by a specific platform/community.
 * Implementation: Phase 3
 */
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FeedSidebar from '../components/FeedSidebar';
import { getFeedBySlug } from '../utils/feedList';

const Feed = () => {
  const { feedId } = useParams();
  const feed = getFeedBySlug(feedId);

  return (
    <div className="min-h-screen bg-brand-background">
      <FeedSidebar />
      <Navbar />
      <main className="ml-20 pt-14 flex min-h-screen">
        <section className="flex-1 max-w-2xl px-6 py-6">
          <div className="card mb-6">
            <h1 className="font-display text-brand-text text-3xl font-semibold">
              {feed?.emoji} {feed?.label || feedId}
            </h1>
            <p className="text-brand-muted text-sm mt-1">{feed?.description}</p>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-xl
                          px-4 py-3 text-brand-muted text-sm">
            ℹ️ Platform feed posts coming in Phase 3.
          </div>
        </section>
      </main>
    </div>
  );
};

export default Feed;
