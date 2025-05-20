import { CalendarEvent, User, Comment, TimeSwapRequest } from '../types';
import { addDays, addHours, formatISO, subDays } from 'date-fns';

// Mock users
export const mockUsers: User[] = [
  {
    id: '0dcd212f-6a02-424f-90f9-71f09672f62f',
    name: 'Parent A',
    role: 'parent',
    color: '#2563EB'
  },
  {
    id: '0dcd212f-6a02-424f-90f9-71f09672f62f',
    name: 'Parent B',
    role: 'parent',
    color: '#10B981'
  },
  {
    id: '0dcd212f-6a02-424f-90f9-71f09672f62f',
    name: 'Dr. Johnson',
    role: 'professional',
    color: '#8B5CF6'
  }
];

// Current user (for demo purposes)
export const currentUser = mockUsers[0];

// Helper function to generate ISO date strings
const isoDate = (date: Date): string => formatISO(date);

// Mock events
export const mockEvents: CalendarEvent[] = [
  {
    id: 'event1',
    title: 'School Pickup',
    description: 'Pick up kids from school',
    start: isoDate(addHours(new Date(), 2)),
    end: isoDate(addHours(new Date(), 3)),
    allDay: false,
    eventType: 'School',
    createdBy: '0dcd212f-6a02-424f-90f9-71f09672f62f',
    sharedWith: ['0dcd212f-6a02-424f-90f9-71f09672f62f'],
    color: mockUsers[0].color,
    comments: []
  },
  {
    id: 'event2',
    title: 'Doctor Appointment',
    description: 'Annual checkup with Dr. Smith',
    start: isoDate(addDays(new Date(), 2)),
    end: isoDate(addDays(addHours(new Date(), 3), 2)),
    allDay: false,
    eventType: 'Medical',
    createdBy: '0dcd212f-6a02-424f-90f9-71f09672f62f',
    sharedWith: ['0dcd212f-6a02-424f-90f9-71f09672f62f'],
    color: mockUsers[1].color,
    comments: []
  },
  {
    id: 'event3',
    title: 'Summer Vacation',
    description: 'Two weeks at Grandparents',
    start: isoDate(addDays(new Date(), 14)),
    end: isoDate(addDays(new Date(), 28)),
    allDay: true,
    eventType: 'Vacation',
    createdBy: '0dcd212f-6a02-424f-90f9-71f09672f62f',
    sharedWith: ['0dcd212f-6a02-424f-90f9-71f09672f62f'],
    color: mockUsers[0].color,
    recurrence: {
      type: 'NONE',
      end: { type: 'never' }
    },
    comments: []
  },
  {
    id: 'event4',
    title: 'Weekend Exchange',
    description: 'Regular weekend exchange',
    start: isoDate(addDays(new Date(), 5)),
    end: isoDate(addDays(new Date(), 7)),
    allDay: true,
    eventType: 'Exchange',
    createdBy: '0dcd212f-6a02-424f-90f9-71f09672f62f',
    sharedWith: ['0dcd212f-6a02-424f-90f9-71f09672f62f'],
    color: mockUsers[1].color,
    recurrence: {
      type: 'WEEKLY',
      end: { type: 'count', count: 8 }
    },
    comments: []
  },
  {
    id: 'event5',
    title: 'Soccer Practice',
    description: 'Weekly soccer practice',
    start: isoDate(subDays(new Date(), 3)),
    end: isoDate(subDays(addHours(new Date(), 2), 3)),
    allDay: false,
    eventType: 'Other',
    createdBy: '0dcd212f-6a02-424f-90f9-71f09672f62f',
    sharedWith: [],
    color: mockUsers[0].color,
    recurrence: {
      type: 'WEEKLY',
      end: { type: 'until', until: isoDate(addDays(new Date(), 60)) }
    },
    comments: []
  }
];

// Mock comments
export const mockComments: Comment[] = [
  {
    id: 'comment1',
    eventId: 'event1',
    userId: 'user1',
    userName: 'Parent A',
    text: 'I might be 5 minutes late.',
    createdAt: isoDate(subDays(new Date(), 1))
  },
  {
    id: 'comment2',
    eventId: 'event2',
    userId: 'user2',
    userName: 'Parent B',
    text: 'Please bring the insurance card.',
    createdAt: isoDate(subDays(new Date(), 2))
  }
];

// Mock time swap requests
export const mockTimeSwapRequests: TimeSwapRequest[] = [
  {
    id: 'swap1',
    eventId: 'event1',
    requestedBy: 'user1',
    requestedTo: 'user2',
    proposedStart: isoDate(addDays(addHours(new Date(), 2), 1)),
    proposedEnd: isoDate(addDays(addHours(new Date(), 3), 1)),
    status: 'pending',
    reason: 'Work meeting conflict',
    createdAt: isoDate(subDays(new Date(), 3))
  }
];