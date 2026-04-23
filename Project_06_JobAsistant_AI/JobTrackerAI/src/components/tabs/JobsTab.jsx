import { useState, useMemo } from 'react';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Plus, Search, Download, TrendingUp, BriefcaseBusiness, Trophy, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { COLUMNS } from '../../lib/constants';
import { KanbanColumn } from '../kanban/KanbanColumn';
import { JobCard } from '../kanban/JobCard';
import { AddJobModal } from '../modals/AddJobModal';
import { motion } from 'framer-motion';

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-border rounded-xl px-4 py-3 flex items-center gap-3"
    >
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={16} className="text-white" />
      </div>
      <div>
        <div className="text-xl font-bold font-heading text-text">{value}</div>
        <div className="text-xs text-text-muted">{label}</div>
      </div>
    </motion.div>
  );
}

export function JobsTab() {
  const { jobs, updateJob } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? jobs.filter(j => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)) : jobs;
  }, [jobs, search]);

  const columnedJobs = useMemo(() => {
    const map = {};
    COLUMNS.forEach(c => { map[c.id] = []; });
    filtered.forEach(j => {
      if (map[j.status]) map[j.status].push(j);
      else map['researching'].push(j);
    });
    return map;
  }, [filtered]);

  const applied = jobs.filter(j => j.status !== 'researching').length;
  const interviews = jobs.filter(j => j.status === 'interview').length;
  const offers = jobs.filter(j => j.status === 'offer').length;
  const rejected = jobs.filter(j => j.status === 'rejected').length;
  const rejectionRate = applied > 0 ? Math.round((rejected / applied) * 100) : 0;

  const activeJob = jobs.find(j => j.id === activeId);

  function handleDragStart({ active }) {
    setActiveId(active.id);
  }

  async function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (!over) return;
    const job = jobs.find(j => j.id === active.id);
    if (!job) return;

    // Dropped onto a column
    const targetColumnId = COLUMNS.find(c => c.id === over.id)?.id;
    if (targetColumnId && job.status !== targetColumnId) {
      await updateJob({ ...job, status: targetColumnId });
      return;
    }

    // Dropped onto a card → find which column it belongs to
    const overJob = jobs.find(j => j.id === over.id);
    if (overJob && overJob.status !== job.status) {
      await updateJob({ ...job, status: overJob.status });
    }
  }

  const exportCSV = () => {
    const headers = ['Title', 'Company', 'Status', 'URL', 'Notes', 'Date Added'];
    const rows = jobs.map(j => [
      `"${j.title}"`, `"${j.company}"`, j.status, `"${j.url || ''}"`, `"${(j.notes || '').replace(/"/g, '""')}"`, j.createdAt
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job-applications.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-text">My Jobs</h1>
            <p className="text-text-muted text-sm mt-0.5">{jobs.length} total applications tracked</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="btn btn-secondary gap-2 text-sm">
              <Download size={15} /> Export CSV
            </button>
            <button onClick={() => setAddOpen(true)} className="btn btn-primary gap-2 text-sm" id="add-job-btn">
              <Plus size={15} /> Add Job
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Total Applied" value={applied} icon={BriefcaseBusiness} color="bg-blue-500" />
          <StatCard label="Interviews" value={interviews} icon={TrendingUp} color="bg-green-500" />
          <StatCard label="Offers" value={offers} icon={Trophy} color="bg-emerald-500" />
          <StatCard label="Rejection Rate" value={`${rejectionRate}%`} icon={XCircle} color="bg-red-500" />
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            className="input-field pl-9 text-sm"
            placeholder="Search by title or company…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full min-w-max">
            {COLUMNS.map(col => (
              <KanbanColumn key={col.id} column={col} jobs={columnedJobs[col.id] || []} />
            ))}
          </div>
          <DragOverlay>
            {activeJob ? (
              <div className="opacity-90 rotate-2 scale-105 shadow-2xl">
                <JobCard job={activeJob} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <AddJobModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
