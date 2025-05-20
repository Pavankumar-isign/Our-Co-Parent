import { useCalendarStore } from '../../store/useCalendarStore';
import { mockUsers } from '../../mocks/data';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

const eventTypes = ['VACATION', 'MEDICAL', 'SCHOOL', 'EXCHANGE', 'OTHER'];

interface FilterPopoverProps {
  onClose: () => void;
}

export default function FilterPopover({ onClose }: FilterPopoverProps) {
  const { filters, setFilters } = useCalendarStore();
  const popoverRef = useRef<HTMLDivElement>(null);
  
  // Handle clicking outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Toggle event type filter
  const toggleEventType = (type: string) => {
    const currentTypes = [...filters.eventTypes];
    const index = currentTypes.indexOf(type);
    
    if (index >= 0) {
      currentTypes.splice(index, 1);
    } else {
      currentTypes.push(type);
    }
    
    setFilters({ eventTypes: currentTypes });
  };
  
  // Toggle user filter
  const toggleUser = (userId: string) => {
    const currentUsers = [...filters.users];
    const index = currentUsers.indexOf(userId);
    
    if (index >= 0) {
      currentUsers.splice(index, 1);
    } else {
      currentUsers.push(userId);
    }
    
    setFilters({ users: currentUsers });
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      eventTypes: [],
      users: [],
    });
  };
  
  return (
    <div 
      ref={popoverRef}
      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg z-10 border border-gray-200"
    >
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <h3 className="font-medium">Filters</h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="p-3">
        <h4 className="font-medium mb-2">Event Types</h4>
        <div className="space-y-1">
          {eventTypes.map(type => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.eventTypes.includes(type)}
                onChange={() => toggleEventType(type)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-200">
        <h4 className="font-medium mb-2">Family Members</h4>
        <div className="space-y-1">
          {mockUsers.map(user => (
            <label key={user.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.users.includes(user.id)}
                onChange={() => toggleUser(user.id)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: user.color }}
                ></span>
                <span>{user.name}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={resetFilters}
          className="w-full py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
}