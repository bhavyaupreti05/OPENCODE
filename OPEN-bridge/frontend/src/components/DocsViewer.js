import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import './DocsViewer.css';

const DocsViewer = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const response = await API.get(`/docs/${id}`);
        setDoc(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load documentation');
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [id]);

  if (loading) {
    return <div className="docs-viewer-page">
      <div className="loading">Loading documentation...</div>
    </div>;
  }

  if (error) {
    return <div className="docs-viewer-page">
      <div className="error-message">{error}</div>
      <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
    </div>;
  }

  if (!doc) {
    return <div className="docs-viewer-page">
      <div className="error-message">Documentation not found</div>
      <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
    </div>;
  }

  return (
    <div className="docs-viewer-page">
      <div className="doc-header">
        <div className="doc-meta">
          <div className="doc-tags">
            <span className="tag stack">{doc.stackId?.name}</span>
            <span className="tag skill">{doc.skillId?.name}</span>
            <span className="tag difficulty">{doc.difficultyId?.name}</span>
            <span className="tag type">{doc.contentType}</span>
          </div>
          <div className="doc-stats">
            <span className="stat">📖 {doc.estimatedReadTime} min read</span>
          </div>
        </div>
        <h1>{doc.title}</h1>
        <p className="doc-summary">{doc.summary}</p>
      </div>

      <div className="doc-content">
        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(doc.content) }}
        />
      </div>

      <div className="doc-actions">
        <Link to="/dashboard" className="btn btn-outline">Back to Dashboard</Link>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          Print Document
        </button>
      </div>
    </div>
  );
};

// Simple markdown formatter - in a real app, you'd use a proper markdown parser
const formatMarkdown = (content) => {
  return content
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(.+?)$/, '<p>$1</p>');
};

export default DocsViewer;