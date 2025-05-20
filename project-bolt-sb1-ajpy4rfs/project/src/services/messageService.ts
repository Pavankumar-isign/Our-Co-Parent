import api from './api';
import { Message, MessageThread, MessageStatus } from '../types';

export const messageApi = {
  sendMessage: async (recipientId: string, subject: string, body: string, attachments?: File[]) => {
    const formData = new FormData();
    formData.append('recipientId', recipientId);
    formData.append('subject', subject);
    formData.append('body', body);
    
    if (attachments) {
      attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }
    
    const response = await api.post('/messages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getInbox: async (page = 0, size = 20) => {
    const response = await api.get('/messages/inbox', {
      params: { page, size }
    });
    return response.data;
  },

  getSentMessages: async (page = 0, size = 20) => {
    const response = await api.get('/messages/sent', {
      params: { page, size }
    });
    return response.data;
  },

  getThreads: async (page = 0, size = 20) => {
    const response = await api.get('/messages/threads', {
      params: { page, size }
    });
    return response.data;
  },

  markAsRead: async (messageId: string) => {
    const response = await api.post(`/messages/${messageId}/read`);
    return response.data;
  },

  archiveMessage: async (messageId: string) => {
    const response = await api.post(`/messages/${messageId}/archive`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/messages/unread-count');
    return response.data;
  }
};