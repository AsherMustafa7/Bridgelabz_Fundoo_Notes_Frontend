import apiClient from '../utils/apiClient';

export const getAllNotes = async () => {
  const response = await apiClient.get('/api/notes');
  return response.data;
};

export const createNote = async (noteData) => {
  const response = await apiClient.post('/api/notes', noteData);
  return response.data;
};

export const togglePin = async (noteId) => {
  const response = await apiClient.patch(`/api/notes/${noteId}/pin`);
  return response.data;
};

export const toggleArchive = async (noteId) => {
  const response = await apiClient.patch(`/api/notes/${noteId}/archive`);
  return response.data;
};

export const toggleTrash = async (noteId) => {
  const response = await apiClient.patch(`/api/notes/${noteId}/trash`);
  return response.data;
};
