import apiClient from '../utils/apiClient';
import { setToken, removeToken, setUser } from '../utils/token';

export const registerUser = async (userData) => {
  const response = await apiClient.post('/api/users/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/api/users/login', credentials);
  const data = response.data;
  if (data && data.token) {
    setToken(data.token);
    setUser({ email: credentials.email });
  }
  return data;
};

export const logoutUser = () => {
  removeToken();
};
