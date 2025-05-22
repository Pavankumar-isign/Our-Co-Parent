 
import { Child, CoParent } from '../types/user';
import api from './api'; 

export const userApi = {
  setCoParent: async (coParent: Partial<CoParent>) => {
    const response = await api.post('http://localhost:8080/api/users/co-parent', coParent);
    return response.data;
  },

addChildren: async (children: Partial<Child>[]) => {
  console.log(children);
  const response = await api.post('http://localhost:8080/api/users/children', children);
  return response.data;
},


  updateChild: async (childId: string, child: Partial<Child>) => {
    const response = await api.put(`http://localhost:8080/api/users/children/${childId}`, child);
    return response.data;
  },

  getUserFamily: async () => {
    const response = await api.get('http://localhost:8080/api/users/family');
    return response.data;
  }
}; 