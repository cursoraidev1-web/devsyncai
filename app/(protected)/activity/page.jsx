'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  CheckCircle,
  MessageSquare,
  Upload,
  ArrowRightLeft,
  FileText,
  Filter,
  Clock,
} from 'lucide-react';
import { fetchActivity } from '../../../services/api/activity';
import { toast } from 'react-toastify';
import PulsingLoader from '../../../components/PulsingLoader';
import '../../../styles/pages/Activity.css';

const TYPE_META = {
  all: { label: 'All', icon: Filter, color: '#6B46C1' },
  task: { label: 'Tasks', icon: CheckCircle, color: '#3182CE' },
  prd: { label: 'PRDs', icon: FileText, color: '#7C3AED' },
  comment: { label: 'Comments', icon: MessageSquare, color: '#38A169' },
  file: { label: 'Files', icon: Upload, color: '#DD6B20' },
  handoff: { label: 'Handoffs', icon: ArrowRightLeft, color: '#0F766E' },
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const describeActivity = (activity) => {
  const actor = activity.user?.full_name || activity.user?.name || 'A teammate';

  switch (activity.type) {
    case 'task':
      return `${actor} ${activity.action} task "${activity.title}"`;
    case 'prd':
      return `${actor} ${activity.action} PRD "${activity.title}"`;
    case 'comment':
      return `${actor} added a comment`;
    case 'file':
      return `${actor} uploaded "${activity.title}"`;
    case 'handoff':
      return `${actor} ${activity.action} handoff "${activity.title}"`;
    default:
      return `${actor} updated "${activity.title}"`;
  }
};

const secondaryText = (activity) => {
  if (activity.type === 'comment') {
    return activity.metadata?.content || 'Comment added';
  }

  if (activity.type === 'task') {
    return activity.metadata?.status ? `Status: ${activity.metadata.status}` : 'Task updated';
  }

  if (activity.type === 'prd' || activity.type === 'handoff') {
    return activity.metadata?.status ? `Status: ${activity.metadata.status}` : 'Updated';
  }

  return activity.title;
};

const Activity = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      setLoading(true);
      try {
        const filters = selectedType === 'all' ? {} : { type: selectedType };
        const data = await fetchActivity(filters);
        setActivities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load activity:', error);
        toast.error(error?.data?.error || error?.message || 'Failed to load activity');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [selectedType]);

  const activityTypes = useMemo(() => Object.entries(TYPE_META), []);

  if (loading) {
    return (
      <div className="activity-page">
        <div className="activity-header">
          <div className="activity-breadcrumbs">Workspace Activity</div>
        </div>
        <PulsingLoader message="Loading activity..." />
      </div>
    );
  }

  return (
    <div className="activity-page">
      <div className="activity-header">
        <div className="activity-breadcrumbs">Workspace Activity</div>
      </div>

      <div className="activity-title-section">
        <h1>Activity Feed</h1>
        <div className="activity-tabs">
          {activityTypes.map(([type, meta]) => (
            <button
              key={type}
              className={`activity-tab ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {meta.label}
            </button>
          ))}
        </div>
      </div>

      <div className="activity-feed">
        {activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <Clock size={48} style={{ color: '#718096', marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No activity yet</h3>
            <p style={{ color: '#718096' }}>
              Recent task updates, comments, uploads, and handoffs will appear here.
            </p>
          </div>
        ) : (
          activities.map((activity) => {
            const meta = TYPE_META[activity.type] || TYPE_META.all;
            const Icon = meta.icon;

            return (
              <div key={activity.id} className="activity-item">
                <div className="activity-timeline">
                  <div className="activity-timeline-line"></div>
                  <div className="activity-timeline-icon" style={{ backgroundColor: meta.color }}>
                    <Icon size={16} color="white" />
                  </div>
                </div>
                <div className="activity-content">
                  <div className="activity-main">
                    <p className="activity-text">{describeActivity(activity)}</p>
                    <p className="activity-description">{secondaryText(activity)}</p>
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
                      style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
                    >
                      {meta.label}
                    </span>
                    <div className="activity-avatar">
                      {(activity.user?.full_name || activity.user?.name || 'U')
                        .split(' ')
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Activity;
