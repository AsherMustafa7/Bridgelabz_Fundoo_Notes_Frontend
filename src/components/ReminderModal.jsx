import React, { useState } from 'react';
import { createReminder } from '../services/reminderService';
import { saveReminder, initAudioContext } from '../utils/reminderManager';

export const ReminderModal = ({ note, onClose, onSuccess }) => {
  const [reminderTime, setReminderTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!note) return null;

  // Preset offset in seconds
  const setPresetSeconds = (seconds) => {
    initAudioContext();
    const d = new Date(Date.now() + seconds * 1000);
    const pad = (n) => String(n).padStart(2, '0');
    // Format YYYY-MM-DDTHH:mm:ss
    const formatted = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    setReminderTime(formatted);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    initAudioContext(); // Unlock audio on submit click

    if (!reminderTime) {
      setError('Please select a reminder time');
      return;
    }

    const selectedDate = new Date(reminderTime);
    if (selectedDate.getTime() <= Date.now()) {
      setError('Reminder time must be in the future');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Ensure ISO format YYYY-MM-DDTHH:mm:ss for backend LocalDateTime
      let isoTime = reminderTime;
      if (isoTime.length === 16) {
        isoTime = `${isoTime}:00`;
      }

      // 1. Send event to RabbitMQ via Spring Boot backend
      await createReminder(note.id, isoTime);

      // 2. Register live alert in client reminder manager
      saveReminder(note.id, isoTime, note.title);

      if (onSuccess) {
        onSuccess(
          `Reminder scheduled for "${note.title || 'Untitled'}" at ${selectedDate.toLocaleTimeString()}`
        );
      }
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to set reminder';
      setError(typeof msg === 'string' ? msg : 'Error scheduling reminder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Set Reminder</h3>
          <button type="button" className="btn-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <p className="modal-note-title">
          Note: <strong>{note.title || 'Untitled'}</strong>
        </p>

        {error && <div className="alert-banner alert-error">{error}</div>}

        <div className="preset-buttons">
          <button
            type="button"
            className="btn-preset btn-preset-highlight"
            onClick={() => setPresetSeconds(15)}
            title="Triggers in exactly 15 seconds"
          >
            ⚡ Test in 15 sec
          </button>
          <button
            type="button"
            className="btn-preset"
            onClick={() => setPresetSeconds(30)}
            title="Triggers in 30 seconds"
          >
            +30 sec
          </button>
          <button
            type="button"
            className="btn-preset"
            onClick={() => setPresetSeconds(60)}
            title="Triggers in 1 minute"
          >
            +1 min
          </button>
          <button
            type="button"
            className="btn-preset"
            onClick={() => setPresetSeconds(4 * 3600)}
          >
            Later today (+4h)
          </button>
          <button
            type="button"
            className="btn-preset"
            onClick={() => setPresetSeconds(24 * 3600)}
          >
            Tomorrow
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="reminderTime">Custom Date & Time</label>
            <input
              id="reminderTime"
              type="datetime-local"
              step="1"
              value={reminderTime}
              onChange={(e) => {
                setReminderTime(e.target.value);
                setError('');
              }}
              min={new Date().toISOString().slice(0, 19)}
              disabled={loading}
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Scheduling...' : 'Save Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;
