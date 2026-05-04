import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../App.css';

const Navbar = () => {
  const location = useLocation();
  const isAuth = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuth) return null;

  return (
    <nav className="glass-panel" style={{
      position: 'fixed',
      top: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 2rem)',
      maxWidth: '1200px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      zIndex: 1000,
      border: '1px solid var(--border-medium)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/" style={{ 
          fontSize: '1.5rem', 
          fontWeight: 800, 
          textDecoration: 'none', 
          color: 'var(--text-primary)',
          letterSpacing: '-1px'
        }}>
          OPEN<span className="gradient-text">-bridge</span>
        </Link>
        
        <div style={{ display: 'flex', gap: '1.5rem', marginLeft: '1rem' }}>
          <Link to="/open-source-guides" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500 }}>Guides</Link>
          <Link to="/contribution-proof" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500 }}>Proof</Link>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500 }}>Dashboard</Link>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Sign In</Link>
        <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Get Started</Link>
      </div>
    </nav>
  );
};

export default Navbar;
