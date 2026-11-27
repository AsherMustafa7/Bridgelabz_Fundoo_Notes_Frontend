import React, { useState, useEffect, useRef } from 'react';
import {
  getReminders,
  getDismissedReminders,
  dismissReminderAlert,
  triggerDesktopNotification,
  playReminderChime,
} from '../utils/reminderManager';

export const ReminderNotification = () => {
  const [dueAlerts, setDueAlerts] = useState([]);
  const chimedRef = useRef({});

  const checkDueReminders = () => {
    const reminders = getReminders();
    const dismissed = getDismissedReminders();
    const now = new Date();

    const activeList = [];

    Object.values(reminders).forEach((item) => {
      const reminderDate = new Date(item.reminderTime);
      if (reminderDate <= now && !dismissed[item.noteId]) {
        activeList.push({
          id: item.noteId,
          title: item.noteTitle,
          time: reminderDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          date: reminderDate.toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
          }),
        });

        // Trigger chime and desktop notification once per note session
        if (!chimedRef.current[item.noteId]) {
          chimedRef.current[item.noteId] = true;
          playReminderChime();
          triggerDesktopNotification(
            `⏰ Reminder: ${item.noteTitle}`,
            `It's time for your Fundoo Note! Scheduled for ${reminderDate.toLocaleTimeString()}`
          );
        }
      }
    });

    setDueAlerts(activeList);
  };

  useEffect(() => {
    // Immediate check
    checkDueReminders();

    // Check every second for exact timing
    const timer = setInterval(checkDueReminders, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDismiss = (noteId) => {
    dismissReminderAlert(noteId);
    setDueAlerts((prev) => prev.filter((a) => a.id !== noteId));
  };

  if (dueAlerts.length === 0) return null;

  return (
    <div className="prominent-alert-overlay">
      {dueAlerts.map((alert) => (
        <div key={alert.id} className="prominent-alert-card">
          <div className="alert-bell-pulse">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#FFFFFF">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
          </div>

          <div className="alert-content">
            <div className="alert-badge-top">⏰ Reminder Alert • {alert.date} at {alert.time}</div>
            <h3 className="alert-note-title">{alert.title}</h3>
            <p className="alert-desc">It is time for your scheduled reminder!</p>
          </div>

          <div className="alert-actions">
            <button
              type="button"
              className="btn btn-alert-dismiss"
              onClick={() => handleDismiss(alert.id)}
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReminderNotification;
