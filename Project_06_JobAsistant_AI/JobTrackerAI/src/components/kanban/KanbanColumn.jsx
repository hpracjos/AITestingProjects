import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import { JobCard } from './JobCard';

export function KanbanColumn({ column, jobs }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col min-w-[280px] max-w-[300px] w-[280px]">
      {/* Column Header */}
      <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl mb-3 bg-gradient-to-r ${column.bg}`}>
        <div className="flex items-center gap-2">
          <span className="text-base">{column.icon}</span>
          <span className="font-semibold text-sm text-text">{column.label}</span>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-text-muted min-w-[24px] text-center">
          {jobs.length}
        </span>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[200px] rounded-xl transition-all duration-200 ${
          isOver
            ? 'bg-accent/10 ring-2 ring-accent/40 ring-dashed'
            : 'bg-background/30'
        } p-2 space-y-2`}
      >
        <SortableContext items={jobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </AnimatePresence>
        </SortableContext>

        {jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 text-center text-text-muted/50 select-none">
            <span className="text-2xl mb-1 opacity-40">
              {column.id === 'researching' ? '🔎' :
               column.id === 'applied' ? '📬' :
               column.id === 'followup' ? '📞' :
               column.id === 'interview' ? '🎙️' :
               column.id === 'offer' ? '🏆' : '📭'}
            </span>
            <span className="text-xs">No jobs yet</span>
          </div>
        )}
      </div>
    </div>
  );
}
