import React from 'react';
import { LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from "../assets/logo.png"
import { Link, Route } from 'react-router-dom';
const Header = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-primary dark:bg-gray-800 text-white shadow-lg transition-colors">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
      <Link to="/chat">
            <div className="h-16 w-16">
            <img  src={logo} alt="Logo"
            className="w-full h-full rounded-full" />
          </div>
      </Link>

          {/* User Info and Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-white hover:bg-opacity-20 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Name */}
            {user && (
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs opacity-75">{user.email}</p>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white dark:bg-gray-700 text-primary dark:text-cyan-400 px-4 py-2 rounded-lg hover:bg-opacity-90 dark:hover:bg-gray-600 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
