import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CICDPage from '../page';

jest.mock('../../../../services/api/cicd', () => ({
  fetchPipelines: jest.fn().mockResolvedValue([]),
  fetchDeployments: jest.fn().mockResolvedValue([]),
  fetchCommits: jest.fn().mockResolvedValue([]),
  getCICDMetrics: jest.fn().mockResolvedValue(null),
  getPipelineLogs: jest.fn(),
  triggerPipeline: jest.fn(),
  cancelPipeline: jest.fn(),
  rollbackDeployment: jest.fn(),
}));

jest.mock('../../../../context/AppContext', () => ({
  useApp: () => ({ projects: [] }),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('CI/CD page', () => {
  it('shows an honest empty state when no GitHub-backed CI/CD data is available', async () => {
    render(<CICDPage />);

    await waitFor(() => {
      expect(screen.getByText(/no pipeline data available/i)).toBeInTheDocument();
    });
  });
});
