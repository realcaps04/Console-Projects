import React, { useState, useEffect } from 'react';
import { Terminal, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from './utils/supabase';
import './LearnerLogin.css';

const LearnerLogin = ({ setActivePage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animText, setAnimText] = useState('');
  const fullText = 'Learning Path';

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setAnimText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const validate = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        // Redirection logic can be handled here or in App level
        // For now, let's just go to the dashboard if successful
        setActivePage('learnerdashboard');
      }
    } catch (err) {
      console.error('Auth Error:', err.message);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ll-page">
      {/* ── Header ── */}
      <header className="ll-header">
        <h1 className="ll-brand cursor-pointer" onClick={() => setActivePage('home')}>
          Console<span className="ll-brand-dot"> Learning</span>
        </h1>
      </header>

      {/* ── Body ── */}
      <div className="ll-body">
        {/* Left hero panel */}
        <div className="ll-left-panel">
          <div className="ll-hero-bg" />
          <div className="ll-blob ll-blob-1" />
          <div className="ll-blob ll-blob-2" />

          {/* Animated ghost text */}
          <div className="ll-ghost-text" aria-hidden="true">{animText}</div>

          <div className="ll-hero-content">
            <h2 className="ll-hero-title">
              Master the<br />Infrastructure of<br />Tomorrow.
            </h2>
            <p className="ll-hero-sub">
              Join thousands of learners building high-performance systems and mastering precision engineering.
            </p>

            <div className="ll-social-proof">
              <div className="ll-avatars">
                <img className="ll-avatar" src="https://i.pravatar.cc/40?u=learner1" alt="Student" />
                <img className="ll-avatar" src="https://i.pravatar.cc/40?u=learner2" alt="Student" />
                <img className="ll-avatar" src="https://i.pravatar.cc/40?u=learner3" alt="Student" />
              </div>
              <div className="ll-proof-text">
                <strong>24,000+ Students</strong>
                <span>Learning right now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="ll-right-panel">
          <div className="ll-form-card">
            <div className="ll-icon-wrap">
              <Terminal size={22} color="#3b5fe2" />
            </div>

            <h2 className="ll-form-title">Welcome Back, Learner</h2>
            <p className="ll-form-sub">Continue your path to technical mastery.</p>

            {error && (
              <div className="ll-error-msg">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form className="ll-form" onSubmit={handleLogin}>
              <div className="ll-field">
                <label htmlFor="ll-email">Email Address</label>
                <input
                  id="ll-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                  required
                />
              </div>

              <div className="ll-field">
                <div className="ll-field-header">
                  <label htmlFor="ll-password">Password</label>
                  <a href="#" className="ll-forgot" onClick={(e) => e.preventDefault()}>
                    Forgot password?
                  </a>
                </div>
                <div className="ll-password-wrap">
                  <input
                    id="ll-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="ll-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="ll-submit-btn"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Access Infrastructure'}
              </button>
            </form>

            <div className="ll-divider">
              <span>Or authenticate with</span>
            </div>

            <div className="ll-oauth-row">
              <button className="ll-oauth-btn" type="button" disabled={loading}>
                {/* Google SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>

              <button className="ll-oauth-btn" type="button" disabled={loading}>
                {/* GitHub SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.26c3 0 4.58-1.58 4.58-5.38 0-1.12-.3-2.12-1-3.05.1-.34.5-1.52-.1-3.26 0 0-1 0-3.3 1.54a11.4 11.4 0 0 0-6 0c-2.3-1.54-3.3-1.54-3.3-1.54-.5 1.74-.2 2.92-.1 3.26-.7.93-1 1.93-1 3.05 0 3.8 1.58 5.38 4.58 5.38a4.8 4.8 0 0 0-1 3.26v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span className="ll-code-brkt">&lt;&gt;</span>
                GitHub
              </button>
            </div>

            <p className="ll-signup-prompt">
              New to the terminal?{' '}
              <a
                href="#"
                className="ll-signup-link"
                onClick={(e) => { e.preventDefault(); setActivePage('learnerregistration'); }}
              >
                Join the Console Learning
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="ll-footer">
        <p className="ll-footer-copy">© 2024 Console Core. Precision in Infrastructure.</p>
        <div className="ll-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Security</a>
          <a href="#">Status</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default LearnerLogin;
