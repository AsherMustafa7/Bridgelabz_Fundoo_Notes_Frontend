const STORAGE_KEY = 'fundoo_reminders';
const ALERTED_KEY = 'fundoo_reminders_alerted';

export const getReminders = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const saveReminder = (noteId, reminderTime, noteTitle) => {
  const current = getReminders();
  current[noteId] = {
    noteId,
    reminderTime,
    noteTitle: noteTitle || 'Untitled Note',
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));

  // Request browser desktop notification permission if supported
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
};

export const removeReminder = (noteId) => {
  const current = getReminders();
  delete current[noteId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

export const getAlertedReminders = () => {
  try {
    const raw = localStorage.getItem(ALERTED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const markReminderAlerted = (noteId) => {
  const alerted = getAlertedReminders();
  alerted[noteId] = true;
  localStorage.setItem(ALERTED_KEY, JSON.stringify(alerted));
};

// Play gentle web audio chime
export const playReminderChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {
    // Audio context may require user gesture
  }
};
