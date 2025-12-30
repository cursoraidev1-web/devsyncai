import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompanyProvider } from './context/CompanyContext';
import { PlanProvider } from './context/PlanContext';
import { AppProvider, useApp } from './context/AppContext';
import PWAInstallPrompt from './components/PWAInstallPrompt';

// Landing Page
import Landing from './pages/Landing';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserSignup from './pages/auth/UserSignup';
import ResetPassword from './pages/auth/ResetPassword';
import ResetPasswordSuccess from './pages/auth/ResetPasswordSuccess';
import Verify2FA from './pages/auth/Verify2FA';
import OAuthCallback from './pages/auth/OAuthCallback';
import AcceptInvite from './pages/AcceptInvite';
import AcceptCompanyInvite from './pages/AcceptCompanyInvite';

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
import SupportHelp from './pages/SupportHelp';
import Activity from './pages/Activity';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Teams from './pages/Teams';
import HandoffSystem from './pages/HandoffSystem';
import Integrations from './pages/Integrations';
import Feedback from './pages/Feedback';
import DocumentationEditor from './pages/DocumentationEditor';
import HandoffDetails from './pages/HandoffDetails';
import Pricing from './pages/Pricing';

// Layout
import Layout from './components/Layout';
import UpgradeModal from './components/UpgradeModal';
import OfflineIndicator from './components/OfflineIndicator';

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
        {/* Landing Page */}
        <Route 
          path="/landing" 
          element={<Landing />} 
        />
        
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <UserSignup />} 
        />
        <Route 
          path="/forgot-password" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <ResetPassword />} 
        />
        <Route 
          path="/reset-password" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <ResetPassword />} 
        />
        <Route 
          path="/reset-password-success" 
          element={<ResetPasswordSuccess />} 
        />
        <Route 
          path="/verify-2fa" 
          element={<Verify2FA />} 
        />
        <Route 
          path="/auth/callback" 
          element={<OAuthCallback />} 
        />
        <Route 
          path="/accept-invite" 
          element={<AcceptInvite />} 
        />
        <Route 
          path="/accept-company-invite" 
          element={<AcceptCompanyInvite />} 
        />
        <Route 
          path="/pricing" 
          element={<Pricing />} 
        />

        {/* Root redirect - must come before protected routes */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/landing" />} 
        />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardRouter />} />
          <Route path="prd-designer" element={<PRDDesigner />} />
          <Route path="tasks" element={<TaskTracker />} />
          <Route path="documents" element={<DocumentStore />} />
          <Route path="ci-cd" element={<CICDIntegration />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="support" element={<SupportHelp />} />
          <Route path="activity" element={<Activity />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="teams" element={<Teams />} />
          <Route path="handoffs" element={<HandoffSystem />} />
          <Route path="handoffs/:id" element={<HandoffDetails />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="documents/editor" element={<DocumentationEditor />} />
          <Route path="documents/editor/:id" element={<DocumentationEditor />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/landing" />} />
      </Routes>
    </Router>
  );
}

const GlobalUI = () => {
  const { upgradeModalOpen, upgradeMessage, closeUpgradeModal } = useApp();
  return (
    <>
      <PWAInstallPrompt />
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={closeUpgradeModal}
        message={upgradeMessage}
      />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <PlanProvider>
          <AppProvider>
            <GlobalUI />
            <AppRoutes />
            <OfflineIndicator />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </AppProvider>
        </PlanProvider>
      </CompanyProvider>
    </AuthProvider>
  );
}

export default App;
