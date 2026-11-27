import apiClient from '../utils/apiClient';

export const generateOtp = async (email) => {
  const response = await apiClient.post(
    `/api/redis/otp/generate?email=${encodeURIComponent(email)}`
  );
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await apiClient.post(
    `/api/redis/otp/verify?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`
  );
  return response.data;
};

export const saveRedisData = async (key, value) => {
  const response = await apiClient.post(
    `/api/redis/save?key=${encodeURIComponent(key)}&value=${encodeURIComponent(value)}`
  );
  return response.data;
};

export const getRedisData = async (key) => {
  const response = await apiClient.get(`/api/redis/get/${encodeURIComponent(key)}`);
  return response.data;
};

export const deleteRedisData = async (key) => {
  const response = await apiClient.delete(`/api/redis/delete/${encodeURIComponent(key)}`);
  return response.data;
};
