import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, DollarSign, FileText, BookOpen, Activity, Star, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Streamline Your</span>
              <span className="block text-blue-600">Co-Parenting Journey</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Manage schedules, expenses, and communication all in one place. Stay organized and focused on what matters most - your children.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/about"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Everything You Need to Co-Parent Effectively
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Our comprehensive suite of tools helps you stay organized and communicate effectively.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Shared Calendar',
                  description: 'Keep track of schedules, events, and important dates with our intuitive calendar system.',
                  icon: Calendar,
                  color: 'bg-blue-500'
                },
                {
                  title: 'Secure Messaging',
                  description: 'Communicate effectively with built-in tone analysis to maintain positive interactions.',
                  icon: MessageSquare,
                  color: 'bg-green-500'
                },
                {
                  title: 'Expense Tracking',
                  description: 'Easily track and manage shared expenses, reimbursements, and payments.',
                  icon: DollarSign,
                  color: 'bg-purple-500'
                },
                {
                  title: 'Info Bank',
                  description: 'Store and access important documents, medical records, and contact information.',
                  icon: FileText,
                  color: 'bg-yellow-500'
                },
                {
                  title: 'Journal Entries',
                  description: 'Document important moments and keep track of check-ins and updates.',
                  icon: BookOpen,
                  color: 'bg-pink-500'
                },
                {
                  title: 'ToneMeter™',
                  description: 'AI-powered communication analysis helps maintain positive interactions.',
                  icon: Activity,
                  color: 'bg-indigo-500'
                }
              ].map((feature) => (
                <div key={feature.title} className="relative">
                  <div className="absolute h-12 w-12 rounded-md flex items-center justify-center">
                    <feature.icon
                      className={`h-8 w-8 text-white ${feature.color} rounded-lg p-1`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Trusted by Co-Parents Everywhere
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              See what our users have to say about their experience.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote: "This app has transformed how we manage our co-parenting responsibilities. Everything is so much more organized now.",
                  author: "Sarah M.",
                  role: "Parent"
                },
                {
                  quote: "The calendar and expense tracking features have eliminated so many potential conflicts. Highly recommended!",
                  author: "Michael R.",
                  role: "Parent"
                },
                {
                  quote: "As a family law professional, I recommend this platform to all my clients. It really helps keep everyone on the same page.",
                  author: "Jennifer L.",
                  role: "Family Law Attorney"
                }
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden px-6 py-8"
                >
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                    </div>
                    <div className="mt-6">
                      <p className="font-medium text-gray-900">{testimonial.author}</p>
                      <p className="text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Join thousands of co-parents today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/about" className="text-base text-gray-300 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-base text-gray-300 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/privacy" className="text-base text-gray-300 hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-base text-gray-300 hover:text-white">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Features
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/features/calendar" className="text-base text-gray-300 hover:text-white">
                    Calendar
                  </Link>
                </li>
                <li>
                  <Link to="/features/messaging" className="text-base text-gray-300 hover:text-white">
                    Messaging
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Connect
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">
              © 2025 CoParent Calendar. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}