import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import TestPage from './pages/TestPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to chat if logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/chat" />;
};

function App() {
  return (

    <div className=' h-[100vh]'>
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <ChatProvider>
            <Routes>
              {/* Root redirects to login */}
              <Route path="/" element={<Navigate to="/chat" replace />} />
              
              {/* Auth Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Protected Chat Route */}
              <Route
                path="/chat"
                element={
                  // <ProtectedRoute>
                    <Chat />
                  // </ProtectedRoute>
                }
              />

              {/* Test Page (Public for debugging) */}
              <Route path="/test" element={<TestPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/chat" />} />
            </Routes>
            </ChatProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
</div>
  );
}

export default App;
