import { useState, useEffect } from 'react';
import { fetchPRDs, createPRD, updatePRD, deletePRD, getPRD } from '../api/prds';

/**
 * React hook for managing PRDs
 * @param {string} [projectId] - Optional project ID to filter PRDs
 * @returns {Object} PRDs data, loading state, error, and CRUD operations
 */
export const usePRDs = (projectId) => {
  const [prds, setPrds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPRDs = async () => {
      try {
        setLoading(true);
        setError(null);
        const filters = projectId ? { project_id: projectId } : {};
        const data = await fetchPRDs(filters);
        setPrds(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch PRDs');
        console.error('Error fetching PRDs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPRDs();
  }, [projectId]);

  const create = async (data) => {
    try {
      setError(null);
      const newPRD = await createPRD(data);
      setPrds(prev => [newPRD, ...prev]);
      return newPRD;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create PRD';
      setError(errorMessage);
      throw err;
    }
  };

  const update = async (id, updates) => {
    try {
      setError(null);
      const updated = await updatePRD(id, updates);
      setPrds(prev => prev.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update PRD';
      setError(errorMessage);
      throw err;
    }
  };

  const remove = async (id) => {
    try {
      setError(null);
      await deletePRD(id);
      setPrds(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete PRD';
      setError(errorMessage);
      throw err;
    }
  };

  const fetchOne = async (id) => {
    try {
      setError(null);
      return await getPRD(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch PRD';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    prds,
    loading,
    error,
    createPRD: create,
    updatePRD: update,
    deletePRD: remove,
    getPRD: fetchOne,
    refetch: () => {
      const filters = projectId ? { project_id: projectId } : {};
      return fetchPRDs(filters).then(data => {
        setPrds(data);
        return data;
      });
    }
  };
};



