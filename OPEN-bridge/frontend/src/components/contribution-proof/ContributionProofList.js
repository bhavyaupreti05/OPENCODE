import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const ContributionProofList = () => {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const params = filter !== 'all' ? { status: filter } : {};
        const response = await API.get('/contribution-proof', { params });
        setProofs(response.data);
      } catch (err) {
        setError('Could not load your contribution proofs.');
      } finally {
        setLoading(false);
      }
    };

    fetchProofs();
  }, [filter]);

  const getStatusBadge = (status) => {
    const classes = {
      pending: 'badge badge-pending',
      verified: 'badge badge-verified',
      rejected: 'badge badge-rejected'
    };
    return classes[status] || 'badge';
  };

  return (
    <div className="contribution-list-page">
      <h2>My Contribution Proofs</h2>
      <p>Track the status of your submitted contributions.</p>

      <div className="filter-controls">
        <label>Filter by status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading && <p>Loading your proofs…</p>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && proofs.length === 0 && (
        <p>You haven't submitted any contribution proofs yet.</p>
      )}

      <div className="proofs-list">
        {proofs.map((proof) => (
          <div key={proof._id} className="proof-card">
            <div className="proof-header">
              <h3>
                <a href={proof.url} target="_blank" rel="noopener noreferrer">
                  {proof.url}
                </a>
              </h3>
              <span className={getStatusBadge(proof.status)}>
                {proof.status.charAt(0).toUpperCase() + proof.status.slice(1)}
              </span>
            </div>

            {proof.description && (
              <p className="proof-description">{proof.description}</p>
            )}

            <div className="proof-meta">
              <small>Submitted: {new Date(proof.createdAt).toLocaleDateString()}</small>
              {proof.verifiedAt && (
                <small>Reviewed: {new Date(proof.verifiedAt).toLocaleDateString()}</small>
              )}
            </div>

            {proof.notes && (
              <div className="proof-notes">
                <strong>Notes:</strong> {proof.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContributionProofList;