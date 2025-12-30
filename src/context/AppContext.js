import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { fetchNotifications, markNotificationRead as apiMarkNotificationRead, markAllNotificationsRead as apiMarkAllNotificationsRead } from '../api/notifications';
import { fetchProjects as apiFetchProjects, createProject as apiCreateProject } from '../api/projects';
import { fetchTasks, fetchTasksByProject, updateTask as apiUpdateTask, createTask as apiCreateTask, deleteTask as apiDeleteTask } from '../api/tasks';
import { inviteToProject, fetchTeams as apiFetchTeams, createTeam as apiCreateTeam, updateTeam as apiUpdateTeam, deleteTeam as apiDeleteTeam, getTeamMembers as apiGetTeamMembers, addTeamMember as apiAddTeamMember, removeTeamMember as apiRemoveTeamMember } from '../api/teams';
import { fetchDocuments as apiFetchDocuments, createDocument as apiCreateDocument } from '../api/documents';
import { getAnalytics as apiGetAnalytics } from '../api/analytics';
import { setUpgradeHandler } from '../api/client';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { token, user } = useAuth();
  const { currentCompany } = useCompany();
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [tasks, setTasks] = useState([]); // All tasks cache
  const [tasksByProject, setTasksByProject] = useState(new Map()); // Cached by project ID
  const [tasksLoading, setTasksLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamMembersLoading, setTeamMembersLoading] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');

  const openUpgradeModal = useCallback((message) => {
    setUpgradeMessage(message || 'Upgrade your plan to continue.');
    setUpgradeModalOpen(true);
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setUpgradeModalOpen(false);
    setUpgradeMessage('');
  }, []);

  useEffect(() => {
    setUpgradeHandler(openUpgradeModal);
  }, [openUpgradeModal]);

  const loadNotifications = useCallback(async () => {
    if (!token) return;
    setNotificationsLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setNotificationsLoading(false);
    }
  }, [token]);

  const markNotificationRead = async (id) => {
    try {
      await apiMarkNotificationRead(id);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
      );
    } catch (error) {
      console.error('Failed to mark notification read', error);
      throw error;
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await apiMarkAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications read', error);
      throw error;
    }
  };

  const loadProjects = useCallback(async () => {
    if (!token) return;
    setProjectsLoading(true);
    try {
      const response = await apiFetchProjects();
      // Handle response structure: { success: true, data: [...], message: "..." }
      const projectsData = response?.data || (Array.isArray(response) ? response : []);
      
      // Transform backend fields to frontend format
      const transformedProjects = projectsData.map(project => {
        // Format deadline/due date
        const endDate = project.end_date || project.due_date || project.deadline;
        let formattedDeadline = 'No due date';
        if (endDate) {
          try {
            const date = new Date(endDate);
            formattedDeadline = date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            });
          } catch (e) {
            formattedDeadline = endDate;
          }
        }

        // Handle team/members - ensure it's always an array for .length access
        const teamMembers = project.members || project.team_members || project.team || [];
        const teamArray = Array.isArray(teamMembers) ? teamMembers : [];
        const memberCount = project.member_count || project.members_count || teamArray.length || 0;

        return {
          ...project,
          // Map backend fields to frontend expected fields
          dueDate: endDate,
          deadline: formattedDeadline,
          // Ensure team is always an array for dashboard compatibility
          team: teamArray,
          teamName: project.team_name || project.team_name || 'Unassigned',
          // Calculate or default missing fields
          progress: project.progress || project.completion_percentage || 0,
          members: memberCount,
          member_count: memberCount,
          isMine: project.owner_id === user?.id || false,
          // Ensure status is properly set
          status: project.status || 'active'
        };
      });
      
      setProjects(transformedProjects);
    } catch (error) {
      console.error('Failed to fetch projects', error);
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  }, [token, user]);

  const createProject = async (payload) => {
    try {
      const data = await apiCreateProject(payload);
      setProjects((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Failed to create project', error);
      throw error;
    }
  };

  /**
   * Load all tasks (default behavior)
   * Tasks are cached and can be filtered by project client-side
   */
  const loadAllTasks = useCallback(async () => {
    if (!token) return;
    setTasksLoading(true);
    try {
      const data = await fetchTasks(); // Fetch all tasks
      const tasksArray = Array.isArray(data) ? data : [];
      
      // Transform tasks to ensure all fields are properly formatted
      const transformedTasks = tasksArray.map(task => {
        // Format due date
        const dueDate = task.due_date || task.dueDate;
        let formattedDueDate = 'No due date';
        if (dueDate) {
          try {
            const date = new Date(dueDate);
            formattedDueDate = date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            });
          } catch (e) {
            formattedDueDate = dueDate;
          }
        }

        return {
          ...task,
          // Ensure both field names are available for compatibility
          dueDate: formattedDueDate,
          due_date: dueDate,
          // Ensure status is normalized (already done in fetchTasks, but double-check)
          status: task.status || 'todo',
          // Ensure tags is always an array
          tags: Array.isArray(task.tags) ? task.tags : (task.tags ? [task.tags] : []),
          // Ensure description exists
          description: task.description || task.desc || '',
          // Ensure priority exists
          priority: task.priority || 'medium'
        };
      });
      
      setTasks(transformedTasks);
      
      // Update cache by project for quick filtering
      const tasksByProjectMap = new Map();
      transformedTasks.forEach(task => {
        const projectId = task.project_id;
        if (projectId) {
          if (!tasksByProjectMap.has(projectId)) {
            tasksByProjectMap.set(projectId, []);
          }
          tasksByProjectMap.get(projectId).push(task);
        }
      });
      setTasksByProject(tasksByProjectMap);
    } catch (error) {
      console.error('Failed to fetch all tasks', error);
      setTasks([]);
      setTasksByProject(new Map());
    } finally {
      setTasksLoading(false);
    }
  }, [token]);

  /**
   * Get tasks filtered by project (client-side filtering from all tasks)
   * @param {string} projectId - Project ID to filter by
   * @returns {Array} Filtered tasks
   */
  const getTasksByProject = useCallback((projectId) => {
    if (!projectId) return tasks;
    return tasks.filter(task => task.project_id === projectId);
  }, [tasks]);

  /**
   * Load tasks for a specific project (deprecated - use getTasksByProject instead)
   * Kept for backward compatibility but now just filters from all tasks
   * @param {string} projectId - Project ID
   * @param {boolean} forceRefresh - Force refresh all tasks
   */
  const loadTasks = useCallback(
    async (projectId, forceRefresh = false) => {
      if (!token) return;
      
      // If we need to refresh or don't have tasks yet, fetch all
      if (forceRefresh || tasks.length === 0) {
        await loadAllTasks();
      }
      
      // Return filtered tasks (client-side filtering)
      if (projectId) {
        return getTasksByProject(projectId);
      }
      
      return tasks;
    },
    [token, tasks, loadAllTasks, getTasksByProject]
  );

  const addTask = async (task) => {
    try {
      const data = await apiCreateTask(task);
      // Add to all tasks
      setTasks((prev) => [...prev, data]);
      // Add to project cache if project_id exists
      if (task.project_id) {
        setTasksByProject(prev => {
          const newMap = new Map(prev);
          const projectTasks = newMap.get(task.project_id) || [];
          newMap.set(task.project_id, [...projectTasks, data]);
          return newMap;
        });
      }
      return data;
    } catch (error) {
      console.error('Failed to create task', error);
      throw error;
    }
  };

  const updateTask = async (id, updates) => {
    // Find the task to get its project_id
    const taskToUpdate = tasks.find(t => t.id === id);
    const projectId = updates.project_id || taskToUpdate?.project_id;

    // Optimistic update
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)));
    
    // Update cache if project_id exists
    if (projectId) {
      setTasksByProject(prev => {
        const newMap = new Map(prev);
        const projectTasks = newMap.get(projectId) || [];
        newMap.set(projectId, projectTasks.map(task => task.id === id ? { ...task, ...updates } : task));
        return newMap;
      });
    }

    try {
      const data = await apiUpdateTask(id, updates);
      // Update with server response
      setTasks((prev) => prev.map((task) => (task.id === id ? data : task)));
      
      // Update cache
      if (projectId) {
        setTasksByProject(prev => {
          const newMap = new Map(prev);
          const projectTasks = newMap.get(projectId) || [];
          newMap.set(projectId, projectTasks.map(task => task.id === id ? data : task));
          return newMap;
        });
      }
      
      return data;
    } catch (error) {
      console.error('Failed to update task', error);
      // Revert optimistic update on error
      if (projectId) {
        loadTasks(projectId, true); // Force refresh
      }
      throw error;
    }
  };

  const deleteTask = async (id) => {
    // Optimistic removal
    const taskToDelete = tasks.find(t => t.id === id);
    const projectId = taskToDelete?.project_id;
    
    setTasks((prev) => prev.filter((task) => task.id !== id));
    
    // Remove from cache
    if (projectId) {
      setTasksByProject(prev => {
        const newMap = new Map(prev);
        const projectTasks = newMap.get(projectId) || [];
        newMap.set(projectId, projectTasks.filter(task => task.id !== id));
        return newMap;
      });
    }
    
    try {
      await apiDeleteTask(id);
    } catch (error) {
      console.error('Failed to delete task', error);
      // Revert optimistic removal
      if (taskToDelete) {
        setTasks((prev) => [...prev, taskToDelete]);
        if (projectId) {
          setTasksByProject(prev => {
            const newMap = new Map(prev);
            const projectTasks = newMap.get(projectId) || [];
            newMap.set(projectId, [...projectTasks, taskToDelete]);
            return newMap;
          });
        }
      }
      throw error;
    }
  };

  const sendInvite = async ({ projectId, email, role }) => {
    if (!projectId) {
      throw new Error('Project is required to send an invite.');
    }
    try {
      return await inviteToProject(projectId, { email, role });
    } catch (error) {
      console.error('Failed to send invite', error);
      throw error;
    }
  };

  const loadDocuments = useCallback(async (projectId) => {
    if (!token || !projectId) return;
    try {
      const data = await apiFetchDocuments(projectId);
      setDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch documents', error);
      throw error;
    }
  }, [token]);

  const createDocument = async (payload) => {
    try {
      const data = await apiCreateDocument(payload);
      setDocuments((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Failed to create document', error);
      throw error;
    }
  };

  const loadTeams = useCallback(async () => {
    if (!token) return;
    setTeamsLoading(true);
    try {
      const response = await apiFetchTeams();
      const teamsData = response?.data || (Array.isArray(response) ? response : []);
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch (error) {
      console.error('Failed to fetch teams', error);
      setTeams([]);
    } finally {
      setTeamsLoading(false);
    }
  }, [token]);

  const createTeam = async (payload) => {
    try {
      const data = await apiCreateTeam(payload);
      setTeams((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Failed to create team', error);
      throw error;
    }
  };

  const updateTeam = async (teamId, payload) => {
    try {
      const data = await apiUpdateTeam(teamId, payload);
      setTeams((prev) => prev.map(t => t.id === teamId ? data : t));
      return data;
    } catch (error) {
      console.error('Failed to update team', error);
      throw error;
    }
  };

  const deleteTeam = async (teamId) => {
    try {
      await apiDeleteTeam(teamId);
      setTeams((prev) => prev.filter(t => t.id !== teamId));
    } catch (error) {
      console.error('Failed to delete team', error);
      throw error;
    }
  };

  const loadTeamMembers = useCallback(async (teamId) => {
    if (!token || !teamId) return;
    setTeamMembersLoading(true);
    try {
      const response = await apiGetTeamMembers(teamId);
      const membersData = response?.data || (Array.isArray(response) ? response : []);
      setTeamMembers(Array.isArray(membersData) ? membersData : []);
    } catch (error) {
      console.error('Failed to fetch team members', error);
      setTeamMembers([]);
    } finally {
      setTeamMembersLoading(false);
    }
  }, [token]);

  const addTeamMember = async (teamId, memberData) => {
    try {
      const data = await apiAddTeamMember(teamId, memberData);
      setTeamMembers((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Failed to add team member', error);
      throw error;
    }
  };

  const removeTeamMember = async (teamId, memberId) => {
    try {
      await apiRemoveTeamMember(teamId, memberId);
      setTeamMembers((prev) => prev.filter(m => m.id !== memberId));
    } catch (error) {
      console.error('Failed to remove team member', error);
      throw error;
    }
  };

  const loadAnalytics = useCallback(async (projectId) => {
    if (!token || !projectId) return null;
    try {
      return await apiGetAnalytics(projectId);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
      throw error;
    }
  }, [token]);

  useEffect(() => {
    if (token && currentCompany) {
      loadNotifications();
      loadProjects();
      loadAllTasks(); // Always load all tasks by default
      const interval = setInterval(() => loadNotifications(), 60000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setProjects([]);
      setTasks([]);
      setTasksByProject(new Map());
    }
  }, [token, currentCompany, loadNotifications, loadProjects, loadAllTasks]);

  const value = {
    notifications,
    notificationsLoading,
    addNotification: (notification) =>
      setNotifications((prev) => [
        { ...notification, id: Date.now(), timestamp: new Date(), read: false },
        ...prev
      ]),
    markNotificationRead,
    markAllNotificationsRead,
    projects,
    projectsLoading,
    loadProjects,
    createProject,
    tasks,
    tasksLoading,
    loadTasks,
    loadAllTasks,
    getTasksByProject,
    addTask,
    updateTask,
    deleteTask,
    documents,
    loadDocuments,
    createDocument,
    teams,
    teamsLoading,
    loadTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    teamMembers,
    teamMembersLoading,
    loadTeamMembers,
    addTeamMember,
    removeTeamMember,
    loadAnalytics,
    addDocument: (document) =>
      setDocuments((prev) => [...prev, { ...document, id: Date.now() }]),
    setDocuments,
    sendInvite,
    upgradeModalOpen,
    upgradeMessage,
    openUpgradeModal,
    closeUpgradeModal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
