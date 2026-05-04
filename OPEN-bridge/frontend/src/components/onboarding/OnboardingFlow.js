import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import '../../App.css';

const OnboardingFlow = () => {
  const [stacks, setStacks] = useState([]);
  const [skills, setSkills] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [selectedStack, setSelectedStack] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState('beginner');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [stacksResponse, difficultiesResponse] = await Promise.all([
          API.get('/stacks'),
          API.get('/difficulties')
        ]);
        setStacks(stacksResponse.data.data);
        setDifficulties(difficultiesResponse.data.data);
      } catch (err) {
        setError('Unable to load onboarding options. Please try again later.');
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    if (!selectedStack) {
      setSkills([]);
      setSelectedSkill('');
      return;
    }

    const loadSkills = async () => {
      try {
        const response = await API.get(`/stacks/${selectedStack}/skills`);
        setSkills(response.data.data);
      } catch (err) {
        setError('Unable to load specific skill focus for this stack.');
      }
    };
    loadSkills();
  }, [selectedStack]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await API.post('/onboarding', {
        stackId: selectedStack,
        skillId: selectedSkill,
        difficultyId: selectedDifficulty,
        confidenceLevel,
        experience
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Onboarding failed. Please ensure all fields are correct.');
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '100px 2rem 60px', position: 'relative' }}>
      <div className="mesh-gradient"></div>
      
      <div className="glass-panel animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: '640px', 
        padding: '3.5rem',
        boxShadow: 'var(--shadow-xxl)',
        border: '1px solid var(--border-medium)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Personalize your <span className="gradient-text">Future</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            We'll tailor your learning path based on your tech stack and current experience.
          </p>
        </div>

        {error && (
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            borderRadius: 'var(--radius-sm)',
            color: '#f87171',
            fontSize: '0.85rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Technology Stack</label>
              <select
                className="form-input"
                style={{ appearance: 'none', background: 'var(--bg-secondary) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 1rem center' }}
                value={selectedStack}
                onChange={(e) => setSelectedStack(e.target.value)}
                required
              >
                <option value="">Select stack</option>
                {stacks.map((stack) => (
                  <option key={stack._id} value={stack._id}>{stack.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Skill Focus</label>
              <select
                className="form-input"
                style={{ appearance: 'none', background: 'var(--bg-secondary) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 1rem center' }}
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                required
                disabled={!skills.length}
              >
                <option value="">Select skill</option>
                {skills.map((skill) => (
                  <option key={skill._id} value={skill._id}>{skill.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Difficulty</label>
            <select
              className="form-input"
              style={{ appearance: 'none', background: 'var(--bg-secondary) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 1rem center' }}
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              required
            >
              <option value="">Select difficulty</option>
              {difficulties.map((level) => (
                <option key={level._id} value={level._id}>{level.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginTop: '2.5rem' }}>
            <label className="form-label">How do you feel about your readiness?</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { id: 'beginner', label: 'I’m starting from the very beginning' },
                { id: 'confused', label: 'I know some basics but feel overwhelmed' },
                { id: 'some_experience', label: 'I have experience and want elite structure' }
              ].map((opt) => (
                <label key={opt.id} className="flex-center" style={{ 
                  justifyContent: 'flex-start', 
                  gap: '12px', 
                  padding: '16px', 
                  borderRadius: 'var(--radius-md)', 
                  border: `1px solid ${confidenceLevel === opt.id ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                  background: confidenceLevel === opt.id ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}>
                  <input
                    type="radio"
                    name="confidence"
                    value={opt.id}
                    checked={confidenceLevel === opt.id}
                    onChange={(e) => setConfidenceLevel(e.target.value)}
                    style={{ scale: '1.2', accentColor: 'var(--accent-primary)' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: confidenceLevel === opt.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '2rem' }}>
            <label className="form-label">Briefly describe your goals (Optional)</label>
            <textarea
              className="form-input"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="What specific projects or goals are you targeting?"
              style={{ minHeight: '120px', resize: 'vertical' }}
              maxLength={500}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
            <Link to="/dashboard" className="btn btn-secondary" style={{ flex: 1 }}>Skip for now</Link>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Initialize Workspace</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingFlow;
