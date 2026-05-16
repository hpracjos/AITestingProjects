import { useApp } from '../context/AppContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

export default function Toast() {
  const { state, dispatch } = useApp();

  if (!state.toast) return null;

  const Icon = icons[state.toast.type] || Info;

  return (
    <div className={`toast toast-${state.toast.type}`}>
      <Icon size={18} />
      <span style={{ fontSize: '0.875rem', flex: 1 }}>{state.toast.message}</span>
      <button
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--gray-400)',
          padding: '2px',
          display: 'flex',
        }}
        onClick={() => dispatch({ type: 'CLEAR_TOAST' })}
      >
        <X size={16} />
      </button>
    </div>
  );
}
