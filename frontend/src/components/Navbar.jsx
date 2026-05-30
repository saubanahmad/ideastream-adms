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
import ideaStreamLogo from '../assets/icons/ideastream.svg';
import followingIcon from '../assets/icons/following.svg';
import logoutIcon from '../assets/icons/logout.svg';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
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
      setSearchResults({ users: [], posts: [] });
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const { data } = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
        console.log("SEARCH RESPONSE:", data);
        setSearchResults(data.data || { users: [], posts: [] });
      } catch (err) {
        console.error("Search failed", err);
        setSearchResults({ users: [], posts: [] });
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
      setSearchResults(prev => ({
        ...prev,
        users: prev.users.map(u => u.id === targetId ? { ...u, isFollowing: true } : u)
      }));
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
        <Link to="/home" className="flex items-center">
          <img src={ideaStreamLogo} alt="IdeaStream" className="h-8 w-auto" />
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
            placeholder="Search users or ideas"
            className="w-64 px-4 py-1.5 rounded-full bg-brand-background text-brand-text
                       placeholder:text-brand-muted text-sm border border-brand-border
                       focus:outline-none focus:ring-2 focus:ring-brand-primary
                       transition-all duration-200"
          />

          {/* Search Dropdown */}
          {showDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-brand-card rounded-xl shadow-lg border border-brand-border overflow-hidden z-50">
              {isSearching ? (
                <div className="p-4 text-center text-brand-muted text-sm animate-pulse">
                  Searching...
                </div>
              ) : searchResults.users?.length === 0 && searchResults.posts?.length === 0 ? (
                <div className="p-4 text-center text-brand-muted text-sm">
                  No results found.
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {/* Users Section */}
                  {searchResults.users?.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-2 text-xs font-semibold text-brand-muted uppercase tracking-wider bg-brand-surface border-b border-brand-border">
                        Users
                      </div>
                      {searchResults.users.map(u => (
                        <div 
                          key={u.id} 
                          onClick={() => {
                            setShowDropdown(false);
                            navigate(`/user/${u.username}`);
                          }}
                          className="flex items-center justify-between p-3 hover:bg-brand-surface transition-colors border-b border-brand-border last:border-0 cursor-pointer"
                        >
                          <div className="min-w-0 pr-3">
                            <p className="text-brand-text font-display text-sm truncate font-semibold">{u.username}</p>
                            <p className="text-brand-muted text-xs truncate">{u.email || 'Idea creator'}</p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!u.isFollowing) handleFollow(e, u.id);
                            }}
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

                  {/* Posts Section */}
                  {searchResults.posts?.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-brand-muted uppercase tracking-wider bg-brand-surface border-b border-brand-border border-t">
                        Posts
                      </div>
                      {searchResults.posts.map(post => (
                        <div 
                          key={post._id} 
                          onClick={() => {
                            setShowDropdown(false);
                            navigate(`/post/${post._id}`);
                          }}
                          className="flex flex-col p-3 hover:bg-brand-surface transition-colors border-b border-brand-border last:border-0 cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-brand-text font-display text-sm font-semibold line-clamp-1">{post.title}</p>
                            <span className="text-[10px] bg-brand-surface border border-brand-border text-brand-primary px-2 py-0.5 rounded-full shrink-0 ml-2">
                              {post.feed}
                            </span>
                          </div>
                          <p className="text-brand-muted text-xs line-clamp-2 mb-1">{post.content}</p>
                          <p className="text-brand-muted text-[10px]">by @{post.authorUsername}</p>
                        </div>
                      ))}
                    </div>
                  )}
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

        {/* Following page */}
        <Link to="/following">
          <button
            className="hover:scale-110 active:scale-95 transition-transform duration-150 flex items-center justify-center"
            title="Following"
          >
            <img src={followingIcon} alt="Following" className="h-6 w-6" />
          </button>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="hover:scale-110 active:scale-95 transition-transform duration-150 flex items-center justify-center"
          title="Logout"
        >
          <img src={logoutIcon} alt="Logout" className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
