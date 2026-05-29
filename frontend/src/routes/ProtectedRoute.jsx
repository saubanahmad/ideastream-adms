/**
 * src/routes/ProtectedRoute.jsx — Route Guard
 *
 * This component wraps routes that require authentication.
 * If a user tries to navigate to a protected page without being
 * logged in, they are automatically redirected to /login.
 *
 * Usage in App.jsx:
 *   <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
 *
 * Flow:
 *   1. App starts → isLoading = true (checking localStorage)
 *   2. While loading: show a spinner so there's no flash of the login page
 *   3. Not logged in: redirect to /login
 *   4. Logged in: render the protected page normally
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  // While checking auth state on app startup, show a simple loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background">
        <div className="text-brand-primary font-display text-2xl animate-pulse">
          Loading IdeaStream...
        </div>
      </div>
    );
  }

  // Not logged in — redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Logged in — render the protected content
  return children;
};

export default ProtectedRoute;
