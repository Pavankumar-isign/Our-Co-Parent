export type UserRole = 'parent' | 'professional';

export type User = {
  id: string;
  name: string;
  role: UserRole;
  color: string;
};

export type EventType = 'VACATION' | 'MEDICAL' | 'SCHOOL_EVENT' | 'EXCHANGE' | 'OTHER';

export type RecurrenceType = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type RecurrenceEnd = {
  type: 'never' | 'until' | 'count';
  until?: string; // ISO date string
  count?: number;
};

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO date string
  end: string; // ISO date string
  allDay: boolean;
  eventType: EventType;
  createdBy: string; // user ID
  sharedWith: string[]; // array of user IDs
  color?: string;
  recurrence?: {
    type: RecurrenceType;
    end: RecurrenceEnd;
  };
  attachments?: string[]; // array of file URLs
  comments?: Comment[];
   viewOnly?: boolean;
}

export interface Comment {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string; // ISO date string
}

export interface TimeSwapRequest {
  id: string;
  eventId: string;
  requestedBy: string; // user ID
  requestedTo: string; // user ID
  proposedStart: string; // ISO date string
  proposedEnd: string; // ISO date string
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  response?: string;
  createdAt: string; // ISO date string
}

export interface AuditLogEntry {
  id: string;
  entityType: 'event' | 'timeSwapRequest';
  entityId: string;
  action: 'create' | 'update' | 'delete';
  userId: string;
  userName: string;
  timestamp: string; // ISO date string
  details?: Record<string, any>;
}

export interface Message {
  id: string;
  subject: string;
  body: string;
  sender: User;
  thread: MessageThread;
  sentAt: string;
  readAt?: string;
  status: MessageStatus;
  attachments?: MessageAttachment[];
}

export interface MessageThread {
  id: string;
  subject: string;
  participants: User[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export type MessageStatus = 'DRAFT' | 'SENT' | 'ARCHIVED';

export type ExpenseCategory = 'MEDICAL' | 'DENTAL' | 'EDUCATION' | 'ACTIVITIES' | 'CLOTHING' | 'OTHER';

export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  purchaseDate: string;
  description?: string;
  receiptUrl?: string;
  status: ExpenseStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  children: string[];
  isPrivate: boolean;
  splitRatio: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  splitRatio: number;
  isCustom: boolean;
}

export interface Payment {
  id: string;
  expenseId: string;
  amount: number;
  method: 'CASH' | 'CHECK' | 'BANK_TRANSFER' | 'OTHER';
  paidBy: string;
  paidAt: string;
  notes?: string;
  confirmed: boolean;
}

export interface ExpenseReport {
  totalExpenses: number;
  categoryBreakdown: {
    category: string;
    amount: number;
    count: number;
  }[];
  monthlyTotals: {
    month: string;
    amount: number;
  }[];
  pendingReimbursements: number;
}