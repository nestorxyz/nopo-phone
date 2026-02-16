import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { PRESET_APPS } from '../utils/constants';

const Launcher = () => {
  const {
    phrase,
    tasks,
    addTask,
    toggleTask,
    removeTask,
    resetTasks,
    bgImage,
    overlayOpacity,
    selectedAppIds,
  } = useSettings();
  const [time, setTime] = useState(new Date());
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText);
      setNewTaskText('');
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const visibleApps = PRESET_APPS.filter((app) =>
    selectedAppIds.includes(app.id),
  );

  const containerStyle = bgImage
    ? {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  const overlayStyle = {
    backgroundColor: `rgba(0,0,0, ${bgImage ? overlayOpacity : 0})`,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem',
  };

  return (
    <div style={containerStyle} className="launcher-container">
      <div style={overlayStyle}>
        <header className="launcher-header">
          <p className="launcher-phrase">{phrase}</p>
        </header>

        <div className="time-display">
          <h1>{formatTime(time)}</h1>
          <p>{formatDate(time)}</p>
        </div>

        <div className="task-widget">
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task.id} className="task-item">
                <span
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    opacity: task.completed ? 0.5 : 1,
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => removeTask(task.id)}
                  className="delete-task"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddTask} className="task-form">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Add focus task..."
            />
          </form>
          {tasks.length > 0 && (
            <button onClick={resetTasks} className="reset-tasks">
              Reset Tasks
            </button>
          )}
        </div>

        <div className="app-links">
          {visibleApps.map((app) => (
            <a key={app.id} href={app.url} className="app-link">
              {app.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Launcher;
