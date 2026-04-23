export const COLUMNS = [
  { id: 'researching', label: 'Researching', icon: '🔍', color: '#64748B', bg: 'from-slate-500/20 to-slate-600/10', badge: 'bg-slate-500/20 text-slate-300' },
  { id: 'applied',     label: 'Applied',     icon: '📨', color: '#3B82F6', bg: 'from-blue-500/20 to-blue-600/10', badge: 'bg-blue-500/20 text-blue-300' },
  { id: 'followup',    label: 'Follow-Up',   icon: '🔁', color: '#F59E0B', bg: 'from-amber-500/20 to-amber-600/10', badge: 'bg-amber-500/20 text-amber-300' },
  { id: 'interview',   label: 'Interview',   icon: '✅', color: '#22C55E', bg: 'from-green-500/20 to-green-600/10', badge: 'bg-green-500/20 text-green-300' },
  { id: 'offer',       label: 'Offer',       icon: '🎉', color: '#10B981', bg: 'from-emerald-500/20 to-emerald-600/10', badge: 'bg-emerald-500/20 text-emerald-300' },
  { id: 'rejected',    label: 'Rejected',    icon: '❌', color: '#EF4444', bg: 'from-red-500/20 to-red-600/10', badge: 'bg-red-500/20 text-red-300' },
];

export const COLUMN_MAP = Object.fromEntries(COLUMNS.map(c => [c.id, c]));

export const RESUME_COLORS = [
  { id: 'indigo', label: 'Indigo', class: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  { id: 'violet', label: 'Violet', class: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  { id: 'cyan',   label: 'Cyan',   class: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { id: 'rose',   label: 'Rose',   class: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  { id: 'teal',   label: 'Teal',   class: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
  { id: 'orange', label: 'Orange', class: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
];
