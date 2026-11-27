import apiClient from '../utils/apiClient';

export const createReminder = async (noteId, reminderTime) => {
  const response = await apiClient.post('/api/reminders', {
    noteId,
    reminderTime,
  });
  return response.data;
};
