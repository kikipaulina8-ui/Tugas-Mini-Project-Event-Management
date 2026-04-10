import api from './api';
import type { Event, Review } from '../types';

export const eventService = {
  getEvents: async (params?: any): Promise<Event[]> => {
    const res = await api.get('/event/list', { params });
    return res.data?.data || res.data || [];
  },

  getEventDetail: async (id: string | number): Promise<Event> => {
    // Workaround for Daniel's backend missing the GET /event/:id endpoint 
    const res = await api.get('/event/list');
    const events = res.data?.data || res.data || [];
    const event = events.find((e: Event) => e.id.toString() === id.toString());
    if (!event) throw new Error("Event not found");
    return event;
  },

  createEvent: async (data: FormData | any) => {
    const res = await api.post('/event/create', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return res.data?.data || res.data;
  },

  updateEvent: async (id: string | number, data: any) => {
    const res = await api.put(`/event/${id}/update`, data);
    return res.data?.data || res.data;
  },

  getEventAttendees: async (id: string | number) => {
    const res = await api.get(`/event/${id}/attendees`);
    return res.data?.data || res.data || [];
  },

  getEventReviews: async (id: string | number): Promise<Review[]> => {
    const res = await api.get(`/review/event/${id}`);
    return res.data?.data || res.data || [];
  },

  createReview: async (data: any) => {
    const res = await api.post('/review', data);
    return res.data?.data || res.data;
  }
};
