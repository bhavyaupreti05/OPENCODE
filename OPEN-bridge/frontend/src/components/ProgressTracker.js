import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import '../App.css';

const ProgressTracker = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // Simulating API call for user progress
        const mockProgress = {
          totalPaths: 2,
          completedPaths: 1,
          inProgressPaths: 1,
          totalNodes: 8,
          completedNodes: 3,
          inProgressNodes: 2,
          paths: [
            {
              _id: '69e517d21d61b3cf8ff18382',
              title: 'JavaScript Fundamentals',
              progress: 60,
              completedNodes: 3,
              totalNodes: 5,
              status: 'in-progress',
              lastActivity: '2024-01-15T10:30:00Z'
            },
            {
              _id: '69e517d21d61b3cf8ff18383',
              title: 'React Basics',
              progress: 100,
              completedNodes: 3,
              totalNodes: 3,
              status: 'completed',
              lastActivity: '2024-01-10T14:20:00Z'
            }
          ]
        };
        setProgress(mockProgress);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load progress data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Analyzing your achievements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #ef4444' }}>
          {error}
        </div>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Dashboard</Link>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return { bg: 'rgba(34, 197, 94, 0.1)', color: '#4ade80' };
      case 'in-progress': return { bg: 'rgba(234, 179, 8, 0.1)', color: '#facc15' };
      default: return { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)' };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="progress-tracker-page" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container">
        <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Your <span className="gradient-text">Journey</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>A detailed breakdown of your milestones and technical growth.</p>
        </header>

        {/* Overview Stats */}
        <section style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '4rem'
        }}>
          {[
            { label: 'Active Paths', val: progress.totalPaths, icon: '🎯' },
            { label: 'Completed', val: progress.completedPaths, icon: '✅' },
            { label: 'Learning Nodes', val: `${progress.completedNodes}/${progress.totalNodes}`, icon: '📚' },
            { label: 'Overall Mastery', val: `${Math.round((progress.completedNodes / progress.totalNodes) * 100)}%`, icon: '🚀' }
          ].map((stat, i) => (
            <div key={i} className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stat.val}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Path Details */}
        <section>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Path Mastery Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            {progress.paths.map((path) => {
              const status = getStatusStyle(path.status);
              return (
                <div key={path._id} className="glass-card" style={{ padding: '2.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{path.title}</h3>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 700, 
                          padding: '4px 12px', 
                          borderRadius: 'var(--radius-full)', 
                          backgroundColor: status.bg, 
                          color: status.color,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {path.status.replace('-', ' ')}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                          Last active: {formatDate(path.lastActivity)}
                        </span>
                      </div>
                    </div>
                    <Link to={`/learning-path/${path._id}`} className="btn btn-secondary">
                      Go to Path
                    </Link>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Module completion</span>
                      <span style={{ fontWeight: 600 }}>{path.progress}%</span>
                    </div>
                    <div style={{ 
                      height: '8px', 
                      width: '100%', 
                      background: 'var(--bg-tertiary)', 
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${path.progress}%`, 
                        background: 'var(--accent-gradient)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}></div>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    {path.completedNodes} of {path.totalNodes} technical challenges verified
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div style={{ marginTop: '5rem', textAlign: 'center' }}>
          <Link to="/onboarding" className="btn btn-primary" style={{ padding: '16px 48px' }}>Start New Learning Path</Link>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Workspace</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
