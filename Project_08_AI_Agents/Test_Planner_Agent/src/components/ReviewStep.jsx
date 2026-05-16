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

    // Simulate LLM-powered test plan generation
    await new Promise(r => setTimeout(r, 3000));

    const selectedIssues = state.issues.filter(i => state.selectedIssueIds.includes(i.id));
    const issuesSummary = selectedIssues.map(i => `${i.key}: ${i.summary}`).join(', ');

    const plan = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      title: `Test Plan — ${state.fetchForm.productName || state.fetchForm.projectKey}`,
      generatedAt: new Date().toISOString(),
      issueCount: selectedIssues.length,
      sections: {
        objective: `The objective of this test plan is to ensure the quality, functionality, and reliability of the ${state.fetchForm.productName || state.fetchForm.projectKey} application. This plan covers ${selectedIssues.length} user stories/issues: ${issuesSummary}. The testing effort aims to validate all functional requirements, identify defects early, and ensure a seamless user experience across all supported environments.`,

        scope: `Scope of Testing:\n\n1. Functional Testing — Verify all features described in the ${selectedIssues.length} stories work as specified\n2. Data Validation Testing — Ensure proper input validation and boundary handling\n3. Error Handling Testing — Verify appropriate error messages and graceful failure\n4. Performance Testing — Assess response times under normal and peak loads\n5. Security Testing — Validate authentication, authorization, and data protection\n6. Integration Testing — Verify interactions between components\n7. Regression Testing — Ensure existing functionality remains intact\n8. Usability Testing — Evaluate user experience and accessibility\n9. Compatibility Testing — Test across browsers, devices, and OS versions\n10. API Testing — Validate all API endpoints and data contracts`,

        inclusions: selectedIssues.map(issue =>
          `**${issue.key} — ${issue.summary}**\nType: ${issue.type} | Priority: ${issue.priority} | Status: ${issue.status}\nAcceptance Criteria:\n${issue.acceptanceCriteria}\nTest Focus: Verify all acceptance criteria, boundary conditions, error handling, and edge cases.`
        ).join('\n\n'),

        testEnvironments: `Test Environments:\n\n| Environment | URL |\n|---|---|\n| QA | https://${state.fetchForm.projectKey?.toLowerCase() || 'app'}-qa.example.com |\n| Pre-Production | https://${state.fetchForm.projectKey?.toLowerCase() || 'app'}-preprod.example.com |\n\nBrowser Matrix:\n• Windows 10/11 — Chrome (latest), Firefox (latest), Edge (latest)\n• macOS — Safari (latest), Chrome (latest)\n• Android — Chrome Mobile\n• iOS — Safari Mobile\n\nDevices: Desktop, Tablet (iPad), Mobile (iPhone 14, Samsung Galaxy S24)`,

        defectReporting: `Defect Reporting Procedure:\n\n1. **Identification**: Any deviation from requirements, acceptance criteria, or expected behavior\n2. **Logging**: All defects logged in JIRA with:\n   - Summary, Description, Steps to Reproduce\n   - Expected vs Actual Results\n   - Screenshots/Videos attached\n   - Environment details\n3. **Severity Levels**: Critical, High, Medium, Low\n4. **Triage**: Daily defect triage with dev team\n5. **Tracking**: Defect metrics tracked weekly`,

        testStrategy: `Test Strategy:\n\n**Phase 1 — Smoke Testing**\nVerify critical paths and core functionality\n\n**Phase 2 — Functional Testing**\nExecute test cases using design techniques:\n• Equivalence Class Partitioning\n• Boundary Value Analysis\n• Decision Table Testing\n• State Transition Testing\n• Use Case Testing\n\n**Phase 3 — Regression Testing**\nFull regression suite execution after bug fixes\n\n**Phase 4 — Exploratory Testing**\nSession-based exploratory testing for edge cases\n\n**Phase 5 — Performance & Security**\nLoad testing, security scanning, and API performance validation`,

        testSchedule: `Test Schedule:\n\n| Task | Duration | Sprint |\n|---|---|---|\n| Test Plan Review & Approval | 1 day | ${state.fetchForm.sprintVersion || 'Current Sprint'} |\n| Test Case Design | 2-3 days | ${state.fetchForm.sprintVersion || 'Current Sprint'} |\n| Test Case Review | 1 day | ${state.fetchForm.sprintVersion || 'Current Sprint'} |\n| Test Execution — Cycle 1 | 3-4 days | ${state.fetchForm.sprintVersion || 'Current Sprint'} |\n| Defect Retesting | 1-2 days | ${state.fetchForm.sprintVersion || 'Current Sprint'} |\n| Regression Testing | 2 days | ${state.fetchForm.sprintVersion || 'Next Sprint'} |\n| Test Summary Report | 1 day | ${state.fetchForm.sprintVersion || 'Next Sprint'} |`,

        testDeliverables: `Test Deliverables:\n\n1. Test Plan Document (this document)\n2. Test Scenarios & Test Cases\n3. Test Execution Reports\n4. Defect Reports\n5. Test Summary Report\n6. Traceability Matrix\n7. Automation Scripts (if applicable)`,

        entryExitCriteria: `**Entry Criteria:**\n• Requirements/user stories are reviewed and approved\n• Test environment is set up and accessible\n• Test data is prepared\n• Test cases are reviewed and signed off\n\n**Exit Criteria:**\n• All planned test cases executed\n• No open Critical or High severity defects\n• Test coverage ≥ 95%\n• Test Summary Report is approved\n• All defects are logged and tracked`,

        tools: `Tools:\n\n| Tool | Purpose |\n|---|---|\n| JIRA | Defect Tracking & Test Management |\n| ${state.fetchForm.projectKey || 'App'} Test Suite | Test Case Management |\n| Postman / Newman | API Testing |\n| JMeter / k6 | Performance Testing |\n| OWASP ZAP | Security Testing |\n| Browser DevTools | Debugging |\n| Screenshot Tools | Evidence Capture |`,

        risksAndMitigations: `Risks and Mitigations:\n\n| Risk | Impact | Mitigation |\n|---|---|---|\n| Resource unavailability | High | Backup resource planning, cross-training |\n| Environment instability | High | Dedicated QA environment, environment monitoring |\n| Incomplete requirements | Medium | Regular grooming sessions, clarification meetings |\n| Tight timelines | High | Risk-based testing, prioritized test execution |\n| Third-party dependencies | Medium | Mock services, early integration testing |\n| Data privacy concerns | High | Use anonymized test data, follow compliance guidelines |`,

        approvals: `Approvals Required:\n\n| Document | Approver | Status |\n|---|---|---|\n| Test Plan | QA Lead / Product Owner | Pending |\n| Test Scenarios | QA Lead | Pending |\n| Test Cases | QA Lead / BA | Pending |\n| Test Summary Report | QA Lead / PM | Pending |\n\nTesting will only proceed to subsequent phases once approvals are obtained.`,
      },
    };

    dispatch({ type: 'SET_TEST_PLAN', payload: plan });
    dispatch({ type: 'ADD_TO_HISTORY', payload: plan });
    setGenerating(false);
    showToast('Test plan generated successfully!', 'success');
    dispatch({ type: 'SET_STEP', payload: 4 });
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
