import React, { useState, useEffect } from 'react';
import { X, Search, MessageSquare } from 'lucide-react';
import { chatAPI } from '../services/api';
import { useChat } from '../context/ChatContext';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const { setCurrentSession, setSessionMessages } = useChat();

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = async () => {
    try {
      const response = await chatAPI.getUserSessions();
      setAllSessions(response.data.sessions.data || []);
      setSearchResults(response.data.sessions.data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults(allSessions);
      return;
    }

    const filtered = allSessions.filter((session) =>
      session.messages?.some((msg) =>
        msg.message.toLowerCase().includes(query.toLowerCase())
      )
    );
    setSearchResults(filtered);
  };

  const handleSelectSession = async (session) => {
    try {
      const response = await chatAPI.getHistory(session.session_id);
      setCurrentSession(session);
      setSessionMessages(response.data.messages || []);
      onClose();
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-primary dark:bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="p-6 border-b border-white dark:border-gray-700 border-opacity-20">
          <div className="flex items-center gap-4">
            <Search size={24} className="text-white dark:text-gray-300" />
            <input
              type="text"
              placeholder="البحث في الدردشات ..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent text-white dark:text-gray-200 placeholder-white dark:placeholder-gray-400 placeholder-opacity-70 text-lg outline-none focus:outline-none  focus:ring-0 focus:border-0"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X size={24} className="text-white dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          {searchResults.length === 0 ? (
            <div className="text-center text-white dark:text-gray-400 text-opacity-80 py-8">
              <p>لا توجد نتائج</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((session) => (
                <button
                  key={session.id}
                  onClick={() => handleSelectSession(session)}
                  className="w-full flex items-start gap-4 p-4 bg-white dark:bg-gray-700 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-gray-600 rounded-xl text-right transition-all"
                >
                  <MessageSquare size={20} className="text-white dark:text-gray-300 mt-1 flex-shrink-0" />
                  <div className="flex-1 text-white dark:text-gray-200">
                    <p className="text-base leading-relaxed">
                      {session.messages?.[0]?.message || 'دردشة جديدة'}
                    </p>
                    <p className="text-sm text-white dark:text-gray-400 text-opacity-60 mt-1">
                      {session.message_count} رسالة
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
