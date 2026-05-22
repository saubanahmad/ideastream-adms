/**
 * src/pages/Login.jsx — Login Page
 *
 * Features:
 *   - Email + password form
 *   - Client-side validation (both fields required)
 *   - Calls POST /api/auth/login (implemented Phase 2)
 *   - On success: saves token via AuthContext, redirects to /home
 *   - Link to /signup for new users
 *
 * In Phase 1, the form is visually complete but the API call
 * returns a 501 (not implemented yet). The form structure is ready.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setError(''); // Clear error when user types
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/login', formData);
      login(data.user, data.token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-brand-accent rounded-3xl shadow-2xl p-8 md:p-10">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="font-display text-brand-cream text-4xl font-semibold mb-1">
            💡 IdeaStream
          </h1>
          <p className="text-brand-cream/70 text-sm font-sans">
            Welcome back — sign in to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label htmlFor="email" className="input-label text-brand-cream/80">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              className="input-field"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="input-label text-brand-cream/80">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              className="input-field"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-300 text-sm
                            px-4 py-2 rounded-xl">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 text-base"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-brand-primary/40" />
          <span className="text-brand-cream/50 text-xs">or</span>
          <div className="flex-1 h-px bg-brand-primary/40" />
        </div>

        {/* Sign up link */}
        <p className="text-center text-brand-cream/70 text-sm font-sans">
          New to IdeaStream?{' '}
          <Link
            to="/signup"
            className="text-brand-cream font-medium underline underline-offset-2
                       hover:text-brand-cream/80 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
