// import { useRef, useEffect, useState } from 'react'; 
// import type { CalendarApi } from '@fullcalendar/core'; 
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { useCalendarStore } from '../../store/useCalendarStore';
// import EventModal from './EventModal';
// import TimeSwapModal from './TimeSwapModal';
// import CalendarHeader from './CalendarHeader';
// import { mockUsers, currentUser } from '../../mocks/data';
// import { CalendarEvent } from '../../types';
// import { parseISO } from 'date-fns';


// export default function Calendar() {
//   const { 
//     events, 
//     view, 
//     date,
//     setView, 
//     setDate,
//     filters,
//     isEventModalOpen,
//     isTimeSwapModalOpen,
//     openEventModal,
//     selectedEvent,
//     updateEvent
//   } = useCalendarStore();
  
//   const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>(events);
//   const calendarRef = useRef<FullCalendar | null>(null);

  
//   // Apply filters to events
//   useEffect(() => {
//     let filtered = [...events];
    
//     // Filter by event type
//     if (filters.eventTypes.length > 0) {
//       filtered = filtered.filter(event => 
//         filters.eventTypes.includes(event.eventType)
//       );
//     }
    
//     // Filter by user
//     if (filters.users.length > 0) {
//       filtered = filtered.filter(event => 
//         filters.users.includes(event.createdBy) || 
//         event.sharedWith.some(id => filters.users.includes(id))
//       );
//     }
    
//     setFilteredEvents(filtered);
//   }, [events, filters]);
//   useEffect(() => {
//   const calendarApi = calendarRef.current?.getApi();
//   if (calendarApi) {
//     calendarApi.changeView(view);
//   }
// }, [view]);

  
//   // Handle date click to create new event
//   // const handleDateClick = (info: any) => {
//   //   const end = new Date(info.date);
//   //   end.setHours(end.getHours() + 1);
    
//   //   const newEvent: Partial<CalendarEvent> = {
//   //     title: '',
//   //     start: info.date.toISOString(),
//   //     end: end.toISOString(),
//   //     allDay: info.allDay,
//   //     eventType: 'OTHER',
//   //     createdBy: currentUser.id,
//   //     sharedWith: [],
//   //     color: currentUser.color,
//   //   };
    
//   //   openEventModal(newEvent as CalendarEvent);
//   // };
  
// const handleDateClick = (info: any) => {
//   const clickedDate = new Date(info.date);
//   const now = new Date();

//   if (clickedDate < now.setHours(0, 0, 0, 0)) {
//     alert('You cannot create events in the past.');
//     return;
//   }

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



//   // Handle event click to edit
//   // const handleEventClick = (info: any) => {
//   //   const event = events.find(e => e.id === info.event.id);
//   //   if (event) {
//   //     openEventModal(event);
//   //   }
//   // };

//   const handleEventClick = (info: any) => {
//   const event = events.find(e => e.id === info.event.id);
//   if (!event) return;

//   const eventStart = new Date(event.start);
//   const now = new Date();

//   if (eventStart < now.setHours(0, 0, 0, 0)) {
//     alert('Past events cannot be edited.');
//     return;
//   }

//   openEventModal(event);
// };

  
//   // Handle event drop (drag & drop)
//   const handleEventDrop = (info: any) => {
//     const { event } = info;
    
//     updateEvent(event.id, {
//       start: event.start.toISOString(),
//       end: event.end ? event.end.toISOString() : event.start.toISOString(),
//     });
//   };
  
//   // Handle event resize
//   const handleEventResize = (info: any) => {
//     const { event } = info;
    
//     updateEvent(event.id, {
//       start: event.start.toISOString(),
//       end: event.end.toISOString(),
//     });
//   };
  
//   // Format events for FullCalendar
//   const formattedEvents = filteredEvents.map(event => ({
//     id: event.id,
//     title: event.title,
//     start: event.start,
//     end: event.end,
//     allDay: event.allDay,
//     backgroundColor: event.color,
//     borderColor: event.color,
//     extendedProps: {
//       description: event.description,
//       eventType: event.eventType,
//       createdBy: event.createdBy,
//       createdByName: mockUsers.find(u => u.id === event.createdBy)?.name || 'Unknown',
//       sharedWith: event.sharedWith,
//     }
//   }));
  
//   return (
//     <div className="flex flex-col h-full">
//       <CalendarHeader />
      
//       {/* <div className="flex-1 p-4 bg-white rounded-lg shadow overflow-hidden"> */}
//       <div className="p-4 bg-white rounded-lg shadow overflow-hidden" style={{ height: '80vh' }}>

