import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);

  const startNewChat = () => {
    // Save current session to sessions list if it has messages
    if (currentSession && messages.length > 0) {
      const newSession = {
        id: currentSession.session_id || Date.now(),
        title: messages[0]?.message?.substring(0, 50) || 'محادثة جديدة',
        timestamp: new Date().toISOString(),
        messageCount: messages.length,
      };
      setSessions(prev => [newSession, ...prev]);
    }
    
    // Clear current session and messages
    setCurrentSession(null);
    setMessages([]);
    
    // Clear localStorage
    localStorage.removeItem('chatMessages');
    localStorage.removeItem('currentSession');
  };

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const setSessionMessages = (sessionMessages) => {
    setMessages(sessionMessages);
  };

  const value = {
    currentSession,
    setCurrentSession,
    messages,
    setMessages,
    sessions,
    setSessions,
    startNewChat,
    addMessage,
    setSessionMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
