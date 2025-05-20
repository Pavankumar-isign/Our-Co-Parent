import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Calendar, Clock, Repeat, Users, AlertTriangle } from 'lucide-react';
import { useCalendarStore } from '../../store/useCalendarStore';
import { mockUsers, currentUser } from '../../mocks/data';
import { CalendarEvent, EventType, RecurrenceType } from '../../types';
import { format, parseISO, isAfter } from 'date-fns';

// Form validation schema
const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  start: z.string(),
  end: z.string(),
  allDay: z.boolean(),
  eventType: z.enum(['VACATION', 'MEDICAL', 'SCHOOL_EVENT', 'EXCHANGE', 'OTHER'] as const),
  sharedWith: z.array(z.string()),
  recurrenceType: z.enum(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY'] as const),
  recurrenceEndType: z.enum(['never', 'until', 'count'] as const),
  recurrenceUntil: z.string().optional(),
  recurrenceCount: z.number().optional()
}).refine(data => {
  // Validate end date is after start date
  return isAfter(parseISO(data.end), parseISO(data.start));
}, {
  message: 'End time must be after start time',
  path: ['end']
});

type EventFormData = z.infer<typeof eventSchema>;

export default function EventModal() {
  const { 
    selectedEvent,
    closeEventModal,
    addEvent,
    updateEvent,
    deleteEvent,
    checkConflicts
  } = useCalendarStore();
  
  const [conflicts, setConflicts] = useState<CalendarEvent[]>([]);
  const [showConflicts, setShowConflicts] = useState(false);
  const isPastEvent = new Date(selectedEvent?.start || '') < new Date();
  
  const isEditMode = selectedEvent && selectedEvent.id;
  
  // Set up form with default values
  const { control, handleSubmit, watch, formState: { errors }, setValue, reset } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: selectedEvent?.title || '',
      description: selectedEvent?.description || '',
      start: selectedEvent?.start || new Date().toISOString(),
      end: selectedEvent?.end || new Date().toISOString(),
      allDay: selectedEvent?.allDay || false,
      eventType: (selectedEvent?.eventType as EventType) || 'OTHER',
      sharedWith: selectedEvent?.sharedWith || [],
      recurrenceType: selectedEvent?.recurrence?.type || 'NONE',
      recurrenceEndType: selectedEvent?.recurrence?.end.type || 'never',
      recurrenceUntil: selectedEvent?.recurrence?.end.type === 'until' 
        ? selectedEvent.recurrence.end.until 
        : undefined,
      recurrenceCount: selectedEvent?.recurrence?.end.type === 'count'
        ? selectedEvent.recurrence.end.count
        : undefined
    }
  });
  
  // Watch form values to check for conflicts
  const startDate = watch('start');
  const endDate = watch('end');
  
  // Check for conflicts when dates change
  useEffect(() => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    // Only check if we have valid dates
    if (isAfter(end, start)) {
      const conflictEvents = checkConflicts(start, end, isEditMode ? selectedEvent?.id : undefined);
      setConflicts(conflictEvents);
      setShowConflicts(conflictEvents.length > 0);
    }
  }, [startDate, endDate, isEditMode, selectedEvent, checkConflicts]);
  
  // Handle form submission
  const onSubmit = (data: EventFormData) => {
    const eventData: Omit<CalendarEvent, 'id'> = {
      title: data.title,
      description: data.description,
      start: data.start,
      end: data.end,
      allDay: data.allDay,
      eventType: data.eventType,
      createdBy: selectedEvent?.createdBy || currentUser.id,
      sharedWith: data.sharedWith,
      color: selectedEvent?.color || currentUser.color,
      recurrence: data.recurrenceType !== 'NONE' ? {
        type: data.recurrenceType,
        end: {
          type: data.recurrenceEndType,
          until: data.recurrenceEndType === 'until' ? data.recurrenceUntil : undefined,
          count: data.recurrenceEndType === 'count' ? data.recurrenceCount : undefined
        }
      } : undefined
    };
    
    if (isEditMode && selectedEvent) {
      updateEvent(selectedEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    
    closeEventModal();
  };
  
  // Handle event deletion
  const handleDelete = () => {
    if (isEditMode && selectedEvent) {
      deleteEvent(selectedEvent.id);
      closeEventModal();
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button 
            onClick={closeEventModal}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-4">
          {/* Conflict Warning */}
          {showConflicts && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
              <AlertTriangle className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
              <div>
                <p className="text-yellow-700 font-medium">Scheduling Conflict Detected</p>
                <p className="text-sm text-yellow-600">
                  This event overlaps with {conflicts.length} existing event{conflicts.length > 1 ? 's' : ''}:
                </p>
                <ul className="text-sm text-yellow-600 mt-1 list-disc list-inside">
                  {conflicts.slice(0, 3).map(event => (
                    <li key={event.id}>{event.title} ({formatDate(event.start)})</li>
                  ))}
                  {conflicts.length > 3 && (
                    <li>...and {conflicts.length - 3} more</li>
                  )}
                </ul>
              </div>
            </div>
          )}
          
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title*
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`w-full px-3 py-2 border ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter event title"
                />
              )}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          
          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add description or notes"
                />
              )}
            />
          </div>
          
          {/* Date & Time */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date & Time*
              </label>
              <div className="flex items-center">
                <Calendar size={18} className="text-gray-400 mr-2" />
                <Controller
                  name="start"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="datetime-local"
                      value={field.value.slice(0, 16)} // Format for datetime-local
                      onChange={(e) => {
                        field.onChange(new Date(e.target.value).toISOString());
                      }}
                      className={`w-full px-3 py-2 border ${
                        errors.start ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  )}
                />
              </div>
              {errors.start && (
                <p className="mt-1 text-sm text-red-500">{errors.start.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date & Time*
              </label>
              <div className="flex items-center">
                <Clock size={18} className="text-gray-400 mr-2" />
                <Controller
                  name="end"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="datetime-local"
                      value={field.value.slice(0, 16)} // Format for datetime-local
                      onChange={(e) => {
                        field.onChange(new Date(e.target.value).toISOString());
                      }}
                      className={`w-full px-3 py-2 border ${
                        errors.end ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  )}
                />
              </div>
              {errors.end && (
                <p className="mt-1 text-sm text-red-500">{errors.end.message}</p>
              )}
            </div>
          </div>
          
          {/* All Day Toggle */}
          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <Controller
                name="allDay"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={onChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                )}
              />
              <span className="ml-2 text-sm text-gray-700">All day event</span>
            </label>
          </div>
          
          {/* Event Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type*
            </label>
            <Controller
              name="eventType"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Vacation">Vacation</option>
                  <option value="Medical">Medical</option>
                  <option value="School">School</option>
                  <option value="Exchange">Exchange</option>
                  <option value="Other">Other</option>
                </select>
              )}
            />
          </div>
          
          {/* Shared With */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Users size={18} className="mr-1" />
              Share with
            </label>
            <div className="space-y-2">
              {mockUsers.filter(u => u.id !== currentUser.id).map(user => (
                <label key={user.id} className="flex items-center space-x-2">
                  <Controller
                    name="sharedWith"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={field.value.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange([...field.value, user.id]);
                          } else {
                            field.onChange(field.value.filter(id => id !== user.id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    )}
                  />
                  <div className="flex items-center">
                    <span 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: user.color }}
                    ></span>
                    <span>{user.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          {/* Recurrence */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Repeat size={18} className="mr-1" />
              Recurrence
            </label>
            <Controller
              name="recurrenceType"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                >
                  <option value="NONE">Does not repeat</option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              )}
            />
            
            {watch('recurrenceType') !== 'NONE' && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ends
                  </label>
                  <Controller
                    name="recurrenceEndType"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="never">Never</option>
                        <option value="until">On date</option>
                        <option value="count">After occurrence count</option>
                      </select>
                    )}
                  />
                </div>
                
                {watch('recurrenceEndType') === 'until' && (
                  <div>
                    <Controller
                      name="recurrenceUntil"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="date"
                          value={field.value?.slice(0, 10) || ''}
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            field.onChange(date.toISOString());
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    />
                  </div>
                )}
                
                {watch('recurrenceEndType') === 'count' && (
                  <div>
                    <Controller
                      name="recurrenceCount"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Number of occurrences"
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
        
        {/* Footer */}
<div className="p-4 border-t border-gray-200 flex justify-between">
  {isEditMode ? (
    isPastEvent ? (
      <div /> // past event: show nothing or static label
    ) : (
      <button
        type="button"
        onClick={handleDelete}
        className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
      >
        Delete Event
      </button>
    )
  ) : (
    <div /> // not edit mode: show nothing
  )}
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={closeEventModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              {isEditMode ? 'Update Event' : 'Save Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}