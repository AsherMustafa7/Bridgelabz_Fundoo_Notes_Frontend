import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import NoteEditor from '../components/NoteEditor';
import NoteList from '../components/NoteList';
import ReminderModal from '../components/ReminderModal';
import {
  getAllNotes,
  createNote,
  togglePin,
  toggleArchive,
  toggleTrash,
} from '../services/noteService';
import { getReminders, removeReminder } from '../utils/reminderManager';

export const DashboardPage = () => {
  const { searchQuery } = useOutletContext() || { searchQuery: '' };
  const [notes, setNotes] = useState([]);
  const [reminders, setReminders] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeReminderNote, setActiveReminderNote] = useState(null);

  const refreshReminders = () => {
    setReminders(getReminders());
  };

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllNotes();
      setNotes(Array.isArray(data) ? data : []);
      refreshReminders();
      setError('');
    } catch (err) {
      console.error('Failed to load notes', err);
      setError('Unable to load notes. Please check connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreateNote = async ({ title, description, pinned }) => {
    try {
      const newNote = await createNote({ title, description });
      if (pinned && newNote?.id) {
        const pinnedNote = await togglePin(newNote.id);
        setNotes((prev) => [pinnedNote, ...prev]);
      } else if (newNote) {
        setNotes((prev) => [newNote, ...prev]);
      }
    } catch (err) {
      console.error('Error creating note', err);
      throw err;
    }
  };

  const handleTogglePin = async (noteId) => {
    try {
      const updated = await togglePin(noteId);
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, pinned: updated.pinned } : n))
      );
    } catch (err) {
      console.error('Failed to pin note', err);
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
      console.error('Failed to archive note', err);
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
      console.error('Failed to trash note', err);
    }
  };

  const handleRemoveReminder = (noteId) => {
    removeReminder(noteId);
    refreshReminders();
    setSuccessMessage('Reminder removed');
  };

  // Filter active notes (not trashed and not archived)
  const activeNotes = notes.filter((n) => !n.trashed && !n.archived);

  // Filter by search query
  const query = (searchQuery || '').trim().toLowerCase();
  const filteredNotes = query
    ? activeNotes.filter(
        (n) =>
          (n.title && n.title.toLowerCase().includes(query)) ||
          (n.description && n.description.toLowerCase().includes(query))
      )
    : activeNotes;

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const otherNotes = filteredNotes.filter((n) => !n.pinned);

  return (
    <div className="dashboard-page">
      <NoteEditor onAddNote={handleCreateNote} />

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
          <span>Loading notes...</span>
        </div>
      ) : (
        <NoteList
          pinnedNotes={pinnedNotes}
          otherNotes={otherNotes}
          reminders={reminders}
          onRemoveReminder={handleRemoveReminder}
          onTogglePin={handleTogglePin}
          onToggleArchive={handleToggleArchive}
          onToggleTrash={handleToggleTrash}
          onOpenReminder={(note) => setActiveReminderNote(note)}
          emptyMessage={
            query
              ? `No notes matching "${query}"`
              : 'Notes you add appear here'
          }
        />
      )}

      {activeReminderNote && (
        <ReminderModal
          note={activeReminderNote}
          onClose={() => setActiveReminderNote(null)}
          onSuccess={(msg) => {
            setSuccessMessage(msg);
            refreshReminders();
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;
