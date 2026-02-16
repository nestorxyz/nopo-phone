import React, { useState, useEffect } from 'react';

const FocusMode = ({ onClose }) => {
  const [duration, setDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(null); // seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startFocus = () => {
    setTimeLeft(duration * 60);
    setIsActive(true);
  };

  const stopFocus = () => {
    if (window.confirm('Are you sure you want to break your focus?')) {
      setIsActive(false);
      setTimeLeft(null);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isActive) {
    return (
      <div className="focus-setup-overlay">
        <div className="focus-setup">
          <h2>Enter Focus Mode</h2>
          <div className="duration-selector">
            <button onClick={() => setDuration(Math.max(5, duration - 5))}>
              -
            </button>
            <span>{duration} min</span>
            <button onClick={() => setDuration(duration + 5)}>+</button>
          </div>
          <div className="focus-actions">
            <button onClick={startFocus} className="start-focus-btn">
              Start
            </button>
            <button onClick={onClose} className="cancel-focus-btn">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="focus-mode-active">
      <h1 className="focus-timer">{formatTime(timeLeft)}</h1>
      <p className="focus-message">Stay in the zone.</p>
      <button onClick={stopFocus} className="give-up-btn">
        Give Up
      </button>
    </div>
  );
};

export default FocusMode;
