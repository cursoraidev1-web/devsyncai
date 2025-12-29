import { useState, useEffect } from 'react';
import { fetchTasksByProject, createTask, updateTask, deleteTask } from '../api/tasks';
import { getComments, createComment } from '../api/comments';

/**
 * React hook for managing tasks with comments
 * @param {string} [projectId] - Optional project ID to filter tasks
 * @returns {Object} Tasks data, loading state, error, and CRUD operations
 */
export const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const loadTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTasksByProject(projectId);
        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [projectId]);

  const create = async (taskData) => {
    try {
      setError(null);
      const newTask = await createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw err;
    }
  };

  const update = async (id, updates) => {
    try {
      setError(null);
      const updated = await updateTask(id, updates);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw err;
    }
  };

  const remove = async (id) => {
    try {
      setError(null);
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw err;
    }
  };

  const getTaskComments = async (taskId) => {
    try {
      setError(null);
      return await getComments({
        resource_type: 'task',
        resource_id: taskId
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch comments';
      setError(errorMessage);
      throw err;
    }
  };

  const addComment = async (taskId, projectId, content, parentId = null) => {
    try {
      setError(null);
      return await createComment({
        resource_type: 'task',
        resource_id: taskId,
        project_id: projectId,
        content,
        parent_id: parentId
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add comment';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask: create,
    updateTask: update,
    deleteTask: remove,
    getTaskComments,
    addComment,
    refetch: async () => {
      if (!projectId) return [];
      const data = await fetchTasksByProject(projectId);
      setTasks(data);
      return data;
    }
  };
};

