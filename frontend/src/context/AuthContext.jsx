/**
 * src/context/AuthContext.jsx — Global Authentication State
 *
 * React Context lets us share state across all components without
 * "prop drilling" (passing props through many layers of components).
 *
 * This AuthContext provides:
 *   - user       : The currently logged-in user object (or null if not logged in)
 *   - token      : The JWT string (or null)
 *   - isLoading  : True while checking if the user is already logged in
 *   - login()    : Store user + token after successful login
 *   - logout()   : Clear user + token, redirect to login page
 *   - isLoggedIn : Convenience boolean
 *
 * Usage in any component:
 *   import { useAuth } from '../context/AuthContext';
 *   const { user, login, logout, isLoggedIn } = useAuth();
 */

import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the context object
const AuthContext = createContext(null);

// 2. AuthProvider — wraps the entire app (in main.jsx)
//    Manages the auth state and provides it to all children
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // User object from PostgreSQL
  const [token, setToken] = useState(null);   // JWT string
  const [isLoading, setIsLoading] = useState(true); // True on initial load

  // On app startup: check if there's a saved session in localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        // Corrupted data — clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false); // Done checking
  }, []);

  /**
   * login — Called after successful API login
   * Saves user + token to state AND localStorage (so it persists on refresh)
   */
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * logout — Clears all auth state
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    isLoading,
    isLoggedIn: !!user, // True if user is not null
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. useAuth — custom hook for convenient access
//    Usage: const { user, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
};

export default AuthContext;
