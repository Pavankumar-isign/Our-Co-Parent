import { UserRole } from ".";

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  language: string;
  role: UserRole;
}

export interface SecuritySettings {
  username: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
  securityQuestions: {
    question: string;
    answer: string;
  }[];
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  types: {
    messages: boolean;
    calendar: boolean;
    expenses: boolean;
    documents: boolean;
  };
}

export interface ConnectedAccount {
  id: string;
  name: string;
  email: string;
  role: 'CHILD' | 'THIRD_PARTY' | 'PROFESSIONAL';
  relationship: string;
  permissions: {
    calendar: boolean;
    expenses: boolean;
    messages: boolean;
    documents: boolean;
  };
}

export interface Subscription {
  plan: string;
  status: 'ACTIVE' | 'INACTIVE';
  renewalDate: string;
  paymentMethod: {
    type: string;
    last4: string;
    expiryDate: string;
  };
}

export interface PersonalizationSettings {
  colorPreferences: {
    primary: string;
    calendar: string;
    messages: string;
  };
  dashboardLayout: {
    widgets: string[];
    order: string[];
  };
}
