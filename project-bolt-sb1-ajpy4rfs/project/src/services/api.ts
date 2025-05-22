import axios from 'axios';
import { TimeSwapRequest } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const timeSwapApi = {
  updateRequest: async (requestId: string, data: Partial<TimeSwapRequest>) => {
    const response = await api.patch(`http://localhost:8080/api/calendar/time-swaps/${requestId}`, data);
    return response.data;
  },

  createRequest: async (request: Omit<TimeSwapRequest, 'id' | 'status' | 'createdAt'>) => {
    const response = await api.post('http://localhost:8080/api/calendar/time-swaps', request);
    return response.data;
  }
};


export const eventApi = {
  getEvents: async (start: string, end: string) => {
    const response = await api.get('http://localhost:8080/api/calendar/events', {
      params: { start, end },
    });
    return response.data;
  },

  createEvent: async (event: any) => {
    console.log(event);
    const response = await api.post('http://localhost:8080/api/calendar/events', event);
    return response.data;
  },

  updateEvent: async (eventId: string, event: any) => {
    const response = await api.put(`http://localhost:8080/api/calendar/events/${eventId}`, event);
    return response.data;
  },


  deleteEvent: async (eventId: string) => {
    await api.delete(`http://localhost:8080/api/calendar/events/${eventId}`);
  },

  checkConflicts: async (start: string, end: string, excludeEventId?: string) => {
    const response = await api.get('http://localhost:8080/api/calendar/events/conflicts', {
      params: { start, end, excludeEventId },
    });
    return response.data;
  },
};

export default api;