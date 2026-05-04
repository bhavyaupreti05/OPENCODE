import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProofReview = () => {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProof, setSelectedProof] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewStatus, setReviewStatus] = useState('verified');

  useEffect(() => {
    fetchProofs();
  }, []);

  const fetchProofs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/contributor-console/proofs');
      setProofs(response.data.proofs);
      setError(null);
    } catch (err) {
      setError('Failed to load proofs');
      console.error('Error fetching proofs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (proofId) => {
    try {
      await axios.put(`/api/contributor-console/proofs/${proofId}/verify`, {
        status: reviewStatus,
        notes: reviewNotes,
        verifiedBy: 'admin' // This should come from authenticated user
      });

      await fetchProofs();
      setSelectedProof(null);
      setReviewNotes('');
      setReviewStatus('verified');
    } catch (err) {
      setError('Failed to update proof status');
      console.error('Error updating proof:', err);
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      pending: 'badge-pending',
      verified: 'badge-verified',
      rejected: 'badge-rejected'
    };
    return `badge ${classes[status] || 'badge-pending'}`;
  };

  if (loading) {
    return <div className="loading">Loading proofs...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const pendingProofs = proofs.filter(proof => proof.status === 'pending');
  const reviewedProofs = proofs.filter(proof => proof.status !== 'pending');

  return (
    <div className="proof-review">
      <div className="review-header">
        <h2>Review Contribution Proofs</h2>
        <button onClick={fetchProofs} className="btn btn-secondary">
          Refresh
        </button>
      </div>

      <div className="proofs-summary">
        <div className="summary-card">
          <span className="summary-number">{pendingProofs.length}</span>
          <span className="summary-label">Pending Review</span>
        </div>
        <div className="summary-card">
          <span className="summary-number">{reviewedProofs.length}</span>
          <span className="summary-label">Reviewed</span>
        </div>
        <div className="summary-card">
          <span className="summary-number">{proofs.length}</span>
          <span className="summary-label">Total</span>
        </div>
      </div>

      <div className="proofs-container">
        {/* Pending Proofs */}
        <div className="proofs-section">
          <h3>Pending Review ({pendingProofs.length})</h3>
          {pendingProofs.length === 0 ? (
            <p className="no-proofs">No proofs pending review.</p>
          ) : (
            <div className="proofs-list">
              {pendingProofs.map(proof => (
                <div key={proof._id} className="proof-card">
                  <div className="proof-header">
                    <div className="proof-info">
                      <h4>{proof.userId?.email || 'Unknown User'}</h4>
                      <span className={getStatusBadge(proof.status)}>{proof.status}</span>
                    </div>
                    <div className="proof-date">
                      {new Date(proof.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="proof-content">
                    <p><strong>Contribution URL:</strong></p>
                    <a
                      href={proof.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proof-url"
                    >
                      {proof.url}
                    </a>

                    <p><strong>Description:</strong></p>
                    <p className="proof-description">{proof.description}</p>
                  </div>

                  <div className="proof-actions">
                    <button
                      onClick={() => setSelectedProof(proof)}
                      className="btn btn-primary"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviewed Proofs */}
        <div className="proofs-section">
          <h3>Recently Reviewed ({reviewedProofs.slice(0, 10).length})</h3>
          {reviewedProofs.length === 0 ? (
            <p className="no-proofs">No reviewed proofs yet.</p>
          ) : (
            <div className="proofs-list">
              {reviewedProofs.slice(0, 10).map(proof => (
                <div key={proof._id} className="proof-card reviewed">
                  <div className="proof-header">
                    <div className="proof-info">
                      <h4>{proof.userId?.email || 'Unknown User'}</h4>
                      <span className={getStatusBadge(proof.status)}>{proof.status}</span>
                    </div>
                    <div className="proof-date">
                      Reviewed: {proof.verifiedAt ? new Date(proof.verifiedAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>

                  <div className="proof-content">
                    <p><strong>Contribution URL:</strong></p>
                    <a
                      href={proof.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proof-url"
                    >
                      {proof.url}
                    </a>

                    <p><strong>Description:</strong></p>
                    <p className="proof-description">{proof.description}</p>

                    {proof.notes && (
                      <>
                        <p><strong>Review Notes:</strong></p>
                        <p className="proof-notes">{proof.notes}</p>
                      </>
                    )}
                  </div>

                  <div className="proof-meta">
                    <small>
                      Verified by: {proof.verifiedBy?.email || 'Unknown'}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedProof && (
        <div className="modal-overlay" onClick={() => setSelectedProof(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Review Contribution Proof</h3>
              <button
                onClick={() => setSelectedProof(null)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="proof-details">
                <p><strong>User:</strong> {selectedProof.userId?.email || 'Unknown'}</p>
                <p><strong>Submitted:</strong> {new Date(selectedProof.createdAt).toLocaleDateString()}</p>

                <p><strong>Contribution URL:</strong></p>
                <a
                  href={selectedProof.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proof-url"
                >
                  {selectedProof.url}
                </a>

                <p><strong>Description:</strong></p>
                <p className="proof-description">{selectedProof.description}</p>
              </div>

              <div className="review-form">
                <div className="form-group">
                  <label>Decision:</label>
                  <select
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                  >
                    <option value="verified">Verify (Accept)</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Review Notes:</label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add notes about your decision..."
                    rows="4"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => handleReview(selectedProof._id)}
                className={`btn ${reviewStatus === 'verified' ? 'btn-primary' : 'btn-danger'}`}
              >
                {reviewStatus === 'verified' ? 'Verify Proof' : 'Reject Proof'}
              </button>
              <button
                onClick={() => setSelectedProof(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProofReview;