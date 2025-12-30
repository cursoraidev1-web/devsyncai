import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { acceptInvite } from '../api/teams';
import './AcceptInvite.css';

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('Joining team...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invite token missing. Please use the invite link from your email.');
      return;
    }

    const join = async () => {
      try {
        await acceptInvite(token);
        setStatus('success');
        setMessage('Invite accepted! Redirecting to your dashboard...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err) {
        setStatus('error');
        setMessage(err?.message || 'Invite expired or invalid.');
      }
    };

    join();
  }, [navigate, searchParams]);

  return (
    <div className="accept-invite">
      <div className="accept-invite-card">
        <div className={`accept-invite-status accept-invite-status--${status}`}>
          {status === 'loading' && <span className="spinner" />}
          {status === 'success' && '✅'}
          {status === 'error' && '⚠️'}
        </div>
        <h1 className="accept-invite-title">Team Invitation</h1>
        <p className="accept-invite-message">{message}</p>
      </div>
    </div>
  );
};

export default AcceptInvite;














