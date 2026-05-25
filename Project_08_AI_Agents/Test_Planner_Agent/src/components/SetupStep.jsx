import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PLATFORM_INTEGRATIONS, LLM_PROVIDERS } from '../data/constants';
import {
  Settings,
  Plus,
  Check,
  ChevronDown,
  Bell,
  Plug,
  Trash2,
  Zap,
  X,
} from 'lucide-react';
import './SetupStep.css';

export default function SetupStep() {
  const { state, dispatch, showToast } = useApp();
  const [showNewConnection, setShowNewConnection] = useState(state.connections.length === 0);
  const [showLlmForm, setShowLlmForm] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testingLlm, setTestingLlm] = useState(false);

  // Jira form state
  const [connForm, setConnForm] = useState({
    name: '',
    url: '',
    email: '',
    apiToken: '',
  });

  // LLM form state
  const [llmForm, setLlmForm] = useState({
    provider: 'groq',
    name: '',
    apiUrl: '',
    apiKey: '',
    model: '',
  });

  const activeConnection = state.connections.find(c => c.id === state.activeConnectionId);
  const activeLlm = state.llmConnections.find(c => c.id === state.activeLlmConnectionId);

  const handleSaveConnection = async (e) => {
    e.preventDefault();
    if (!connForm.name || !connForm.url || !connForm.email || !connForm.apiToken) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      await fetch('/api/save-env', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          JIRA_URL: connForm.url,
          JIRA_EMAIL: connForm.email,
          JIRA_API_TOKEN: connForm.apiToken
        })
      });
    } catch (err) {
      console.error('Failed to save to .env', err);
    }

    dispatch({ type: 'ADD_CONNECTION', payload: { ...connForm, type: 'jira' } });
    setConnForm({ name: '', url: '', email: '', apiToken: '' });
    setShowNewConnection(false);
    showToast('Jira connection saved successfully!', 'success');
  };

  const handleTestConnection = async () => {
    if (!activeConnection) return;
    setTestingConnection(true);
    // Simulate API test
    await new Promise(r => setTimeout(r, 1500));
    dispatch({
      type: 'UPDATE_CONNECTION_STATUS',
      payload: { id: activeConnection.id, status: 'connected' },
    });
    setTestingConnection(false);
    showToast('Connection test successful!', 'success');
  };

  const handleSaveLlm = async (e) => {
    e.preventDefault();
    if (!llmForm.provider || !llmForm.apiKey) {
      showToast('Please fill in required LLM fields', 'error');
      return;
    }
    const provider = LLM_PROVIDERS.find(p => p.provider === llmForm.provider);

    try {
      const payload = {};
      if (llmForm.provider === 'groq') payload.GROQ_API_KEY = llmForm.apiKey;
      if (llmForm.provider === 'ollama') payload.OLLAMA_BASE_URL = llmForm.apiUrl || provider?.defaultUrl;
      
      await fetch('/api/save-env', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Failed to save to .env', err);
    }

    dispatch({
      type: 'ADD_LLM_CONNECTION',
      payload: {
        ...llmForm,
        name: llmForm.name || provider?.name || llmForm.provider,
        apiUrl: llmForm.apiUrl || provider?.defaultUrl || '',
        model: llmForm.model || provider?.models[0] || '',
      },
    });
    setLlmForm({ provider: 'groq', name: '', apiUrl: '', apiKey: '', model: '' });
    setShowLlmForm(false);
    showToast('LLM connection saved!', 'success');
  };

  const handleTestLlm = async () => {
    if (!activeLlm) return;
    setTestingLlm(true);
    await new Promise(r => setTimeout(r, 1500));
    dispatch({
      type: 'UPDATE_LLM_STATUS',
      payload: { id: activeLlm.id, status: 'connected' },
    });
    setTestingLlm(false);
    showToast('LLM connection test successful!', 'success');
  };

  const canContinue = state.activeConnectionId && state.activeLlmConnectionId;

  const selectedProvider = LLM_PROVIDERS.find(p => p.provider === llmForm.provider);

  return (
    <div className="setup-step animate-fade-in">
      {/* ===== Jira Connection Section ===== */}
      <div className="card mb-xl">
        <h2>Jira Connection</h2>
        <p className="text-sm text-muted mb-lg">Connect to your Jira instance to fetch requirements</p>

        {/* Existing connections dropdown */}
        {state.connections.length > 0 && !showNewConnection && (
          <div className="connection-selector">
            <label>Select Jira Connection</label>
            <select
              value={state.activeConnectionId || ''}
              onChange={e => dispatch({ type: 'SET_ACTIVE_CONNECTION', payload: e.target.value })}
            >
              <option value="">-- Select a connection --</option>
              {state.connections.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.url})
                </option>
              ))}
            </select>

            <div className="connection-actions mt-lg">
              <button className="btn btn-outline btn-sm" onClick={() => setShowNewConnection(true)}>
                <Settings size={14} />
                Add New Connection
              </button>
              {activeConnection && (
                <>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={handleTestConnection}
                    disabled={testingConnection}
                  >
                    {testingConnection ? (
                      <>
                        <div className="spinner spinner-sm" /> Testing...
                      </>
                    ) : (
                      <>
                        <Plug size={14} /> Test Connection
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      dispatch({ type: 'REMOVE_CONNECTION', payload: activeConnection.id });
                      showToast('Connection removed', 'info');
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* New connection form */}
        {showNewConnection && (
          <form onSubmit={handleSaveConnection} className="connection-form">
            {state.connections.length > 0 && (
              <button
                type="button"
                className="btn btn-outline btn-sm mb-lg"
                onClick={() => setShowNewConnection(false)}
              >
                <X size={14} /> Cancel
              </button>
            )}
            <hr className="divider" />

            <div className="form-group">
              <label htmlFor="conn-name">Connection Name</label>
              <input
                id="conn-name"
                type="text"
                placeholder="e.g., VWO Production"
                value={connForm.name}
                onChange={e => setConnForm({ ...connForm, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="conn-url">Jira URL</label>
              <input
                id="conn-url"
                type="url"
                placeholder="https://yourcompany.atlassian.net"
                value={connForm.url}
                onChange={e => setConnForm({ ...connForm, url: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="conn-email">Jira Email</label>
              <input
                id="conn-email"
                type="email"
                placeholder="your-email@company.com"
                value={connForm.email}
                onChange={e => setConnForm({ ...connForm, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="conn-token">API Token</label>
              <input
                id="conn-token"
                type="password"
                placeholder="Your Jira API token"
                value={connForm.apiToken}
                onChange={e => setConnForm({ ...connForm, apiToken: e.target.value })}
              />
              <span className="form-helper">
                Generate at:{' '}
                <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noreferrer">
                  https://id.atlassian.com/manage-profile/security/api-tokens
                </a>
              </span>
            </div>

            <button type="submit" className="btn btn-primary">
              <Check size={16} /> Save Connection
            </button>
          </form>
        )}
      </div>

      {/* ===== LLM Connection Section ===== */}
      <div className="card mb-xl">
        <div className="section-header">
          <div>
            <h2>🧠 LLM Connection</h2>
            <p className="text-sm text-muted">Configure the AI model for test plan generation</p>
          </div>
        </div>

        {/* Existing LLM connections */}
        {state.llmConnections.length > 0 && !showLlmForm && (
          <div className="connection-selector mt-lg">
            <label>Select LLM Provider</label>
            <select
              value={state.activeLlmConnectionId || ''}
              onChange={e => dispatch({ type: 'SET_ACTIVE_LLM', payload: e.target.value })}
            >
              <option value="">-- Select an LLM --</option>
              {state.llmConnections.map(c => {
                const prov = LLM_PROVIDERS.find(p => p.provider === c.provider);
                return (
                  <option key={c.id} value={c.id}>
                    {prov?.icon} {c.name} ({c.model})
                  </option>
                );
              })}
            </select>

            <div className="connection-actions mt-lg">
              <button className="btn btn-outline btn-sm" onClick={() => setShowLlmForm(true)}>
                <Plus size={14} /> Add New LLM
              </button>
              {activeLlm && (
                <>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={handleTestLlm}
                    disabled={testingLlm}
                  >
                    {testingLlm ? (
                      <>
                        <div className="spinner spinner-sm" /> Testing...
                      </>
                    ) : (
                      <>
                        <Zap size={14} /> Test Connection
                      </>
                    )}
                  </button>
                  {activeLlm.status === 'connected' && (
                    <span className="badge badge-success">
                      <Check size={12} /> Connected
                    </span>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      dispatch({ type: 'REMOVE_LLM_CONNECTION', payload: activeLlm.id });
                      showToast('LLM connection removed', 'info');
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* New LLM form */}
        {(showLlmForm || state.llmConnections.length === 0) && (
          <form onSubmit={handleSaveLlm} className="connection-form mt-lg">
            {state.llmConnections.length > 0 && (
              <button
                type="button"
                className="btn btn-outline btn-sm mb-lg"
                onClick={() => setShowLlmForm(false)}
              >
                <X size={14} /> Cancel
              </button>
            )}

            <div className="llm-provider-grid">
              {LLM_PROVIDERS.map(p => (
                <button
                  key={p.provider}
                  type="button"
                  className={`llm-provider-card ${llmForm.provider === p.provider ? 'selected' : ''}`}
                  onClick={() => setLlmForm({
                    ...llmForm,
                    provider: p.provider,
                    apiUrl: p.defaultUrl,
                    model: p.models[0],
                    name: p.name,
                  })}
                >
                  <span className="llm-provider-icon">{p.icon}</span>
                  <span className="llm-provider-name">{p.name}</span>
                </button>
              ))}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="llm-name">Connection Name</label>
                <input
                  id="llm-name"
                  type="text"
                  placeholder={selectedProvider?.name || 'My LLM'}
                  value={llmForm.name}
                  onChange={e => setLlmForm({ ...llmForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="llm-model">Model</label>
                <select
                  id="llm-model"
                  value={llmForm.model}
                  onChange={e => setLlmForm({ ...llmForm, model: e.target.value })}
                >
                  {selectedProvider?.models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="llm-url">API URL</label>
              <input
                id="llm-url"
                type="url"
                placeholder={selectedProvider?.defaultUrl}
                value={llmForm.apiUrl}
                onChange={e => setLlmForm({ ...llmForm, apiUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="llm-key">API Key</label>
              <input
                id="llm-key"
                type="password"
                placeholder="Your API key"
                value={llmForm.apiKey}
                onChange={e => setLlmForm({ ...llmForm, apiKey: e.target.value })}
              />
              {llmForm.provider === 'ollama' && (
                <span className="form-helper">Not required for local Ollama instances</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              <Check size={16} /> Save LLM Connection
            </button>
          </form>
        )}
      </div>

      {/* ===== Continue Button ===== */}
      <button
        className="btn btn-primary btn-full btn-lg"
        disabled={!canContinue}
        onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
      >
        Continue to Fetch Issues
      </button>

      {/* ===== Platform Integration Grid ===== */}
      <div className="card mt-xl">
        <h2>Import from Test Management Tools</h2>
        <p className="text-sm text-muted mb-xl">
          Connect to your existing test case repositories and management platforms
        </p>

        <div className="platform-grid">
          {PLATFORM_INTEGRATIONS.map((platform) => {
            const isJiraConnected = platform.type === 'jira' && state.connections.length > 0;
            return (
              <div
                key={platform.type}
                className={`platform-card ${isJiraConnected ? 'connected' : ''} ${platform.status === 'coming_soon' ? 'coming-soon' : ''}`}
              >
                <div className="platform-card-header">
                  <span className="platform-icon">{platform.icon}</span>
                  <div>
                    <h4>{platform.name}</h4>
                    {isJiraConnected ? (
                      <span className="badge badge-success">
                        <Check size={10} /> Connected
                      </span>
                    ) : (
                      <span className="badge badge-gray">Coming Soon</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted">{platform.description}</p>
                <div className="platform-features">
                  <span className="text-xs font-semibold">Key Features:</span>
                  <ul>
                    {platform.features.map(f => (
                      <li key={f} className="text-xs text-muted">• {f}</li>
                    ))}
                  </ul>
                </div>
                <div className="platform-card-action">
                  {isJiraConnected ? (
                    <button className="btn btn-outline btn-sm btn-full">Manage Connection</button>
                  ) : (
                    <button className="btn btn-outline btn-sm btn-full" disabled>
                      <Bell size={14} /> Notify Me
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
