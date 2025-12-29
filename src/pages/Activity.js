import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  MessageSquare, 
  Upload,
  Filter,
  Search,
  Clock
} from 'lucide-react';
import { fetchActivity } from '../api/activity';
import { toast } from 'react-toastify';
import PulsingLoader from '../components/PulsingLoader';
import './Activity.css';

const Activity = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const data = await fetchActivity();
        setActivities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load activity:', error);
        toast.error('Failed to load activity');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    loadActivity();
  }, []);

  // Default activities if API returns empty
  const defaultActivities = [
    {
      id: 1,
      type: 'status-change',
      icon: CheckCircle,
      title: 'Olivia Chen updated the status of "Develop API Documentation"',
      description: 'Changed status from In Review to Completed.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 45 * 60 * 1000),
      tag: 'Status Change',
      tagColor: '#3182CE',
      user: { name: 'Olivia Chen', avatar: 'OC' }
    },
    {
      id: 2,
      type: 'comment',
      icon: MessageSquare,
      title: 'Ben Carter left a comment on "Finalize Marketing Copy"',
      description: '"Looks great! Just one minor suggestion for the headline. Let\'s discuss."',
      timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000 - 10 * 60 * 1000),
      tag: 'Comment',
      tagColor: '#38A169',
      user: { name: 'Ben Carter', avatar: 'BC' }
    },
    {
      id: 3,
      type: 'file-added',
      icon: Upload,
      title: 'Sophie Turner added a new file',
      description: 'File: Final_Marketing_Assets.zip',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000 - 30 * 60 * 1000),
      tag: 'File Added',
      tagColor: '#DD6B20',
      user: { name: 'Sophie Turner', avatar: 'ST' }
    }
  ];

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);

    const isToday = days === 0;
    const isYesterday = days === 1;

    if (isToday && hours === 0) {
      return `Today at ${new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    if (isToday) {
      return `Today at ${new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    if (isYesterday) {
      return `Yesterday at ${new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const groupActivitiesByDate = (activities) => {
    const groups = {};
    activities.forEach(activity => {
      const date = new Date(activity.timestamp);
      const isToday = date.toDateString() === new Date().toDateString();
      const isYesterday = date.toDateString() === new Date(Date.now() - 86400000).toDateString();
      
      let groupKey;
      if (isToday) groupKey = 'Today';
      else if (isYesterday) groupKey = 'Yesterday';
      else groupKey = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(activity);
    });
    return groups;
  };

  // Use fetched activities or fallback to default activities
  const displayActivities = activities.length > 0 ? activities : defaultActivities;
  const groupedActivities = groupActivitiesByDate(displayActivities);

  if (loading) {
    return (
      <div className="activity-page">
        <div className="activity-header">
          <div className="activity-breadcrumbs">
            Projects &gt; &quot;QuantumLeap&quot; Platform &gt; Activity
          </div>
        </div>
        <PulsingLoader message="Loading activity..." />
      </div>
    );
  }

  return (
    <div className="activity-page">
      <div className="activity-header">
        <div className="activity-breadcrumbs">
          Projects &gt; &quot;QuantumLeap&quot; Platform &gt; Activity
        </div>
        <div className="activity-header-actions">
          <button className="activity-action-btn">
            <Filter size={18} />
            Filter
          </button>
          <button className="activity-action-btn">
            <Search size={18} />
            Search
          </button>
        </div>
      </div>

      <div className="activity-title-section">
        <h1>&quot;QuantumLeap&quot; Platform — Activity</h1>
        <div className="activity-tabs">
          <button 
            className={`activity-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`activity-tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button 
            className={`activity-tab ${activeTab === 'files' ? 'active' : ''}`}
            onClick={() => setActiveTab('files')}
          >
            Files
          </button>
          <button 
            className={`activity-tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
          <button 
            className={`activity-tab ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            Team
          </button>
        </div>
      </div>

      <div className="activity-feed">
        {Object.entries(groupedActivities).map(([dateGroup, dateActivities]) => (
          <div key={dateGroup} className="activity-date-group">
            <h2 className="activity-date-header">{dateGroup}</h2>
            {dateActivities.map(activity => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="activity-item">
                  <div className="activity-timeline">
                    <div className="activity-timeline-line"></div>
                    <div className="activity-timeline-icon" style={{ backgroundColor: '#6B46C1' }}>
                      <Icon size={16} color="white" />
                    </div>
                  </div>
                  <div className="activity-content">
                    <div className="activity-main">
                      <p className="activity-text">{activity.title}</p>
                      <p className="activity-description">{activity.description}</p>
                      <div className="activity-meta">
                        <span className="activity-time">
                          <Clock size={14} />
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                    <div className="activity-side">
                      <span 
                        className="activity-tag"
                        style={{ backgroundColor: `${activity.tagColor}15`, color: activity.tagColor }}
                      >
                        {activity.tag}
                      </span>
                      <div className="activity-avatar">
                        {activity.user.avatar}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activity;