//         <FullCalendar
//          ref={calendarRef}
//           plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//           initialView={view}
//           headerToolbar={false}
//           height="100%"
//           events={formattedEvents}
//           editable={true}
//           selectable={true}
//           selectMirror={true}
//           dayMaxEvents={true}
//           weekends={true}
//           initialDate={date}
//           dateClick={handleDateClick}
//           eventClick={handleEventClick}
//           eventDrop={handleEventDrop}
//           eventResize={handleEventResize}
//           datesSet={(dateInfo) => setDate(dateInfo.start)}
//           eventTimeFormat={{
//             hour: '2-digit',
//             minute: '2-digit',
//             meridiem: false
//           }}
//           eventContent={(eventInfo) => (
//             <div className="p-1 overflow-hidden text-xs">
//               <div className="font-semibold truncate">{eventInfo.event.title}</div>
//               {!eventInfo.event.allDay && (
//                 <div className="text-xs opacity-75">
//                   {eventInfo.timeText}
//                 </div>
//               )}
//               <div className="text-xs">
//                 {eventInfo.event.extendedProps.eventType}
//               </div>
//             </div>
//           )}
//         />
//       </div>
      
//       {isEventModalOpen && <EventModal />}
//       {isTimeSwapModalOpen && <TimeSwapModal />}
//     </div>
//   );
// }


// import { useRef, useEffect, useState } from 'react';
// import type { CalendarApi } from '@fullcalendar/core';
// import FullCalendar from '@fullcalendar/react'; 
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { useCalendarStore } from '../../store/useCalendarStore';
// import EventModal from './EventModal';
// import TimeSwapModal from './TimeSwapModal';
// import CalendarHeader from './CalendarHeader';
// import { mockUsers, currentUser } from '../../mocks/data';
// import { CalendarEvent } from '../../types';
// import { parseISO } from 'date-fns';


// export default function Calendar() {
//   const {
//     events,
//     view,
//     date,
//     setView,
//     setDate,
//     filters,
//     isEventModalOpen,
//     isTimeSwapModalOpen,
//     openEventModal,
//     selectedEvent,
//     updateEvent
//   } = useCalendarStore();

//   const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>(events);
//   const calendarRef = useRef<FullCalendar | null>(null);


//   // Apply filters to events
//   useEffect(() => {
//     let filtered = [...events];

//     // Filter by event type
//     if (filters.eventTypes.length > 0) {
//       filtered = filtered.filter(event =>
//         filters.eventTypes.includes(event.eventType)
//       );
//     }

//     // Filter by user
//     if (filters.users.length > 0) {
//       filtered = filtered.filter(event =>
//         filters.users.includes(event.createdBy) ||
//         event.sharedWith.some(id => filters.users.includes(id))
//       );
//     }

//     setFilteredEvents(filtered);
//   }, [events, filters]);
// // Change view safely
// useEffect(() => {
//   queueMicrotask(() => {
//     const calendarApi = calendarRef.current?.getApi();
//     if (calendarApi && view) {
//       calendarApi.changeView(view);
//     }
//   });
// }, [view]);

// // Goto date safely (on initial mount)
// useEffect(() => {
//   queueMicrotask(() => {
//     const calendarApi = calendarRef.current?.getApi();
//     if (calendarApi && date) {
//       calendarApi.gotoDate(date);
//     }
//   });
// }, []);
// useEffect(() => {
//   const timer = setTimeout(() => {
//     const calendarApi = calendarRef.current?.getApi();
//     if (calendarApi && date) {
//       calendarApi.gotoDate(date);
//     }
//   }, 0);
//   return () => clearTimeout(timer);
// }, []);







//   // Handle date click to create new event
//   // const handleDateClick = (info: any) => {
//   //   const end = new Date(info.date);
//   //   end.setHours(end.getHours() + 1);

//   //   const newEvent: Partial<CalendarEvent> = {
//   //     title: '',
//   //     start: info.date.toISOString(),
//   //     end: end.toISOString(),
//   //     allDay: info.allDay,
//   //     eventType: 'OTHER',
//   //     createdBy: currentUser.id,
//   //     sharedWith: [],
//   //     color: currentUser.color,
//   //   };

//   //   openEventModal(newEvent as CalendarEvent);
//   // };

//   const handleDateClick = (info: any) => {
//     const clickedDate = new Date(info.date);
//     const now = new Date();

//     if (clickedDate < now.setHours(0, 0, 0, 0)) {
//       alert('You cannot create events in the past.');
//       return;
//     }

//     const start = new Date(info.date);
//     start.setHours(start.getHours() + 1);
//     const end = new Date(start);
//     end.setHours(end.getHours() + 1);

//     const newEvent: CalendarEvent = {
//       id: '', // required even if it's a dummy
//       title: '',
//       description: '',
//       start: start.toISOString(),
//       end: end.toISOString(),
//       allDay: info.allDay,
//       eventType: 'OTHER',
//       createdBy: currentUser.id,
//       sharedWith: [],
//       color: currentUser.color,
//     };

