/**
 * src/pages/Signup.jsx — Registration Page
 *
 * Features:
 *   - Full name, username, email, password, confirm password fields
 *   - Client-side validation
 *   - Calls POST /api/auth/register (implemented Phase 2)
 *   - On success: auto-login + redirect to /home
 *   - Link back to /login
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setError('');
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const { fullName, username, email, password, confirmPassword } = formData;
    if (!fullName || !username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        fullName,
        username,
        email,
        password,
      });
      login(data.user, data.token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-10">
      {/* Card */}
      <div className="w-full max-w-md bg-brand-accent rounded-3xl shadow-2xl p-8 md:p-10">

        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="font-display text-brand-cream text-4xl font-semibold mb-1">
            💡 IdeaStream
          </h1>
          <p className="text-brand-cream/70 text-sm font-sans">
            Create your account and start sharing ideas
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="input-label text-brand-cream/80">Full Name</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ahmad Khan"
              autoComplete="name"
              className="input-field"
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="input-label text-brand-cream/80">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="ahmad_ideas"
              autoComplete="username"
              className="input-field"
            />
            <p className="text-brand-cream/50 text-xs mt-1">
              Must be unique. Only letters, numbers, and underscores.
            </p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="input-label text-brand-cream/80">Email</label>
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
            <label htmlFor="password" className="input-label text-brand-cream/80">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              className="input-field"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="input-label text-brand-cream/80">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              autoComplete="new-password"
              className="input-field"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-300 text-sm
                            px-4 py-2 rounded-xl">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 text-base mt-2"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-brand-primary/40" />
          <span className="text-brand-cream/50 text-xs">or</span>
          <div className="flex-1 h-px bg-brand-primary/40" />
        </div>

        {/* Login link */}
        <p className="text-center text-brand-cream/70 text-sm font-sans">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-brand-cream font-medium underline underline-offset-2
                       hover:text-brand-cream/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
