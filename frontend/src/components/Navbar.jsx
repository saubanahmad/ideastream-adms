/**
 * src/components/Navbar.jsx — Top Navigation Bar
 *
 * Displayed on all authenticated pages.
 * Contains: Logo, Search bar (placeholder), user info, logout button.
 *
 * In Phase 2+, the search will be wired to the search API endpoint.
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const { data } = await api.get(`/users/search?q=${encodeURIComponent(searchQuery)}`);
        console.log("SEARCH RESPONSE:", data);
        setSearchResults(data.data || []);
      } catch (err) {
        console.error("Search failed", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFollow = async (e, targetId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setLoadingActionId(targetId);
      await api.post(`/users/${targetId}/follow`);
      // Update local state to show followed
      setSearchResults(prev => prev.map(u => u.id === targetId ? { ...u, isFollowing: true } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to follow user.');
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-20 right-0 h-14 bg-brand-surface border-b border-brand-border z-30 flex items-center justify-between px-6 shadow-sm">

      {/* Left: Logo + Search */}
      <div className="flex items-center gap-4">
        {/* Logo text */}
        <Link to="/home" className="font-display text-brand-text text-xl font-semibold tracking-wide">
          IdeaStream
        </Link>

        {/* Search bar */}
        <div className="relative hidden md:block" ref={dropdownRef}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search users..."
            className="w-64 px-4 py-1.5 rounded-full bg-brand-background text-brand-text
                       placeholder:text-brand-muted text-sm border border-brand-border
                       focus:outline-none focus:ring-2 focus:ring-brand-primary
                       transition-all duration-200"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted text-sm pointer-events-none">
            🔍
          </span>

          {/* Search Dropdown */}
          {showDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-brand-card rounded-xl shadow-lg border border-brand-border overflow-hidden z-50">
              {isSearching ? (
                <div className="p-4 text-center text-brand-muted text-sm animate-pulse">
                  Searching...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-brand-muted text-sm">
                  No users found.
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 hover:bg-brand-surface transition-colors border-b border-brand-border last:border-0">
                      <div className="min-w-0 pr-3">
                        <p className="text-brand-text font-display text-sm truncate font-semibold">{u.username}</p>
                        <p className="text-brand-muted text-xs truncate">{u.email || 'Idea creator'}</p>
                      </div>
                      <button 
                        onClick={(e) => !u.isFollowing && handleFollow(e, u.id)}
                        disabled={loadingActionId === u.id || u.isFollowing}
                        className={`text-xs px-3 py-1 rounded-full transition-colors duration-200 shrink-0 border ${
                          loadingActionId === u.id
                            ? 'bg-brand-surface text-brand-muted border-transparent cursor-not-allowed'
                            : u.isFollowing
                              ? 'bg-transparent border-brand-border text-brand-muted cursor-not-allowed'
                              : 'bg-brand-primary border-brand-primary hover:bg-brand-primaryHover text-brand-text'
                        }`}>
                        {loadingActionId === u.id ? '...' : u.isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: User info + actions */}
      <div className="flex items-center gap-4">
        {user && (
          <Link
            to="/profile"
            className="font-display text-brand-text text-base hover:text-brand-primary
                       transition-colors duration-200 hidden sm:block"
          >
            {user.username}
          </Link>
        )}

        {/* Create idea button */}
        <Link to="/home">
          <button
            className="text-brand-text text-xl hover:scale-110 active:scale-95 hover:text-brand-primary
                       transition-transform duration-150"
            title="Create Idea"
          >
            ✏️
          </button>
        </Link>

        {/* Following page */}
        <Link to="/following">
          <button
            className="text-brand-text text-xl hover:scale-110 active:scale-95 hover:text-brand-primary
                       transition-transform duration-150"
            title="Following"
          >
            👥
          </button>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-brand-text text-xl hover:scale-110 active:scale-95 hover:text-brand-primary
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
