import api from './api';

export const sendVerificationCode = async (email: string) => {
  const response = await api.post('/send-verification', { email });
  return response.data;
};

export const register = async (email: string, password: string, token: string) => {
  const response = await api.post('/register', { email, password, token });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/user/me');
  return response.data;
};
