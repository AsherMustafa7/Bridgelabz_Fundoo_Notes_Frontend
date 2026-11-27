import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import { getAllNotes, toggleArchive, toggleTrash } from '../services/noteService';

export const ArchivePage = () => {
  const { searchQuery } = useOutletContext() || { searchQuery: '' };
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchArchiveNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllNotes();
      setNotes(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Failed to load archived notes', err);
      setError('Unable to load archived notes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchiveNotes();
  }, [fetchArchiveNotes]);

  const handleUnarchive = async (noteId) => {
    try {
      await toggleArchive(noteId);
      // Remove from archived view
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (err) {
      console.error('Failed to unarchive note', err);
    }
  };

  const handleTrash = async (noteId) => {
    try {
      await toggleTrash(noteId);
      // Remove from archived view because it is now trashed
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (err) {
      console.error('Failed to trash note', err);
    }
  };

  // Filter archived notes (archived === true and trashed === false)
  const archivedNotes = notes.filter((n) => n.archived && !n.trashed);

  const query = (searchQuery || '').trim().toLowerCase();
  const filteredNotes = query
    ? archivedNotes.filter(
        (n) =>
          (n.title && n.title.toLowerCase().includes(query)) ||
          (n.description && n.description.toLowerCase().includes(query))
      )
    : archivedNotes;

  return (
    <div className="archive-page">
      <div className="page-header">
        <h2 className="page-title">Archive</h2>
      </div>

      {error && <div className="alert-banner alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Loading archive...</span>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="notes-empty-state">
          <svg viewBox="0 0 24 24" width="80" height="80" fill="#e0e0e0">
            <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z" />
          </svg>
          <p className="empty-message-text">Your archived notes appear here</p>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onToggleArchive={handleUnarchive}
              onToggleTrash={handleTrash}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchivePage;
