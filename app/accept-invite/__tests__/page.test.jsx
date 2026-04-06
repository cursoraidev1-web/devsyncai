import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AcceptInvite from '../page';

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockGetInviteStatus = jest.fn();
const mockAcceptInvite = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams('token=invite-token-123'),
}));

jest.mock('../../../services/api/teams', () => ({
  getInviteStatus: (...args) => mockGetInviteStatus(...args),
  acceptInvite: (...args) => mockAcceptInvite(...args),
}));

jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('AcceptInvite page', () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockPush.mockReset();
    mockGetInviteStatus.mockReset();
    mockAcceptInvite.mockReset();
  });

  it('redirects unauthenticated users back through login with returnTo preserved', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, loading: false });
    mockGetInviteStatus.mockResolvedValue({
      valid: true,
      email: 'invitee@example.com',
      projectId: 'project-123',
    });

    render(<AcceptInvite />);

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith(
        '/login?returnTo=%2Faccept-invite%3Ftoken%3Dinvite-token-123'
      )
    );
    expect(mockAcceptInvite).not.toHaveBeenCalled();
  });

  it('accepts valid invites for authenticated users and routes to the project page', async () => {
    jest.useFakeTimers();
    mockUseAuth.mockReturnValue({ isAuthenticated: true, loading: false });
    mockGetInviteStatus.mockResolvedValue({
      valid: true,
      email: 'invitee@example.com',
      projectId: 'project-123',
    });
    mockAcceptInvite.mockResolvedValue({ project_id: 'project-123' });

    render(<AcceptInvite />);

    await waitFor(() => expect(mockAcceptInvite).toHaveBeenCalledWith('invite-token-123'));
    expect(screen.getByText(/Invite accepted!/i)).toBeInTheDocument();

    jest.runAllTimers();
    expect(mockPush).toHaveBeenCalledWith('/projects/project-123');
    jest.useRealTimers();
  });
});
