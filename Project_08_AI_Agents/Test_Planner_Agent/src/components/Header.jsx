import './Header.css';
import { History, Target } from 'lucide-react';

export default function Header({ onViewHistory }) {
  return (
    <header className="app-header">
      <div className="app-header-left">
        <div className="app-header-icon">
          <Target size={24} />
        </div>
        <div className="app-header-text">
          <h1>Intelligent Test Planning Agent</h1>
          <p>Generate comprehensive test plans from Jira requirements using AI</p>
        </div>
      </div>
      <button className="btn btn-outline" onClick={onViewHistory}>
        <History size={16} />
        View History
      </button>
    </header>
  );
}
