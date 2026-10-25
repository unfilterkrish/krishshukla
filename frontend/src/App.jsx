import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MyPromptsPage from './pages/MyPromptsPage';
import PromptDetailsPage from './pages/PromptDetailsPage';
import CreatePromptPage from './pages/CreatePromptPage';
import EditPromptPage from './pages/EditPromptPage';
import FavoritesPage from './pages/FavoritesPage';
import AiImproverPage from './pages/AiImproverPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prompts"
            element={
              <ProtectedRoute>
                <MyPromptsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prompts/create"
            element={
              <ProtectedRoute>
                <CreatePromptPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prompts/edit/:id"
            element={
              <ProtectedRoute>
                <EditPromptPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prompts/:id"
            element={
              <ProtectedRoute>
                <PromptDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-improver"
            element={
              <ProtectedRoute>
                <AiImproverPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

