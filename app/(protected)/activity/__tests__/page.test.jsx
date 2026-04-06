import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ActivityPage from '../page';
import { fetchActivity } from '../../../../services/api/activity';

jest.mock('../../../../services/api/activity', () => ({
  fetchActivity: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('Activity page', () => {
  it('renders a truthful empty state when no activity exists', async () => {
    fetchActivity.mockResolvedValue([]);

    render(<ActivityPage />);

    await waitFor(() => {
      expect(screen.getByText(/no activity yet/i)).toBeInTheDocument();
    });
  });
});
