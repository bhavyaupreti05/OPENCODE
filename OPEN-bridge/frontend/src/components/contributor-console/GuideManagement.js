import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GuideManagement = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    repositoryUrl: '',
    language: '',
    difficulty: 'Beginner',
    contributionGuide: '',
    projectOverview: '',
    gettingStartedSteps: [{ step: '', description: '' }],
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/contributor-console/guides');
      setGuides(response.data.guides);
      setError(null);
    } catch (err) {
      setError('Failed to load guides');
      console.error('Error fetching guides:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      repositoryUrl: '',
      language: '',
      difficulty: 'Beginner',
      contributionGuide: '',
      projectOverview: '',
      gettingStartedSteps: [{ step: '', description: '' }],
      tags: []
    });
    setTagInput('');
    setEditingGuide(null);
    setShowForm(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...formData.gettingStartedSteps];
    newSteps[index][field] = value;
    setFormData(prev => ({
      ...prev,
      gettingStartedSteps: newSteps
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      gettingStartedSteps: [...prev.gettingStartedSteps, { step: '', description: '' }]
    }));
  };

  const removeStep = (index) => {
    setFormData(prev => ({
      ...prev,
      gettingStartedSteps: prev.gettingStartedSteps.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const action = editingGuide ? 'update' : 'create';
      const payload = {
        action,
        guideData: editingGuide ? { id: editingGuide._id, ...formData } : formData
      };

      await axios.post('/api/contributor-console/guides', payload);
      await fetchGuides();
      resetForm();
    } catch (err) {
      setError('Failed to save guide');
      console.error('Error saving guide:', err);
    }
  };

  const handleEdit = (guide) => {
    setFormData({
      name: guide.name,
      description: guide.description,
      repositoryUrl: guide.repositoryUrl,
      language: guide.language,
      difficulty: guide.difficulty,
      contributionGuide: guide.contributionGuide,
      projectOverview: guide.projectOverview,
      gettingStartedSteps: guide.gettingStartedSteps.length > 0
        ? guide.gettingStartedSteps
        : [{ step: '', description: '' }],
      tags: guide.tags || []
    });
    setEditingGuide(guide);
    setShowForm(true);
  };

  const handleDelete = async (guideId) => {
    if (window.confirm('Are you sure you want to deactivate this guide?')) {
      try {
        await axios.delete('/api/contributor-console/guides', {
          data: { action: 'delete', guideData: { id: guideId } }
        });
        await fetchGuides();
      } catch (err) {
        setError('Failed to delete guide');
        console.error('Error deleting guide:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading guides...</div>;
  }

  return (
    <div className="guide-management">
      <div className="management-header">
        <h2>Manage Repository Guides</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add New Guide'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="guide-form">
          <h3>{editingGuide ? 'Edit Guide' : 'Add New Guide'}</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Language *</label>
              <select
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                required
              >
                <option value="">Select Language</option>
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
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Repository URL *</label>
            <input
              type="url"
              value={formData.repositoryUrl}
              onChange={(e) => handleInputChange('repositoryUrl', e.target.value)}
              placeholder="https://github.com/owner/repo"
              required
            />
          </div>

          <div className="form-group">
            <label>Project Overview *</label>
            <textarea
              value={formData.projectOverview}
              onChange={(e) => handleInputChange('projectOverview', e.target.value)}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Contribution Guide *</label>
            <textarea
              value={formData.contributionGuide}
              onChange={(e) => handleInputChange('contributionGuide', e.target.value)}
              rows="6"
              required
            />
          </div>

          <div className="form-group">
            <label>Getting Started Steps *</label>
            {formData.gettingStartedSteps.map((step, index) => (
              <div key={index} className="step-input">
                <input
                  type="text"
                  placeholder="Step title"
                  value={step.step}
                  onChange={(e) => handleStepChange(index, 'step', e.target.value)}
                  required
                />
                <textarea
                  placeholder="Step description"
                  value={step.description}
                  onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                  rows="2"
                  required
                />
                {formData.gettingStartedSteps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="btn btn-danger btn-small"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addStep} className="btn btn-secondary">
              Add Step
            </button>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tag-input">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button type="button" onClick={addTag} className="btn btn-secondary">
                Add
              </button>
            </div>
            <div className="tag-list">
              {formData.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingGuide ? 'Update Guide' : 'Create Guide'}
            </button>
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="guides-list">
        <h3>All Guides ({guides.length})</h3>
        {guides.length === 0 ? (
          <p>No guides found.</p>
        ) : (
          <div className="guides-grid">
            {guides.map(guide => (
              <div key={guide._id} className="guide-admin-card">
                <div className="guide-header">
                  <h4>{guide.name}</h4>
                  <div className="guide-meta">
                    <span className={`badge badge-${guide.difficulty.toLowerCase()}`}>
                      {guide.difficulty}
                    </span>
                    <span className="language">{guide.language}</span>
                  </div>
                </div>

                <p className="guide-description">{guide.description}</p>

                <div className="guide-url">
                  <a href={guide.repositoryUrl} target="_blank" rel="noopener noreferrer">
                    {guide.repositoryUrl}
                  </a>
                </div>

                <div className="guide-tags">
                  {guide.tags?.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>

                <div className="guide-actions">
                  <button
                    onClick={() => handleEdit(guide)}
                    className="btn btn-secondary btn-small"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(guide._id)}
                    className="btn btn-danger btn-small"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideManagement;