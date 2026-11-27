const STORAGE_KEY = 'fundoo_reminders';
const DISMISSED_KEY = 'fundoo_reminders_dismissed';

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

  // Reset dismissed status when a new reminder is scheduled
  const dismissed = getDismissedReminders();
  delete dismissed[noteId];
  localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));

  // Request browser permission proactively
  requestNotificationPermission();
};

export const removeReminder = (noteId) => {
  const current = getReminders();
  delete current[noteId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));

  const dismissed = getDismissedReminders();
  delete dismissed[noteId];
  localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));
};

export const getDismissedReminders = () => {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const dismissReminderAlert = (noteId) => {
  const dismissed = getDismissedReminders();
  dismissed[noteId] = true;
  localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));
};

export const requestNotificationPermission = async () => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'default') {
      try {
        const result = await Notification.requestPermission();
        return result;
      } catch (err) {
        console.error('Error requesting notification permission', err);
      }
    }
    return Notification.permission;
  }
  return 'unsupported';
};

export const triggerDesktopNotification = (title, body) => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.svg',
          requireInteraction: true,
        });
      } catch (err) {
        console.error('Desktop notification failed', err);
      }
    }
  }
};

// Play reliable pleasant dual-tone chime
export const playReminderChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // Resume context if suspended
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Note 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Note 2: B5 (987.77 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.18);
    gain2.gain.setValueAtTime(0.25, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.65);
  } catch (e) {
    console.warn('Audio playback not allowed without user interaction', e);
  }
};
