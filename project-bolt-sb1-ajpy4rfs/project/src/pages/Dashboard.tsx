// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, MessageSquare, DollarSign, FileText, BookOpen, Bell, Settings } from 'lucide-react';
// import { useAuthStore } from '../store/useAuthStore';

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const { user } = useAuthStore();
//   const [showNotifications, setShowNotifications] = useState(false);

//   const menuItems = [
//     { icon: Calendar, label: 'Calendar', path: '/calendar' },
//     { icon: MessageSquare, label: 'Messages', path: '/messages' },
//     { icon: DollarSign, label: 'Expenses', path: '/expenses' },
//     { icon: FileText, label: 'Info Bank', path: '/info-bank' },
//     { icon: BookOpen, label: 'Journal', path: '/journal' },
//   ];

//   const notifications = [
//     {
//       id: 1,
//       title: 'New Message',
//       description: 'You have a new message from John',
//       time: '5 minutes ago'
//     },
//     {
//       id: 2,
//       title: 'Calendar Update',
//       description: 'Event "Doctor\'s Appointment" has been modified',
//       time: '1 hour ago'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div className="flex items-center">
//               <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <button
//                   onClick={() => setShowNotifications(!showNotifications)}
//                   className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   <Bell className="h-6 w-6" />
//                   <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
//                 </button>

//                 {showNotifications && (
//                   <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10">
//                     <div className="py-2">
//                       {notifications.map(notification => (
//                         <div
//                           key={notification.id}
//                           className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
//                         >
//                           <p className="text-sm font-medium text-gray-900">
//                             {notification.title}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             {notification.description}
//                           </p>
//                           <p className="text-xs text-gray-400 mt-1">
//                             {notification.time}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <button
//                 onClick={() => navigate('/settings')}
//                 className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 <Settings className="h-6 w-6" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         {/* Quick Access Menu */}
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-8">
//           {menuItems.map((item) => (
//             <button
//               key={item.label}
//               onClick={() => navigate(item.path)}
//               className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center justify-center space-y-2"
//             >
//               <item.icon className="h-8 w-8 text-blue-600" />
//               <span className="text-sm font-medium text-gray-900">{item.label}</span>
//             </button>
//           ))}
//         </div>

//         {/* Dashboard Widgets */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {/* Calendar Widget */}
//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <Calendar className="h-6 w-6 text-gray-400" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="text-sm font-medium text-gray-500 truncate">
//                       Upcoming Events
//                     </dt>
//                     <dd className="flex items-baseline">
//                       <div className="text-2xl font-semibold text-gray-900">3</div>
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gray-50 px-5 py-3">
//               <div className="text-sm">
//                 <button
//                   onClick={() => navigate('/calendar')}
//                   className="font-medium text-blue-700 hover:text-blue-900"
//                 >
//                   View calendar
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Messages Widget */}
//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <MessageSquare className="h-6 w-6 text-gray-400" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="text-sm font-medium text-gray-500 truncate">
//                       Unread Messages
//                     </dt>
//                     <dd className="flex items-baseline">
//                       <div className="text-2xl font-semibold text-gray-900">2</div>
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gray-50 px-5 py-3">
//               <div className="text-sm">
//                 <button
//                   onClick={() => navigate('/messages')}
//                   className="font-medium text-blue-700 hover:text-blue-900"
//                 >
//                   View messages
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Expenses Widget */}
//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <DollarSign className="h-6 w-6 text-gray-400" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="text-sm font-medium text-gray-500 truncate">
//                       Pending Expenses
//                     </dt>
//                     <dd className="flex items-baseline">
//                       <div className="text-2xl font-semibold text-gray-900">$150.00</div>
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gray-50 px-5 py-3">
//               <div className="text-sm">
//                 <button
//                   onClick={() => navigate('/expenses')}
//                   className="font-medium text-blue-700 hover:text-blue-900"
//                 >
//                   View expenses
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MessageSquare,
  DollarSign,
  FileText,
  BookOpen,
  Bell,
  Settings,
  Euro,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import CoParentSetupModal from "../components/profile/CoParentSetupModal";
