import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
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
import PulsingLoader from '../components/PulsingLoader';
import './Analytics.css';

const Analytics = () => {
  const { loadAnalytics, projects } = useApp();
  const [timeRange, setTimeRange] = useState('week');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const projectId = projects?.[0]?.id;
    if (projectId) {
      setLoading(true);
      loadAnalytics(projectId)
        .then(data => {
          // Transform API response to match expected format
          const transformed = {
            kpiCards: data?.kpiCards || data?.kpi_cards || data?.kpis || [],
            projectProgress: data?.projectProgress || data?.project_progress || data?.projects || [],
            teamPerformance: data?.teamPerformance || data?.team_performance || data?.teams || [],
            deploymentMetrics: data?.deploymentMetrics || data?.deployment_metrics || data?.deployments || [],
            sprintVelocity: data?.sprintVelocity || data?.sprint_velocity || data?.sprints || []
          };
          setAnalyticsData(transformed);
        })
        .catch(error => {
          console.error('Failed to load analytics:', error);
          setAnalyticsData(null);
        })
        .finally(() => setLoading(false));
    } else {
      setAnalyticsData(null);
    }
  }, [projects, loadAnalytics, timeRange]);

  // Load KPI cards from analyticsData
  const kpiCards = analyticsData?.kpiCards || [];

  // Load project progress from analyticsData
  const projectProgress = analyticsData?.projectProgress || [];

  // Load team performance from analyticsData
  const teamPerformance = analyticsData?.teamPerformance || [];

  // Load deployment metrics from analyticsData
  const deploymentMetrics = analyticsData?.deploymentMetrics || [];

  // Load sprint velocity from analyticsData
  const sprintVelocity = analyticsData?.sprintVelocity || [];

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
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <PulsingLoader message="Loading analytics data..." />
          </div>
        ) : kpiCards.length > 0 ? (
          kpiCards.map((kpi, index) => (
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
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <BarChart3 size={48} style={{ color: '#718096', marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No analytics data available</h3>
            <p style={{ color: '#718096' }}>Analytics will appear here once you have project data</p>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="analytics-grid">
        {/* Project Progress */}
        <div className="analytics-section">
          <div className="section-header">
            <h2>Project Progress</h2>
          </div>
          {projectProgress.length > 0 ? (
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
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Target size={48} style={{ color: '#718096', marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No project progress data</h3>
              <p style={{ color: '#718096' }}>Project progress will appear here once available</p>
            </div>
          )}
        </div>

        {/* Sprint Velocity */}
        <div className="analytics-section">
          <div className="section-header">
            <h2>Sprint Velocity</h2>
          </div>
          {sprintVelocity.length > 0 ? (
            <>
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
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Activity size={48} style={{ color: '#718096', marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No sprint velocity data</h3>
              <p style={{ color: '#718096' }}>Sprint velocity will appear here once available</p>
            </div>
          )}
        </div>

        {/* Team Performance */}
        <div className="analytics-section full-width">
          <div className="section-header">
            <h2>Team Performance</h2>
          </div>
          {teamPerformance.length > 0 ? (
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
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Users size={48} style={{ color: '#718096', marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No team performance data</h3>
              <p style={{ color: '#718096' }}>Team performance metrics will appear here once available</p>
            </div>
          )}
        </div>

        {/* Deployment Metrics */}
        <div className="analytics-section full-width">
          <div className="section-header">
            <h2>Deployment Metrics</h2>
          </div>
          {deploymentMetrics.length > 0 ? (
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
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Activity size={48} style={{ color: '#718096', marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No deployment metrics</h3>
              <p style={{ color: '#718096' }}>Deployment metrics will appear here once CI/CD is configured</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
