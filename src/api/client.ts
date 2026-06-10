import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const client = axios.create({ baseURL: import.meta.env.VITE_API_URL });

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
