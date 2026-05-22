/**
 * src/pages/Profile.jsx — User Profile Page
 * Shows and allows editing of the logged-in user's profile.
 * Implementation: Phase 2 (profile view) / Phase 3 (posts by user)
 */
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import FeedSidebar from '../components/FeedSidebar';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-brand-cream">
      <FeedSidebar />
      <Navbar />
      <main className="ml-20 pt-14 px-6 py-6 max-w-2xl">
        <div className="bg-brand-accent rounded-2xl p-8 shadow-md">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 rounded-full bg-brand-primary flex items-center justify-center
                            text-brand-cream text-3xl font-display font-bold">
              {user?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="font-display text-brand-cream text-2xl font-semibold">
                {user?.fullName || user?.username}
              </h1>
              <p className="text-brand-cream/70 text-sm">@{user?.username}</p>
              <p className="text-brand-cream/50 text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="bg-brand-primary/20 border border-brand-primary/40 rounded-xl px-4 py-3 text-brand-primary text-sm">
            ℹ️ Profile editing and user posts coming in Phase 2 & 3.
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
