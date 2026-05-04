import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="mesh-gradient"></div>
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="animate-fade-in">
            <span style={{ 
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(59, 130, 246, 0.1)',
              color: 'var(--accent-primary)',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '2rem',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              Introducing OPEN-bridge 1.0
            </span>
            
            <h1 style={{ 
              fontSize: 'clamp(3rem, 8vw, 5rem)', 
              lineHeight: 1.1, 
              marginBottom: '1.5rem',
              fontWeight: 800
            }}>
              Learn faster, build confidence,<br />
              <span className="gradient-text">and contribute to open source</span>
            </h1>
            
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--text-secondary)', 
              maxWidth: '800px', 
              margin: '0 auto 3rem',
              lineHeight: 1.6
            }}>
              OPEN-bridge provides a elite, polished path from beginner to verified contributor. 
              Guided lessons, active practice, and a sophisticated dashboard to track your journey.
            </p>
            
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '4rem' }}>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                Start Your Journey
              </Link>
              <Link to="/open-source-guides" className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                Explore Guides
              </Link>
            </div>

            {/* Hero Visual - Stats */}
            <div style={{ 
              display: 'flex', 
              gap: '2rem', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {[
                { label: 'More Confidence', val: '4x' },
                { label: 'Curated Tasks', val: '100+' },
                { label: 'Verified Proofs', val: '5k+' }
              ].map((stat, i) => (
                <div key={i} className="glass-panel" style={{ padding: '1.5rem 2.5rem', minWidth: '180px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stat.val}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Built for the next generation of <span className="gradient-text">contributors</span></h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Everything you need to go from your first repo to your first pull request.</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2rem' 
          }}>
            {[
              {
                title: 'Choose Your Path',
                desc: 'Pick a stack, skill level, and goal so each step stays focused and rewarding.',
                icon: '🎯'
              },
              {
                title: 'Practice with Guidance',
                desc: 'Solve real tasks with in-app hints, helpful feedback, and high-fidelity pacing.',
                icon: '🚀'
              },
              {
                title: 'Verify Your Work',
                desc: 'Submit your contribution proof to build a portfolio that top-tier companies actually value.',
                icon: '✅'
              },
              {
                title: 'Elite Dashboard',
                desc: 'Watch your progress grow with world-class metrics and clear milestones.',
                icon: '📊'
              }
            ].map((f, i) => (
              <div key={i} className="glass-card" style={{ padding: '2.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="glass-panel" style={{ 
            padding: '5rem', 
            textAlign: 'center', 
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
            border: '1px solid var(--border-medium)'
          }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Ready to build the future?</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
              Join thousands of developers who are bridging the gap between learning and contributing.
            </p>
            <Link to="/signup" className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '1.1rem' }}>
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