//     openEventModal(newEvent);
//   };



//   // Handle event click to edit
//   // const handleEventClick = (info: any) => {
//   //   const event = events.find(e => e.id === info.event.id);
//   //   if (event) {
//   //     openEventModal(event);
//   //   }
//   // };

//   const handleEventClick = (info: any) => {
//     const event = events.find(e => e.id === info.event.id);
//     if (!event) return;

//     const eventStart = new Date(event.start);
//     const now = new Date();

//     if (eventStart < now.setHours(0, 0, 0, 0)) {
//       alert('Past events cannot be edited.');
//       return;
//     }

//     openEventModal(event);
//   };


//   // Handle event drop (drag & drop)
//   const handleEventDrop = (info: any) => {
//     const { event } = info;

//     updateEvent(event.id, {
//       start: event.start.toISOString(),
//       end: event.end ? event.end.toISOString() : event.start.toISOString(),
//     });
//   };

//   // Handle event resize
//   const handleEventResize = (info: any) => {
//     const { event } = info;

//     updateEvent(event.id, {
//       start: event.start.toISOString(),
//       end: event.end.toISOString(),
//     });
//   };

//   // Format events for FullCalendar
//   const formattedEvents = filteredEvents.map(event => ({
//     id: event.id,
//     title: event.title,
//     start: event.start,
//     end: event.end,
//     allDay: event.allDay,
//     backgroundColor: event.color,
//     borderColor: event.color,
//     extendedProps: {
//       description: event.description,
//       eventType: event.eventType,
//       createdBy: event.createdBy,
//       createdByName: mockUsers.find(u => u.id === event.createdBy)?.name || 'Unknown',
//       sharedWith: event.sharedWith,
//     }
//   }));

//   return (
//     <div className="flex flex-col h-full">
//       <CalendarHeader calendarRef={calendarRef} />


//       {/* <div className="flex-1 p-4 bg-white rounded-lg shadow overflow-hidden"> */}
//       <div className="p-4 bg-white rounded-lg shadow overflow-hidden" style={{ height: '80vh' }}>

//         <FullCalendar
//           ref={calendarRef}
//           plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//           initialView={view}
//           headerToolbar={false}
//           height="100%"
//           events={formattedEvents}
//           editable={true}
//           selectable={true}
//           selectMirror={true}
//           dayMaxEvents={true}
//           weekends={true}
//           initialDate={date}
//           dateClick={handleDateClick}
//           eventClick={handleEventClick}
//           eventDrop={handleEventDrop}
//           eventResize={handleEventResize}
//           datesSet={(dateInfo) => {
//   if (dateInfo.start.getTime() !== new Date(date).getTime()) {
//     setDate(dateInfo.start);
//   }
// }}


//           eventTimeFormat={{
//             hour: '2-digit',
//             minute: '2-digit',
//             meridiem: false
//           }}
//           eventContent={(eventInfo) => (
//             <div className="p-1 overflow-hidden text-xs">
//               <div className="font-semibold truncate">{eventInfo.event.title}</div>
//               {!eventInfo.event.allDay && (
//                 <div className="text-xs opacity-75">
//                   {eventInfo.timeText}
//                 </div>
//               )}
//               <div className="text-xs">
//                 {eventInfo.event.extendedProps.eventType}
//               </div>
//             </div>
//           )}
//         />
//       </div>

//       {isEventModalOpen && <EventModal />}
//       {isTimeSwapModalOpen && <TimeSwapModal />}
//     </div>
//   );
// }

import { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useCalendarStore } from '../../store/useCalendarStore';
import { useUserStore } from '../../store/useUserStore';
import EventModal from './EventModal';
import TimeSwapModal from './TimeSwapModal';
import { CalendarEvent } from '../../types';
import { format, parseISO, isSameDay } from 'date-fns';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import EventList from './EventList';
import { mockUsers } from '../../mocks/data';

