import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close sidebar on mobile when clicking outside
      if (window.innerWidth <= 768 && sidebarOpen) {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          // Check if click is not on menu button
          const menuButton = document.querySelector('.menu-button');
          if (menuButton && !menuButton.contains(event.target)) {
            setSidebarOpen(false);
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="layout">
      {/* Overlay for mobile */}
      {sidebarOpen && window.innerWidth <= 768 && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div ref={sidebarRef}>
        <Sidebar isOpen={sidebarOpen} />
      </div>
      
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
