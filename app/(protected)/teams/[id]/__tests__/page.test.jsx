import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeamDetailPage from '../page';
import { getCompanyMembers } from '../../../../../services/api/auth';

const push = jest.fn();
const loadTeamMembers = jest.fn();
const addTeamMember = jest.fn();
const removeTeamMember = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useParams: () => ({ id: 'team-1' }),
}));

jest.mock('../../../../../components/ui', () => ({
  Modal: ({ isOpen, children, title }) =>
    isOpen ? (
      <div>
        <h2>{title}</h2>
        {children}
      </div>
    ) : null,
}));

jest.mock('../../../../../components/PulsingLoader', () => {
  return function PulsingLoader({ message }) {
    return <div>{message}</div>;
  };
});

jest.mock('../../../../../context/AppContext', () => ({
  useApp: () => ({
    teams: [
      {
        id: 'team-1',
        name: 'Platform',
        description: 'Core team',
      },
    ],
    teamMembers: [
      {
        id: 'member-1',
        user_id: 'user-1',
        role: 'developer',
        user: {
          id: 'user-1',
          full_name: 'Existing Member',
          email: 'existing@example.com',
        },
      },
    ],
    teamsLoading: false,
    teamMembersLoading: false,
    loadTeamMembers,
    addTeamMember,
    removeTeamMember,
  }),
}));

jest.mock('../../../../../context/CompanyContext', () => ({
  useCompany: () => ({
    currentCompany: {
      id: 'company-1',
      name: 'Acme',
    },
  }),
}));

jest.mock('../../../../../services/api/auth', () => ({
  getCompanyMembers: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Team detail page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getCompanyMembers.mockResolvedValue([
      {
        id: 'user-1',
        fullName: 'Existing Member',
        email: 'existing@example.com',
        role: 'member',
      },
      {
        id: 'user-2',
        fullName: 'New Member',
        email: 'new@example.com',
        role: 'member',
      },
    ]);
    addTeamMember.mockResolvedValue({ success: true });
    loadTeamMembers.mockResolvedValue([]);
  });

  it('adds an available workspace member to the team', async () => {
    const user = userEvent.setup();

    render(<TeamDetailPage />);

    await waitFor(() => expect(loadTeamMembers).toHaveBeenCalledWith('team-1'));

    await user.click(screen.getByRole('button', { name: /add members/i }));

    await waitFor(() => expect(getCompanyMembers).toHaveBeenCalledWith('company-1'));

    expect(screen.getByRole('option', { name: /new member/i })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /existing member/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add to team/i }));

    await waitFor(() => {
      expect(addTeamMember).toHaveBeenCalledWith('team-1', {
        user_id: 'user-2',
        role: 'developer',
      });
    });
  });
});
