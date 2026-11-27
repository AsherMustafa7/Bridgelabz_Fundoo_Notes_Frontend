import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import { getAllNotes, toggleTrash } from '../services/noteService';

export const TrashPage = () => {
  const { searchQuery } = useOutletContext() || { searchQuery: '' };
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTrashNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllNotes();
      setNotes(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Failed to load trash notes', err);
      setError('Unable to load trashed notes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrashNotes();
  }, [fetchTrashNotes]);

  const handleRestore = async (noteId) => {
    try {
      await toggleTrash(noteId);
      // Remove from trash list
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (err) {
      console.error('Failed to restore note', err);
    }
  };

  // Filter notes where trashed === true
  const trashedNotes = notes.filter((n) => n.trashed);

  const query = (searchQuery || '').trim().toLowerCase();
  const filteredNotes = query
    ? trashedNotes.filter(
        (n) =>
          (n.title && n.title.toLowerCase().includes(query)) ||
          (n.description && n.description.toLowerCase().includes(query))
      )
    : trashedNotes;

  return (
    <div className="trash-page">
      <div className="trash-header-banner">
        <em>Notes in Trash will be kept until deleted permanently or restored.</em>
      </div>

      {error && <div className="alert-banner alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Loading trash...</span>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="notes-empty-state">
          <svg viewBox="0 0 24 24" width="80" height="80" fill="#e0e0e0">
            <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z" />
          </svg>
          <p className="empty-message-text">No notes in Trash</p>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onToggleTrash={handleRestore}
              isTrashView={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrashPage;
