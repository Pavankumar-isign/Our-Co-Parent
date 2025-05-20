import api from './api';
import { Expense, ExpenseCategory, Payment, ExpenseReport } from '../types';

export const expenseApi = {
  getExpenses: async () => {
    const response = await api.get('/expenses');
    return response.data;
  },

  createExpense: async (expense: Partial<Expense>) => {
    const response = await api.post('/expenses', expense);
    return response.data;
  },

  updateExpense: async (id: string, expense: Partial<Expense>) => {
    const response = await api.put(`/expenses/${id}`, expense);
    return response.data;
  },

  deleteExpense: async (id: string) => {
    await api.delete(`/expenses/${id}`);
  },

  approveExpense: async (id: string) => {
    const response = await api.post(`/expenses/${id}/approve`);
    return response.data;
  },

  rejectExpense: async (id: string) => {
    const response = await api.post(`/expenses/${id}/reject`);
    return response.data;
  },

  recordPayment: async (payment: Partial<Payment>) => {
    const response = await api.post(`/expenses/${payment.expenseId}/payments`, payment);
    return response.data;
  },

  getExpenseReport: async () => {
    const response = await api.get('/expenses/reports');
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/expenses/categories');
    return response.data;
  },

  createCategory: async (category: Partial<ExpenseCategory>) => {
    const response = await api.post('/expenses/categories', category);
    return response.data;
  }
};