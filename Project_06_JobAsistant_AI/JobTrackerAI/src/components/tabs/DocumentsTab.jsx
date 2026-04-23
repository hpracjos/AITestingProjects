import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';

const INITIAL = { title: '', company: '', fileNote: '', date: '' };

function DocForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-surface border border-border rounded-xl p-4 space-y-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-text-muted mb-1 block">Title *</label>
          <input className="input-field text-sm" placeholder="Cover Letter" value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-text-muted mb-1 block">Company</label>
          <input className="input-field text-sm" placeholder="Acme Corp" value={form.company} onChange={e => set('company', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-text-muted mb-1 block">File Note / URL</label>
        <input className="input-field text-sm" placeholder="cover_acme.pdf or Google Docs link" value={form.fileNote} onChange={e => set('fileNote', e.target.value)} />
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="btn btn-secondary flex-1 text-sm">Cancel</button>
        <button onClick={() => form.title.trim() && onSave(form)} className="btn btn-primary flex-1 text-sm">Save Document</button>
      </div>
    </motion.div>
  );
}

export function DocumentsTab() {
  const { documents, addDocument, updateDocument, deleteDocument } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const grouped = documents.reduce((acc, doc) => {
    const key = doc.company || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(doc);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text">Documents</h1>
          <p className="text-text-muted text-sm">{documents.length} documents stored</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary gap-2 text-sm">
          <Plus size={15} /> Add Document
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="mb-4">
            <DocForm
              initial={INITIAL}
              onSave={async (form) => { await addDocument(form); setShowForm(false); }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </AnimatePresence>

      {documents.length === 0 ? (
        <div className="text-center py-16 text-text-muted/50">
          <div className="text-4xl mb-3">🗂️</div>
          <p className="text-sm">No documents yet. Add cover letters, portfolios, and more.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([company, docs]) => (
            <div key={company}>
              <h3 className="font-semibold text-sm text-text-muted uppercase tracking-wider mb-2">{company}</h3>
              <div className="space-y-2">
                <AnimatePresence>
                  {docs.map(doc => (
                    <motion.div key={doc.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="bg-surface border border-border rounded-xl p-4">
                      {editId === doc.id ? (
                        <DocForm
                          initial={{ title: doc.title, company: doc.company || '', fileNote: doc.fileNote || '' }}
                          onSave={async (form) => { await updateDocument({ ...doc, ...form }); setEditId(null); }}
                          onCancel={() => setEditId(null)}
                        />
                      ) : (
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm text-text">{doc.title}</p>
                            {doc.fileNote && <p className="text-xs text-text-muted mt-0.5">{doc.fileNote}</p>}
                            {doc.createdAt && <p className="text-xs text-text-muted/60 mt-1">{format(new Date(doc.createdAt), 'MMM d, yyyy')}</p>}
                          </div>
                          <div className="flex gap-1 ml-3">
                            <button onClick={() => setEditId(doc.id)} className="btn btn-ghost p-1.5 rounded-lg"><Pencil size={14} /></button>
                            <button onClick={() => deleteDocument(doc.id)} className="btn btn-ghost p-1.5 rounded-lg text-red-400"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
