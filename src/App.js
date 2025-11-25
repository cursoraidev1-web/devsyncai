import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Dashboard from './pages/Dashboard';
import PRDDesigner from './pages/PRDDesigner';
import TaskTracker from './pages/TaskTracker';
import Documentation from './pages/Documentation';
import CICD from './pages/CICD';
import Analytics from './pages/Analytics';
import Team from './pages/Team';

function App() {
  const [currentUser, setCurrentUser] = useState({
    name: 'John Doe',
    role: 'Product Manager', // Product Manager, Developer, QA, DevOps
    avatar: 'JD'
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Router>
      <div className="app">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentUser={currentUser}
        />
        <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Header currentUser={currentUser} />
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
              <Route path="/prd" element={<PRDDesigner currentUser={currentUser} />} />
              <Route path="/tasks" element={<TaskTracker currentUser={currentUser} />} />
              <Route path="/docs" element={<Documentation currentUser={currentUser} />} />
              <Route path="/cicd" element={<CICD currentUser={currentUser} />} />
              <Route path="/analytics" element={<Analytics currentUser={currentUser} />} />
              <Route path="/team" element={<Team currentUser={currentUser} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
