import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import ReminderModal from '../components/ReminderModal';
import { getAllNotes, toggleArchive, toggleTrash, togglePin } from '../services/noteService';

export const ReminderPage = () => {
  const { searchQuery } = useOutletContext() || { searchQuery: '' };
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeReminderNote, setActiveReminderNote] = useState(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllNotes();
      setNotes(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Failed to load notes for reminders', err);
      setError('Unable to load notes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleTogglePin = async (noteId) => {
    try {
      const updated = await togglePin(noteId);
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, pinned: updated.pinned } : n))
      );
    } catch (err) {
      console.error('Failed to toggle pin', err);
    }
  };

  const handleToggleArchive = async (noteId) => {
    try {
      const updated = await toggleArchive(noteId);
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, archived: updated.archived } : n
        )
      );
    } catch (err) {
      console.error('Failed to toggle archive', err);
    }
  };

  const handleToggleTrash = async (noteId) => {
    try {
      const updated = await toggleTrash(noteId);
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, trashed: updated.trashed } : n
        )
      );
    } catch (err) {
      console.error('Failed to toggle trash', err);
    }
  };

  // Active notes eligible for reminders (not trashed)
  const activeNotes = notes.filter((n) => !n.trashed);

  const query = (searchQuery || '').trim().toLowerCase();
  const filteredNotes = query
    ? activeNotes.filter(
        (n) =>
          (n.title && n.title.toLowerCase().includes(query)) ||
          (n.description && n.description.toLowerCase().includes(query))
      )
    : activeNotes;

  return (
    <div className="reminders-page">
      <div className="page-header">
        <h2 className="page-title">Reminders</h2>
        <p className="page-subtext">
          Schedule asynchronous note alerts handled by RabbitMQ message broker
        </p>
      </div>

      {error && <div className="alert-banner alert-error">{error}</div>}
      {successMessage && (
        <div className="alert-banner alert-success">
          {successMessage}
          <button
            type="button"
            style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setSuccessMessage('')}
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Loading reminders...</span>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="notes-empty-state">
          <svg viewBox="0 0 24 24" width="80" height="80" fill="#e0e0e0">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
          <p className="empty-message-text">Notes with upcoming reminders appear here</p>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onTogglePin={handleTogglePin}
              onToggleArchive={handleToggleArchive}
              onToggleTrash={handleToggleTrash}
              onOpenReminder={(n) => setActiveReminderNote(n)}
            />
          ))}
        </div>
      )}

      {activeReminderNote && (
        <ReminderModal
          note={activeReminderNote}
          onClose={() => setActiveReminderNote(null)}
          onSuccess={(msg) => setSuccessMessage(msg)}
        />
      )}
    </div>
  );
};

export default ReminderPage;
