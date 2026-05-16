import { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext(null);

const initialState = {
  // Current wizard step: 1=Setup, 2=Fetch, 3=Review, 4=TestPlan
  currentStep: 1,

  // Platform connections (Jira, ADO, etc.)
  connections: [],
  activeConnectionId: null,

  // LLM connections
  llmConnections: [],
  activeLlmConnectionId: null,

  // Fetch form data
  fetchForm: {
    productName: '',
    projectKey: '',
    sprintVersion: '',
    additionalContext: '',
  },

  // Fetched issues
  issues: [],
  selectedIssueIds: [],

  // Review additional context
  reviewContext: '',

  // Generated test plan
  testPlan: null,

  // History of generated plans
  history: [],

  // UI state
  loading: false,
  error: null,
  toast: null,
  theme: 'light', // 'light' or 'dark'

  // Settings panel
  showSettings: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };

    case 'ADD_CONNECTION': {
      const newConn = {
        id: uuidv4(),
        type: action.payload.type || 'jira',
        name: action.payload.name,
        url: action.payload.url,
        email: action.payload.email,
        apiToken: action.payload.apiToken,
        status: 'connected',
        createdAt: new Date().toISOString(),
        lastTestedAt: null,
      };
      return {
        ...state,
        connections: [...state.connections, newConn],
        activeConnectionId: newConn.id,
      };
    }

    case 'REMOVE_CONNECTION':
      return {
        ...state,
        connections: state.connections.filter(c => c.id !== action.payload),
        activeConnectionId:
          state.activeConnectionId === action.payload ? null : state.activeConnectionId,
      };

    case 'SET_ACTIVE_CONNECTION':
      return { ...state, activeConnectionId: action.payload };

    case 'UPDATE_CONNECTION_STATUS': {
      return {
        ...state,
        connections: state.connections.map(c =>
          c.id === action.payload.id
            ? { ...c, status: action.payload.status, lastTestedAt: new Date().toISOString() }
            : c
        ),
      };
    }

    case 'ADD_LLM_CONNECTION': {
      const newLlm = {
        id: uuidv4(),
        provider: action.payload.provider,
        name: action.payload.name,
        apiUrl: action.payload.apiUrl,
        apiKey: action.payload.apiKey,
        model: action.payload.model,
        status: 'disconnected',
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        llmConnections: [...state.llmConnections, newLlm],
        activeLlmConnectionId: newLlm.id,
      };
    }

    case 'REMOVE_LLM_CONNECTION':
      return {
        ...state,
        llmConnections: state.llmConnections.filter(c => c.id !== action.payload),
        activeLlmConnectionId:
          state.activeLlmConnectionId === action.payload ? null : state.activeLlmConnectionId,
      };

    case 'SET_ACTIVE_LLM':
      return { ...state, activeLlmConnectionId: action.payload };

    case 'UPDATE_LLM_STATUS':
      return {
        ...state,
        llmConnections: state.llmConnections.map(c =>
          c.id === action.payload.id ? { ...c, status: action.payload.status } : c
        ),
      };

    case 'SET_FETCH_FORM':
      return { ...state, fetchForm: { ...state.fetchForm, ...action.payload } };

    case 'SET_ISSUES':
      return {
        ...state,
        issues: action.payload,
        selectedIssueIds: action.payload.map(i => i.id),
      };

    case 'TOGGLE_ISSUE': {
      const id = action.payload;
      const selected = state.selectedIssueIds.includes(id)
        ? state.selectedIssueIds.filter(i => i !== id)
        : [...state.selectedIssueIds, id];
      return { ...state, selectedIssueIds: selected };
    }

    case 'SELECT_ALL_ISSUES':
      return { ...state, selectedIssueIds: state.issues.map(i => i.id) };

    case 'DESELECT_ALL_ISSUES':
      return { ...state, selectedIssueIds: [] };

    case 'SET_REVIEW_CONTEXT':
      return { ...state, reviewContext: action.payload };

    case 'SET_TEST_PLAN':
      return { ...state, testPlan: action.payload };

    case 'ADD_TO_HISTORY':
      return { ...state, history: [action.payload, ...state.history] };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_TOAST':
      return { ...state, toast: action.payload };

    case 'CLEAR_TOAST':
      return { ...state, toast: null };

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };

    case 'TOGGLE_SETTINGS':
      return { ...state, showSettings: !state.showSettings };

    case 'RESET_WIZARD':
      return {
        ...state,
        currentStep: 1,
        fetchForm: initialState.fetchForm,
        issues: [],
        selectedIssueIds: [],
        reviewContext: '',
        testPlan: null,
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const showToast = useCallback((message, type = 'info') => {
    dispatch({ type: 'SET_TOAST', payload: { message, type } });
    setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 4000);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, showToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
