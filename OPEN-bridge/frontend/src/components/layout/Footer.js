import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-light)',
      padding: '4rem 0',
      marginTop: '4rem',
      backgroundColor: 'var(--bg-secondary)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '3rem'
      }}>
        <div>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>OPEN-bridge</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            The premier platform for transitioning from learning to confident open-source contribution.
          </p>
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Platform</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <Link to="/open-source-guides" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Guides</Link>
            <Link to="/problem-catalog" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Catalog</Link>
            <Link to="/practice" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Practice</Link>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Community</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <Link to="/contribution-proof" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Contributions</Link>
            <Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Dashboard</Link>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>GitHub</a>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Legal</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Service</a>
          </div>
        </div>
      </div>
      
      <div className="container" style={{ marginTop: '4rem', paddingBottom: '0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} OPEN-bridge. All rights reserved. Built with precision for the future of open source.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
