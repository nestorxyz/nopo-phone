import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  saveImageToDB,
  getImageFromDB,
  savePrefs,
  getPrefs,
} from '../utils/storage';
import { DEFAULT_APPS } from '../utils/constants';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [bgImage, setBgImage] = useState(null); // Blob URL
  const [phrase, setPhrase] = useState('FOCUS');
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [tasks, setTasks] = useState([]);
  const [selectedAppIds, setSelectedAppIds] = useState(DEFAULT_APPS);

  // Load initial state
  useEffect(() => {
    const loadState = async () => {
      // Load Prefs
      const prefs = getPrefs();
      if (prefs) {
        if (prefs.phrase !== undefined) setPhrase(prefs.phrase);
        if (prefs.overlayOpacity !== undefined)
          setOverlayOpacity(prefs.overlayOpacity);
        if (prefs.tasks !== undefined) setTasks(prefs.tasks);
        if (prefs.selectedAppIds !== undefined)
          setSelectedAppIds(prefs.selectedAppIds);
      }

      // Load Image
      try {
        const imageBlob = await getImageFromDB();
        if (imageBlob) {
          const url = URL.createObjectURL(imageBlob);
          setBgImage(url);
        }
      } catch (err) {
        console.error('Failed to load background image:', err);
      }
    };
    loadState();
  }, []);

  // Persist text prefs whenever they change
  useEffect(() => {
    savePrefs({ phrase, overlayOpacity, tasks, selectedAppIds });
  }, [phrase, overlayOpacity, tasks, selectedAppIds]);

  const updateBgImage = async (file) => {
    try {
      await saveImageToDB(file);
      const url = URL.createObjectURL(file);
      setBgImage(url);
    } catch (err) {
      console.error('Failed to save image:', err);
    }
  };

  const addTask = (text) => {
    const newTask = { id: Date.now(), text, completed: false };
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const resetTasks = () => {
    setTasks([]);
  };

  const toggleApp = (appId) => {
    setSelectedAppIds((prev) => {
      if (prev.includes(appId)) {
        return prev.filter((id) => id !== appId);
      } else {
        return [...prev, appId];
      }
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        bgImage,
        updateBgImage,
        phrase,
        setPhrase,
        overlayOpacity,
        setOverlayOpacity,
        tasks,
        addTask,
        toggleTask,
        removeTask,
        resetTasks,
        selectedAppIds,
        toggleApp,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
