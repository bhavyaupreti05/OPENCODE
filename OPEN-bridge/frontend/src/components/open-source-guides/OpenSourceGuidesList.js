import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

const OpenSourceGuidesList = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    language: '',
    difficulty: '',
    tags: []
  });

  useEffect(() => {
    fetchGuides();
  }, [filters]);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await API.get('/open-source-guides', {
        params: {
          language: filters.language || undefined,
          difficulty: filters.difficulty || undefined,
          tags: filters.tags.length > 0 ? filters.tags : undefined
        }
      });
      setGuides(response.data.guides);
      setError(null);
    } catch (err) {
      setError('Failed to load repository guides');
      console.error('Error fetching guides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      language: '',
      difficulty: '',
      tags: []
    });
  };

  if (loading) {
    return (
      <div className="guides-list-page">
        <h1>Open-Source Guides</h1>
        <div className="loading">Loading guides...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guides-list-page">
        <h1>Open-Source Guides</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="guides-list-page">
      <h1>Open-Source Guides</h1>

      <div className="filters-section">
        <h2>Find the Perfect Project</h2>

        <div className="filter-controls">
          <select
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
          >
            <option value="">All Languages</option>
            <option value="JavaScript">JavaScript</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="C#">C#</option>
            <option value="Go">Go</option>
            <option value="Rust">Rust</option>
            <option value="PHP">PHP</option>
            <option value="Ruby">Ruby</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <button onClick={clearFilters} className="btn btn-secondary">
            Clear Filters
          </button>
        </div>

        <div className="tag-filters">
          <h3>Popular Tags:</h3>
          {['web', 'mobile', 'api', 'cli', 'framework', 'library', 'game', 'data', 'ai', 'security'].map(tag => (
            <button
              key={tag}
              className={`tag-btn ${filters.tags.includes(tag) ? 'active' : ''}`}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="guides-grid">
        {guides.length === 0 ? (
          <div className="no-guides">
            <p>No guides found matching your criteria.</p>
            <button onClick={clearFilters} className="btn btn-primary">
              Show All Guides
            </button>
          </div>
        ) : (
          guides.map(guide => (
            <div key={guide._id} className="guide-card">
              <div className="guide-header">
                <h3>
                  <Link to={`/open-source-guides/${guide._id}`}>
                    {guide.name}
                  </Link>
                </h3>
                <div className="guide-meta">
                  <span className={`badge badge-${guide.difficulty.toLowerCase()}`}>
                    {guide.difficulty}
                  </span>
                  <span className="language">{guide.language}</span>
                </div>
              </div>

              <p className="guide-description">{guide.description}</p>

              <div className="guide-tags">
                {guide.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>

              <div className="guide-actions">
                <Link
                  to={`/open-source-guides/${guide._id}`}
                  className="btn btn-primary"
                >
                  View Guide
                </Link>
                <a
                  href={guide.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  View Repository
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OpenSourceGuidesList;