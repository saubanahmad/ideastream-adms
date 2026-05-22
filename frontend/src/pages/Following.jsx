/**
 * src/pages/Following.jsx — Following / Followers Page
 * Shows users the logged-in user follows, followers, and recommendations.
 * Implementation: Phase 4 (Neo4j follow system)
 */
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import FeedSidebar from '../components/FeedSidebar';

const Following = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-brand-cream">
      <FeedSidebar />
      <Navbar />
      <main className="ml-20 pt-14 px-6 py-6 max-w-3xl">
        <div className="bg-brand-accent rounded-2xl p-6 mb-6 shadow-md">
          <h1 className="font-display text-brand-cream text-2xl font-semibold">
            👥 Social Graph
          </h1>
          <p className="text-brand-cream/70 text-sm mt-1">
            Your followers, following, and recommended accounts
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Following */}
          <div className="bg-brand-primary rounded-2xl p-5 shadow-md">
            <h2 className="font-display text-brand-cream text-lg mb-3">Following</h2>
            <p className="text-brand-cream/50 text-sm">
              Neo4j follow relationships coming in Phase 4.
            </p>
          </div>
          {/* Followers */}
          <div className="bg-brand-primary rounded-2xl p-5 shadow-md">
            <h2 className="font-display text-brand-cream text-lg mb-3">Followers</h2>
            <p className="text-brand-cream/50 text-sm">
              Neo4j follower queries coming in Phase 4.
            </p>
          </div>
        </div>

        <div className="bg-brand-primary/20 border border-brand-primary/40 rounded-xl
                        px-4 py-3 text-brand-primary text-sm mt-4">
          ℹ️ Graph-based follow recommendations (friends-of-friends) coming in Phase 4.
        </div>
      </main>
    </div>
  );
};

export default Following;
