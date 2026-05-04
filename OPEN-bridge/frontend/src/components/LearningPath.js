import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import './LearningPath.css';

const LearningPath = () => {
  const { id } = useParams();
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPath = async () => {
      try {
        const response = await API.get(`/paths/${id}`);
        setPath(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load learning path');
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, [id]);

  if (loading) {
    return <div className="learning-path-page">
      <div className="loading">Loading your learning path...</div>
    </div>;
  }

  if (error) {
    return <div className="learning-path-page">
      <div className="error-message">{error}</div>
      <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
    </div>;
  }

  if (!path) {
    return <div className="learning-path-page">
      <div className="error-message">Learning path not found</div>
      <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
    </div>;
  }

  return (
    <div className="learning-path-page">
      <div className="path-header">
        <h1>{path.title}</h1>
        <p className="path-description">{path.description}</p>
        <div className="path-meta">
          <span className="meta-item">
            <strong>Stack:</strong> {path.stackId.name}
          </span>
          <span className="meta-item">
            <strong>Skill:</strong> {path.skillId.name}
          </span>
          <span className="meta-item">
            <strong>Level:</strong> {path.difficultyId.name}
          </span>
          <span className="meta-item">
            <strong>Duration:</strong> {path.estimatedDuration} minutes
          </span>
        </div>
      </div>

      <div className="path-nodes">
        <h2>Your Learning Journey</h2>
        {path.nodes.length === 0 ? (
          <div className="empty-nodes">
            <p>No learning content available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="nodes-list">
            {path.nodes.map((node, index) => (
              <div key={node._id} className="node-card">
                <div className="node-header">
                  <div className="node-order">{index + 1}</div>
                  <div className="node-content">
                    <h3>{node.title}</h3>
                    <p>{node.description}</p>
                    <div className="node-meta">
                      <span className="node-type">{node.contentType}</span>
                      <span className="node-time">{node.estimatedTime} min</span>
                      <span className="node-difficulty">{node.difficulty}</span>
                    </div>
                  </div>
                </div>
                <div className="node-actions">
                  {node.contentType === 'doc' && (
                    <Link
                      to={`/docs/${node.contentId._id}`}
                      className="btn btn-primary"
                    >
                      Read Documentation
                    </Link>
                  )}
                  {node.contentType === 'problem' && (
                    <Link
                      to={`/problems/${node.contentId._id}`}
                      className="btn btn-secondary"
                    >
                      Solve Problem
                    </Link>
                  )}
                  {node.contentType === 'simulation' && (
                    <Link
                      to={`/simulation/${node.contentId._id}`}
                      className="btn btn-warning"
                    >
                      Start Simulation
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="path-actions">
        <Link to="/dashboard" className="btn btn-outline">Back to Dashboard</Link>
        <Link to="/progress" className="btn btn-outline">View Progress</Link>
      </div>
    </div>
  );
};

export default LearningPath;