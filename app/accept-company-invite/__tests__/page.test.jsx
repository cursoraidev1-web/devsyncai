import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AcceptCompanyInvite from '../page';

const mockReplace = jest.fn();
const mockRegister = jest.fn();
const mockReplaceSession = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => new URLSearchParams('token=company-invite-token'),
}));

jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    register: (...args) => mockRegister(...args),
    replaceSession: (...args) => mockReplaceSession(...args),
  }),
}));

jest.mock('../../../components/PasswordInput', () => ({ value, onChange, placeholder }) => (
  <input
    aria-label={placeholder}
    value={value}
    onChange={(event) => onChange(event.target.value)}
  />
));

jest.mock('../../../components/EmailVerificationMessage', () => () => <div>Email verification</div>);
jest.mock('../../../services/api/auth', () => ({
  resendVerificationEmail: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('AcceptCompanyInvite page', () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockRegister.mockReset();
    mockReplaceSession.mockReset();
  });

  it('auto-signs invited users in when the backend returns an authenticated invite registration', async () => {
    mockRegister.mockResolvedValue({
      user: { id: 'user-123', email: 'invitee@example.com' },
      token: 'session-token',
    });

    render(<AcceptCompanyInvite />);

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invitee@example.com' } });
    fireEvent.change(screen.getByLabelText(/Enter your password/i), {
      target: { value: 'CuriousOrbit#824A' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm your password/i), {
      target: { value: 'CuriousOrbit#824A' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Create Account & Join/i }));

    await waitFor(() => expect(mockReplaceSession).toHaveBeenCalledWith(
      { id: 'user-123', email: 'invitee@example.com' },
      'session-token'
    ));
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });
});
