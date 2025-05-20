 
import { create } from 'zustand'; 
import { ConnectedAccount, NotificationPreferences, PersonalizationSettings, Profile, SecuritySettings, Subscription } from '../types/account';
import { accountApi } from '../services/accountApi';

interface AccountState {
  profile: Profile | null;
  securitySettings: SecuritySettings | null;
  notificationPreferences: NotificationPreferences | null;
  connectedAccounts: ConnectedAccount[];
  subscription: Subscription | null;
  personalizationSettings: PersonalizationSettings | null;
  isLoading: boolean;
  error: string | null;

  // Profile actions
  fetchProfile: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  
  // Security actions
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  enable2FA: () => Promise<void>;
  
  // Notification actions
  updateNotificationPreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
  
  // Connected accounts actions
  fetchConnectedAccounts: () => Promise<void>;
  addConnectedAccount: (account: Partial<ConnectedAccount>) => Promise<void>;
  removeConnectedAccount: (accountId: string) => Promise<void>;
  
  // Subscription actions
  fetchSubscription: () => Promise<void>;
  updateSubscription: (plan: string) => Promise<void>;
  
  // Personalization actions
  updatePersonalizationSettings: (settings: Partial<PersonalizationSettings>) => Promise<void>;
}

export const useAccountStore = create<AccountState>((set, get) => ({
  profile: null,
  securitySettings: null,
  notificationPreferences: null,
  connectedAccounts: [],
  subscription: null,
  personalizationSettings: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const profile = await accountApi.getProfile();
      set({ profile });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch profile' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (profileData) => {
    try {
      set({ isLoading: true, error: null });
      const updatedProfile = await accountApi.updateProfile(profileData);
      set({ profile: updatedProfile });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePassword: async (currentPassword, newPassword) => {
    try {
      set({ isLoading: true, error: null });
      await accountApi.updatePassword(currentPassword, newPassword);
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update password' });
    } finally {
      set({ isLoading: false });
    }
  },

  enable2FA: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await accountApi.enable2FA();
      // Handle 2FA setup response (e.g., show QR code)
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to enable 2FA' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateNotificationPreferences: async (preferences) => {
    try {
      set({ isLoading: true, error: null });
      const updatedPreferences = await accountApi.updateNotificationPreferences(preferences);
      set({ notificationPreferences: updatedPreferences });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update notification preferences' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchConnectedAccounts: async () => {
    try {
      set({ isLoading: true, error: null });
      const accounts = await accountApi.getConnectedAccounts();
      set({ connectedAccounts: accounts });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch connected accounts' });
    } finally {
      set({ isLoading: false });
    }
  },

  addConnectedAccount: async (account) => {
    try {
      set({ isLoading: true, error: null });
      const newAccount = await accountApi.addConnectedAccount(account);
      set(state => ({
        connectedAccounts: [...state.connectedAccounts, newAccount]
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to add connected account' });
    } finally {
      set({ isLoading: false });
    }
  },

  removeConnectedAccount: async (accountId) => {
    try {
      set({ isLoading: true, error: null });
      await accountApi.removeConnectedAccount(accountId);
      set(state => ({
        connectedAccounts: state.connectedAccounts.filter(a => a.id !== accountId)
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to remove connected account' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSubscription: async () => {
    try {
      set({ isLoading: true, error: null });
      const subscription = await accountApi.getSubscription();
      set({ subscription });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch subscription' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSubscription: async (plan) => {
    try {
      set({ isLoading: true, error: null });
      const updatedSubscription = await accountApi.updateSubscription(plan);
      set({ subscription: updatedSubscription });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update subscription' });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePersonalizationSettings: async (settings) => {
    try {
      set({ isLoading: true, error: null });
      const updatedSettings = await accountApi.updatePersonalizationSettings(settings);
      set({ personalizationSettings: updatedSettings });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update personalization settings' });
    } finally {
      set({ isLoading: false });
    }
  }
}));
 