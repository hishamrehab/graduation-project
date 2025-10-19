import React from 'react';
import { User, Bot } from 'lucide-react';

const ChatMessage = ({ message, sender }) => {
  const isUser = sender === 'user';

  return (
    <div className={`flex gap-4 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-slide-in`}>
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
      }`}>
        {isUser ? (
          <User size={20} className="text-white" />
        ) : (
          <Bot size={20} className="text-gray-600 dark:text-gray-300" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[70%] rounded-3xl p-4 lg:p-5 ${
          isUser
            ? 'bg-primary text-white text-right'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 text-left'
        }`}
      >
        <p className="text-base lg:text-lg leading-relaxed whitespace-pre-wrap">
          {message}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
