'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Check, 
  ChevronRight,
  Github,
  Zap,
  Palette,
  List,
  CheckSquare,
  Plus,
  FileText,
  Bell,
  Search
} from 'lucide-react';
import '../../styles/pages/Landing.css';

const Landing = () => {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState('what-makes-different');

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const faqs = [
    {
      id: 'small-teams',
      question: 'Can small teams use it?',
      answer: 'Yes, Zyndrx is designed to scale from small startup teams to large enterprise organizations.'
    },
    {
      id: 'replace-tools',
      question: 'Does Zyndrx replace my existing tools?',
      answer: 'Zyndrx integrates with your existing tools, enhancing your workflow without forcing you to abandon what works.'
    },
    {
      id: 'difficult-learn',
      question: 'Is Zyndrx difficult to learn?',
      answer: 'No, Zyndrx features an intuitive interface designed for modern tech teams. Most users are productive within their first day.'
    },
    {
      id: 'is-free',
      question: 'Is Zyndrx free?',
      answer: 'Zyndrx offers a free tier for small teams, with premium plans available for larger organizations and advanced features.'
    },
    {
      id: 'what-makes-different',
      question: 'What makes Zyndrx different?',
      answer: 'Zyndrx brings every tech role into one connected flow. It removes chaos, keeps teams in sync, and will have an AI layer that makes everything even smarter. Unlike fragmented tools, Zyndrx is a true home base where product, design, development, and marketing work together without lost context.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-header-content">
          <div className="landing-logo">
            <div className="logo-square">
              <span className="logo-z">Z</span>
            </div>
            <span className="logo-text">Zyndrx</span>
          </div>
          <nav className="landing-nav">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#integrations">Integrations</a>
            <a href="#about">About</a>
          </nav>
          <div className="landing-header-actions">
            <Link href="/login" className="landing-link">Sign in</Link>
            <button 
              className="landing-btn-primary"
              onClick={() => router.push('/register')}
            >
              Get started
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          {/* Avatars around headline */}
          <div className="hero-avatars">
            <div className="avatar-float avatar-designer">
              <div className="avatar-circle"></div>
              <span className="avatar-label">Designer</span>
            </div>
            <div className="avatar-float avatar-backend">
              <div className="avatar-circle"></div>
              <span className="avatar-label">Backend</span>
            </div>
            <div className="avatar-float avatar-ai-engineer">
              <div className="avatar-circle"></div>
              <span className="avatar-label">AI Engineer</span>
            </div>
            <div className="avatar-float avatar-manager">
              <div className="avatar-circle"></div>
              <span className="avatar-label">Manager</span>
            </div>
          </div>

          <h1 className="landing-hero-title">
            Transforming Tech Teams Into One Seamless Workspace.
          </h1>
          <p className="landing-hero-subtitle">
            From AI-generated PRDs to automated CI/CD workflows, everything stays connected so nothing falls through the cracks.
          </p>
          <div className="hero-cta-section">
            <button 
              className="landing-btn-primary landing-btn-large"
              onClick={() => router.push('/register')}
            >
              Get started
              <ArrowRight size={20} />
            </button>
            <p className="hero-cta-note">No credit card required. Set up in minutes.</p>
          </div>
          
          <div className="landing-hero-preview">
            <div className="dashboard-preview">
              {/* Avatars around dashboard */}
              <div className="dashboard-avatars">
                <div className="avatar-float avatar-qa">
                  <div className="avatar-circle"></div>
                  <span className="avatar-label">QA Engineer</span>
                </div>
                <div className="avatar-float avatar-admin">
                  <div className="avatar-circle"></div>
                  <span className="avatar-label">Admin</span>
                </div>
                <div className="avatar-float avatar-cloud">
                  <div className="avatar-circle"></div>
                  <span className="avatar-label">Cloud Engineer</span>
                </div>
                <div className="avatar-float avatar-frontend">
                  <div className="avatar-circle"></div>
                  <span className="avatar-label">Frontend</span>
                </div>
              </div>

              <div className="dashboard-header-preview">
                <div className="dashboard-top-bar">
                  <div className="dashboard-logo-preview">
                    <div className="avatar-inline">
                      <div className="avatar-circle-small"></div>
                    </div>
                    <div className="logo-square-small">
                      <span className="logo-z-small">Z</span>
                    </div>
                    <span>Zyndrx</span>
                  </div>
                  <div className="dashboard-top-right">
                    <div className="dashboard-search">
                      <Search size={16} />
                      <span>Search anything...</span>
                    </div>
                    <div className="dashboard-notification">
                      <Bell size={18} />
                    </div>
                    <div className="dashboard-user-menu">
                      <div className="avatar-circle-small"></div>
                      <div className="menu-dots">⋯</div>
                    </div>
                  </div>
                </div>
                <div className="dashboard-breadcrumb">Main Menu &gt; Dashboard</div>
              </div>
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
                      <div className="metric-label">Overdue Tasks</div>
                      <div className="metric-value">3</div>
                      <div className="metric-change negative">↓ -1 from last week</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-label">AI Suggestions</div>
                      <div className="metric-value">7</div>
                      <div className="metric-description">New ideas to optimize workflow</div>
                    </div>
                  </div>
                  <div className="dashboard-chart-section">
                    <div className="chart-header">
                      <div>
                        <h3>Overview - Activity & Progress</h3>
                        <p>Tasks completed this month</p>
                      </div>
                      <select className="chart-dropdown">
                        <option>Last Month</option>
                      </select>
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
                  <div className="dashboard-actions">
                    <button className="action-btn primary">
                      <Plus size={18} />
                      New Task
                    </button>
                    <button className="action-btn secondary">
                      <FileText size={18} />
                      New Project
                    </button>
                  </div>
                  <div className="recent-activity">
                    <h3>Recent Activity</h3>
                    <div className="activity-list">
                      <div className="activity-item-small">Recent updates...</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introductory Text Section */}
      <section className="landing-intro">
        <div className="landing-container">
          <p className="landing-intro-label">Everything your team needs to ship better products.</p>
          <h2 className="landing-intro-title">
            Not just another project tool, a true home base for software teams. Zyndrx is designed to fit how real tech teams work, a space where every role actually fits and works together without friction.
          </h2>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features">
        <div className="landing-container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-image">
                <div className="feature-screenshot-placeholder">
                  <div className="screenshot-overlay"></div>
                  <div className="screenshot-overlay"></div>
                  <div className="screenshot-overlay"></div>
                </div>
              </div>
              <h3 className="feature-title">A Unified Workflow</h3>
              <p className="feature-description">
                Everything your team needs lives in one place. Product, design, development, and marketing work together without lost context.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-image">
                <div className="feature-screenshot-placeholder">
                  <div className="screenshot-board"></div>
                </div>
              </div>
              <h3 className="feature-title">Structured Project Management</h3>
              <p className="feature-description">
                Tasks move smoothly from one role to the next. Clear stages, clean handoffs, and consistent progress from start to finish.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-image">
                <div className="feature-screenshot-placeholder">
                  <div className="screenshot-cards"></div>
                </div>
              </div>
              <h3 className="feature-title">Real-Time Visibility</h3>
              <p className="feature-description">
                See what's happening, what's next, and who's responsible instantly. Without guessing, no chasing, no unnecessary meetings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Specific Dashboards Section */}
      <section className="landing-dashboards">
        <div className="landing-container">
          <h2 className="landing-section-title">Role-Specific Dashboards</h2>
          <p className="landing-section-description">
            Each role sees only what matters to them. Designers, developers, and product managers all get clarity without clutter.
          </p>
          <div className="dashboard-showcase">
            <div className="dashboard-showcase-preview">
              <div className="dashboard-header-preview">
                <div className="dashboard-logo-preview">
                  <div className="logo-square-small">
                    <span className="logo-z-small">Z</span>
                  </div>
                  <span>Zyndrx</span>
                </div>
              </div>
              <div className="dashboard-content-preview">
                <div className="dashboard-sidebar-preview">
                  <div className="sidebar-item active">Dashboard</div>
                </div>
                <div className="dashboard-main-preview">
                  <h2>Welcome back, Calvin</h2>
                  <div className="metrics-preview">
                    <div className="metric-card">
                      <div className="metric-label">Active Tasks</div>
                      <div className="metric-value">3</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-label">In Suggestions</div>
                      <div className="metric-value">7</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-Page CTA Banner */}
      <section className="landing-cta-banner">
        <div className="landing-container">
          <h2 className="landing-cta-title">Built for real teams doing real work.</h2>
          <p className="landing-cta-description">
            We created Zyndrx for teams tired of fragmented tools, unclear requirements, and slow delivery cycles. Whether you're building your first product or scaling a complex system, Zyndrx adapts to how your team works not the other way around.
          </p>
          <button 
            className="landing-btn-primary landing-btn-large"
            onClick={() => router.push('/register')}
          >
            Get started
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="landing-integrations">
        <div className="landing-container">
          <h2 className="landing-section-title">Connect Zyndrx to the tools you already use</h2>
          <p className="landing-section-description">
            Zyndrx fits into your existing workflow without forcing change. Sync your favorite tools in minutes and keep work moving without friction.
          </p>
          <div className="integrations-showcase">
            <div className="integrations-number">7</div>
            <div className="integrations-logos">
              <div className="integration-logo">
                <CheckSquare size={40} />
                <span>Jira</span>
              </div>
              <div className="integration-logo">
                <Zap size={40} />
                <span>Slack</span>
              </div>
              <div className="integration-logo">
                <Github size={40} />
                <span>GitHub</span>
              </div>
              <div className="integration-logo">
                <Palette size={40} />
                <span>Figma</span>
              </div>
              <div className="integration-logo">
                <List size={40} />
                <span>Asana</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="landing-faqs">
        <div className="landing-container landing-faqs-container">
          <div className="faqs-content">
            <div className="faqs-image">
              <div className="faqs-image-placeholder">
                <div className="team-collaboration-icon"></div>
              </div>
            </div>
            <div className="faqs-list">
              <h2 className="landing-section-title">FAQs</h2>
              <p className="landing-section-description">Get answers to common questions about Zyndrx?</p>
              <div className="faq-items">
                {faqs.map((faq) => (
                  <div 
                    key={faq.id} 
                    className={`faq-item ${expandedFAQ === faq.id ? 'expanded' : ''}`}
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <div className="faq-question">
                      <span>{faq.question}</span>
                      <ChevronRight 
                        className={`faq-chevron ${expandedFAQ === faq.id ? 'expanded' : ''}`}
                        size={20} 
                      />
                    </div>
                    {expandedFAQ === faq.id && (
                      <div className="faq-answer">{faq.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="landing-final-cta">
        <div className="landing-container">
          <div className="final-cta-content">
            <div className="final-cta-number">7</div>
            <div className="final-cta-text">
              <h2 className="landing-section-title">Ready to build and ship better products?</h2>
              <p className="landing-section-description">
                Join teams using Zyndrx to move faster, collaborate better, and deliver with confidence.
              </p>
              <button 
                className="landing-btn-primary landing-btn-large"
                onClick={() => router.push('/register')}
              >
                Get started
                <ArrowRight size={20} />
              </button>
              <p className="final-cta-note">It only takes 5 minutes to set up.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-content">
            <div className="footer-left">
              <div className="landing-logo">
                <div className="logo-square">
                  <span className="logo-z">Z</span>
                </div>
                <span className="logo-text">Zyndrx</span>
              </div>
              <p className="footer-tagline">The AI-powered workspace for modern product teams.</p>
              <p className="footer-copyright">Copyright ©2023</p>
            </div>
            <div className="footer-right">
              <div className="footer-column">
                <a href="#social">Instagram</a>
                <a href="#social">Facebook</a>
                <a href="#social">LinkedIn</a>
              </div>
              <div className="footer-column">
                <a href="#features">Features</a>
                <a href="#integrations">Integrations</a>
                <a href="#pricing">Pricing</a>
              </div>
              <div className="footer-column">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
