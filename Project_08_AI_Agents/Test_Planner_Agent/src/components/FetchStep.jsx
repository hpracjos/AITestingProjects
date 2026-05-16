import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import './FetchStep.css';

/* Simulated Jira issues for demo purposes */
const MOCK_ISSUES = [
  {
    id: '1',
    key: 'VWOAPP-101',
    summary: 'User should be able to login with valid credentials',
    description: 'As a user, I want to log into the VWO application using my email and password so that I can access the dashboard.',
    type: 'Story',
    status: 'In Progress',
    priority: 'High',
    acceptanceCriteria: '1. User enters valid email and password\n2. System validates credentials\n3. User is redirected to dashboard\n4. Session token is created',
    labels: ['login', 'authentication'],
    sprint: 'Sprint 15',
  },
  {
    id: '2',
    key: 'VWOAPP-102',
    summary: 'Implement password reset functionality',
    description: 'As a user, I want to reset my password via email so that I can regain access if I forget it.',
    type: 'Story',
    status: 'To Do',
    priority: 'High',
    acceptanceCriteria: '1. User clicks "Forgot Password"\n2. System sends reset email\n3. User clicks link and enters new password\n4. Password is updated successfully',
    labels: ['password', 'security'],
    sprint: 'Sprint 15',
  },
  {
    id: '3',
    key: 'VWOAPP-103',
    summary: 'Add two-factor authentication support',
    description: 'As a security-conscious user, I want to enable 2FA on my account for additional security.',
    type: 'Story',
    status: 'To Do',
    priority: 'Medium',
    acceptanceCriteria: '1. User enables 2FA in settings\n2. QR code is generated for authenticator app\n3. User verifies with code\n4. 2FA is active on subsequent logins',
    labels: ['2fa', 'security'],
    sprint: 'Sprint 16',
  },
  {
    id: '4',
    key: 'VWOAPP-104',
    summary: 'Dashboard should display A/B test results',
    description: 'As a user, I want to see my A/B test results on the dashboard with conversion rates and statistical significance.',
    type: 'Story',
    status: 'In Progress',
    priority: 'High',
    acceptanceCriteria: '1. Dashboard loads test results\n2. Conversion rates are displayed\n3. Statistical significance is calculated\n4. Charts are rendered correctly',
    labels: ['dashboard', 'analytics'],
    sprint: 'Sprint 15',
  },
  {
    id: '5',
    key: 'VWOAPP-105',
    summary: 'API rate limiting returns incorrect error codes',
    description: 'When the API rate limit is exceeded, the system returns 500 instead of 429 Too Many Requests.',
    type: 'Bug',
    status: 'Open',
    priority: 'Critical',
    acceptanceCriteria: '1. Rate limit exceeded returns 429\n2. Response includes Retry-After header\n3. Error message is descriptive',
    labels: ['api', 'bug', 'rate-limiting'],
    sprint: 'Sprint 15',
  },
];

export default function FetchStep() {
  const { state, dispatch, showToast } = useApp();
  const [fetching, setFetching] = useState(false);

  const activeConnection = state.connections.find(c => c.id === state.activeConnectionId);

  const handleFetch = async () => {
    if (!state.fetchForm.projectKey) {
      showToast('Project Key is required', 'error');
      return;
    }
    setFetching(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 2000));
    dispatch({ type: 'SET_ISSUES', payload: MOCK_ISSUES });
    setFetching(false);
    showToast(`Fetched ${MOCK_ISSUES.length} issues successfully!`, 'success');
    // Auto-advance to review
    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  return (
    <div className="fetch-step animate-fade-in">
      <div className="card">
        <h2>Fetch Jira Requirements</h2>
        <p className="text-sm text-muted mb-xl">Enter project details to fetch user stories and requirements</p>

        {/* Connected indicator */}
        {activeConnection && (
          <div className="connected-banner">
            <div className="connected-info">
              <strong>Connected to:</strong>
              <span>{activeConnection.name} ({activeConnection.url})</span>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
            >
              Change
            </button>
          </div>
        )}

        {/* Fetch Form */}
        <div className="form-row mt-xl">
          <div className="form-group">
            <label htmlFor="product-name">Product Name</label>
            <input
              id="product-name"
              type="text"
              placeholder="e.g., App.vwo.com"
              value={state.fetchForm.productName}
              onChange={e => dispatch({
                type: 'SET_FETCH_FORM',
                payload: { productName: e.target.value },
              })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-key">
              Project Key <span className="required">*</span>
            </label>
            <input
              id="project-key"
              type="text"
              placeholder="e.g., VWOAPP"
              value={state.fetchForm.projectKey}
              onChange={e => dispatch({
                type: 'SET_FETCH_FORM',
                payload: { projectKey: e.target.value },
              })}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="sprint-version">Sprint/Fix Version (Optional)</label>
          <input
            id="sprint-version"
            type="text"
            placeholder="e.g., Sprint 15 or leave empty for all open issues"
            value={state.fetchForm.sprintVersion}
            onChange={e => dispatch({
              type: 'SET_FETCH_FORM',
              payload: { sprintVersion: e.target.value },
            })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="additional-context">Additional Context (Optional)</label>
          <textarea
            id="additional-context"
            placeholder="Any additional information about the product, testing goals, or constraints..."
            rows={4}
            value={state.fetchForm.additionalContext}
            onChange={e => dispatch({
              type: 'SET_FETCH_FORM',
              payload: { additionalContext: e.target.value },
            })}
          />
        </div>

        <button
          className="btn btn-primary btn-full btn-lg"
          onClick={handleFetch}
          disabled={fetching || !state.fetchForm.projectKey}
        >
          {fetching ? (
            <>
              <div className="spinner" /> Fetching Jira Issues...
            </>
          ) : (
            <>
              <Download size={18} /> Fetch Jira Issues
            </>
          )}
        </button>
      </div>
    </div>
  );
}
