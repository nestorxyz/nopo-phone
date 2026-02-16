const DB_NAME = 'NopoPhoneDB';
const STORE_NAME = 'images';
const IMAGE_KEY = 'bgImage';

// Helper to open IndexedDB
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveImageToDB = async (file) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(file, IMAGE_KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getImageFromDB = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(IMAGE_KEY);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const VISIBLITY_PREFS_KEY = 'nopo_prefs';

export const savePrefs = (prefs) => {
  localStorage.setItem(VISIBLITY_PREFS_KEY, JSON.stringify(prefs));
};

export const getPrefs = () => {
  const stored = localStorage.getItem(VISIBLITY_PREFS_KEY);
  return stored ? JSON.parse(stored) : null;
};
