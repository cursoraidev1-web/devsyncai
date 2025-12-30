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
    // Support both 'token' and 'invite' URL parameters
    const token = searchParams.get('token') || searchParams.get('invite');
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
        // Extract error message from API response
        // API client throws error with message and data properties
        const errorMessage = err?.data?.error || err?.message || 'Invite expired or invalid.';
        setMessage(errorMessage);
        console.error('Accept invite error:', err);
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














