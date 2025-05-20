import api from './api';
import { InfoBankEntry, InfoBankSection } from '../types';

export const infoBankApi = {
  getEntries: async (section: InfoBankSection) => {
    const response = await api.get('/info-bank', {
      params: { section }
    });
    return response.data;
  },

  getEmergencyContacts: async () => {
    const response = await api.get('/info-bank/emergency-contacts');
    return response.data;
  },

  createEntry: async (entry: Partial<InfoBankEntry>) => {
    const formData = new FormData();
    formData.append('entry', JSON.stringify(entry));
    
    if (entry.files) {
      entry.files.forEach(file => {
        formData.append('files', file);
      });
    }
    
    const response = await api.post('/info-bank', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateEntry: async (id: string, entry: Partial<InfoBankEntry>) => {
    const response = await api.put(`/info-bank/${id}`, entry);
    return response.data;
  },

  deleteEntry: async (id: string) => {
    await api.delete(`/info-bank/${id}`);
  }
};