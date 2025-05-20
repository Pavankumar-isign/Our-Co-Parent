import { Bell, Users, Calendar, MessageSquare, DollarSign, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { currentUser, mockUsers } from '../../mocks/data';
import { useCalendarStore } from '../../store/useCalendarStore';
import { useMessageStore } from '../../store/useMessageStore';

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { timeSwapRequests } = useCalendarStore();
  const { unreadCount, updateUnreadCount } = useMessageStore();
  const location = useLocation();
  
  // Update unread count when component mounts
  useState(() => {
    updateUnreadCount();
  }, []);
  
  // Filter pending time swap requests for the current user
  const pendingRequests = timeSwapRequests.filter(req => 
    req.requestedTo === currentUser.id && req.status === 'pending'
  );
  
  // Get total notifications count
  const totalNotifications = pendingRequests.length + unreadCount;
  
  // Get user name by ID
  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };
  
  // Toggle notifications panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">CoParent</h1>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`flex items-center font-medium h-16 ${
                location.pathname === '/'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="h-5 w-5 mr-1" />
              <span>Calendar</span>
            </Link>
            <Link
              to="/messages"
              className={`flex items-center font-medium h-16 ${
                location.pathname === '/messages'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="h-5 w-5 mr-1" />
              <span>Messages</span>
            </Link>
            <Link
              to="/expenses"
              className={`flex items-center font-medium h-16 ${
                location.pathname === '/expenses'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <DollarSign className="h-5 w-5 mr-1" />
              <span>Expenses</span>
            </Link>
            <Link
              to="/family"
              className="flex items-center text-gray-600 hover:text-gray-900 font-medium h-16"
            >
              <Users className="h-5 w-5 mr-1" />
              <span>Family</span>
            </Link>
          </nav>
          
          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 relative"
                aria-label="Notifications"
              >
                <Bell className="h-6 w-6" />
                {totalNotifications > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
                    {totalNotifications}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 overflow-hidden">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-700">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {unreadCount > 0 && (
                      <Link
                        to="/messages"
                        className="block px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          New Messages
                        </p>
                        <p className="text-sm text-gray-500">
                          You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                        </p>
                      </Link>
                    )}
                    {pendingRequests.map(request => (
                      <a
                        key={request.id}
                        href="#"
                        className="block px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Time Swap Request
                            </p>
                            <p className="text-sm text-gray-500">
                              {getUserName(request.requestedBy)} requested a time swap
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Reason: {request.reason}
                            </p>
                          </div>
                        </div>
                      </a>
                    ))}
                    {totalNotifications === 0 && (
                      <div className="px-4 py-6 text-center text-gray-500">
                        <p>No new notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* User Account */}
            <div className="flex items-center space-x-2">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: currentUser.color }}
              >
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden md:inline-block font-medium text-gray-700">
                {currentUser.name}
              </span>
            </div>
            
            {/* Settings */}
            <button
              className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100"
              aria-label="Settings"
            >
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}