import React, { useState } from 'react';
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
  Search
} from 'lucide-react';
import './SupportHelp.css';

const SupportHelp = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const actionCards = [
    {
      icon: BookOpen,
      title: 'Browse Documentation',
      description: 'Explore our guides and find answers to your questions.',
      buttonText: 'Go to Docs',
      buttonVariant: 'primary'
    },
    {
      icon: MessageSquare,
      title: 'Contact Support',
      description: 'Get in touch with our team for personalized help.',
      buttonText: 'Open a Ticket',
      buttonVariant: 'outline'
    },
    {
      icon: AlertCircle,
      title: 'Report a Problem',
      description: 'Let us know about a bug or issue you\'ve found.',
      buttonText: 'Report Issue',
      buttonVariant: 'outline'
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
        <div className="support-search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search help articles, FAQs, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
              <button className={`support-card-btn ${card.buttonVariant}`}>
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
              <div key={index} className="doc-category-card">
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
        <a href="#" className="system-status-link">
          View Status Page →
        </a>
      </div>
    </div>
  );
};

export default SupportHelp;


