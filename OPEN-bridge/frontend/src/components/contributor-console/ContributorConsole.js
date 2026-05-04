import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Analytics from './Analytics';
import GuideManagement from './GuideManagement';
import ProofReview from './ProofReview';

const ContributorConsole = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user has admin/contributor permissions
    // For now, we'll assume they do
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="contributor-console">
        <div className="loading">Loading contributor console...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contributor-console">
        <div className="error-message">{error}</div>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'analytics', label: 'Analytics', component: Analytics },
    { id: 'guides', label: 'Manage Guides', component: GuideManagement },
    { id: 'proofs', label: 'Review Proofs', component: ProofReview }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="contributor-console">
      <div className="console-header">
        <h1>Contributor Console</h1>
        <p>Manage platform content and review contributions</p>
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="console-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="console-content">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default ContributorConsole;