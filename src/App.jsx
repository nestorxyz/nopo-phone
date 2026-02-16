import React, { useState } from 'react';
import Launcher from './components/Launcher';
import SettingsModal from './components/SettingsModal';
import FocusMode from './components/FocusMode';
import './App.css';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);

  return (
    <div className="app-container">
      <Launcher />

      <button
        className="settings-toggle"
        onClick={() => setIsSettingsOpen(true)}
        aria-label="Settings"
      >
        ⚙️
      </button>

      <button
        className="focus-toggle"
        onClick={() => setIsFocusModeOpen(true)}
        aria-label="Focus Mode"
      >
        ◎
      </button>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {isFocusModeOpen && (
        <FocusMode onClose={() => setIsFocusModeOpen(false)} />
      )}
    </div>
  );
}

export default App;
