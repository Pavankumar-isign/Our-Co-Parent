import { create } from 'zustand';
import { Expense, ExpenseCategory, Payment, ExpenseReport } from '../types';
import { expenseApi } from '../services/expenseApi';

interface ExpenseState {
  expenses: Expense[];
  categories: ExpenseCategory[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchExpenses: () => Promise<void>;
  createExpense: (expense: Partial<Expense>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  approveExpense: (id: string) => Promise<void>;
  rejectExpense: (id: string) => Promise<void>;
  recordPayment: (payment: Partial<Payment>) => Promise<void>;
  getExpenseReport: () => Promise<ExpenseReport>;
  fetchCategories: () => Promise<void>;
  createCategory: (category: Partial<ExpenseCategory>) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchExpenses: async () => {
    try {
      set({ isLoading: true, error: null });
      const expenses = await expenseApi.getExpenses();
      set({ expenses });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch expenses' });
    } finally {
      set({ isLoading: false });
    }
  },

  createExpense: async (expense) => {
    try {
      set({ isLoading: true, error: null });
      const newExpense = await expenseApi.createExpense(expense);
      set(state => ({
        expenses: [...state.expenses, newExpense]
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create expense' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateExpense: async (id, expense) => {
    try {
      set({ isLoading: true, error: null });
      const updatedExpense = await expenseApi.updateExpense(id, expense);
      set(state => ({
        expenses: state.expenses.map(e => e.id === id ? updatedExpense : e)
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update expense' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteExpense: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await expenseApi.deleteExpense(id);
      set(state => ({
        expenses: state.expenses.filter(e => e.id !== id)
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete expense' });
    } finally {
      set({ isLoading: false });
    }
  },

  approveExpense: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const updatedExpense = await expenseApi.approveExpense(id);
      set(state => ({
        expenses: state.expenses.map(e => e.id === id ? updatedExpense : e)
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to approve expense' });
    } finally {
      set({ isLoading: false });
    }
  },

  rejectExpense: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const updatedExpense = await expenseApi.rejectExpense(id);
      set(state => ({
        expenses: state.expenses.map(e => e.id === id ? updatedExpense : e)
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to reject expense' });
    } finally {
      set({ isLoading: false });
    }
  },

  recordPayment: async (payment) => {
    try {
      set({ isLoading: true, error: null });
      await expenseApi.recordPayment(payment);
      await get().fetchExpenses();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to record payment' });
    } finally {
      set({ isLoading: false });
    }
  },

  getExpenseReport: async () => {
    try {
      set({ isLoading: true, error: null });
      return await expenseApi.getExpenseReport();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to get expense report' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const categories = await expenseApi.getCategories();
      set({ categories });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch categories' });
    } finally {
      set({ isLoading: false });
    }
  },

  createCategory: async (category) => {
    try {
      set({ isLoading: true, error: null });
      const newCategory = await expenseApi.createCategory(category);
      set(state => ({
        categories: [...state.categories, newCategory]
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create category' });
    } finally {
      set({ isLoading: false });
    }
  }
}));