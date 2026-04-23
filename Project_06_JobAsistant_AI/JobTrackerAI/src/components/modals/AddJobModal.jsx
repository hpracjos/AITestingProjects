import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { COLUMNS, RESUME_COLORS } from '../../lib/constants';

const INITIAL = { title: '', company: '', url: '', resumeId: '', status: 'researching', notes: '' };

export function AddJobModal({ isOpen, onClose, editJob = null }) {
  const { addJob, updateJob, resumes } = useApp();
  const [form, setForm] = useState(editJob || INITIAL);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Job title is required';
    if (!form.company.trim()) e.company = 'Company name is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (editJob) {
      await updateJob({ ...editJob, ...form });
    } else {
      await addJob({ ...form, createdAt: new Date().toISOString() });
    }
    setForm(INITIAL);
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setForm(editJob || INITIAL);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editJob ? 'Edit Job' : 'Add New Job'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Job Title *</label>
            <input
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Senior Frontend Engineer"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Company *</label>
            <input
              className={`input-field ${errors.company ? 'border-red-500' : ''}`}
              placeholder="Acme Corp"
              value={form.company}
              onChange={e => set('company', e.target.value)}
            />
            {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">LinkedIn / Job URL</label>
          <input
            className="input-field"
            placeholder="https://linkedin.com/jobs/..."
            value={form.url}
            onChange={e => set('url', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Initial Status</label>
            <select className="input-field" value={form.status} onChange={e => set('status', e.target.value)}>
              {COLUMNS.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Resume Used</label>
            <select className="input-field" value={form.resumeId} onChange={e => set('resumeId', e.target.value)}>
              <option value="">— Select Resume —</option>
              {resumes.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Notes</label>
          <textarea
            className="input-field resize-none"
            rows={4}
            placeholder="Any notes about this application..."
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={handleClose} className="btn btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn btn-primary flex-1">
            {editJob ? 'Save Changes' : 'Add Job'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
