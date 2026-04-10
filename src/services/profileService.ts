import api from './api';

export const profileService = {
  updateProfile: async (data: any) => {
    const res = await api.patch('/profile/update', data);
    return res.data?.data || res.data;
  },

  updatePicture: async (data: FormData) => {
    const res = await api.patch('/profile/update-picture', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data || res.data;
  }
};
