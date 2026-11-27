import React from 'react';

export const NoteCard = ({
  note,
  onTogglePin,
  onToggleArchive,
  onToggleTrash,
  onOpenReminder,
  isTrashView = false,
}) => {
  return (
    <div className={`note-card ${note.pinned ? 'note-pinned' : ''}`}>
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title || 'Untitled'}</h3>
        {!isTrashView && (
          <button
            type="button"
            className={`btn-card-action btn-pin ${note.pinned ? 'pin-active' : ''}`}
            onClick={() => onTogglePin(note.id)}
            title={note.pinned ? 'Unpin note' : 'Pin note'}
            aria-label="Toggle pin"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" />
            </svg>
          </button>
        )}
      </div>

      <div className="note-card-content">
        <p className="note-card-description">{note.description}</p>
      </div>

      <div className="note-card-footer">
        {!isTrashView ? (
          <>
            {onOpenReminder && (
              <button
                type="button"
                className="btn-card-action"
                onClick={() => onOpenReminder(note)}
                title="Remind me"
                aria-label="Set reminder"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
              </button>
            )}

            <button
              type="button"
              className={`btn-card-action ${note.archived ? 'action-active' : ''}`}
              onClick={() => onToggleArchive(note.id)}
              title={note.archived ? 'Unarchive' : 'Archive'}
              aria-label="Toggle archive"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z" />
              </svg>
            </button>

            <button
              type="button"
              className="btn-card-action"
              onClick={() => onToggleTrash(note.id)}
              title="Delete"
              aria-label="Delete note"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z" />
              </svg>
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn-card-action"
            onClick={() => onToggleTrash(note.id)}
            title="Restore"
            aria-label="Restore note"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
            </svg>
            <span style={{ fontSize: '12px', marginLeft: '4px' }}>Restore</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
