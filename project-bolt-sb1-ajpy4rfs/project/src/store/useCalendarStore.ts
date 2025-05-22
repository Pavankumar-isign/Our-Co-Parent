  import { create } from 'zustand';
  import { CalendarEvent, TimeSwapRequest, Comment } from '../types';
  import { eventApi } from '../services/api';
  import { useUserStore } from './useUserStore';

  interface CalendarState {
    // Current view state
    view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
    date: Date;
    
    // Data
    events: CalendarEvent[];
    timeSwapRequests: TimeSwapRequest[];
    comments: Comment[];
    
    // Modal state
// Modal state
isEventModalOpen: boolean;
isTimeSwapModalOpen: boolean;
selectedEvent: CalendarEvent | null;
selectedTimeSwapRequest: TimeSwapRequest | null;

// Modal actions
setSelectedTimeSwapRequest: (request: TimeSwapRequest | null) => void;



    
    // Filtering
    filters: {
      eventTypes: string[];
      users: string[];
    };
    
    // Actions
    setView: (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') => void;
    setDate: (date: Date) => void;
    
    // Event CRUD
    addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<string>;
    updateEvent: (id: string, event: Partial<CalendarEvent>) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
    setSelectedEvent: (event: CalendarEvent | null) => void;
    fetchEvents: (start: Date, end: Date) => Promise<void>;
    
    // Modal controls
    openEventModal: (event?: CalendarEvent) => void;
    closeEventModal: () => void;
    openTimeSwapModal: (request?: TimeSwapRequest) => void;
    closeTimeSwapModal: () => void;
    
    // Time swap requests
    createTimeSwapRequest: (request: Omit<TimeSwapRequest, 'id' | 'status' | 'createdAt'>) => string;
    updateTimeSwapRequest: (id: string, update: Partial<TimeSwapRequest>) => void;
    
    // Comments
    addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => string;
    
    // Filters
    setFilters: (filters: Partial<CalendarState['filters']>) => void;
    
    // Helper
    checkConflicts: (start: Date, end: Date, excludeEventId?: string) => Promise<CalendarEvent[]>;

    // Validation helpers
    canCreateEvent: () => boolean;
    canEditEvent: (event: CalendarEvent) => boolean;
  }

  export const useCalendarStore = create<CalendarState>((set, get) => ({
    // Initial state
  // Initial state
  view: 'dayGridMonth',
  date: new Date(),
  events: [],
  timeSwapRequests: [],
  comments: [],
  isEventModalOpen: false,
  isTimeSwapModalOpen: false,
  selectedEvent: null,
  filters: {
    eventTypes: [],
    users: [],
  },

selectedTimeSwapRequest: null,
setSelectedTimeSwapRequest: (request) => set({ selectedTimeSwapRequest: request }),




    // View actions
    setView: (view) => set({ view }),
    setDate: (date) => set({ date }),
    
    fetchEvents: async (start: Date, end: Date) => {
      try {
        const events = await eventApi.getEvents(start.toISOString(), end.toISOString());
        set({ events });
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    },

    addEvent: async (eventData) => {
      try {
        const newEvent = await eventApi.createEvent(eventData);
        set((state) => ({
          events: [...state.events, newEvent]
        }));
        return newEvent.id;
      } catch (error) {
        console.error('Failed to create event:', error);
        throw error;
      }
    },

    updateEvent: async (id, updates) => {
      try {
        const updatedEvent = await eventApi.updateEvent(id, updates);
        set((state) => ({
          events: state.events.map(event => 
            event.id === id ? { ...event, ...updatedEvent } : event
          )
        }));
      } catch (error) {
        console.error('Failed to update event:', error);
        throw error;
      }
    },

    deleteEvent: async (id) => {
      try {
        await eventApi.deleteEvent(id);
        set((state) => ({
          events: state.events.filter(event => event.id !== id)
        }));
      } catch (error) {
        console.error('Failed to delete event:', error);
        throw error;
      }
    },
    
    setSelectedEvent: (event) => set({ selectedEvent: event }),
    
    // Modal controls
    openEventModal: (event = null) => set({ 
      isEventModalOpen: true,
      selectedEvent: event
    }),
    
    closeEventModal: () => set({ 
      isEventModalOpen: false,
      selectedEvent: null
    }),
    
    openTimeSwapModal: (request = null) => set({ 
      isTimeSwapModalOpen: true,
      selectedTimeSwapRequest: request
    }),
    
    closeTimeSwapModal: () => set({ 
      isTimeSwapModalOpen: false,
      selectedTimeSwapRequest: null
    }),
    
    // Time swap requests
    createTimeSwapRequest: (requestData) => {
      const id = `swap${Date.now()}`;
      const newRequest: TimeSwapRequest = {
        ...requestData,
        id,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      set((state) => ({
        timeSwapRequests: [...state.timeSwapRequests, newRequest]
      }));
      
      return id;
    },
    
    updateTimeSwapRequest: (id, updates) => {
      set((state) => ({
        timeSwapRequests: state.timeSwapRequests.map(request => 
          request.id === id ? { ...request, ...updates } : request
        )
      }));
    },
    
    // Comments
    addComment: (commentData) => {
      const id = `comment${Date.now()}`;
      const newComment: Comment = {
        ...commentData,
        id,
        createdAt: new Date().toISOString(),
      };
      
      set((state) => ({
        comments: [...state.comments, newComment]
      }));
      
      return id;
    },
    
    // Filters
    setFilters: (filters) => set((state) => ({
      filters: { ...state.filters, ...filters }
    })),
    
    // Helper functions
    checkConflicts: async (start: Date, end: Date, excludeEventId?: string) => {
      try {
        return await eventApi.checkConflicts(
          start.toISOString(),
          end.toISOString(),
          excludeEventId
        );
      } catch (error) {
        console.error('Failed to check conflicts:', error);
        return [];
      }
    },

    canCreateEvent: () => {
      const { coParent, children } = useUserStore.getState();
      return !!(coParent && children.length > 0);
    },
    
    canEditEvent: (event: CalendarEvent) => {
      const eventDate = new Date(event.start);
      const now = new Date();
      return eventDate >= now;
    }
  }));