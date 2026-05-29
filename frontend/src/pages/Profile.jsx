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
    <div className="min-h-screen bg-brand-background">
      <FeedSidebar />
      <Navbar />
      <main className="ml-20 pt-14 px-6 py-6 max-w-2xl">
        <div className="card">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center
                            text-brand-primary text-3xl font-display font-bold">
              {user?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="font-display text-brand-text text-2xl font-semibold">
                {user?.fullName || user?.username}
              </h1>
              <p className="text-brand-muted text-sm">@{user?.username}</p>
              <p className="text-brand-muted text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-muted text-sm">
            ℹ️ Profile editing and user posts coming in Phase 2 & 3.
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
