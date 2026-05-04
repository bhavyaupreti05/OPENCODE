import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const ContributionProofSubmit = () => {
  const [formData, setFormData] = useState({
    url: '',
    description: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await API.post('/contribution-proof', formData);
      setSuccess(true);
      setFormData({ url: '', description: '', notes: '' });
    } catch (err) {
      setError('Failed to submit contribution proof. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contribution-submit-page">
      <h2>Submit Contribution Proof</h2>
      <p>Share your real-world open-source contributions to get verified and build your profile.</p>

      {success && (
        <div className="success-message">
          Your contribution proof has been submitted successfully! It will be reviewed by our community.
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="contribution-form">
        <div className="form-group">
          <label htmlFor="url">Contribution URL *</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://github.com/example/repo/pull/123"
            required
          />
          <small>Link to your PR, issue, or contribution</small>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Briefly describe what you contributed..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional context or notes..."
            rows="2"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Proof'}
        </button>
      </form>
    </div>
  );
};

export default ContributionProofSubmit;