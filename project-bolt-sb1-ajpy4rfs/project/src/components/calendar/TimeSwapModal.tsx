import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Calendar, Clock, MessageSquare, Check, X as XIcon } from 'lucide-react';
import { useCalendarStore } from '../../store/useCalendarStore';
import { mockUsers, currentUser } from '../../mocks/data';
import { format, parseISO, isAfter } from 'date-fns';
import { useUserStore } from '../../store/useUserStore';
import { timeSwapApi } from '../../services/api';
const swapSchema = z.object({
  proposedStart: z.string(),
  proposedEnd: z.string(),
  reason: z.string().min(1, 'Please provide a reason for the swap request'),
  response: z.string().optional()
}).refine(data => {
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

 const isViewMode = !!selectedTimeSwapRequest?.id && selectedTimeSwapRequest?.status !== 'pending';

  const canRespond = isViewMode &&
    selectedTimeSwapRequest.status === 'pending' &&
    selectedTimeSwapRequest.requestedTo === currentUser.id;

  const eventId = selectedTimeSwapRequest?.eventId || '';
  const event = events.find(e => e.id === eventId);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<SwapFormData>({
    resolver: zodResolver(swapSchema),
    defaultValues: {
      proposedStart: '',
      proposedEnd: '',
      reason: '',
      response: ''
    }
  });

  useEffect(() => {
    if (selectedTimeSwapRequest) {
      reset({
        proposedStart: selectedTimeSwapRequest.proposedStart || '',
        proposedEnd: selectedTimeSwapRequest.proposedEnd || '',
        reason: selectedTimeSwapRequest.reason || '',
        response: selectedTimeSwapRequest.response || ''
      });
    }
  }, [selectedTimeSwapRequest, reset]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
    } catch {
      return '';
    }
  };

 const onSubmit = async (data: SwapFormData) => {
  if (!event) return;

  setIsSubmitting(true);

  try {
    // 1. API call to backend
await timeSwapApi.createRequest({
  eventId: event.id,
  requestedBy: currentUser.id,
  requestedTo: event.createdBy === currentUser.id
    ? event.sharedWith[0]
    : event.createdBy,
  proposedStart: data.proposedStart,
  proposedEnd: data.proposedEnd,
  reason: data.reason
});


    // 2. Local store update
    createTimeSwapRequest({
      eventId: event.id,
      requestedBy: currentUser.id,
      requestedTo: event.createdBy === currentUser.id
        ? event.sharedWith[0]
        : event.createdBy,
      proposedStart: data.proposedStart,
      proposedEnd: data.proposedEnd,
      reason: data.reason,
    });

    closeTimeSwapModal();
  } catch (error) {
    console.error("❌ Failed to create swap request via API", error);
    alert("Failed to submit time swap request. Please try again.");
  }

  setIsSubmitting(false);
};


  const toLocalDateTimeInputValue = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };
 

const handleApprove = async (data: SwapFormData) => {
  if (!selectedTimeSwapRequest) return;

  setIsSubmitting(true);

  try {
    await timeSwapApi.updateRequest(selectedTimeSwapRequest.id, {
      status: 'approved',
      response: data.response
    });

    updateTimeSwapRequest(selectedTimeSwapRequest.id, {
      status: 'approved',
      response: data.response
    });

    if (event) {
      await useCalendarStore.getState().updateEvent(event.id, {
        start: selectedTimeSwapRequest.proposedStart,
        end: selectedTimeSwapRequest.proposedEnd
      });
    }
  } catch (error) {
    console.error('❌ Failed to update swap request via API', error);
  }

  setIsSubmitting(false);
  closeTimeSwapModal();
};

const handleReject = async (data: SwapFormData) => {
  if (!selectedTimeSwapRequest) return;

  setIsSubmitting(true);

  try {
    await timeSwapApi.updateRequest(selectedTimeSwapRequest.id, {
      status: 'rejected',
      response: data.response
    });

    updateTimeSwapRequest(selectedTimeSwapRequest.id, {
      status: 'rejected',
      response: data.response
    });
  } catch (error) {
    console.error('❌ Failed to reject swap via API', error);
  }

  setIsSubmitting(false);
  closeTimeSwapModal();
};


const getUserName = (userId: string) => {
  const { user, coParent } = useUserStore.getState(); // ✅ Use real user data

  if (user?.id === userId) return user.name;
  if (coParent?.id === userId) return coParent.name;

  return 'Unknown User'; // fallback if unmatched
};

  if (!selectedTimeSwapRequest) {
    console.warn('⛔ TimeSwapModal: No selectedTimeSwapRequest yet. Waiting...');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
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

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-4">
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

          {/* Proposed Start */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Start Time</label>
            <div className="flex items-center">
              <Calendar size={18} className="text-gray-400 mr-2" />
              <Controller
                name="proposedStart"
                control={control}
                render={({ field }) => (
                  <input
                    type="datetime-local"
                   value={field.value ? toLocalDateTimeInputValue(field.value) : ''}


                    onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     
                  />
                )}
              />
            </div>
            {errors.proposedStart && (
              <p className="mt-1 text-sm text-red-500">{errors.proposedStart.message}</p>
            )}
          </div>

          {/* Proposed End */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Proposed End Time</label>
            <div className="flex items-center">
              <Clock size={18} className="text-gray-400 mr-2" />
              <Controller
                name="proposedEnd"
                control={control}
                render={({ field }) => (
                  <input
                    type="datetime-local"
                  value={field.value ? toLocalDateTimeInputValue(field.value) : ''}


                    onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     
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
              <MessageSquare size={18} className="mr-1" /> Reason for Request
            </label>
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  className={`w-full px-3 py-2 border ${errors.reason ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Why do you need to swap times?"
                   
                />
              )}
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-500">{errors.reason.message}</p>
            )}
          </div>

          {/* Response */}
          {canRespond && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <MessageSquare size={18} className="mr-1" /> Your Response (Optional)
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
                  <XIcon size={16} className="mr-1" /> Decline
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(handleApprove)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
                >
                  <Check size={16} className="mr-1" /> Approve
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}