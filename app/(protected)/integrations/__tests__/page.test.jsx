import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IntegrationsPage from '../page';
import {
  fetchIntegrations,
  getIntegrationConfig,
  updateIntegrationConfig,
} from '../../../../services/api/integrations';

jest.mock('../../../../services/api/integrations', () => ({
  fetchIntegrations: jest.fn(),
  connectIntegration: jest.fn(),
  disconnectIntegration: jest.fn(),
  getIntegrationConfig: jest.fn(),
  updateIntegrationConfig: jest.fn(),
  syncIntegration: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('Integrations page', () => {
  it('loads integration config fields and saves a wrapped config payload', async () => {
    const user = userEvent.setup();

    fetchIntegrations.mockResolvedValue([
      {
        id: 'github',
        type: 'github',
        name: 'GitHub',
        description: 'GitHub integration',
        category: 'Development',
        connected: true,
        supported: true,
        integration_id: 'integration-123',
        config: {},
      },
    ]);
    getIntegrationConfig.mockResolvedValue({
      config: { repository: 'owner/repo' },
      config_fields: [{ key: 'repository', label: 'Repository', required: true }],
      supported: true,
    });
    updateIntegrationConfig.mockResolvedValue({ success: true });

    render(<IntegrationsPage />);

    await waitFor(() => expect(screen.getByText(/connected \(1\)/i)).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /configure/i }));

    const repositoryInput = await screen.findByDisplayValue('owner/repo');
    await user.clear(repositoryInput);
    await user.type(repositoryInput, 'openai/zyndrx');
    await user.click(screen.getByRole('button', { name: /save configuration/i }));

    await waitFor(() => {
      expect(updateIntegrationConfig).toHaveBeenCalledWith('integration-123', {
        repository: 'openai/zyndrx',
      });
    });
  });
});
