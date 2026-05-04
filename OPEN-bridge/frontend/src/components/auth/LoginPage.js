import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import '../../App.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await API.post('/auth/login', { email, password });
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '2rem', position: 'relative' }}>
      <div className="mesh-gradient"></div>
      
      <div className="glass-panel animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: '440px', 
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
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Welcome back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Enter your credentials to access your workspace.
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
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--accent-primary)', 
                  fontSize: '0.75rem', 
                  cursor: 'pointer',
                  fontWeight: 600
                }}
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
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem', padding: '14px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
          <Link to="/signup" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>
            Create one for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
