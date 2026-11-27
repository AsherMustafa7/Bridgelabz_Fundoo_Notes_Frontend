import apiClient from '../utils/apiClient';

export const uploadExcelNotes = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/api/batch/import/notes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const runBatchProcessingJob = async () => {
  const response = await apiClient.post('/api/batch/run');
  return response.data;
};
