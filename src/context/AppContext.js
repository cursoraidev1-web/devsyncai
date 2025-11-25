import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'task',
      title: 'New task assigned',
      message: 'You have been assigned to "User Authentication API"',
      timestamp: new Date(),
      read: false
    },
    {
      id: 2,
      type: 'deployment',
      title: 'Deployment successful',
      message: 'Production build #234 deployed successfully',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    }
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'E-Commerce Platform',
      status: 'active',
      progress: 65,
      team: ['PM', 'Dev', 'QA', 'DevOps'],
      deadline: '2025-12-31'
    },
    {
      id: 2,
      name: 'Mobile App Redesign',
      status: 'active',
      progress: 40,
      team: ['PM', 'Designer', 'Dev'],
      deadline: '2025-11-30'
    }
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'User Authentication API',
      description: 'Implement JWT-based authentication',
      status: 'in-progress',
      priority: 'high',
      assignee: 'developer',
      project: 1,
      dueDate: '2025-11-28',
      tags: ['backend', 'security']
    },
    {
      id: 2,
      title: 'Design Dashboard Mockups',
      description: 'Create wireframes for admin dashboard',
      status: 'todo',
      priority: 'medium',
      assignee: 'designer',
      project: 1,
      dueDate: '2025-11-26',
      tags: ['design', 'ui']
    },
    {
      id: 3,
      title: 'Setup CI/CD Pipeline',
      description: 'Configure GitHub Actions for automated deployment',
      status: 'completed',
      priority: 'high',
      assignee: 'devops',
      project: 1,
      dueDate: '2025-11-20',
      tags: ['devops', 'automation']
    }
  ]);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'PRD - E-Commerce Platform v2.0',
      type: 'prd',
      tags: ['product', 'requirements'],
      uploadedBy: 'pm',
      uploadedAt: '2025-11-15',
      size: '2.4 MB',
      project: 1
    },
    {
      id: 2,
      name: 'API Documentation',
      type: 'documentation',
      tags: ['technical', 'api'],
      uploadedBy: 'developer',
      uploadedAt: '2025-11-20',
      size: '1.8 MB',
      project: 1
    }
  ]);

  const addNotification = (notification) => {
    setNotifications(prev => [{
      ...notification,
      id: Date.now(),
      timestamp: new Date(),
      read: false
    }, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const addTask = (task) => {
    setTasks(prev => [...prev, { ...task, id: Date.now() }]);
  };

  const updateTask = (id, updates) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addDocument = (document) => {
    setDocuments(prev => [...prev, { ...document, id: Date.now() }]);
  };

  const value = {
    notifications,
    addNotification,
    markNotificationRead,
    projects,
    setProjects,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    documents,
    addDocument,
    setDocuments
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
