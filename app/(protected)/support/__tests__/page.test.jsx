import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SupportPage from '../page';
import { submitFeedback } from '../../../../services/api/feedback';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

jest.mock('../../../../services/api/feedback', () => ({
  submitFeedback: jest.fn(),
}));

jest.mock('../../../../components/ui', () => ({
  Modal: ({ isOpen, children, footer, title }) => (
    isOpen ? (
      <div>
        <h2>{title}</h2>
        {children}
        {footer}
      </div>
    ) : null
  ),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Support page', () => {
  beforeEach(() => {
    submitFeedback.mockResolvedValue({ success: true });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'Zyndrx API is running' }),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('submits a support ticket through the feedback API', async () => {
    const user = userEvent.setup();
    render(<SupportPage />);

    await user.click(screen.getByRole('button', { name: /open a ticket/i }));
    await user.type(screen.getByLabelText(/subject/i), 'Need help with deployments');
    await user.type(screen.getByLabelText(/message/i), 'The deployment history is empty.');
    await user.click(screen.getByRole('button', { name: /submit ticket/i }));

    await waitFor(() => {
      expect(submitFeedback).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'general',
          title: 'Need help with deployments',
        })
      );
    });
  }, 10000);
});
