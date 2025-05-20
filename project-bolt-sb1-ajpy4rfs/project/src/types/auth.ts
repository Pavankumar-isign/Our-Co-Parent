export interface User {
  id: string;
  name: string;
  email: string;
  role: 'PARENT' | 'PROFESSIONAL';
  phone?: string;
  address?: string;
  profession?: string;
  licenseNumber?: string;
  isVerified: boolean;
  color: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'PARENT' | 'PROFESSIONAL';
  phone?: string;
  address?: string;
  profession?: string;
  licenseNumber?: string;
  coParentEmail?: string;
  inviteCode?: string;
}