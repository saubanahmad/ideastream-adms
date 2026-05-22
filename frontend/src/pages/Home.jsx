/**
 * src/pages/Home.jsx — Main IdeaStream Feed (Global)
 *
 * This is the main page users see after logging in.
 * It shows the global IdeaStream feed (all posts from all platforms).
 *
 * Phase 1: Shows the layout with a welcome message and empty state.
 * Phase 3: Wires up to GET /api/feed for real posts.
 *
 * Layout:
 *   - Left: FeedSidebar (fixed, from component)
 *   - Top: Navbar (fixed, from component)
 *   - Center (64%): CreatePost + Feed list
 *   - Right (36%): "Who to follow" suggestions panel
 */

import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import FeedSidebar from '../components/FeedSidebar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

// Placeholder posts for Phase 1 — removed in Phase 3 when real API is wired
const PLACEHOLDER_POSTS = [
  {
    _id: '1',
    title: 'Vertical Farming in Urban Apartments',
    content: 'What if we converted unused balcony space into hydroponic micro-farms? A single 2m² setup could produce 30% of a family\'s vegetable needs year-round.',
    feed: 'Cultivate',
    authorUsername: 'greenthumb99',
    upvoteCount: 42,
    downvoteCount: 3,
    comments: [],
  },
  {
    _id: '2',
    title: 'AI-powered Pothole Detection System',
    content: 'Using computer vision on dashcam footage to automatically report pothole locations to city councils. Crowd-sourced road maintenance!',
    feed: 'Urban Core',
    authorUsername: 'devstorm',
    upvoteCount: 89,
    downvoteCount: 7,
    comments: [{}, {}],
  },
  {
    _id: '3',
    title: 'Open Source EV Conversion Kit',
    content: 'A standardized, affordable kit for converting any ICE vehicle to electric. All schematics open-sourced on GitHub.',
    feed: 'FastLane',
    authorUsername: 'sparky_ev',
    upvoteCount: 156,
    downvoteCount: 12,
    comments: [{}, {}, {}],
  },
];

const Home = () => {
  const { user } = useAuth();

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
          <CreatePost />

          {/* Feed Toggle (Latest / Trending) */}
          <div className="flex gap-3 mb-5">
            <button className="btn-primary text-sm px-5 py-2">
              ⏱ Latest
            </button>
            <button className="btn-secondary text-sm px-5 py-2">
              🔥 Trending
            </button>
          </div>

          {/* Feed notice for Phase 1 */}
          <div className="bg-brand-primary/20 border border-brand-primary/40 rounded-xl
                          px-4 py-3 mb-4 text-brand-primary text-sm font-sans">
            ℹ️ Placeholder posts shown below. Real posts from MongoDB will appear in Phase 3.
          </div>

          {/* Post list */}
          <div>
            {PLACEHOLDER_POSTS.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
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
