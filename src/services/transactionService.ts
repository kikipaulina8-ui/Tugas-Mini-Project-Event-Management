import api from './api';
import type { Order, DashboardStats } from '../types';

export const transactionService = {
  createOrder: async (data: any) => {
    const res = await api.post('/order/create', data);
    return res.data?.data || res.data;
  },

  payOrder: async (id: number | string, paymentProof: FormData | any) => {
    const res = await api.post(`/order/${id}/pay`, paymentProof, {
      headers: paymentProof instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return res.data?.data || res.data;
  },

  cancelOrder: async (id: number | string) => {
    const res = await api.post(`/order/${id}/cancel`);
    return res.data?.data || res.data;
  },

  confirmOrder: async (id: number | string) => {
    const res = await api.post(`/order/${id}/confirm`);
    return res.data?.data || res.data;
  },

  rejectOrder: async (id: number | string) => {
    const res = await api.post(`/order/${id}/reject`);
    return res.data?.data || res.data;
  },

  getOrders: async (): Promise<Order[]> => {
    const res = await api.get('/order/list');
    return res.data?.data || res.data || [];
  },
};

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await api.get('/dashboard/stats');
    return res.data?.data || res.data;
  }
};
