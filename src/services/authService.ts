import api from './api';
import type { User } from '../types';

export const authService = {
  login: async (credentials: any): Promise<{ accessToken: string; user?: User; refreshToken?: string }> => {
    const res = await api.post('/auth/login', credentials);
    return res.data?.data || res.data;
  },
  
  register: async (data: any) => {
    const res = await api.post('/auth/register', data);
    return res.data?.data || res.data;
  },

  getProfile: async (): Promise<User> => {
    const res = await api.get('/profile/detail');
    return res.data?.data || res.data;
  }
};
