import React, { useState } from 'react';
import '../styles/Header.css';

function Header({ currentUser }) {
  const [notifications] = useState([
    { id: 1, text: 'New PR merged to main branch', type: 'cicd', time: '5m ago' },
    { id: 2, text: 'QA approved Feature #145', type: 'task', time: '15m ago' },
    { id: 3, text: 'John commented on PRD-2024-001', type: 'prd', time: '1h ago' },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search projects, tasks, or documents..." />
        </div>
      </div>

      <div className="header-right">
        <button className="header-btn">
          <span className="btn-icon">➕</span>
          <span>New Project</span>
        </button>

        <div className="notification-wrapper">
          <button 
            className="icon-btn notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <span className="bell-icon">🔔</span>
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <button className="mark-read-btn">Mark all as read</button>
              </div>
              <div className="notification-list">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`notification-item ${notif.type}`}>
                    <div className="notif-content">
                      <p>{notif.text}</p>
                      <span className="notif-time">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button className="icon-btn">
          <span>⚙️</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
