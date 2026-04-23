import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAll, addItem, updateItem, deleteItem, getProfile, saveProfile } from '../lib/db';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [activeTab, setActiveTab] = useState('jobs');

  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theme handling
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  // Load all data
  const loadAll = useCallback(async () => {
    setLoading(true);
    const [j, r, d, e, p] = await Promise.all([
      getAll('jobs'),
      getAll('resumes'),
      getAll('documents'),
      getAll('experiences'),
      getProfile(),
    ]);
    setJobs(j);
    setResumes(r);
    setDocuments(d);
    setExperiences(e);
    setProfile(p || {});
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Jobs CRUD
  const addJob = async (job) => {
    const id = await addItem('jobs', job);
    setJobs(prev => [...prev, { ...job, id, createdAt: job.createdAt || new Date().toISOString() }]);
    return id;
  };
  const updateJob = async (job) => {
    await updateItem('jobs', job);
    setJobs(prev => prev.map(j => j.id === job.id ? job : j));
  };
  const deleteJob = async (id) => {
    await deleteItem('jobs', id);
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  // Resumes CRUD
  const addResume = async (resume) => {
    const id = await addItem('resumes', resume);
    setResumes(prev => [...prev, { ...resume, id, createdAt: new Date().toISOString() }]);
  };
  const updateResume = async (resume) => {
    await updateItem('resumes', resume);
    setResumes(prev => prev.map(r => r.id === resume.id ? resume : r));
  };
  const deleteResume = async (id) => {
    await deleteItem('resumes', id);
    setResumes(prev => prev.filter(r => r.id !== id));
  };

  // Documents CRUD
  const addDocument = async (doc) => {
    const id = await addItem('documents', doc);
    setDocuments(prev => [...prev, { ...doc, id, createdAt: new Date().toISOString() }]);
  };
  const updateDocument = async (doc) => {
    await updateItem('documents', doc);
    setDocuments(prev => prev.map(d => d.id === doc.id ? doc : d));
  };
  const deleteDocument = async (id) => {
    await deleteItem('documents', id);
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // Experiences CRUD
  const addExperience = async (exp) => {
    const id = await addItem('experiences', exp);
    setExperiences(prev => [...prev, { ...exp, id, createdAt: new Date().toISOString() }]);
  };
  const updateExperience = async (exp) => {
    await updateItem('experiences', exp);
    setExperiences(prev => prev.map(e => e.id === exp.id ? exp : e));
  };
  const deleteExperience = async (id) => {
    await deleteItem('experiences', id);
    setExperiences(prev => prev.filter(e => e.id !== id));
  };

  // Profile
  const updateProfile = async (data) => {
    await saveProfile(data);
    setProfile(data);
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      activeTab, setActiveTab,
      jobs, addJob, updateJob, deleteJob,
      resumes, addResume, updateResume, deleteResume,
      documents, addDocument, updateDocument, deleteDocument,
      experiences, addExperience, updateExperience, deleteExperience,
      profile, updateProfile,
      loading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