import ChildrenSetupModal from "../components/profile/ChildrenSetupModal";
import { useCalendarStore } from "../store/useCalendarStore";
import CalendarComponent from "../components/calendar/Calendar";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { coParent, children, fetchUserFamily, isLoading } = useUserStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCoParentModal, setShowCoParentModal] = useState(false);
  const [showChildrenModal, setShowChildrenModal] = useState(false);
  const { events, fetchEvents } = useCalendarStore();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    fetchUserFamily();
    const today = new Date();
    const start = new Date(today);
    const end = new Date(today);
    start.setDate(1);
    end.setMonth(end.getMonth() + 1);
    fetchEvents(start, end);
  }, [fetchUserFamily]);

  const now = new Date();
  const upcomingEvents = events
    .filter((event) => new Date(event.start) >= now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 3);

  const menuItems = [
    {
      icon: Calendar,
      label: "Calendar",
      path: "calendar",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: MessageSquare,
      label: "Messages",
      path: "messages",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: DollarSign,
      label: "Expenses",
      path: "expenses",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      icon: FileText,
      label: "Info Bank",
      path: "info-bank",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: BookOpen,
      label: "Journal",
      path: "journal",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "New Message",
      description: "You have a new message from John",
      time: "5 minutes ago",
    },
    {
      id: 2,
      title: "Calendar Update",
      description: 'Event "Doctor\'s Appointment" has been modified',
      time: "1 hour ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br to-purple-100 animate-fade-in">
      <header className="bg-blue-100 shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-indigo-800 animate-fade-up">
              Welcome, {user?.name}
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-600 hover:text-blue-600"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-ping" />
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="text-gray-600 hover:text-blue-600"
              >
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 animate-slide-in">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveSection(item.path)}
              className="bg-white shadow rounded-xl p-6 hover:shadow-md transition transform hover:-translate-y-0.5 flex flex-col items-center justify-center space-y-3"
            >
              <div className={`rounded-full p-3 ${item.bgColor}`}>
                <item.icon className={`h-8 w-8 ${item.color}`} />
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {!activeSection && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-100 p-6 rounded-2xl animate-fade-up">
              <h3 className="text-lg font-semibold text-indigo-700 mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5" /> Upcoming Events
              </h3>
              {upcomingEvents.length === 0 ? (
                <p className="text-gray-500">No upcoming events</p>
              ) : (
                <ul className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <li key={event.id} className="p-3 bg-indigo-50 rounded-lg">
                      <div className="font-semibold text-gray-800">
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(event.start).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4">
                <button
                  onClick={() => setActiveSection("calendar")}
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  View all events →
                </button>
              </div>
            </div>

            <div className="bg-green-100 p-6 rounded-2xl animate-fade-up delay-75">
              <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" /> Unread Messages
              </h3>
              <p className="text-3xl font-bold text-gray-800">0</p>
              <button
                onClick={() => setActiveSection("messages")}
                className="mt-4 text-green-600 text-sm font-medium hover:underline"
              >
                View messages →
              </button>
            </div>

            <div className="bg-red-100 p-6 rounded-2xl animate-fade-up delay-100">
              <h3 className="text-lg font-semibold text-yellow-700 mb-4 flex items-center">
                <Euro className="mr-2 h-5 w-5" /> Pending Expenses
              </h3>
              <p className="text-3xl font-bold text-gray-800">€ 0.00</p>
              <button
                onClick={() => setActiveSection("expenses")}
                className="mt-4 text-yellow-600 text-sm font-medium hover:underline"
              >
                View expenses →
              </button>
            </div>
          </div>
        )}

        {activeSection === "calendar" && (
          <div className="mt-8 animate-fade-in-up">
            <CalendarComponent />
          </div>
        )}
      </main>

      {showCoParentModal && <CoParentSetupModal />}
      {showChildrenModal && <ChildrenSetupModal />}
    </div>
  );
}
