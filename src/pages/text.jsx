import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SearchModal from '../components/SearchModal';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import SuggestionPill from '../components/SuggestionPill';
import { useChat } from '../context/ChatContext';
import { chatAPI } from '../services/api';
import logo from "../assets/logo.png"

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { messages, currentSession, setCurrentSession, addMessage, setSessions, startNewChat } = useChat();
  const messagesEndRef = useRef(null);

  const suggestions = [
    'ما هي الأقسام المتاحة بالمعهد؟',
    'ما هي شروط القبول بالمعهد؟',
    'ما هي المصروفات الدراسية بالمعهد؟',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load sessions from backend on mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await chatAPI.getUserSessions();
        console.log('Sessions response:', response.data);
        
        if (response.data && response.data.sessions) {
          const sessionsData = Array.isArray(response.data.sessions) 
            ? response.data.sessions 
            : response.data.sessions.data || [];
          
          console.log('Sessions data:', sessionsData);
          setSessions(sessionsData);
        } else {
          setSessions([]);
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
        console.error('Error details:', error.response?.data);
        setSessions([]);
      }
    };
    
    fetchSessions();
  }, []);

  // Load session and messages from localStorage on mount
  useEffect(() => {
    // Load session
    const savedSession = localStorage.getItem('currentSession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setCurrentSession(session);
      } catch (e) {
        console.error('Error loading session:', e);
      }
    }

    // Load messages
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach(msg => addMessage(msg));
        }
      } catch (e) {
        console.error('Error loading saved messages:', e);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (currentSession) {
      localStorage.setItem('currentSession', JSON.stringify(currentSession));
    }
  }, [currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText, files = []) => {
    // Add user message immediately (before API call)
    const userMessage = {
      sender: 'user',
      message: messageText,
      timestamp: new Date().toISOString(),
      files: files.map(f => f.name),
    };
    addMessage(userMessage);

    try {
      setLoading(true);

      // If no session, create one
      let sessionId = currentSession?.session_id;
      if (!sessionId) {
        try {
          const sessionResponse = await chatAPI.startSession();
          sessionId = sessionResponse.data.session_id;
          setCurrentSession({ session_id: sessionId });
        } catch (sessionError) {
          console.error('Error creating session:', sessionError);
          addMessage({
            sender: 'bot',
            message: 'عذراً، لم نتمكن من بدء جلسة جديدة. يرجى المحاولة مرة أخرى.',
            timestamp: new Date().toISOString(),
          });
          return;
        }
      }

      // Send to API
      try {
        const response = await chatAPI.sendMessage(sessionId, messageText);

        // Add bot response
        addMessage({
          sender: 'bot',
          message: response.data.response || 'تم استلام رسالتك',
          metadata: response.data.metadata,
          timestamp: new Date().toISOString(),
        });
      } catch (apiError) {
        console.error('Error sending message:', apiError);
        
        // Add error message but keep user message
        const errorMessage = apiError.response?.data?.error || 'عذراً، لم نتمكن من الحصول على رد. يرجى المحاولة مرة أخرى.';
        
        addMessage({
          sender: 'bot',
          message: errorMessage,
          timestamp: new Date().toISOString(),
          isError: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };
  

  return (
    <div className="flex h-[100vh] bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onSearchClick={() => setSearchModalOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Chat Area */}
        <div className="mt-5 sm:3 lg:8 p-10">
            <div className="h-full flex flex-col items-center justify-center p-4">
              <img src={logo} alt='' className='mb-3'/>
              <div className="text-center mb-4 animate-fade-in">
                
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-6 leading-10">
                  مرحباً بك في  لمعهد العالي للهندسة و التكنولوجيا بطنطا
               
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400">
                  كيف يمكنني مساعدتك ؟
                </p>
              </div>
<div className='w-full'>
 <ChatInput 
          onSend={handleSendMessage} 
          disabled={loading} 
          centered={messages.length === 0}
          isSidebarOpen={sidebarOpen}
        />
</div>
  

              {/* Suggestion Pills */}
              <div className="flex flex-wrap gap-4 justify-center mb-12 max-w-4xl">
                {suggestions.map((suggestion, index) => (
                  <SuggestionPill
                    key={index}
                    text={suggestion}
                    onClick={handleSuggestionClick}
                  />
                ))}
              </div>


            </div>
       
        </div>

     
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
};

export default Chat;