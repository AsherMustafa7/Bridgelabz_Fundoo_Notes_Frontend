import React, { useState, useRef, useEffect } from 'react';

export const NoteEditor = ({ onAddNote }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editorRef.current && !editorRef.current.contains(event.target)) {
        if (title.trim() || description.trim()) {
          handleSave();
        } else {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [title, description, isPinned]);

  const handleSave = async () => {
    if (!title.trim() && !description.trim()) {
      setIsExpanded(false);
      return;
    }

    const noteTitle = title.trim() || 'Untitled';
    setIsSubmitting(true);
    try {
      await onAddNote({
        title: noteTitle,
        description: description.trim(),
        pinned: isPinned,
      });
      setTitle('');
      setDescription('');
      setIsPinned(false);
      setIsExpanded(false);
    } catch (err) {
      console.error('Failed to create note', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="note-editor-wrapper" ref={editorRef}>
      {!isExpanded ? (
        <div
          className="note-editor-collapsed"
          onClick={() => setIsExpanded(true)}
        >
          <span className="placeholder-text">Take a note...</span>
        </div>
      ) : (
        <div className="note-editor-expanded">
          <div className="note-editor-header">
            <input
              type="text"
              className="note-input-title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              disabled={isSubmitting}
            />
            <button
              type="button"
              className={`btn-icon btn-editor-pin ${isPinned ? 'is-active-pin' : ''}`}
              onClick={() => setIsPinned(!isPinned)}
              title={isPinned ? 'Unpin note' : 'Pin note'}
              aria-label="Pin note"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" />
              </svg>
            </button>
          </div>

          <textarea
            className="note-input-description"
            placeholder="Take a note..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />

          <div className="note-editor-footer">
            <button
              type="button"
              className="btn-editor-close"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteEditor;
