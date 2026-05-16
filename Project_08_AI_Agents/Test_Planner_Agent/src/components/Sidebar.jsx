import './Sidebar.css';
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  Brain,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const agentItems = [
  { id: 'test-planner', label: 'Intelligent Test Planning Agent', icon: Brain },
];

export default function Sidebar({ currentView, onViewChange, onSettingsClick }) {
  const [planningOpen, setPlanningOpen] = useState(true);
  const { state, dispatch } = useApp();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">360</div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">STLC360 AI</span>
          <span className="sidebar-brand-sub">Enterprise Testing</span>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => {
                if (item.id === 'dashboard') {
                  onViewChange('dashboard');
                } else if (item.id === 'settings' && onSettingsClick) {
                  onSettingsClick();
                }
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Planning & Strategy Section */}
        <div className="sidebar-section-label sidebar-section-collapsible" onClick={() => setPlanningOpen(!planningOpen)}>
          <span>🧪 Planning & Strategy</span>
          {planningOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
        {planningOpen &&
          agentItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => onViewChange(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
      </nav>

      {/* Theme Toggle */}
      <div className="sidebar-footer">
        <button 
          className="sidebar-item" 
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
        >
          {state.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span>{state.theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>
    </aside>
  );
}
