import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const INITIAL = { company: '', role: '', startDate: '', endDate: '', current: false, description: '', achievements: [] };

function ExpForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const [achInput, setAchInput] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addAchievement = () => {
    const t = achInput.trim();
    if (t) setForm(f => ({ ...f, achievements: [...(f.achievements || []), t] }));
    setAchInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-surface border border-border rounded-xl p-4 space-y-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-text-muted mb-1 block">Company *</label>
          <input className="input-field text-sm" placeholder="Google" value={form.company} onChange={e => set('company', e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-text-muted mb-1 block">Role *</label>
          <input className="input-field text-sm" placeholder="Senior Engineer" value={form.role} onChange={e => set('role', e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-text-muted mb-1 block">Start Date</label>
          <input type="month" className="input-field text-sm" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-text-muted mb-1 block">End Date</label>
          <input type="month" className="input-field text-sm" value={form.endDate} disabled={form.current} onChange={e => set('endDate', e.target.value)} />
          <label className="flex items-center gap-1 mt-1 text-xs text-text-muted cursor-pointer">
            <input type="checkbox" checked={form.current} onChange={e => set('current', e.target.checked)} /> Present
          </label>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-text-muted mb-1 block">Description</label>
        <textarea className="input-field text-sm resize-none" rows={3} placeholder="Role description..." value={form.description} onChange={e => set('description', e.target.value)} />
      </div>
      <div>
        <label className="text-xs font-medium text-text-muted mb-1 block">Key Achievements</label>
        <div className="space-y-1 mb-2">
          {(form.achievements || []).map((a, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="text-accent">•</span>
              <span className="flex-1 text-text">{a}</span>
              <button onClick={() => setForm(f => ({ ...f, achievements: f.achievements.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-300"><X size={12} /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="input-field text-sm flex-1" placeholder="Add achievement..." value={achInput}
            onChange={e => setAchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAchievement())} />
          <button onClick={addAchievement} className="btn btn-secondary text-sm px-3">Add</button>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="btn btn-secondary flex-1 text-sm">Cancel</button>
        <button onClick={() => (form.company.trim() && form.role.trim()) && onSave(form)} className="btn btn-primary flex-1 text-sm">Save</button>
      </div>
    </motion.div>
  );
}

export function ExperienceTab() {
  const { experiences, addExperience, updateExperience, deleteExperience } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const sorted = [...experiences].sort((a, b) => (b.startDate || '').localeCompare(a.startDate || ''));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text">Experience</h1>
          <p className="text-text-muted text-sm">{experiences.length} entries</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary gap-2 text-sm">
          <Plus size={15} /> Add Entry
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="mb-6">
            <ExpForm initial={INITIAL} onSave={async (f) => { await addExperience(f); setShowForm(false); }} onCancel={() => setShowForm(false)} />
          </div>
        )}
      </AnimatePresence>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-text-muted/50">
          <div className="text-4xl mb-3">💼</div>
          <p className="text-sm">No experience entries yet.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-6">
            <AnimatePresence>
              {sorted.map(exp => (
                <motion.div key={exp.id} layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  className="relative pl-12">
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 top-3 w-3 h-3 rounded-full bg-accent border-2 border-background" />
                  <div className="bg-surface border border-border rounded-xl p-4">
                    {editId === exp.id ? (
                      <ExpForm
                        initial={{ company: exp.company, role: exp.role, startDate: exp.startDate || '', endDate: exp.endDate || '', current: exp.current || false, description: exp.description || '', achievements: exp.achievements || [] }}
                        onSave={async (f) => { await updateExperience({ ...exp, ...f }); setEditId(null); }}
                        onCancel={() => setEditId(null)}
                      />
                    ) : (
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-text">{exp.role}</h3>
                            <p className="text-text-muted text-sm">{exp.company}</p>
                            <p className="text-xs text-text-muted/70 mt-0.5">
                              {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => setEditId(exp.id)} className="btn btn-ghost p-1.5 rounded-lg"><Pencil size={14} /></button>
                            <button onClick={() => deleteExperience(exp.id)} className="btn btn-ghost p-1.5 rounded-lg text-red-400"><Trash2 size={14} /></button>
                          </div>
                        </div>
                        {exp.description && <p className="text-sm text-text-muted mt-2">{exp.description}</p>}
                        {exp.achievements?.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {exp.achievements.map((a, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                                <span className="text-accent mt-0.5">•</span> {a}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
