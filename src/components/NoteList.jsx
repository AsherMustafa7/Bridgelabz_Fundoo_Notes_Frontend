import React from 'react';
import NoteCard from './NoteCard';

export const NoteList = ({
  pinnedNotes = [],
  otherNotes = [],
  onTogglePin,
  onToggleArchive,
  onToggleTrash,
  onOpenReminder,
  emptyMessage = 'No notes available',
}) => {
  const hasNotes = pinnedNotes.length > 0 || otherNotes.length > 0;

  if (!hasNotes) {
    return (
      <div className="notes-empty-state">
        <svg viewBox="0 0 24 24" width="80" height="80" fill="#e0e0e0">
          <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
        </svg>
        <p className="empty-message-text">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="notes-display-container">
      {pinnedNotes.length > 0 && (
        <section className="notes-section">
          <h4 className="notes-section-title">PINNED</h4>
          <div className="notes-grid">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onTogglePin={onTogglePin}
                onToggleArchive={onToggleArchive}
                onToggleTrash={onToggleTrash}
                onOpenReminder={onOpenReminder}
              />
            ))}
          </div>
        </section>
      )}

      {otherNotes.length > 0 && (
        <section className="notes-section">
          {pinnedNotes.length > 0 && (
            <h4 className="notes-section-title">OTHERS</h4>
          )}
          <div className="notes-grid">
            {otherNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onTogglePin={onTogglePin}
                onToggleArchive={onToggleArchive}
                onToggleTrash={onToggleTrash}
                onOpenReminder={onOpenReminder}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default NoteList;
