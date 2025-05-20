import { useRef, useEffect, useState } from 'react';
import type { CalendarApi } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useCalendarStore } from '../../store/useCalendarStore';
import EventModal from './EventModal';
import TimeSwapModal from './TimeSwapModal';
import CalendarHeader from './CalendarHeader';
import { mockUsers, currentUser } from '../../mocks/data';
import { CalendarEvent } from '../../types';
import { parseISO } from 'date-fns';


export default function Calendar() {
  const {
    events,
    view,
    date,
    setView,
    setDate,
    filters,
    isEventModalOpen,
    isTimeSwapModalOpen,
    openEventModal,
    selectedEvent,
    updateEvent
  } = useCalendarStore();

  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>(events);
  const calendarRef = useRef<FullCalendar | null>(null);


  // Apply filters to events
  useEffect(() => {
    let filtered = [...events];

    // Filter by event type
    if (filters.eventTypes.length > 0) {
      filtered = filtered.filter(event =>
        filters.eventTypes.includes(event.eventType)
      );
    }

    // Filter by user
    if (filters.users.length > 0) {
      filtered = filtered.filter(event =>
        filters.users.includes(event.createdBy) ||
        event.sharedWith.some(id => filters.users.includes(id))
      );
    }

    setFilteredEvents(filtered);
  }, [events, filters]);
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(view);
    }
  }, [view]);


  // Handle date click to create new event
  // const handleDateClick = (info: any) => {
  //   const end = new Date(info.date);
  //   end.setHours(end.getHours() + 1);

  //   const newEvent: Partial<CalendarEvent> = {
  //     title: '',
  //     start: info.date.toISOString(),
  //     end: end.toISOString(),
  //     allDay: info.allDay,
  //     eventType: 'OTHER',
  //     createdBy: currentUser.id,
  //     sharedWith: [],
  //     color: currentUser.color,
  //   };

  //   openEventModal(newEvent as CalendarEvent);
  // };

  const handleDateClick = (info: any) => {
    const clickedDate = new Date(info.date);
    const now = new Date();

    if (clickedDate < now.setHours(0, 0, 0, 0)) {
      alert('You cannot create events in the past.');
      return;
    }

    const end = new Date(info.date);
    end.setHours(end.getHours() + 1);

    const newEvent: Partial<CalendarEvent> = {
      title: '',
      start: info.date.toISOString(),
      end: end.toISOString(),
      allDay: info.allDay,
      eventType: 'OTHER',
      createdBy: currentUser.id,
      sharedWith: [],
      color: currentUser.color,
    };

    openEventModal(newEvent as CalendarEvent);
  };



  // Handle event click to edit
  // const handleEventClick = (info: any) => {
  //   const event = events.find(e => e.id === info.event.id);
  //   if (event) {
  //     openEventModal(event);
  //   }
  // };

  const handleEventClick = (info: any) => {
    const event = events.find(e => e.id === info.event.id);
    if (!event) return;

    const eventStart = new Date(event.start);
    const now = new Date();

    if (eventStart < now.setHours(0, 0, 0, 0)) {
      alert('Past events cannot be edited.');
      return;
    }

    openEventModal(event);
  };


  // Handle event drop (drag & drop)
  const handleEventDrop = (info: any) => {
    const { event } = info;

    updateEvent(event.id, {
      start: event.start.toISOString(),
      end: event.end ? event.end.toISOString() : event.start.toISOString(),
    });
  };

  // Handle event resize
  const handleEventResize = (info: any) => {
    const { event } = info;

    updateEvent(event.id, {
      start: event.start.toISOString(),
      end: event.end.toISOString(),
    });
  };

  // Format events for FullCalendar
  const formattedEvents = filteredEvents.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    allDay: event.allDay,
    backgroundColor: event.color,
    borderColor: event.color,
    extendedProps: {
      description: event.description,
      eventType: event.eventType,
      createdBy: event.createdBy,
      createdByName: mockUsers.find(u => u.id === event.createdBy)?.name || 'Unknown',
      sharedWith: event.sharedWith,
    }
  }));

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader />

      {/* <div className="flex-1 p-4 bg-white rounded-lg shadow overflow-hidden"> */}
      <div className="p-4 bg-white rounded-lg shadow overflow-hidden" style={{ height: '80vh' }}>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          headerToolbar={false}
          height="100%"
          events={formattedEvents}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          initialDate={date}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          datesSet={(dateInfo) => setDate(dateInfo.start)}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
          }}
          eventContent={(eventInfo) => (
            <div className="p-1 overflow-hidden text-xs">
              <div className="font-semibold truncate">{eventInfo.event.title}</div>
              {!eventInfo.event.allDay && (
                <div className="text-xs opacity-75">
                  {eventInfo.timeText}
                </div>
              )}
              <div className="text-xs">
                {eventInfo.event.extendedProps.eventType}
              </div>
            </div>
          )}
        />
      </div>

      {isEventModalOpen && <EventModal />}
      {isTimeSwapModalOpen && <TimeSwapModal />}
    </div>
  );
}