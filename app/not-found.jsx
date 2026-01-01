'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '16px', color: '#1A1F36' }}>
        404
      </h1>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: '#4A5568' }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: '16px', color: '#718096', marginBottom: '32px', maxWidth: '500px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        href="/"
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#8409BD',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          transition: 'background-color 0.2s',
        }}
      >
        Go Home
      </Link>
    </div>
  );
}

