import { openDB } from 'idb';

const DB_NAME = 'JobTrackerAI';
const DB_VERSION = 1;

let dbPromise = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('jobs')) {
          db.createObjectStore('jobs', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('resumes')) {
          db.createObjectStore('resumes', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('documents')) {
          db.createObjectStore('documents', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('experiences')) {
          db.createObjectStore('experiences', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('profile')) {
          db.createObjectStore('profile', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// Generic CRUD
export async function getAll(store) {
  const db = await getDB();
  return db.getAll(store);
}

export async function getOne(store, id) {
  const db = await getDB();
  return db.get(store, id);
}

export async function addItem(store, item) {
  const db = await getDB();
  return db.add(store, { ...item, createdAt: item.createdAt || new Date().toISOString() });
}

export async function updateItem(store, item) {
  const db = await getDB();
  return db.put(store, item);
}

export async function deleteItem(store, id) {
  const db = await getDB();
  return db.delete(store, id);
}

// Profile special: single record
export async function getProfile() {
  const db = await getDB();
  return db.get('profile', 1);
}

export async function saveProfile(data) {
  const db = await getDB();
  return db.put('profile', { ...data, id: 1 });
}
