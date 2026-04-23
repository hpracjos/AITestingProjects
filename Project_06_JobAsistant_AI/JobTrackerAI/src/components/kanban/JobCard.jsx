import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ExternalLink, MoreVertical, Pencil, Trash2, GripVertical, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { COLUMN_MAP } from '../../lib/constants';
import { format } from 'date-fns';
import { AddJobModal } from '../modals/AddJobModal';

export function JobCard({ job }) {
  const { deleteJob, resumes } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const col = COLUMN_MAP[job.status] || COLUMN_MAP['researching'];
  const resume = resumes.find(r => String(r.id) === String(job.resumeId));

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: isDragging ? 0.4 : 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`relative bg-surface rounded-xl border border-border p-4 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200 group cursor-grab active:cursor-grabbing ${isDragging ? 'shadow-2xl ring-2 ring-accent/50 z-50' : ''}`}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-40 transition-opacity cursor-grab active:cursor-grabbing text-text-muted"
        >
          <GripVertical size={14} />
        </div>

        {/* Menu */}
        <div className="absolute top-3 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn btn-ghost rounded-full p-1"
            >
              <MoreVertical size={14} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  className="absolute right-0 top-8 z-20 bg-surface border border-border rounded-xl shadow-xl py-1 min-w-[130px]"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <button
                    onClick={() => { setEditOpen(true); setMenuOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 w-full text-left text-text"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => { deleteJob(job.id); setMenuOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-500/10 w-full text-left text-red-400"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Status badge */}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mb-3 ${col.badge}`}>
          {col.icon} {col.label}
        </span>

        {/* Title + Company */}
        <h3 className="font-semibold text-text text-sm leading-tight mb-0.5 pr-8">{job.title}</h3>
        <p className="text-text-muted text-xs mb-3">{job.company}</p>

        {/* Resume tag */}
        {resume && (
          <div className="flex items-center gap-1 mb-2">
            <FileText size={11} className="text-text-muted" />
            <span className="text-xs text-text-muted">{resume.name}</span>
          </div>
        )}

        {/* Notes toggle */}
        {job.notes && (
          <button
            onClick={() => setNotesOpen(!notesOpen)}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors mb-2"
          >
            {notesOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {notesOpen ? 'Hide notes' : 'Show notes'}
          </button>
        )}
        <AnimatePresence>
          {notesOpen && job.notes && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-text-muted bg-background/50 rounded-lg p-2 mb-2 overflow-hidden"
            >
              {job.notes}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <span className="text-xs text-text-muted">
            {job.createdAt ? format(new Date(job.createdAt), 'MMM d, yyyy') : ''}
          </span>
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover transition-colors"
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </motion.div>

      <AddJobModal isOpen={editOpen} onClose={() => setEditOpen(false)} editJob={job} />
    </>
  );
}
