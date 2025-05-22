import { format, parseISO } from "date-fns";
import { useCalendarStore } from "../../store/useCalendarStore";
import { CalendarEvent, TimeSwapRequest } from "../../types";

interface EventListProps {
  events: CalendarEvent[];
  onEventClick: (event: any) => void;
  currentUserId: string;
}

export default function EventList({
  events,
  onEventClick,
  currentUserId,
}: EventListProps) {
  const { setSelectedTimeSwapRequest, openTimeSwapModal } = useCalendarStore();

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500 text-lg">
          No events scheduled for this day
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          onClick={() => onEventClick({ event: { id: event.id } })}
          className="group bg-purple-100 rounded-xl border border-gray-100 p-4 hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                {event.title}
              </h3>
              <div className="text-sm text-gray-500 mt-1">
                {event.allDay
                  ? "All day"
                  : `${format(parseISO(event.start), "h:mm a")} - ${format(
                      parseISO(event.end),
                      "h:mm a"
                    )}`}
              </div>
              {event.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {event.description}
                </p>
              )}

              {event.createdBy === currentUserId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    const newRequestId = "swap-" + Date.now(); // generate temp ID

                    const swapRequest: TimeSwapRequest = {
                      id: newRequestId,
                      eventId: event.id,
                      requestedBy: currentUserId,
                      requestedTo: event.sharedWith[0] || "",
                      proposedStart: event.start,
                      proposedEnd: event.end,
                      reason: "",
                      response: "",
                      status: "pending",
                      createdAt: new Date().toISOString(),
                    };

                    useCalendarStore.getState().openTimeSwapModal(swapRequest); // ✅ Only this
                  }}
                  className="mt-2 text-sm text-indigo-600 hover:underline"
                >
                  Request Time Swap
                </button>
              )}
            </div>
            <div
              className="w-3 h-3 rounded-full mt-1.5"
              style={{ backgroundColor: event.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
