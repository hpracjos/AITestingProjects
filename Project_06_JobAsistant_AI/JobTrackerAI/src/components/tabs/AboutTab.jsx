import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const EMPTY = { name: '', location: '', email: '', linkedin: '', github: '', portfolio: '', bio: '', interests: [] };

export function AboutTab() {
  const { profile, updateProfile } = useApp();
  const [form, setForm] = useState(EMPTY);
  const [tagInput, setTagInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm({ ...EMPTY, ...profile });
  }, [profile]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addInterest = () => {
    const t = tagInput.trim();
    if (t && !form.interests?.includes(t)) setForm(f => ({ ...f, interests: [...(f.interests || []), t] }));
    setTagInput('');
  };

  const handleSave = async () => {
    await updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text">About Me</h1>
          <p className="text-text-muted text-sm">Your personal profile and links</p>
        </div>
        <button onClick={handleSave} className={`btn gap-2 text-sm transition-all ${saved ? 'btn-secondary text-green-400' : 'btn-primary'}`}>
          <Save size={15} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-5">
        {/* Avatar placeholder */}
        <div className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
            <User size={28} className="text-accent" />
          </div>
          <div>
            <p className="font-semibold text-text">{form.name || 'Your Name'}</p>
            <p className="text-sm text-text-muted">{form.location || 'Location'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Full Name</label>
            <input className="input-field" placeholder="Jane Doe" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Location</label>
            <input className="input-field" placeholder="London, UK" value={form.location} onChange={e => set('location', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-text-muted mb-1 block">Email</label>
          <input className="input-field" type="email" placeholder="jane@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">LinkedIn URL</label>
            <input className="input-field text-sm" placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={e => set('linkedin', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">GitHub URL</label>
            <input className="input-field text-sm" placeholder="https://github.com/..." value={form.github} onChange={e => set('github', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Portfolio URL</label>
            <input className="input-field text-sm" placeholder="https://yoursite.com" value={form.portfolio} onChange={e => set('portfolio', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-text-muted mb-1 block">Bio / Summary</label>
          <textarea className="input-field resize-none" rows={5} placeholder="Write a short professional summary..."
            value={form.bio} onChange={e => set('bio', e.target.value)} />
        </div>

        <div>
          <label className="text-xs font-medium text-text-muted mb-2 block">Interests</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(form.interests || []).map(t => (
              <motion.span key={t} layout initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="flex items-center gap-1 px-3 py-1 bg-accent/15 text-accent rounded-full text-sm border border-accent/20">
                {t}
                <button onClick={() => setForm(f => ({ ...f, interests: f.interests.filter(x => x !== t) }))} className="hover:text-white transition-colors">
                  <X size={11} />
                </button>
              </motion.span>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="input-field flex-1 text-sm" placeholder="Add an interest (e.g. Open Source)…" value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addInterest())} />
            <button onClick={addInterest} className="btn btn-secondary text-sm px-4">Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}
