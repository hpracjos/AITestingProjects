import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RESUME_COLORS } from '../../lib/constants';
import { format } from 'date-fns';

const INITIAL = { name: '', fileNote: '', tags: [], color: 'indigo' };

function ResumeForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput('');
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
          <label className="text-xs font-medium text-text-muted mb-1 block">Resume Name *</label>
          <input className="input-field text-sm" placeholder="SWE Resume v3" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs font-medium text-text-muted mb-1 block">File / URL</label>
          <input className="input-field text-sm" placeholder="resume_v3.pdf or URL" value={form.fileNote}
            onChange={e => setForm(f => ({ ...f, fileNote: e.target.value }))} />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-text-muted mb-1 block">Colour Label</label>
        <div className="flex gap-2">
          {RESUME_COLORS.map(c => (
            <button key={c.id} onClick={() => setForm(f => ({ ...f, color: c.id }))}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${c.class} ${form.color === c.id ? 'ring-2 ring-accent' : ''}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-text-muted mb-1 block">Tags</label>
        <div className="flex flex-wrap gap-1 mb-1">
          {form.tags.map(t => (
            <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-accent/20 text-accent rounded-full text-xs">
              {t}
              <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}><X size={10} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="input-field text-sm flex-1" placeholder="Add tag (e.g. frontend)" value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
          <button onClick={addTag} className="btn btn-secondary text-sm px-3">Add</button>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="btn btn-secondary flex-1 text-sm">Cancel</button>
        <button onClick={() => form.name.trim() && onSave(form)} className="btn btn-primary flex-1 text-sm">Save Resume</button>
      </div>
    </motion.div>
  );
}

export function ResumesTab() {
  const { resumes, addResume, updateResume, deleteResume } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleAdd = async (form) => {
    await addResume(form);
    setShowForm(false);
  };

  const handleEdit = async (form) => {
    const resume = resumes.find(r => r.id === editId);
    await updateResume({ ...resume, ...form });
    setEditId(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text">Resumes</h1>
          <p className="text-text-muted text-sm">{resumes.length} saved versions</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary gap-2 text-sm">
          <Plus size={15} /> Add Resume
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="mb-4">
            <ResumeForm initial={INITIAL} onSave={handleAdd} onCancel={() => setShowForm(false)} />
          </div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {resumes.length === 0 && (
          <div className="text-center py-16 text-text-muted/50">
            <div className="text-4xl mb-3">📄</div>
            <p className="text-sm">No resumes yet. Add your first one!</p>
          </div>
        )}

        <AnimatePresence>
          {resumes.map(resume => {
            const color = RESUME_COLORS.find(c => c.id === resume.color) || RESUME_COLORS[0];
            return (
              <motion.div key={resume.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-surface border border-border rounded-xl p-4">
                {editId === resume.id ? (
                  <ResumeForm
                    initial={{ name: resume.name, fileNote: resume.fileNote || '', tags: resume.tags || [], color: resume.color || 'indigo' }}
                    onSave={handleEdit}
                    onCancel={() => setEditId(null)}
                  />
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${color.class}`}>{resume.name}</span>
                        {resume.createdAt && (
                          <span className="text-xs text-text-muted">{format(new Date(resume.createdAt), 'MMM d, yyyy')}</span>
                        )}
                      </div>
                      {resume.fileNote && <p className="text-sm text-text-muted mb-2">{resume.fileNote}</p>}
                      {resume.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {resume.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 bg-background rounded-full text-xs text-text-muted border border-border">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 ml-3">
                      <button onClick={() => setEditId(resume.id)} className="btn btn-ghost p-1.5 rounded-lg"><Pencil size={14} /></button>
                      <button onClick={() => deleteResume(resume.id)} className="btn btn-ghost p-1.5 rounded-lg text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
