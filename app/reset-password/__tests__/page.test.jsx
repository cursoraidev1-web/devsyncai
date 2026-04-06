import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ResetPassword from '../page';

const mockPush = jest.fn();
const mockResetPassword = jest.fn();
const mockToastError = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams('token=test-reset-token'),
}));

jest.mock('../../../services/api/auth', () => ({
  resetPassword: (...args) => mockResetPassword(...args),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: (...args) => mockToastError(...args),
  },
}));

jest.mock('../../../components/LoadingSpinner', () => () => <span>Loading...</span>);
jest.mock('../../../components/Logo', () => () => <span>Logo</span>);

describe('ResetPassword page', () => {
  const validPassword = 'CuriousOrbit#824A';

  beforeEach(() => {
    mockPush.mockReset();
    mockResetPassword.mockReset();
    mockToastError.mockReset();
  });

  it('submits the normalized reset-password payload', async () => {
    mockResetPassword.mockResolvedValue({ success: true });

    render(<ResetPassword />);

    fireEvent.change(screen.getByLabelText(/^New Password$/i), {
      target: { value: validPassword },
    });
    fireEvent.change(screen.getByLabelText(/^Confirm New Password$/i), {
      target: { value: validPassword },
    });

    fireEvent.click(screen.getByRole('button', { name: /Update Password/i }));

    await waitFor(() =>
      expect(mockResetPassword).toHaveBeenCalledWith({
        newPassword: validPassword,
        token: 'test-reset-token',
      })
    );
    expect(mockPush).toHaveBeenCalledWith('/reset-password/success');
  });

  it('rejects weak passwords before calling the API', async () => {
    render(<ResetPassword />);

    fireEvent.change(screen.getByLabelText(/^New Password$/i), {
      target: { value: 'short' },
    });
    fireEvent.change(screen.getByLabelText(/^Confirm New Password$/i), {
      target: { value: 'short' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Update Password/i }));

    await waitFor(() => expect(mockToastError).toHaveBeenCalled());
    expect(mockResetPassword).not.toHaveBeenCalled();
  });
});
