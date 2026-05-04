import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import '../../App.css';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('/auth/signup', {
        email,
        password,
        confirmPassword
      });
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Account creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '2rem', position: 'relative' }}>
      <div className="mesh-gradient"></div>
      
      <div className="glass-panel animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: '480px', 
        padding: '3rem',
        boxShadow: 'var(--shadow-xxl)',
        border: '1px solid var(--border-medium)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ 
            fontSize: '1.5rem', 
            fontWeight: 800, 
            textDecoration: 'none', 
            color: 'var(--text-primary)',
            letterSpacing: '-1px',
            display: 'block',
            marginBottom: '1rem'
          }}>
            OPEN<span className="gradient-text">-bridge</span>
          </Link>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Join the elite</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Start your world-class journey into open source.
          </p>
        </div>

        {error && (
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            borderRadius: 'var(--radius-sm)',
            color: '#f87171',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min. 8 characters"
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Confirm Password</label>
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Ensure passwords match"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem', padding: '14px' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
