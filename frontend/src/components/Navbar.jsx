/**
 * src/components/Navbar.jsx — Top Navigation Bar
 *
 * Displayed on all authenticated pages.
 * Contains: Logo, Search bar (placeholder), user info, logout button.
 *
 * In Phase 2+, the search will be wired to the search API endpoint.
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-20 right-0 h-14 bg-brand-accent z-30 flex items-center justify-between px-6 shadow-md">

      {/* Left: Logo + Search */}
      <div className="flex items-center gap-4">
        {/* Logo text */}
        <Link to="/home" className="font-display text-brand-cream text-xl font-semibold tracking-wide">
          IdeaStream
        </Link>

        {/* Search bar — wired to /api/feed/search in Phase 3 */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search ideas..."
            className="w-64 px-4 py-1.5 rounded-full bg-brand-primary/60 text-brand-cream
                       placeholder-brand-cream/60 text-sm border border-brand-primary
                       focus:outline-none focus:ring-2 focus:ring-brand-cream/40
                       transition-all duration-200"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-cream/60 text-sm">
            🔍
          </span>
        </div>
      </div>

      {/* Right: User info + actions */}
      <div className="flex items-center gap-4">
        {user && (
          <Link
            to="/profile"
            className="font-display text-brand-cream text-base hover:text-brand-cream/80
                       transition-colors duration-200 hidden sm:block"
          >
            {user.username}
          </Link>
        )}

        {/* Create idea button */}
        <Link to="/home">
          <button
            className="text-brand-cream text-xl hover:scale-110 active:scale-95
                       transition-transform duration-150"
            title="Create Idea"
          >
            ✏️
          </button>
        </Link>

        {/* Following page */}
        <Link to="/following">
          <button
            className="text-brand-cream text-xl hover:scale-110 active:scale-95
                       transition-transform duration-150"
            title="Following"
          >
            👥
          </button>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-brand-cream text-xl hover:scale-110 active:scale-95
                     transition-transform duration-150"
          title="Logout"
        >
          🚪
        </button>
      </div>
    </header>
  );
};

export default Navbar;