export default function Calendar() {
  const {
    events,
    date,
    setDate,
    filters,
    isEventModalOpen,
    isTimeSwapModalOpen,
    openEventModal,
    updateEvent,
    
    canCreateEvent,
  } = useCalendarStore();

  const { user, coParent, children, fetchUserFamily } = useUserStore();

  useEffect(() => {
    if (!user) {
      fetchUserFamily?.();
    }
  }, []);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>(events);
  const calendarRef = useRef<FullCalendar | null>(null);
  

  useEffect(() => {
    const filtered = events.filter(event => {
      const matchType =
        filters.eventTypes.length === 0 || filters.eventTypes.includes(event.eventType);
      const matchUser =
        filters.users.length === 0 ||
        filters.users.includes(event.createdBy) ||
        event.sharedWith.some(id => filters.users.includes(id));
      return matchType && matchUser;
    });
    setFilteredEvents(filtered);
  }, [events, filters]);

  const selectedDateEvents = filteredEvents.filter(event =>
    isSameDay(parseISO(event.start), selectedDate)
  );

  const handleDateClick = (info: any) => {
    const clickedDate = new Date(info.date);
    const sameDayEvents = filteredEvents.filter(event =>
      isSameDay(parseISO(event.start), clickedDate)
    );
    setSelectedDate(clickedDate);
    if (sameDayEvents.length > 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (clickedDate < today) {
      alert('You cannot create events in the past.');
      return;
    }
    if (!user || !user.id) return;

    const end = new Date(clickedDate);
    end.setHours(end.getHours() + 1);

    openEventModal({
      id: '',
      title: '',
      description: '',
      start: clickedDate.toISOString(),
      end: end.toISOString(),
      allDay: info.allDay,
      eventType: 'OTHER',
      createdBy: user.id,
      sharedWith: [],
      color: user.color || '#888',
    });
  };

  const handleEventClick = (info: any) => {
    const event = events.find(e => e.id === info.event.id);
    if (!event) return;
    setSelectedDate(new Date(event.start));
    openEventModal(event);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const calendarApi = calendarRef.current?.getApi();
    if (direction === 'prev') calendarApi?.prev();
    else calendarApi?.next();
    setDate(calendarApi?.getDate() ?? new Date());
  };

  return (
      <>
    <style>{`
 .fc .fc-daygrid-day {
  width: calc(100% / 7);
  aspect-ratio: 1 / 1;        
  padding: 0;                 
}

.fc .fc-daygrid-day-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;               
  width: 100%;
  box-sizing: border-box;
}

.fc .fc-daygrid-day-top {
  padding: 0.25rem;
}

    `}</style>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-6 px-4 sm:px-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {format(date, 'MMMM yyyy')}
              </h2>
              <div className="flex space-x-2">
                <button onClick={() => handleMonthChange('prev')} className="text-gray-500 hover:text-indigo-600">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => handleMonthChange('next')} className="text-gray-500 hover:text-indigo-600">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => canCreateEvent() && openEventModal()}
                  className="inline-flex items-center text-sm px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add
                </button>
              </div>
            </div>

            {/* ✅ Rounded corners and square layout applied below */}
            <div className="rounded-2xl overflow-hidden shadow border border-slate-200">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={false}
                height={600}
                contentHeight={600}
                fixedWeekCount={false}
                events={filteredEvents.map(event => ({
                  ...event,
                  display: 'background',
                  backgroundColor: event.color || '#cfcfcf',
                }))}
                selectable
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                initialDate={selectedDate}
                dayCellClassNames={() =>
                  'rounded-xl aspect-square border transition-all duration-150 hover:bg-indigo-50 cursor-pointer'
                }
                dayHeaderClassNames={() => 'text-indigo-800 font-semibold'}
                eventDisplay="background"
                eventContent={() => null}
                dayMaxEventRows={0}
                showNonCurrentDates={true}
              />
            </div>
          </div>
           <div className="bg-white rounded-2xl shadow p-4 lg:p-6">
            <h3 className="text-md font-semibold text-gray-800 mb-3">Filters</h3>
            <div className="mb-4">
              <h4 className="text-sm text-gray-700 font-medium mb-1">Event Types</h4>
              {['VACATION', 'MEDICAL', 'SCHOOL', 'EXCHANGE', 'OTHER'].map(type => (
                <div key={type} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={filters.eventTypes.includes(type)}
                    onChange={() => {
                      const current = [...filters.eventTypes];
                      const index = current.indexOf(type);
                      index >= 0 ? current.splice(index, 1) : current.push(type);
                      useCalendarStore.getState().setFilters({ eventTypes: current });
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </div>
              ))}
            </div>

            {/* <div>
              <h4 className="text-sm text-gray-700 font-medium mb-1">Family Members</h4>
              {mockUsers.map(user => (
                <div key={user.id} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={filters.users.includes(user.id)}
                    onChange={() => {
                      const current = [...filters.users];
                      const index = current.indexOf(user.id);
                      index >= 0 ? current.splice(index, 1) : current.push(user.id);
                      useCalendarStore.getState().setFilters({ users: current });
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: user.color }}></span>
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>
              ))}
            </div> */}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}>
                <ChevronLeft className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h2>
              <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}>
                <ChevronRight className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="text-sm text-indigo-600 hover:underline"
            >
              Today
            </button>
          </div>
<EventList
  events={selectedDateEvents}
  onEventClick={handleEventClick}
  currentUserId={user?.id || ''}
/>



        </div>
      </div>
      {isEventModalOpen && <EventModal />}
      {isTimeSwapModalOpen && <TimeSwapModal />}
    </div>
      </>

  );
}
