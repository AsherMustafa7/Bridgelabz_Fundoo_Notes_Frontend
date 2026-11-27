const TOKEN_KEY = 'fundoo_token';
const USER_KEY = 'fundoo_user';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || '';
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  return Boolean(token && token.trim().length > 0);
};

export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed to parse user from localStorage', err);
    return null;
  }
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};
