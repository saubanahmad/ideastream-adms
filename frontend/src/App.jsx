/**
 * src/App.jsx — Root React component with all application routes
 *
 * React Router v6 is used for client-side navigation.
 * <Routes> renders the first <Route> that matches the current URL.
 *
 * Route structure:
 *   /            → redirect to /login or /home based on auth
 *   /login       → Login page (public)
 *   /signup      → Signup page (public)
 *   /home        → Main feed (protected — requires login)
 *   /feed/:feedId → Platform-specific feed (protected)
 *   /trending    → Global trending (protected)
 *   /profile     → User profile (protected)
 *   /following   → Follow/followers page (protected)
 *   *            → 404 Not Found
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Trending from './pages/Trending';
import Profile from './pages/Profile';
import Following from './pages/Following';
import UserProfile from './pages/UserProfile';
import PostDetail from './pages/PostDetail';

const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={<Navigate to={isLoggedIn ? '/home' : '/login'} replace />}
      />

      {/* Public routes — accessible without login */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes — require authentication */}
      <Route
        path="/home"
        element={<ProtectedRoute><Home /></ProtectedRoute>}
      />
      <Route
        path="/feed/:feedId"
        element={<ProtectedRoute><Feed /></ProtectedRoute>}
      />
      <Route
        path="/trending"
        element={<ProtectedRoute><Trending /></ProtectedRoute>}
      />
      <Route
        path="/profile"
        element={<ProtectedRoute><Profile /></ProtectedRoute>}
      />
      <Route
        path="/following"
        element={<ProtectedRoute><Following /></ProtectedRoute>}
      />
      <Route
        path="/user/:username"
        element={<ProtectedRoute><UserProfile /></ProtectedRoute>}
      />
      <Route
        path="/post/:id"
        element={<ProtectedRoute><PostDetail /></ProtectedRoute>}
      />

      {/* 404 catch-all */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-brand-background flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-display text-brand-brandDark text-6xl font-bold">404</h1>
              <p className="text-brand-muted text-lg mt-2">Page not found</p>
              <a href="/home" className="btn-primary inline-block mt-4">Go Home</a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
