import React, { useState, useEffect } from 'react';
import {
  getReminders,
  getAlertedReminders,
  markReminderAlerted,
  removeReminder,
  playReminderChime,
} from '../utils/reminderManager';

export const ReminderNotification = () => {
  const [activeAlerts, setActiveAlerts] = useState([]);

  useEffect(() => {
    const checkReminders = () => {
      const reminders = getReminders();
      const alerted = getAlertedReminders();
      const now = new Date();

      Object.values(reminders).forEach((item) => {
        const reminderDate = new Date(item.reminderTime);
        if (reminderDate <= now && !alerted[item.noteId]) {
          // 1. Mark as alerted
          markReminderAlerted(item.noteId);

          // 2. Play gentle audio chime
          playReminderChime();

          // 3. Trigger native desktop browser notification if permitted
          if (
            typeof window !== 'undefined' &&
            'Notification' in window &&
            Notification.permission === 'granted'
          ) {
            new Notification(`⏰ Reminder: ${item.noteTitle}`, {
              body: `It's time for your Fundoo Note!`,
              icon: '/favicon.svg',
            });
          }

          // 4. Trigger in-app floating banner
          setActiveAlerts((prev) => [
            ...prev,
            {
              id: item.noteId,
              title: item.noteTitle,
              time: reminderDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
          ]);
        }
      });
    };

    // Check every 2 seconds
    const interval = setInterval(checkReminders, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = (noteId) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== noteId));
    removeReminder(noteId);
  };

  if (activeAlerts.length === 0) return null;

  return (
    <div className="live-reminder-container">
      {activeAlerts.map((alert) => (
        <div key={alert.id} className="live-reminder-toast">
          <div className="toast-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#1a73e8">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
          </div>
          <div className="toast-body">
            <h4 className="toast-title">Reminder Alert ({alert.time})</h4>
            <p className="toast-text">{alert.title}</p>
          </div>
          <button
            type="button"
            className="btn-toast-dismiss"
            onClick={() => handleDismiss(alert.id)}
            title="Dismiss reminder"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReminderNotification;
