const STORAGE_KEY = 'fundoo_reminders';
const DISMISSED_KEY = 'fundoo_reminders_dismissed';

let globalAudioCtx = null;

// Initialize and unlock audio context permanently for this browser tab
export const initAudioContext = () => {
  if (typeof window === 'undefined') return null;
  try {
    if (!globalAudioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        globalAudioCtx = new AudioCtx();
      }
    }
    if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
      globalAudioCtx.resume().catch(() => {});
    }
  } catch (e) {
    // Ignore audio init errors
  }
  return globalAudioCtx;
};

// Automatically listen for first click/tap to unlock browser audio policy
if (typeof window !== 'undefined') {
  const unlockAudioHandler = () => {
    initAudioContext();
  };
  ['click', 'touchstart', 'keydown'].forEach((eventName) => {
    window.addEventListener(eventName, unlockAudioHandler, { capture: true, passive: true });
  });
}

export const getReminders = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const saveReminder = (noteId, reminderTime, noteTitle) => {
  initAudioContext(); // Ensure audio is unlocked during the click
  const current = getReminders();
  current[noteId] = {
    noteId,
    reminderTime,
    noteTitle: noteTitle || 'Untitled Note',
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));

  // Reset dismissed status for this note
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

// Play an unmistakable 3-tone notification chime
export const playReminderChime = () => {
  const ctx = initAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const playTone = (freq, startTime, duration, type = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Chime Triad: C5 (523Hz), E5 (659Hz), G5 (784Hz)
    playTone(523.25, now, 0.25, 'triangle');
    playTone(659.25, now + 0.12, 0.25, 'sine');
    playTone(783.99, now + 0.24, 0.5, 'sine');
  } catch (e) {
    console.warn('Audio playback error', e);
  }
};

// Compute human countdown
export const getCountdownInfo = (reminderTime) => {
  const target = new Date(reminderTime).getTime();
  const now = Date.now();
  const diffSec = Math.floor((target - now) / 1000);

  if (diffSec <= 0) {
    return { isDue: true, text: 'DUE NOW' };
  }
  if (diffSec < 60) {
    return { isDue: false, text: `in ${diffSec}s` };
  }
  if (diffSec < 3600) {
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    return { isDue: false, text: `in ${mins}m ${secs}s` };
  }
  return {
    isDue: false,
    text: new Date(reminderTime).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};
