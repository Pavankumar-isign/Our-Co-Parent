 
import { create } from 'zustand';
import { userApi } from '../services/userApi'; 
import { User } from '../types';
import { Child, CoParent } from '../types/user';

interface UserState {
  user: User | null;
  coParent: CoParent | null;
  children: Child[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCoParent: (coParent: Partial<CoParent>) => Promise<void>;
  addChildren: (children: Partial<Child>[]) => Promise<void>;
  updateChild: (childId: string, child: Partial<Child>) => Promise<void>;
  fetchUserFamily: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  coParent: null,
  children: [],
  isLoading: false,
  error: null,

  setCoParent: async (coParentData) => {
    try {
      set({ isLoading: true, error: null });
      const coParent = await userApi.setCoParent(coParentData);
      set({ coParent });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to set co-parent' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addChildren: async (childrenData) => {
    try {
      set({ isLoading: true, error: null });
      const children = await userApi.addChildren(childrenData);
      set({ children });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to add children' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateChild: async (childId, childData) => {
    try {
      set({ isLoading: true, error: null });
      const updatedChild = await userApi.updateChild(childId, childData);
      set(state => ({
        children: state.children.map(child => 
          child.id === childId ? updatedChild : child
        )
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update child' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

fetchUserFamily: async () => {
  try {
    set({ isLoading: true, error: null });
    const { coParent, children } = await userApi.getUserFamily();
    set({ coParent, children });
  } catch (error: any) {
    set({ error: error.response?.data?.message || 'Failed to fetch family data' });
  } finally {
    set({ isLoading: false });
  }
}
,
})); 