import { motion } from 'framer-motion';
import { User, Briefcase, FileText, FolderOpen, LayoutDashboard, Sun, Moon, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV = [
  { id: 'about',       label: 'About Me',   Icon: User },
  { id: 'experience',  label: 'Experience', Icon: Briefcase },
  { id: 'resumes',     label: 'Resumes',    Icon: FileText },
  { id: 'documents',   label: 'Documents',  Icon: FolderOpen },
  { id: 'jobs',        label: 'My Jobs',    Icon: LayoutDashboard },
];

export function Sidebar({ collapsed }) {
  const { activeTab, setActiveTab, theme, toggleTheme } = useApp();

  return (
    <aside className={`flex flex-col bg-surface border-r border-border h-full transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'} shrink-0`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-bold">H</span>
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <p className="font-heading font-semibold text-text leading-tight text-sm">HireTrack</p>
            <p className="text-xs text-text-muted leading-tight">AI</p>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {NAV.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              title={collapsed ? label : undefined}
              className={`relative flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                ${active
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/5'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-accent"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={17} className="shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  {label}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme toggle */}
      <div className={`p-3 border-t border-border ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 ${collapsed ? 'justify-center w-full' : 'w-full'}`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {!collapsed && <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>}
        </button>
      </div>
    </aside>
  );
}
