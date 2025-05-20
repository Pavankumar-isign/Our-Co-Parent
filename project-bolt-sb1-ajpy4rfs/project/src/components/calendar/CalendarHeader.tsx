import { Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useCalendarStore } from '../../store/useCalendarStore';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { useState } from 'react';
import FilterPopover from './FilterPopover';
import { mockUsers } from '../../mocks/data';

export default function CalendarHeader() {
  const { view, date, setView, setDate, openEventModal } = useCalendarStore();
  const [showFilters, setShowFilters] = useState(false);
  
  // Format the header date based on current view
  const formatHeaderDate = () => {
    switch (view) {
      case 'dayGridMonth':
        return format(date, 'MMMM yyyy');
      case 'timeGridWeek':
        return `Week of ${format(date, 'MMM d, yyyy')}`;
      case 'timeGridDay':
        return format(date, 'EEEE, MMMM d, yyyy');
      default:
        return format(date, 'MMMM yyyy');
    }
  };
  
  // Navigate to previous period
  const handlePrevious = () => {
    switch (view) {
      case 'dayGridMonth':
        setDate(subMonths(date, 1));
        break;
      case 'timeGridWeek':
        setDate(subWeeks(date, 1));
        break;
      case 'timeGridDay':
        setDate(subDays(date, 1));
        break;
    }
  };
  
  // Navigate to next period
  const handleNext = () => {
    switch (view) {
      case 'dayGridMonth':
        setDate(addMonths(date, 1));
        break;
      case 'timeGridWeek':
        setDate(addWeeks(date, 1));
        break;
      case 'timeGridDay':
        setDate(addDays(date, 1));
        break;
    }
  };
  
  // Go to today
  const handleToday = () => {
    setDate(new Date());
  };
  
  // Toggle filters popover
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Create a new event
  const handleAddEvent = () => {
    const start = new Date();
    start.setHours(start.getHours() + 1, 0, 0, 0);
    
    const end = new Date(start);
    end.setHours(end.getHours() + 1);
    
    openEventModal({
      id: '',
      title: '',
      start: start.toISOString(),
      end: end.toISOString(),
      allDay: false,
      eventType: 'Other',
      createdBy: mockUsers[0].id,
      sharedWith: [],
      color: mockUsers[0].color,
    });
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white rounded-lg shadow mb-4">
      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
        <button
          onClick={handlePrevious}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="text-xl font-semibold">{formatHeaderDate()}</h2>
        
        <button
          onClick={handleNext}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
        
        <button
          onClick={handleToday}
          className="px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
        >
          Today
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex rounded-md shadow-sm overflow-hidden">
          <button
            onClick={() => setView('dayGridMonth')}
            className={`px-3 py-1.5 text-sm ${
              view === 'dayGridMonth'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } transition-colors border border-gray-300`}
          >
            Month
          </button>
          <button
            onClick={() => setView('timeGridWeek')}
            className={`px-3 py-1.5 text-sm ${
              view === 'timeGridWeek'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } transition-colors border-t border-b border-gray-300`}
          >
            Week
          </button>
          <button
            onClick={() => setView('timeGridDay')}
            className={`px-3 py-1.5 text-sm ${
              view === 'timeGridDay'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } transition-colors border border-gray-300`}
          >
            Day
          </button>
        </div>
        
        <div className="relative">
          <button
            onClick={toggleFilters}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Filter"
          >
            <Filter size={20} />
          </button>
          {showFilters && <FilterPopover onClose={() => setShowFilters(false)} />}
        </div>
        
        <button
          onClick={handleAddEvent}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1"
        >
          <Calendar size={16} />
          <span>Add Event</span>
        </button>
      </div>
    </div>
  );
}