import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import '../App.css';

const ProblemCatalog = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await API.get(`/problems/${id}`);
        setProblem(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load problem');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Preparing your technical workspace...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>{error || 'Problem not found'}</h2>
          <Link to="/dashboard" className="btn btn-primary">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="problem-catalog-page" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Mini Breadcrumb Header */}
      <header className="glass-panel" style={{ 
        height: '60px', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 2rem', 
        borderRadius: 0, 
        borderTop: 0,
        borderLeft: 0,
        borderRight: 0,
        background: 'rgba(11, 14, 20, 0.8)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem' }}>
          <Link to="/dashboard" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>Dashboard</Link>
          <span style={{ color: 'var(--text-tertiary)' }}>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{problem.title}</span>
        </div>
      </header>

      {/* Main Split-Pane Workspace */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Pane: Description */}
        <div style={{ flex: '0 0 45%', borderRight: '1px solid var(--border-medium)', overflowY: 'auto', padding: '2.5rem', background: 'var(--bg-primary)' }}>
          <div className="problem-meta" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', background: 'var(--accent-primary)', color: 'white' }}>{problem.stackId?.name}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{problem.difficultyId?.name}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', background: 'rgba(234, 179, 8, 0.1)', color: '#facc15' }}>{problem.estimatedSolveTime} MIN</span>
            </div>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{problem.title}</h1>
          </div>

          <div className="problem-section" style={{ marginBottom: '3rem' }}>
            <div
              style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1rem' }}
              dangerouslySetInnerHTML={{ __html: formatMarkdown(problem.description) }}
            />
          </div>

          {problem.testCases && problem.testCases.length > 0 && (
            <div className="problem-section" style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Examples</h2>
              {problem.testCases.filter(tc => !tc.isHidden).map((testCase, index) => (
                <div key={index} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Example {index + 1}</h4>
                  <div style={{ fontSize: '0.875rem' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Input:</strong> 
                      <pre style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '4px', marginTop: '0.5rem', color: 'var(--accent-primary)' }}>{testCase.input}</pre>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Expected Output:</strong>
                      <pre style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '4px', marginTop: '0.5rem', color: '#4ade80' }}>{testCase.expectedOutput}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {problem.hints && problem.hints.length > 0 && (
            <div className="problem-section">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Hints</h2>
              {problem.hints.map((hint, index) => (
                <details key={index} style={{ marginBottom: '1rem', cursor: 'pointer' }}>
                  <summary style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.9rem' }}>Hint {index + 1}</summary>
                  <p style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{hint.text}</p>
                </details>
              ))}
            </div>
          )}
        </div>

        {/* Right Pane: Code Editor & Results */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
          
          {/* Editor Header */}
          <div style={{ 
            height: '48px', 
            background: 'var(--bg-tertiary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Solution.js</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Reset</button>
                <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Run Tests</button>
            </div>
          </div>

          {/* Textarea disguised as Editor */}
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
                border: 'none',
                color: '#e0e7ff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                padding: '1.5rem',
                resize: 'none',
                outline: 'none',
                lineHeight: 1.6
              }}
              defaultValue={problem.starterCode || '// Write your solution here...'}
              spellCheck={false}
            />
          </div>

          {/* Console / Output Area */}
          <div style={{ 
            height: '250px', 
            borderTop: '1px solid var(--border-medium)', 
            background: 'rgba(11, 14, 20, 0.9)', 
            padding: '1.5rem',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Output</h3>
                <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>All systems operational</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                > Ready to execute solution...
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const formatMarkdown = (content) => {
  if (!content) return '';
  return content
    .replace(/^# (.+)$/gm, '<h1 style="font-size: 2rem; margin-bottom: 1.5rem; color: var(--text-primary)">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size: 1.5rem; margin: 2rem 0 1rem; color: var(--text-primary)">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color: var(--text-primary)">$1</strong>')
    .replace(/`(.+?)`/g, '<code style="background: var(--bg-tertiary); padding: 2px 6px; border-radius: 4px; color: var(--accent-primary)">$1</code>')
    .replace(/\n\n/g, '</p><p style="margin-bottom: 1rem">')
    .replace(/\n/g, '<br>');
};

export default ProblemCatalog;
