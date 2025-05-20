 
import { ConnectedAccount, NotificationPreferences, PersonalizationSettings, Profile } from '../types/account';
import api from './api'; 

export const accountApi = {
  getProfile: async () => {
    const response = await api.get('/account/profile');
    return response.data;
  },

  updateProfile: async (profile: Partial<Profile>) => {
    const response = await api.put('/account/profile', profile);
    return response.data;
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/account/security/password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  enable2FA: async () => {
    const response = await api.post('/account/security/2fa/enable');
    return response.data;
  },

  updateNotificationPreferences: async (preferences: Partial<NotificationPreferences>) => {
    const response = await api.put('/account/notifications', preferences);
    return response.data;
  },

  getConnectedAccounts: async () => {
    const response = await api.get('/account/users');
    return response.data;
  },

  addConnectedAccount: async (account: Partial<ConnectedAccount>) => {
    const response = await api.post('/account/users', account);
    return response.data;
  },

  removeConnectedAccount: async (accountId: string) => {
    await api.delete(`/account/users/${accountId}`);
  },

  getSubscription: async () => {
    const response = await api.get('/account/subscription');
    return response.data;
  },

  updateSubscription: async (plan: string) => {
    const response = await api.put('/account/subscription', { plan });
    return response.data;
  },

  updatePersonalizationSettings: async (settings: Partial<PersonalizationSettings>) => {
    const response = await api.put('/account/personalization', settings);
    return response.data;
  }
}; 