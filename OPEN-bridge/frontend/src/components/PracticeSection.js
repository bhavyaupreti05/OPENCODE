import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import './PracticeSection.css';

const fallbackChallenges = [
  {
    id: 'bug-1',
    title: 'Fix the JavaScript string parser',
    description: 'A small parser has an issue where quoted text is not extracted correctly. Debug the code and fix the edge case.',
    stack: 'JavaScript',
    difficulty: 'Beginner',
    relatedGuide: 'React Starter Repo',
    relatedGuidePath: '/open-source-guides',
    badge: 'bug'
  },
  {
    id: 'bug-2',
    title: 'Resolve the React list rendering bug',
    description: 'A component renders duplicate items due to missing keys and incorrect state updates. Identify the bug and apply the fix.',
    stack: 'React',
    difficulty: 'Intermediate',
    relatedGuide: 'React Starter Repo',
    relatedGuidePath: '/open-source-guides',
    badge: 'frontend'
  },
  {
    id: 'bug-3',
    title: 'Debug Node.js JSON loader',
    description: 'A CLI tool fails when loading JSON files with comments. Fix the parser and make it robust for real repository contributions.',
    stack: 'JavaScript',
    difficulty: 'Intermediate',
    relatedGuide: 'Node.js CLI Tool',
    relatedGuidePath: '/open-source-guides',
    badge: 'backend'
  }
];

const PracticeSection = () => {
  const [practiceChallenges, setPracticeChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPracticeChallenges = async () => {
      try {
        const response = await API.get('/problems/practice');
        setPracticeChallenges(response.data || []);
      } catch (err) {
        setError('Could not load practice challenges. Showing example challenges instead.');
        setPracticeChallenges([]);
      } finally {
        setLoading(false);
      }
    };

    loadPracticeChallenges();
  }, []);

  const challengesToRender = practiceChallenges.length > 0 ? practiceChallenges : fallbackChallenges;

  return (
    <div className="practice-page">
      <div className="practice-hero">
        <h1>Practice Bug Fixes</h1>
        <p>
          Solve real-world bug challenges, sharpen your debugging skills, and get ready to contribute to open-source projects.
        </p>
      </div>

      <div className="practice-intro-card">
        <h2>How it works</h2>
        <ul>
          <li>Choose a bug challenge from the list.</li>
          <li>Read the problem statement and debugging hints.</li>
          <li>Practice solving the issue locally or in the browser.</li>
          <li>Use the related open-source guide to continue contributing.</li>
        </ul>
      </div>

      {loading ? (
        <div className="practice-loading">Loading practice challenges...</div>
      ) : (
        <>
          {error && <div className="practice-error">{error}</div>}

          <div className="challenges-grid">
            {challengesToRender.map((challenge) => {
              const challengeId = challenge._id || challenge.id;
              return (
                <div key={challengeId} className="challenge-card">
                  <div className="challenge-badge">{challenge.badge || 'bug'}</div>
                  <h3>{challenge.title}</h3>
                  <p>{challenge.description}</p>
                  <div className="challenge-meta">
                    <span>{challenge.stackId?.name || challenge.stack}</span>
                    <span>{challenge.difficultyId?.name || challenge.difficulty}</span>
                  </div>
                  <div className="challenge-actions">
                    <Link to={`/problems/${challengeId}`} className="btn btn-primary">
                      Practice Bug Fix
                    </Link>
                    <Link to={challenge.relatedGuidePath} className="btn btn-secondary">
                      Explore {challenge.relatedGuide}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="practice-note">
        <h2>Ready to contribute?</h2>
        <p>
          After solving bugs here, explore open-source repositories and submit contribution proof once you complete your first contribution.
        </p>
        <Link to="/contribution-proof/submit" className="btn btn-tertiary">
          Submit Contribution Proof
        </Link>
      </div>
    </div>
  );
};

export default PracticeSection;
