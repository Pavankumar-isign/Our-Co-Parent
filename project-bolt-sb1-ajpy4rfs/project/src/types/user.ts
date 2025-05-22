 export interface CoParent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  relationship: string;
}

export interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'PARENT' | 'PROFESSIONAL';
  coParent?: CoParent;
  children?: Child[];
} 