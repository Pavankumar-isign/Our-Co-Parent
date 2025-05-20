import { useEffect } from 'react';
import { useMessageStore } from '../../store/useMessageStore';
import { format } from 'date-fns';
import { Mail, Archive, Check } from 'lucide-react';

export default function MessageList() {
  const { messages, isLoading, error, fetchInbox, markAsRead, archiveMessage } = useMessageStore();

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map(message => (
        <div
          key={message.id}
          className={`bg-white rounded-lg shadow p-4 ${
            !message.readAt ? 'border-l-4 border-blue-600' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">{message.subject}</h3>
              <p className="text-sm text-gray-500">
                From: {message.sender.name}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(message.sentAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
            <div className="flex space-x-2">
              {!message.readAt && (
                <button
                  onClick={() => markAsRead(message.id)}
                  className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                  title="Mark as read"
                >
                  <Check size={18} />
                </button>
              )}
              <button
                onClick={() => archiveMessage(message.id)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="Archive"
              >
                <Archive size={18} />
              </button>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-gray-700">{message.body}</p>
          </div>
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700">Attachments:</p>
              <div className="mt-2 space-y-2">
                {message.attachments.map(attachment => (
                  <a
                    key={attachment.id}
                    href={`/api/messages/attachments/${attachment.id}`}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    download
                  >
                    <Mail size={16} className="mr-1" />
                    {attachment.fileName}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}