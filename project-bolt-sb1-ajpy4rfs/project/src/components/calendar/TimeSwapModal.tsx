import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Calendar, Clock, MessageSquare, Check, X as XIcon } from 'lucide-react';
import { useCalendarStore } from '../../store/useCalendarStore';
import { mockUsers, currentUser } from '../../mocks/data';
import { format, parseISO, isAfter } from 'date-fns';

// Form validation schema
const swapSchema = z.object({
  proposedStart: z.string(),
  proposedEnd: z.string(),
  reason: z.string().min(1, 'Please provide a reason for the swap request'),
  response: z.string().optional()
}).refine(data => {
  // Validate end date is after start date
  return isAfter(parseISO(data.proposedEnd), parseISO(data.proposedStart));
}, {
  message: 'End time must be after start time',
  path: ['proposedEnd']
});

type SwapFormData = z.infer<typeof swapSchema>;

export default function TimeSwapModal() {
  const { 
    selectedTimeSwapRequest,
    closeTimeSwapModal,
    createTimeSwapRequest,
    updateTimeSwapRequest,
    events
  } = useCalendarStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isViewMode = selectedTimeSwapRequest?.id;
  const canRespond = isViewMode && 
    selectedTimeSwapRequest.status === 'pending' && 
    selectedTimeSwapRequest.requestedTo === currentUser.id;
  
  const eventId = selectedTimeSwapRequest?.eventId || '';
  const event = events.find(e => e.id === eventId);
  
  // Set up form with default values
  const { control, handleSubmit, formState: { errors } } = useForm<SwapFormData>({
    resolver: zodResolver(swapSchema),
    defaultValues: {
      proposedStart: selectedTimeSwapRequest?.proposedStart || event?.start || new Date().toISOString(),
      proposedEnd: selectedTimeSwapRequest?.proposedEnd || event?.end || new Date().toISOString(),
      reason: selectedTimeSwapRequest?.reason || '',
      response: selectedTimeSwapRequest?.response || ''
    }
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  };
  
  // Handle form submission for creating a swap request
  const onSubmit = (data: SwapFormData) => {
    if (!event) return;
    
    setIsSubmitting(true);
    
    createTimeSwapRequest({
      eventId: event.id,
      requestedBy: currentUser.id,
      requestedTo: event.createdBy === currentUser.id 
        ? event.sharedWith[0] 
        : event.createdBy,
      proposedStart: data.proposedStart,
      proposedEnd: data.proposedEnd,
      reason: data.reason
    });
    
    setIsSubmitting(false);
    closeTimeSwapModal();
  };
  
  // Handle approval of swap request
  const handleApprove = (data: SwapFormData) => {
    if (!selectedTimeSwapRequest) return;
    
    setIsSubmitting(true);
    
    updateTimeSwapRequest(selectedTimeSwapRequest.id, {
      status: 'approved',
      response: data.response
    });
    
    // Also update the event with the new times
    if (event) {
      const eventId = selectedTimeSwapRequest.eventId;
      const updatedEvent = {
        start: selectedTimeSwapRequest.proposedStart,
        end: selectedTimeSwapRequest.proposedEnd
      };
      useCalendarStore.getState().updateEvent(eventId, updatedEvent);
    }
    
    setIsSubmitting(false);
    closeTimeSwapModal();
  };
  
  // Handle rejection of swap request
  const handleReject = (data: SwapFormData) => {
    if (!selectedTimeSwapRequest) return;
    
    setIsSubmitting(true);
    
    updateTimeSwapRequest(selectedTimeSwapRequest.id, {
      status: 'rejected',
      response: data.response
    });
    
    setIsSubmitting(false);
    closeTimeSwapModal();
  };
  
  // Get user name by ID
  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {isViewMode 
              ? `Time Swap Request ${selectedTimeSwapRequest.status !== 'pending' ? `(${selectedTimeSwapRequest.status})` : ''}` 
              : 'Request Time Swap'}
          </h2>
          <button 
            onClick={closeTimeSwapModal}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-4">
          {/* Event Info */}
          {event && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <h3 className="font-medium text-gray-700">Event Details</h3>
              <p className="mt-1"><strong>Title:</strong> {event.title}</p>
              <p className="mt-1">
                <strong>Current Time:</strong> {formatDate(event.start)} - {formatDate(event.end)}
              </p>
              <p className="mt-1">
                <strong>Created By:</strong> {getUserName(event.createdBy)}
              </p>
            </div>
          )}
          
          {/* Request Status Info */}
          {isViewMode && (
            <div className={`mb-4 p-3 rounded-md ${
              selectedTimeSwapRequest.status === 'approved' 
                ? 'bg-green-50 border border-green-200' 
                : selectedTimeSwapRequest.status === 'rejected'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className="font-medium">
                {selectedTimeSwapRequest.status === 'approved' 
                  ? 'This request has been approved' 
                  : selectedTimeSwapRequest.status === 'rejected'
                    ? 'This request has been declined'
                    : 'This request is pending approval'}
              </p>
              <p className="mt-1 text-sm">
                <strong>Requested By:</strong> {getUserName(selectedTimeSwapRequest.requestedBy)}
              </p>
              <p className="mt-1 text-sm">
                <strong>Requested To:</strong> {getUserName(selectedTimeSwapRequest.requestedTo)}
              </p>
              {selectedTimeSwapRequest.status !== 'pending' && selectedTimeSwapRequest.response && (
                <div className="mt-2 text-sm">
                  <strong>Response:</strong> {selectedTimeSwapRequest.response}
                </div>
              )}
            </div>
          )}
          
          {/* Proposed Dates */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proposed Start Time
            </label>
            <div className="flex items-center">
              <Calendar size={18} className="text-gray-400 mr-2" />
              <Controller
                name="proposedStart"
                control={control}
                render={({ field }) => (
                  <input
                    type="datetime-local"
                    value={field.value.slice(0, 16)} // Format for datetime-local
                    onChange={(e) => {
                      field.onChange(new Date(e.target.value).toISOString());
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isViewMode}
                  />
                )}
              />
            </div>
            {errors.proposedStart && (
              <p className="mt-1 text-sm text-red-500">{errors.proposedStart.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proposed End Time
            </label>
            <div className="flex items-center">
              <Clock size={18} className="text-gray-400 mr-2" />
              <Controller
                name="proposedEnd"
                control={control}
                render={({ field }) => (
                  <input
                    type="datetime-local"
                    value={field.value.slice(0, 16)} // Format for datetime-local
                    onChange={(e) => {
                      field.onChange(new Date(e.target.value).toISOString());
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isViewMode}
                  />
                )}
              />
            </div>
            {errors.proposedEnd && (
              <p className="mt-1 text-sm text-red-500">{errors.proposedEnd.message}</p>
            )}
          </div>
          
          {/* Reason */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <MessageSquare size={18} className="mr-1" />
              Reason for Request
            </label>
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  className={`w-full px-3 py-2 border ${
                    errors.reason ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Why do you need to swap times?"
                  disabled={isViewMode}
                />
              )}
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-500">{errors.reason.message}</p>
            )}
          </div>
          
          {/* Response (for approving/rejecting) */}
          {canRespond && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <MessageSquare size={18} className="mr-1" />
                Your Response (Optional)
              </label>
              <Controller
                name="response"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a response message"
                  />
                )}
              />
            </div>
          )}
        </form>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={closeTimeSwapModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              {canRespond ? 'Cancel' : 'Close'}
            </button>
            
            {!isViewMode && (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
              >
                Send Request
              </button>
            )}
            
            {canRespond && (
              <>
                <button
                  type="button"
                  onClick={handleSubmit(handleReject)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
                >
                  <XIcon size={16} className="mr-1" />
                  Decline
                </button>
                
                <button
                  type="button"
                  onClick={handleSubmit(handleApprove)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
                >
                  <Check size={16} className="mr-1" />
                  Approve
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}