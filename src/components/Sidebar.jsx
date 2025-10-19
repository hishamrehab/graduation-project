import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, MessageSquarePlus, Search, LogOut, MessageSquare, User, Trash2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';

const Sidebar = ({ isOpen, toggleSidebar, onSearchClick }) => {
  const { startNewChat, sessions, setSessions } = useChat();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);

  const handleNewChat = () => {
    startNewChat();
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    
    if (!confirm('هل أنت متأكد من حذف هذه المحادثة؟')) {
      return;
    }

    try {
      setDeletingId(sessionId);
      await chatAPI.deleteSession(sessionId);
      
      // Remove from local state
      setSessions(sessions.filter(s => s.session_id !== sessionId));
      
      console.log('✅ Session deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting session:', error);
      alert('فشل حذف المحادثة. حاول مرة أخرى.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 h-full bg-white dark:bg-gray-800 border-l-4 border-primary z-50 transition-all duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 lg:static ${
          isOpen ? 'w-64 lg:w-72' : 'lg:w-20'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Toggle Button - Desktop Only */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-4 transition-colors border-2 "
            title={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            {isOpen ? (
              <ChevronRight size={24} className="text-gray-700 dark:text-gray-300" />
            ) : (
              <ChevronLeft size={24} className="text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className={`flex items-center gap-3 p-4 bg-primary hover:bg-primary-dark text-white rounded-2xl mb-3 transition-all hover:scale-105 shadow-md ${
              !isOpen && 'lg:justify-center lg:w-14 lg:h-14 lg:p-0'
            }`}
            title="دردشة جديدة"
          >
            <MessageSquarePlus size={22} className="flex-shrink-0" />
            {isOpen && <span className="font-medium text-lg">دردشة جديدة</span>}
          </button>

          {/* Search Button */}
          <button
            onClick={onSearchClick}
            className={`flex items-center gap-3 p-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-2xl transition-all hover:scale-105 shadow-md ${
              !isOpen && 'lg:justify-center lg:w-14 lg:h-14 lg:p-0'
            }`}
            title="البحث في الدردشات"
          >
            <Search size={22} className="flex-shrink-0" />
            {isOpen && <span className="font-medium text-lg">البحث في الدردشات</span>}
          </button>

          {/* Chat Sessions List */}
          {isOpen && sessions && sessions.length > 0 && (
            <div className="flex-1 overflow-y-auto mt-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 px-2">المحادثات السابقة</h3>
              <div className="space-y-2">
                {sessions.slice(0, 10).map((session, index) => (
                  <div
                    key={session.id || index}
                    className="group relative flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <MessageSquare size={16} className="text-primary flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate overflow-hidden text-ellipsis whitespace-nowrap">
                      {session.title || `محادثة ${index + 1}`}
                    </span>
                    <button
                      onClick={(e) => handleDeleteSession(session.session_id, e)}
                      disabled={deletingId === session.session_id}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all flex-shrink-0"
                      title="حذف المحادثة"
                    >
                      {deletingId === session.session_id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={16} className="text-red-500" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spacer */}
          {(!isOpen || !sessions || sessions.length === 0) && <div className="flex-1"></div>}

          {/* Footer with User Info and Logout */}
          <div className={`border-t dark:border-gray-700 pt-4 ${
            isOpen ? '' : 'flex justify-center'
          }`}>
            {isOpen ? (
              <>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center">
                  <p className="font-semibold">THIET Assistant</p>
                  <p className="text-xs mt-1">المساعد الذكي للمعهد</p>
                </div>
                
                {/* User Info and Logout Button */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 text-right">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name || 'مستخدم'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded-lg transition-colors flex-shrink-0"
                    title="تسجيل الخروج"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-3 hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded-full transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
