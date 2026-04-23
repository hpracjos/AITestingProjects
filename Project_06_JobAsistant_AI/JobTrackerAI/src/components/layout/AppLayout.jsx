import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useApp } from '../../context/AppContext';
import { JobsTab } from '../tabs/JobsTab';
import { AboutTab } from '../tabs/AboutTab';
import { ExperienceTab } from '../tabs/ExperienceTab';
import { ResumesTab } from '../tabs/ResumesTab';
import { DocumentsTab } from '../tabs/DocumentsTab';

const TAB_COMPONENTS = {
  jobs:       JobsTab,
  about:      AboutTab,
  experience: ExperienceTab,
  resumes:    ResumesTab,
  documents:  DocumentsTab,
};

export function AppLayout() {
  const { activeTab, loading } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const ActiveTab = TAB_COMPONENTS[activeTab] || JobsTab;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar collapsed={collapsed} />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <div className="flex items-center h-12 px-4 border-b border-border bg-surface shrink-0">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="btn btn-ghost p-1.5 rounded-lg"
            title="Toggle sidebar"
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <ActiveTab />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
