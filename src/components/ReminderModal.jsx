import React, { useState } from 'react';
import { createReminder } from '../services/reminderService';

export const ReminderModal = ({ note, onClose, onSuccess }) => {
  const [reminderTime, setReminderTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!note) return null;

  // Helpers for preset times
  const setPreset = (hoursFromNow) => {
    const d = new Date(Date.now() + hoursFromNow * 3600 * 1000);
    // Format to YYYY-MM-DDTHH:mm
    const pad = (n) => String(n).padStart(2, '0');
    const formatted = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setReminderTime(formatted);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reminderTime) {
      setError('Please select a reminder time');
      return;
    }

    const selectedDate = new Date(reminderTime);
    if (selectedDate <= new Date()) {
      setError('Reminder time must be in the future');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Ensure ISO format YYYY-MM-DDTHH:mm:ss for backend LocalDateTime
      const isoTime =
        reminderTime.length === 16 ? `${reminderTime}:00` : reminderTime;
      await createReminder(note.id, isoTime);
      if (onSuccess) {
        onSuccess(
          `Reminder set for "${note.title || 'Untitled'}" at ${selectedDate.toLocaleString()}`
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
            className="btn-preset"
            onClick={() => setPreset(4)}
          >
            Later today (+4h)
          </button>
          <button
            type="button"
            className="btn-preset"
            onClick={() => setPreset(24)}
          >
            Tomorrow (+24h)
          </button>
          <button
            type="button"
            className="btn-preset"
            onClick={() => setPreset(168)}
          >
            Next week (+7d)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="reminderTime">Select Custom Date & Time</label>
            <input
              id="reminderTime"
              type="datetime-local"
              value={reminderTime}
              onChange={(e) => {
                setReminderTime(e.target.value);
                setError('');
              }}
              min={new Date().toISOString().slice(0, 16)}
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
