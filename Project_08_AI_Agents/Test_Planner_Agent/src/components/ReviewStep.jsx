import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TEST_PLAN_SECTIONS } from '../data/constants';
import {
  RefreshCw,
  Target,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Bug,
  BookOpen,
  Layers,
} from 'lucide-react';
import './ReviewStep.css';

const issueTypeIcons = {
  Story: BookOpen,
  Bug: Bug,
  Task: CheckSquare,
  Epic: Layers,
};

const priorityColors = {
  Critical: 'var(--error)',
  High: '#F97316',
  Medium: '#EAB308',
  Low: 'var(--success)',
};

export default function ReviewStep() {
  const { state, dispatch, showToast } = useApp();
  const [generating, setGenerating] = useState(false);
  const [expandedIssue, setExpandedIssue] = useState(null);

  const activeConnection = state.connections.find(c => c.id === state.activeConnectionId);

  const handleGenerate = async () => {
    if (state.selectedIssueIds.length === 0) {
      showToast('Please select at least one issue', 'error');
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'groq' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate plan');

      const selectedIssues = state.issues.filter(i => state.selectedIssueIds.includes(i.id));

      const plan = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        title: `Test Plan — ${state.fetchForm.productName || state.fetchForm.projectKey}`,
        generatedAt: new Date().toISOString(),
        issueCount: selectedIssues.length,
        isRawMarkdown: true,
        rawMarkdown: data.markdown,
        sections: {}
      };

      dispatch({ type: 'SET_TEST_PLAN', payload: plan });
      dispatch({ type: 'ADD_TO_HISTORY', payload: plan });
      showToast('Test plan generated successfully!', 'success');
      dispatch({ type: 'SET_STEP', payload: 4 });
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setGenerating(false);
    }
  };

  const allSelected = state.selectedIssueIds.length === state.issues.length;

  return (
    <div className="review-step animate-fade-in">
      {/* Connection indicator */}
      {activeConnection && (
        <div className="review-connection-bar">
          <div className="review-connection-info">
            <Target size={16} className="text-primary" />
            <span>{activeConnection.name} ({activeConnection.url})</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => {
            dispatch({ type: 'SET_ISSUES', payload: [] });
            dispatch({ type: 'SET_STEP', payload: 2 });
          }}>
            <RefreshCw size={14} /> Refresh Issues
          </button>
        </div>
      )}

      {/* Additional Context */}
      <div className="card mb-xl">
        <h2>Additional Context & Notes</h2>
        <p className="text-sm text-muted mb-lg">
          Add any additional context about the testing approach, special requirements, or constraints
        </p>
        <textarea
          placeholder="Add any additional context about the testing approach, special requirements, constraints, team structure, or specific areas of focus..."
          rows={5}
          value={state.reviewContext}
          onChange={e => dispatch({ type: 'SET_REVIEW_CONTEXT', payload: e.target.value })}
        />
      </div>

      {/* Issues List */}
      <div className="card mb-xl">
        <div className="issues-header">
          <div>
            <h2>Review Jira Issues ({state.issues.length})</h2>
            <p className="text-sm text-muted">Issues that will be used to generate the test plan</p>
          </div>
          <div className="issues-actions">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => dispatch({ type: allSelected ? 'DESELECT_ALL_ISSUES' : 'SELECT_ALL_ISSUES' })}
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
            <span className="badge badge-info">
              {state.selectedIssueIds.length} selected
            </span>
          </div>
        </div>

        {state.issues.length === 0 ? (
          <div className="issues-empty">
            <AlertCircle size={32} className="text-muted" />
            <p>No issues fetched yet. Go back to fetch issues first.</p>
          </div>
        ) : (
          <div className="issues-list">
            {state.issues.map(issue => {
              const isSelected = state.selectedIssueIds.includes(issue.id);
              const isExpanded = expandedIssue === issue.id;
              const TypeIcon = issueTypeIcons[issue.type] || BookOpen;

              return (
                <div
                  key={issue.id}
                  className={`issue-item ${isSelected ? 'selected' : ''}`}
                >
                  <div className="issue-row" onClick={() => setExpandedIssue(isExpanded ? null : issue.id)}>
                    <button
                      className="issue-checkbox"
                      onClick={e => {
                        e.stopPropagation();
                        dispatch({ type: 'TOGGLE_ISSUE', payload: issue.id });
                      }}
                    >
                      {isSelected ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} />}
                    </button>

                    <div className="issue-type-icon" style={{ color: priorityColors[issue.priority] }}>
                      <TypeIcon size={16} />
                    </div>

                    <div className="issue-info">
                      <div className="issue-key">{issue.key}</div>
                      <div className="issue-summary">{issue.summary}</div>
                    </div>

                    <div className="issue-meta">
                      <span className={`badge ${issue.type === 'Bug' ? 'badge-warning' : 'badge-info'}`}>
                        {issue.type}
                      </span>
                      <span className="badge badge-gray">{issue.priority}</span>
                    </div>

                    <button className="issue-expand">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="issue-details animate-fade-in">
                      <div className="issue-detail-grid">
                        <div>
                          <h4 className="text-sm font-semibold mb-sm">Description</h4>
                          <p className="text-sm">{issue.description}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-sm">Acceptance Criteria</h4>
                          <pre className="issue-criteria">{issue.acceptanceCriteria}</pre>
                        </div>
                      </div>
                      <div className="issue-labels mt-md">
                        {issue.labels.map(l => (
                          <span key={l} className="badge badge-gray">{l}</span>
                        ))}
                        <span className="badge badge-info">{issue.sprint}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        className="btn btn-primary btn-full btn-lg"
        onClick={handleGenerate}
        disabled={generating || state.selectedIssueIds.length === 0}
      >
        {generating ? (
          <>
            <div className="spinner" /> Generating Test Plan with AI...
          </>
        ) : (
          <>
            <Target size={18} /> Generate Test Plan
          </>
        )}
      </button>
    </div>
  );
}
