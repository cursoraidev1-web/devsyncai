'use client';


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HelpCircle, 
  MessageSquare, 
  AlertCircle,
  BookOpen,
  Flag,
  Star,
  FileText,
  RefreshCw,
  ArrowRight,
  Search,
  X,
  Send
} from 'lucide-react';
import { Modal } from '../../../components/ui';
import { submitFeedback } from '../../../services/api/feedback';
import { toast } from 'react-toastify';
import '../../../styles/pages/SupportHelp.css';

const getHealthUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  if (!baseUrl) {
    return '/health';
  }

  return baseUrl.includes('/api/v1')
    ? baseUrl.replace('/api/v1', '/health')
    : `${baseUrl.replace(/\/$/, '')}/health`;
};

const SupportHelp = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ticketData, setTicketData] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [reportData, setReportData] = useState({
    title: '',
    description: '',
    steps: ''
  });
  const [systemStatus, setSystemStatus] = useState({ loading: true, healthy: false, message: 'Checking system status...' });

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await fetch(getHealthUrl());
        if (!response.ok) {
          throw new Error('Health check failed');
        }

        const data = await response.json();
        setSystemStatus({
          loading: false,
          healthy: Boolean(data?.success),
          message: data?.message || 'API is reachable',
        });
      } catch (error) {
        setSystemStatus({
          loading: false,
          healthy: false,
          message: 'API health check unavailable',
        });
      }
    };

    loadStatus();
  }, []);

  const handleSubmitTicket = async (e) => {
    e?.preventDefault();
    if (!ticketData.subject || !ticketData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedback({
        type: 'general',
        title: ticketData.subject,
        description: `Priority: ${ticketData.priority}\n\n${ticketData.message}`,
        rating: undefined // Rating is optional
      });
      toast.success('Support ticket submitted successfully! We\'ll get back to you soon.');
      setShowTicketModal(false);
      setTicketData({ subject: '', message: '', priority: 'medium' });
    } catch (error) {
      console.error('Failed to submit ticket:', error);
      toast.error(error?.message || 'Failed to submit ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReport = async (e) => {
    e?.preventDefault();
    if (!reportData.title || !reportData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const description = reportData.steps 
        ? `${reportData.description}\n\nSteps to reproduce:\n${reportData.steps}`
        : reportData.description;

      await submitFeedback({
        type: 'bug',
        title: reportData.title,
        description: description,
        rating: undefined // Rating is optional
      });
      toast.success('Bug report submitted successfully! Thank you for helping us improve.');
      setShowReportModal(false);
      setReportData({ title: '', description: '', steps: '' });
    } catch (error) {
      console.error('Failed to submit report:', error);
      toast.error(error?.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/documents?search=${encodeURIComponent(query)}`);
  };

  const handleDocCategoryClick = (category) => {
    const categoryRoutes = {
      'Getting Started': '/landing',
      'Projects & Tasks': '/projects',
      'PRD & Documentation': '/documents',
      'CI/CD & Pipelines': '/ci-cd',
    };

    router.push(categoryRoutes[category.title] || '/documents');
  };

  const actionCards = [
    {
      icon: BookOpen,
      title: 'Browse Documentation',
      description: 'Explore our guides and find answers to your questions.',
      buttonText: 'Go to Docs',
      buttonVariant: 'primary',
      onClick: () => router.push('/documents')
    },
    {
      icon: MessageSquare,
      title: 'Contact Support',
      description: 'Get in touch with our team for personalized help.',
      buttonText: 'Open a Ticket',
      buttonVariant: 'outline',
      onClick: () => setShowTicketModal(true)
    },
    {
      icon: AlertCircle,
      title: 'Report a Problem',
      description: 'Let us know about a bug or issue you\'ve found.',
      buttonText: 'Report Issue',
      buttonVariant: 'outline',
      onClick: () => setShowReportModal(true)
    }
  ];

  const docCategories = [
    {
      icon: Flag,
      title: 'Getting Started',
      description: 'Your first steps with ZynDrx.'
    },
    {
      icon: Star,
      title: 'Projects & Tasks',
      description: 'Manage and organize your work.'
    },
    {
      icon: FileText,
      title: 'PRD & Documentation',
      description: 'Create and collaborate on docs.'
    },
    {
      icon: RefreshCw,
      title: 'CI/CD & Pipelines',
      description: 'Automate your workflows.'
    }
  ];

  return (
    <div className="support-help-page">
      <div className="support-header">
        <h1>Support & Help</h1>
      </div>

      <div className="support-search-section">
        <h2>How can we help you?</h2>
        <form onSubmit={handleSearch}>
          <div className="support-search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="support-action-cards">
        {actionCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="support-action-card">
              <div className="support-card-icon">
                <Icon size={24} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <button 
                className={`support-card-btn ${card.buttonVariant}`}
                onClick={card.onClick}
              >
                {card.buttonText}
              </button>
            </div>
          );
        })}
      </div>

      <div className="support-doc-categories">
        <h2>Documentation Categories</h2>
        <div className="doc-categories-grid">
          {docCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div 
                key={index} 
                className="doc-category-card"
                onClick={() => handleDocCategoryClick(category)}
              >
                <div className="doc-category-icon">
                  <Icon size={24} />
                </div>
                <div className="doc-category-content">
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>
                <ArrowRight size={20} className="doc-category-arrow" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="support-system-status">
        <h2>System Status</h2>
        <div
          className="system-status-link"
          style={{ color: systemStatus.healthy ? '#0f766e' : '#b45309', cursor: 'default' }}
        >
          {systemStatus.loading
            ? 'Checking platform health...'
            : `${systemStatus.healthy ? 'Operational' : 'Attention needed'}: ${systemStatus.message}`}
        </div>
      </div>

      {/* Support Ticket Modal */}
      <Modal
        isOpen={showTicketModal}
        onClose={() => {
          if (!submitting) {
            setShowTicketModal(false);
            setTicketData({ subject: '', message: '', priority: 'medium' });
          }
        }}
        title="Open a Support Ticket"
        subtitle="Describe your issue and we'll help you resolve it"
        size="md"
        footer={
          <>
            <button
              className="modal-btn-cancel"
              onClick={() => {
                if (!submitting) {
                  setShowTicketModal(false);
                  setTicketData({ subject: '', message: '', priority: 'medium' });
                }
              }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              className="modal-btn-primary"
              onClick={handleSubmitTicket}
              disabled={submitting || !ticketData.subject || !ticketData.message}
            >
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmitTicket}>
          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="ticket-subject">Subject *</label>
            <input
              id="ticket-subject"
              type="text"
              placeholder="Brief description of your issue"
              value={ticketData.subject}
              onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
              disabled={submitting}
              required
              maxLength={200}
            />
          </div>

          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="ticket-priority">Priority</label>
            <select
              id="ticket-priority"
              value={ticketData.priority}
              onChange={(e) => setTicketData({ ...ticketData, priority: e.target.value })}
              disabled={submitting}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white'
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="ticket-message">Message *</label>
            <textarea
              id="ticket-message"
              rows={6}
              placeholder="Please provide as much detail as possible about your issue..."
              value={ticketData.message}
              onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
              disabled={submitting}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>
        </form>
      </Modal>

      {/* Report Issue Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => {
          if (!submitting) {
            setShowReportModal(false);
            setReportData({ title: '', description: '', steps: '' });
          }
        }}
        title="Report a Problem"
        subtitle="Help us fix issues by providing detailed information"
        size="md"
        footer={
          <>
            <button
              className="modal-btn-cancel"
              onClick={() => {
                if (!submitting) {
                  setShowReportModal(false);
                  setReportData({ title: '', description: '', steps: '' });
                }
              }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              className="modal-btn-primary"
              onClick={handleSubmitReport}
              disabled={submitting || !reportData.title || !reportData.description}
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmitReport}>
          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="report-title">Title *</label>
            <input
              id="report-title"
              type="text"
              placeholder="Brief description of the bug"
              value={reportData.title}
              onChange={(e) => setReportData({ ...reportData, title: e.target.value })}
              disabled={submitting}
              required
              maxLength={200}
            />
          </div>

          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="report-description">Description *</label>
            <textarea
              id="report-description"
              rows={4}
              placeholder="Describe what happened and what you expected to happen..."
              value={reportData.description}
              onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
              disabled={submitting}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div className="input-group">
            <label htmlFor="report-steps">Steps to Reproduce (Optional)</label>
            <textarea
              id="report-steps"
              rows={4}
              placeholder="1. Step one...&#10;2. Step two...&#10;3. Step three..."
              value={reportData.steps}
              onChange={(e) => setReportData({ ...reportData, steps: e.target.value })}
              disabled={submitting}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SupportHelp;


