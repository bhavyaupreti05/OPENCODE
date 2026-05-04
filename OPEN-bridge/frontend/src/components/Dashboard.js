import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import '../App.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [paths, setPaths] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please sign in to access your dashboard.');
        return;
      }

      try {
        const [profileResponse, pathsResponse] = await Promise.all([
          API.get('/users/profile'),
          API.get('/paths')
        ]);

        setUser(profileResponse.data.data.user);
        setPaths(pathsResponse.data.data);
      } catch (err) {
        setError('Unable to load dashboard data. Please sign in again.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-page" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome back, <span className="gradient-text">{user?.email?.split('@')[0] || 'Contributor'}</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your progress and continue your journey to open source mastery.</p>
        </div>

        {error && (
          <div className="glass-panel" style={{ padding: '1rem', borderLeft: '4px solid #ef4444', marginBottom: '2rem', color: '#f87171' }}>
            {error}
          </div>
        )}

        {user ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
            {/* Main Content: Learning Paths */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem' }}>Your Learning Paths</h2>
                  <Link to="/onboarding" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>+ Create New Path</Link>
                </div>

                {paths.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
                    <h3 style={{ marginBottom: '0.5rem' }}>No paths active yet</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Complete onboarding to generate your personalized learning roadmap.</p>
                    <Link to="/onboarding" className="btn btn-primary">Start Onboarding</Link>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                    {paths.map((path) => (
                      <div key={path._id} className="glass-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{path.title}</h3>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: '500px' }}>{path.description}</p>
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: '4px', color: 'var(--text-secondary)' }}>{path.stackId.name}</span>
                            <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: '4px', color: 'var(--text-secondary)' }}>{path.skillId.name}</span>
                            <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: '4px', color: 'var(--text-secondary)' }}>{path.difficultyId.name}</span>
                          </div>
                        </div>
                        <Link to={`/learning-path/${path._id}`} className="btn btn-primary" style={{ padding: '10px 20px' }}>
                          Continue
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Quick Actions Grid */}
              <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <Link to="/practice" className="glass-panel" style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit', transition: 'var(--transition-normal)' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛠️</div>
                    <div style={{ fontWeight: 600 }}>Practice Lab</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fix real-world bugs in a safe sandbox.</div>
                  </Link>
                  <Link to="/contribution-proof/submit" className="glass-panel" style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📜</div>
                    <div style={{ fontWeight: 600 }}>Submit Proof</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Log your latest contribution for verification.</div>
                  </Link>
                  <Link to="/open-source-guides" className="glass-panel" style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📖</div>
                    <div style={{ fontWeight: 600 }}>Read Guides</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Learn best practices from industry experts.</div>
                  </Link>
                </div>
              </section>
            </div>

            {/* Sidebar: Profile & Stats */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>Profile Overview</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Selected Stack</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.selectedStack?.name || 'Not set'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Skill Level</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.selectedSkill?.name || 'Not set'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Experience</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.experience || 'Not set'}</div>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                     <Link to="/onboarding" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>Update Preferences →</Link>
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--accent-gradient)', color: 'white', border: 'none' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Go Pro</h3>
                <p style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '1rem' }}>Unlock 1-on-1 mentorship and advanced repo analysis tools.</p>
                <button className="btn" style={{ width: '100%', background: 'white', color: 'var(--bg-primary)', padding: '8px', fontSize: '0.85rem' }}>Upgrade Now</button>
              </div>

              <Link to="/contributor-console" className="btn btn-secondary" style={{ width: '100%', fontSize: '0.9rem' }}>
                Admin Dashboard
              </Link>
            </aside>
          </div>
        ) : (
          <div className="flex-center" style={{ height: '300px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Initializing workspace...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
