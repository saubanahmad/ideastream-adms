/**
 * src/pages/Trending.jsx — Global Trending Feed Page
 * Shows highest-scoring posts across all platforms.
 * Implementation: Phase 3
 */
import Navbar from '../components/Navbar';
import FeedSidebar from '../components/FeedSidebar';

const Trending = () => (
  <div className="min-h-screen bg-brand-background">
    <FeedSidebar />
    <Navbar />
    <main className="ml-20 pt-14 px-6 py-6 max-w-2xl">
      <div className="card mb-6">
        <h1 className="font-display text-brand-text text-3xl font-semibold">
          🔥 Trending Ideas
        </h1>
        <p className="text-brand-muted text-sm mt-1">
          The highest-scored ideas across all communities
        </p>
      </div>
      <div className="bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-muted text-sm">
        ℹ️ Trending feed from MongoDB coming in Phase 3.
      </div>
    </main>
  </div>
);

export default Trending;
