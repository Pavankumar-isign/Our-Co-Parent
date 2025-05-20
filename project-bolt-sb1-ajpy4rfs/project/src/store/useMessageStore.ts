import { create } from 'zustand';
import { Message, MessageThread } from '../types';
import { messageApi } from '../services/messageService';

interface MessageState {
  messages: Message[];
  threads: MessageThread[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  sendMessage: (recipientId: string, subject: string, body: string, attachments?: File[]) => Promise<void>;
  fetchInbox: (page?: number) => Promise<void>;
  fetchSentMessages: (page?: number) => Promise<void>;
  fetchThreads: (page?: number) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  archiveMessage: (messageId: string) => Promise<void>;
  updateUnreadCount: () => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  threads: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  sendMessage: async (recipientId, subject, body, attachments) => {
    try {
      set({ isLoading: true, error: null });
      await messageApi.sendMessage(recipientId, subject, body, attachments);
      await get().fetchInbox();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to send message' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchInbox: async (page = 0) => {
    try {
      set({ isLoading: true, error: null });
      const response = await messageApi.getInbox(page);
      set({ messages: response.content });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch inbox' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSentMessages: async (page = 0) => {
    try {
      set({ isLoading: true, error: null });
      const response = await messageApi.getSentMessages(page);
      set({ messages: response.content });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch sent messages' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchThreads: async (page = 0) => {
    try {
      set({ isLoading: true, error: null });
      const response = await messageApi.getThreads(page);
      set({ threads: response.content });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch threads' });
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (messageId) => {
    try {
      await messageApi.markAsRead(messageId);
      await get().updateUnreadCount();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to mark message as read' });
    }
  },

  archiveMessage: async (messageId) => {
    try {
      await messageApi.archiveMessage(messageId);
      await get().fetchInbox();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to archive message' });
    }
  },

  updateUnreadCount: async () => {
    try {
      const count = await messageApi.getUnreadCount();
      set({ unreadCount: count });
    } catch (error: any) {
      console.error('Failed to update unread count:', error);
    }
  }
}));