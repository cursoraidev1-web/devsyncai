import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import PMDashboard from './pages/dashboards/PMDashboard';
import DeveloperDashboard from './pages/dashboards/DeveloperDashboard';
import QADashboard from './pages/dashboards/QADashboard';
import DevOpsDashboard from './pages/dashboards/DevOpsDashboard';

// Feature Pages
import PRDDesigner from './pages/PRDDesigner';
import TaskTracker from './pages/TaskTracker';
import DocumentStore from './pages/DocumentStore';
import CICDIntegration from './pages/CICDIntegration';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

// Layout
import Layout from './components/Layout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Dashboard Router - routes to correct dashboard based on role
const DashboardRouter = () => {
  const { user } = useAuth();

  const dashboards = {
    'pm': <PMDashboard />,
    'product-owner': <PMDashboard />,
    'developer': <DeveloperDashboard />,
    'qa': <QADashboard />,
    'devops': <DevOpsDashboard />,
    'admin': <PMDashboard />
  };

  return dashboards[user?.role] || <DeveloperDashboard />;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardRouter />} />
          <Route path="prd-designer" element={<PRDDesigner />} />
          <Route path="tasks" element={<TaskTracker />} />
          <Route path="documents" element={<DocumentStore />} />
          <Route path="ci-cd" element={<CICDIntegration />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
