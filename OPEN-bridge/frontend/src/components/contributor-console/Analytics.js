import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/contributor-console/analytics');
      setAnalytics(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!analytics) {
    return <div className="error-message">No analytics data available</div>;
  }

  return (
    <div className="analytics-section">
      <div className="analytics-header">
        <h2>Platform Analytics</h2>
        <p>Last updated: {new Date(analytics.generatedAt).toLocaleString()}</p>
        <button onClick={fetchAnalytics} className="btn btn-secondary">
          Refresh
        </button>
      </div>

      <div className="analytics-grid">
        {/* Guides Analytics */}
        <div className="analytics-card">
          <h3>Repository Guides</h3>
          <div className="metric">
            <span className="metric-value">{analytics.guides.total}</span>
            <span className="metric-label">Total Guides</span>
          </div>

          <div className="sub-metrics">
            <h4>By Language</h4>
            <div className="metric-list">
              {analytics.guides.byLanguage.slice(0, 5).map(item => (
                <div key={item._id} className="metric-item">
                  <span>{item._id}</span>
                  <span className="count">{item.count}</span>
                </div>
              ))}
            </div>

            <h4>By Difficulty</h4>
            <div className="metric-list">
              {analytics.guides.byDifficulty.map(item => (
                <div key={item._id} className="metric-item">
                  <span>{item._id}</span>
                  <span className="count">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Proofs Analytics */}
        <div className="analytics-card">
          <h3>Contribution Proofs</h3>
          <div className="metric">
            <span className="metric-value">{analytics.proofs.total}</span>
            <span className="metric-label">Total Proofs</span>
          </div>

          <div className="sub-metrics">
            <h4>By Status</h4>
            <div className="metric-list">
              {analytics.proofs.byStatus.map(item => (
                <div key={item._id} className="metric-item">
                  <span className={`status-${item._id}`}>{item._id}</span>
                  <span className="count">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {analytics.proofs.recent.length > 0 && (
            <div className="recent-activity">
              <h4>Recent Submissions</h4>
              <div className="recent-list">
                {analytics.proofs.recent.slice(0, 3).map(proof => (
                  <div key={proof._id} className="recent-item">
                    <span className="user">{proof.userId?.email || 'Unknown'}</span>
                    <span className={`status-${proof.status}`}>{proof.status}</span>
                    <span className="date">
                      {new Date(proof.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Users Analytics */}
        <div className="analytics-card">
          <h3>Users</h3>
          <div className="metric">
            <span className="metric-value">{analytics.users.total}</span>
            <span className="metric-label">Total Users</span>
          </div>

          <div className="sub-metrics">
            <h4>By Role</h4>
            <div className="metric-list">
              {analytics.users.byRole.map(item => (
                <div key={item._id} className="metric-item">
                  <span>{item._id}</span>
                  <span className="count">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {analytics.users.recent.length > 0 && (
            <div className="recent-activity">
              <h4>Recent Registrations</h4>
              <div className="recent-list">
                {analytics.users.recent.slice(0, 3).map(user => (
                  <div key={user._id} className="recent-item">
                    <span className="user">{user.email}</span>
                    <span className="role">{user.role?.name || 'user'}</span>
                    <span className="date">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;