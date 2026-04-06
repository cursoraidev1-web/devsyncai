'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { acceptInvite, getInviteStatus } from '../../services/api/teams';
import { useAuth } from '../../context/AuthContext';
import '../../styles/pages/AcceptInvite.css';

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Checking your invitation...');
  const [inviteStatus, setInviteStatus] = useState(null);

  const token = useMemo(
    () => searchParams.get('token') || searchParams.get('invite'),
    [searchParams]
  );
  const returnTo = token ? `/accept-invite?token=${encodeURIComponent(token)}` : '/login';

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invite token missing. Please use the invite link from your email.');
      return;
    }

    let cancelled = false;

    const inspectInvite = async () => {
      try {
        const data = await getInviteStatus(token);
        if (cancelled) return;

        setInviteStatus(data);

        if (!data?.valid) {
          setStatus('error');
          setMessage('This invite is no longer valid. Please request a new invitation.');
          return;
        }

        if (authLoading) {
          setStatus('loading');
          setMessage('Checking your session...');
          return;
        }

        if (!isAuthenticated) {
          setStatus('loading');
          setMessage('Redirecting you to sign in so we can finish joining this project...');
          router.replace(`/login?returnTo=${encodeURIComponent(returnTo)}`);
          return;
        }

        setStatus('loading');
        setMessage('Joining project...');
        const result = await acceptInvite(token);
        if (cancelled) return;

        const projectId = result?.project_id || data?.projectId;
        setStatus('success');
        setMessage('Invite accepted! Redirecting to your project...');
        setTimeout(() => {
          router.push(projectId ? `/projects/${projectId}` : '/dashboard');
        }, 1200);
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        const errorMessage = err?.data?.error || err?.message || 'Invite expired or invalid.';
        setMessage(errorMessage);
        console.error('Accept invite error:', err);
      }
    };

    inspectInvite();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, returnTo, router, token]);

  return (
    <div className="accept-invite">
      <div className="accept-invite-card">
        <div className={`accept-invite-status accept-invite-status--${status}`}>
          {status === 'loading' && <span className="spinner" />}
          {status === 'success' && 'Success'}
          {status === 'error' && 'Error'}
        </div>
        <h1 className="accept-invite-title">Project Invitation</h1>
        <p className="accept-invite-message">{message}</p>
        {inviteStatus?.email && status !== 'success' && (
          <p className="accept-invite-message">Invited email: {inviteStatus.email}</p>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvite() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>}>
      <AcceptInviteContent />
    </Suspense>
  );
}
