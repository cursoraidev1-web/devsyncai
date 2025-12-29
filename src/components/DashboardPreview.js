import React from 'react';
import { Search, Bell, MoreVertical, Plus, FileText } from 'lucide-react';
import './DashboardPreview.css';

const DashboardPreview = () => {
  return (
    <div className="dashboard-preview-container">
      <div className="dashboard-preview-inner">
        {/* Dashboard Header */}
        <div className="dashboard-header-preview">
          <div className="dashboard-top-bar">
            <div className="dashboard-logo-preview">
              <div className="logo-square-small">
                <span className="logo-z-small">Z</span>
              </div>
              <span>Zyndrx</span>
            </div>
            <div className="dashboard-breadcrumb">Main Menu &gt; Dashboard</div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content-preview">
          <div className="dashboard-sidebar-preview">
            <div className="sidebar-item active">Dashboard</div>
            <div className="sidebar-item">My Tasks</div>
            <div className="sidebar-item">Projects</div>
            <div className="sidebar-item">Teams</div>
            <div className="sidebar-section">PRODUCT TOOLS</div>
            <div className="sidebar-item">PRD Designer</div>
            <div className="sidebar-item">Documentation Hub</div>
            <div className="sidebar-item">Handoff System</div>
            <div className="sidebar-item">CI/CD Auto-Agent</div>
            <div className="sidebar-item">Integrations</div>
          </div>
          <div className="dashboard-main-preview">
            <div className="dashboard-welcome">
              <h2>Welcome back, Calvin 👋</h2>
              <p>Here's your project and team performance summary.</p>
            </div>
            <div className="metrics-preview">
              <div className="metric-card">
                <div className="metric-label">Tasks In Progress</div>
                <div className="metric-value">18</div>
                <div className="metric-change positive">↑ +5 from last week</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Tasks Completed</div>
                <div className="metric-value">231</div>
                <div className="metric-change positive">↑ +11% vs last month</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Overdue</div>
                <div className="metric-value">3</div>
                <div className="metric-change negative">↓ -1 from last week</div>
              </div>
            </div>
            <div className="dashboard-chart-section">
              <div className="chart-header">
                <div>
                  <h3>Overview - Activity & Progress</h3>
                  <p>Tasks completed this month</p>
                </div>
              </div>
              <div className="chart-visual">
                <div className="chart-bars">
                  <div className="chart-bar" style={{height: '40%'}}>Apr</div>
                  <div className="chart-bar" style={{height: '50%'}}>May</div>
                  <div className="chart-bar" style={{height: '60%'}}>Jun</div>
                  <div className="chart-bar" style={{height: '70%'}}>Jul</div>
                  <div className="chart-bar active" style={{height: '100%'}}>Aug</div>
                  <div className="chart-bar" style={{height: '80%'}}>Sep</div>
                  <div className="chart-bar" style={{height: '75%'}}>Oct</div>
                </div>
                <div className="chart-label">August 2024 120 tasks</div>
              </div>
            </div>
            <div className="project-overview-header">
              <h3>Project Overview</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;














