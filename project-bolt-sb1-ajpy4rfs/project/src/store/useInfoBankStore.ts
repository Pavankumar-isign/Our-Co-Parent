import { create } from 'zustand';
import { InfoBankEntry, InfoBankSection } from '../types';
import { infoBankApi } from '../services/infoBankApi';

interface InfoBankState {
  entries: InfoBankEntry[];
  emergencyContacts: InfoBankEntry[];
  selectedEntry: InfoBankEntry | null;
  isLoading: boolean;
  error: string | null;
  isEntryModalOpen: boolean;
  
  // Actions
  fetchEntries: (section: InfoBankSection) => Promise<void>;
  fetchEmergencyContacts: () => Promise<void>;
  createEntry: (entry: Partial<InfoBankEntry>) => Promise<void>;
  updateEntry: (id: string, entry: Partial<InfoBankEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  setSelectedEntry: (entry: InfoBankEntry | null) => void;
  openEntryModal: (entry?: InfoBankEntry | null) => void;
  closeEntryModal: () => void;
}

export const useInfoBankStore = create<InfoBankState>((set, get) => ({
  entries: [],
  emergencyContacts: [],
  selectedEntry: null,
  isLoading: false,
  error: null,
  isEntryModalOpen: false,

  fetchEntries: async (section) => {
    try {
      set({ isLoading: true, error: null });
      const entries = await infoBankApi.getEntries(section);
      set({ entries });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch entries' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchEmergencyContacts: async () => {
    try {
      set({ isLoading: true, error: null });
      const contacts = await infoBankApi.getEmergencyContacts();
      set({ emergencyContacts: contacts });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch emergency contacts' });
    } finally {
      set({ isLoading: false });
    }
  },

  createEntry: async (entry) => {
    try {
      set({ isLoading: true, error: null });
      const newEntry = await infoBankApi.createEntry(entry);
      set(state => ({
        entries: [...state.entries, newEntry]
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create entry' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateEntry: async (id, entry) => {
    try {
      set({ isLoading: true, error: null });
      const updatedEntry = await infoBankApi.updateEntry(id, entry);
      set(state => ({
        entries: state.entries.map(e => e.id === id ? updatedEntry : e)
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update entry' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteEntry: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await infoBankApi.deleteEntry(id);
      set(state => ({
        entries: state.entries.filter(e => e.id !== id),
        emergencyContacts: state.emergencyContacts.filter(e => e.id !== id)
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete entry' });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedEntry: (entry) => set({ selectedEntry: entry }),
  
  openEntryModal: (entry = null) => set({ 
    isEntryModalOpen: true,
    selectedEntry: entry 
  }),
  
  closeEntryModal: () => set({ 
    isEntryModalOpen: false,
    selectedEntry: null 
  })
}));