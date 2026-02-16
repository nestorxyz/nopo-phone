import React, { useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { PRESET_APPS } from '../utils/constants';

const SettingsModal = ({ isOpen, onClose }) => {
  const {
    bgImage,
    updateBgImage,
    phrase,
    setPhrase,
    overlayOpacity,
    setOverlayOpacity,
    selectedAppIds,
    toggleApp,
  } = useSettings();

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateBgImage(file);
    }
  };

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <header>
          <h2>Customization</h2>
          <button onClick={onClose} className="close-btn">
            Close
          </button>
        </header>

        <div className="setting-group">
          <label>Top Phrase</label>
          <input
            type="text"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="Enter your focus phrase"
          />
        </div>

        <div className="setting-group">
          <label>Background Image</label>
          <button onClick={() => fileInputRef.current.click()}>
            {bgImage ? 'Change Image' : 'Upload Image'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          {bgImage && (
            <button onClick={() => updateBgImage(null)} className="remove-btn">
              Remove Image
            </button>
          )}
        </div>

        <div className="setting-group">
          <label>Overlay Opacity: {Math.round(overlayOpacity * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
          />
          <small>Darkens the background for better text readability.</small>
        </div>

        <div className="setting-group">
          <label>App Shortcuts</label>
          <div className="app-selection-list">
            {PRESET_APPS.map((app) => (
              <label key={app.id} className="app-checkbox">
                <input
                  type="checkbox"
                  checked={selectedAppIds.includes(app.id)}
                  onChange={() => toggleApp(app.id)}
                />
                {app.name}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
