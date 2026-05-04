import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';

const OpenSourceGuideDetail = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGuide();
  }, [id]);

  const fetchGuide = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/open-source-guides/${id}`);
      setGuide(response.data.guide);
      setError(null);
    } catch (err) {
      setError('Failed to load guide details');
      console.error('Error fetching guide:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="guide-detail-page">
        <div className="loading">Loading guide...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guide-detail-page">
        <div className="error-message">{error}</div>
        <Link to="/open-source-guides" className="btn btn-primary">
          Back to Guides
        </Link>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="guide-detail-page">
        <div className="error-message">Guide not found</div>
        <Link to="/open-source-guides" className="btn btn-primary">
          Back to Guides
        </Link>
      </div>
    );
  }

  return (
    <div className="guide-detail-page">
      <div className="guide-header-section">
        <Link to="/open-source-guides" className="back-link">
          ← Back to Guides
        </Link>

        <div className="guide-title-section">
          <h1>{guide.name}</h1>
          <div className="guide-meta">
            <span className={`badge badge-${guide.difficulty.toLowerCase()}`}>
              {guide.difficulty}
            </span>
            <span className="language">{guide.language}</span>
            <a
              href={guide.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="repo-link"
            >
              View Repository →
            </a>
          </div>
        </div>
      </div>

      <div className="guide-content">
        <section className="guide-section">
          <h2>Description</h2>
          <p className="guide-description">{guide.description}</p>
        </section>

        <section className="guide-section">
          <h2>Project Overview</h2>
          <div className="project-overview">
            {guide.projectOverview}
          </div>
        </section>

        <section className="guide-section">
          <h2>Getting Started</h2>
          <div className="getting-started-steps">
            {guide.gettingStartedSteps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <h4>{step.step}</h4>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="guide-section">
          <h2>Contribution Guide</h2>
          <div className="contribution-guide">
            {guide.contributionGuide}
          </div>
        </section>

        {guide.tags.length > 0 && (
          <section className="guide-section">
            <h2>Tags</h2>
            <div className="guide-tags">
              {guide.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </section>
        )}

        <div className="guide-actions">
          <a
            href={guide.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Start Contributing
          </a>
          <Link
            to="/contribution-proof/submit"
            className="btn btn-secondary"
          >
            Submit Contribution Proof
          </Link>
          <Link
            to="/practice"
            className="btn btn-outline"
          >
            Practice Bug Fixes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OpenSourceGuideDetail;