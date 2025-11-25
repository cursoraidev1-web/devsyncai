import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Clock,
  CheckCircle,
  Target,
  Activity,
  Calendar
} from 'lucide-react';
import './Analytics.css';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');

  const kpiCards = [
    {
      label: 'PRD Completion Rate',
      value: '87%',
      change: '+5.2%',
      trend: 'up',
      icon: CheckCircle,
      color: '#10b981'
    },
    {
      label: 'Avg Task Velocity',
      value: '24',
      change: '+8',
      trend: 'up',
      icon: Activity,
      color: '#4f46e5'
    },
    {
      label: 'Bug-to-Feature Ratio',
      value: '0.18',
      change: '-0.04',
      trend: 'down',
      icon: Target,
      color: '#f59e0b'
    },
    {
      label: 'Team Utilization',
      value: '92%',
      change: '+3%',
      trend: 'up',
      icon: Users,
      color: '#8b5cf6'
    }
  ];

  const projectProgress = [
    { name: 'E-Commerce Platform', progress: 65, tasks: { total: 45, completed: 29 }, status: 'on-track' },
    { name: 'Mobile App Redesign', progress: 40, tasks: { total: 32, completed: 13 }, status: 'on-track' },
    { name: 'API Integration', progress: 78, tasks: { total: 18, completed: 14 }, status: 'ahead' },
    { name: 'Admin Dashboard', progress: 25, tasks: { total: 28, completed: 7 }, status: 'behind' }
  ];

  const teamPerformance = [
    { member: 'John Doe', role: 'Developer', tasksCompleted: 24, onTime: '95%', quality: 'A' },
    { member: 'Jane Smith', role: 'Designer', tasksCompleted: 18, onTime: '92%', quality: 'A' },
    { member: 'Mike Johnson', role: 'Developer', tasksCompleted: 21, onTime: '88%', quality: 'B+' },
    { member: 'Sarah Wilson', role: 'QA Engineer', tasksCompleted: 32, onTime: '97%', quality: 'A+' },
    { member: 'Tom Brown', role: 'DevOps', tasksCompleted: 15, onTime: '90%', quality: 'A' }
  ];

  const deploymentMetrics = [
    { metric: 'Total Deployments', value: 145, change: '+23', period: 'this month' },
    { metric: 'Success Rate', value: '98.5%', change: '+1.2%', period: 'vs last month' },
    { metric: 'Avg Deploy Time', value: '4m 32s', change: '-45s', period: 'improvement' },
    { metric: 'Failed Deployments', value: 3, change: '-2', period: 'this month' }
  ];

  const sprintVelocity = [
    { sprint: 'Sprint 1', planned: 45, completed: 42, percentage: 93 },
    { sprint: 'Sprint 2', planned: 48, completed: 46, percentage: 96 },
    { sprint: 'Sprint 3', planned: 52, completed: 48, percentage: 92 },
    { sprint: 'Sprint 4', planned: 50, completed: 50, percentage: 100 },
    { sprint: 'Sprint 5', planned: 55, completed: 51, percentage: 93 }
  ];

  return (
    <div className="analytics">
      <div className="analytics-header">
        <div>
          <h1>Analytics & Reports</h1>
          <p className="page-subtitle">Track performance metrics and team productivity</p>
        </div>
        <div className="time-range-selector">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn btn-primary">
            <Calendar size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <div className="kpi-icon" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
              <kpi.icon size={24} />
            </div>
            <div className="kpi-content">
              <div className="kpi-label">{kpi.label}</div>
              <div className="kpi-value">{kpi.value}</div>
              <div className={`kpi-change ${kpi.trend}`}>
                {kpi.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {kpi.change} from last period
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="analytics-grid">
        {/* Project Progress */}
        <div className="analytics-section">
          <div className="section-header">
            <h2>Project Progress</h2>
          </div>
          <div className="project-progress-list">
            {projectProgress.map((project, index) => (
              <div key={index} className="progress-item">
                <div className="progress-item-header">
                  <h3>{project.name}</h3>
                  <span className={`status-badge ${project.status}`}>
                    {project.status === 'on-track' ? 'On Track' : 
                     project.status === 'ahead' ? 'Ahead of Schedule' : 
                     'Behind Schedule'}
                  </span>
                </div>
                <div className="progress-details">
                  <span className="progress-text">
                    {project.tasks.completed} of {project.tasks.total} tasks completed
                  </span>
                  <span className="progress-percentage">{project.progress}%</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className={`progress-bar-fill ${project.status}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sprint Velocity */}
        <div className="analytics-section">
          <div className="section-header">
            <h2>Sprint Velocity</h2>
          </div>
          <div className="velocity-chart">
            {sprintVelocity.map((sprint, index) => (
              <div key={index} className="velocity-bar-group">
                <div className="velocity-bars">
                  <div 
                    className="velocity-bar planned"
                    style={{ height: `${(sprint.planned / 60) * 100}%` }}
                    title={`Planned: ${sprint.planned}`}
                  />
                  <div 
                    className="velocity-bar completed"
                    style={{ height: `${(sprint.completed / 60) * 100}%` }}
                    title={`Completed: ${sprint.completed}`}
                  />
                </div>
                <div className="velocity-label">{sprint.sprint}</div>
                <div className="velocity-percentage">{sprint.percentage}%</div>
              </div>
            ))}
          </div>
          <div className="velocity-legend">
            <div className="legend-item">
              <div className="legend-color planned"></div>
              <span>Planned</span>
            </div>
            <div className="legend-item">
              <div className="legend-color completed"></div>
              <span>Completed</span>
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="analytics-section full-width">
          <div className="section-header">
            <h2>Team Performance</h2>
          </div>
          <div className="team-table">
            <div className="table-header">
              <div className="table-col col-member">Team Member</div>
              <div className="table-col col-role">Role</div>
              <div className="table-col col-tasks">Tasks Completed</div>
              <div className="table-col col-ontime">On-Time Delivery</div>
              <div className="table-col col-quality">Quality Score</div>
            </div>
            <div className="table-body">
              {teamPerformance.map((member, index) => (
                <div key={index} className="table-row">
                  <div className="table-col col-member">
                    <div className="member-info">
                      <div className="member-avatar">
                        {member.member.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{member.member}</span>
                    </div>
                  </div>
                  <div className="table-col col-role">{member.role}</div>
                  <div className="table-col col-tasks">
                    <span className="badge badge-primary">{member.tasksCompleted}</span>
                  </div>
                  <div className="table-col col-ontime">
                    <div className="ontime-indicator">
                      <div className="indicator-bar">
                        <div 
                          className="indicator-fill"
                          style={{ width: member.onTime }}
                        />
                      </div>
                      <span>{member.onTime}</span>
                    </div>
                  </div>
                  <div className="table-col col-quality">
                    <span className={`quality-badge ${member.quality.replace('+', 'plus')}`}>
                      {member.quality}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deployment Metrics */}
        <div className="analytics-section full-width">
          <div className="section-header">
            <h2>Deployment Metrics</h2>
          </div>
          <div className="deployment-metrics-grid">
            {deploymentMetrics.map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-label">{metric.metric}</div>
                <div className="metric-value">{metric.value}</div>
                <div className="metric-change">
                  <span className={metric.change.startsWith('+') || metric.change.startsWith('-') ? 
                    (metric.change.startsWith('+') ? 'positive' : 'negative') : ''}>
                    {metric.change}
                  </span>
                  <span className="metric-period">{metric.period}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
