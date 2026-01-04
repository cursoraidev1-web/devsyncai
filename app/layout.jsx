import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import ClientProviders from './providers/ClientProviders';
import '../design-system/global.css';
import '../styles/index.css';
// Suppress harmless telemetry errors
import '../utils/errorHandler';

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4f46e5" />
        <meta
          name="description"
          content="Zyndrx - Project Management & Development Coordination Platform"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Zyndrx" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <title>Zyndrx Platform</title>
        {/* Block telemetry requests early - before React loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                
                // Block fetch requests to telemetry endpoints - return successful response to prevent errors
                const originalFetch = window.fetch;
                window.fetch = function(...args) {
                  const url = args[0]?.toString() || '';
                  
                  // Block telemetry endpoints - return successful response instead of rejecting
                  if (url.includes('127.0.0.1:7245') || 
                      url.includes('localhost:7245') ||
                      (url.includes('127.0.0.1') && url.includes('/ingest/')) ||
                      (url.includes('localhost') && url.includes('/ingest/')) ||
                      url.includes(':7245/ingest/')) {
                    // Return a successful response to prevent errors
                    return Promise.resolve(new Response(null, { 
                      status: 200, 
                      statusText: 'OK',
                      headers: { 'Content-Type': 'application/json' }
                    }));
                  }
                  
                  return originalFetch.apply(this, args).catch(function(err) {
                    const errorMsg = err?.message || err?.toString() || '';
                    // Suppress connection refused errors for telemetry
                    if ((errorMsg.includes('ERR_CONNECTION_REFUSED') || 
                         errorMsg.includes('Failed to fetch') ||
                         errorMsg.includes('NetworkError')) && 
                        (url.includes('127.0.0.1') || url.includes('localhost') || 
                         url.includes('/ingest/') || url.includes(':7245'))) {
                      // Return successful response instead of rejecting
                      return Promise.resolve(new Response(null, { 
                        status: 200, 
                        statusText: 'OK',
                        headers: { 'Content-Type': 'application/json' }
                      }));
                    }
                    throw err;
                  });
                };
                
                // Suppress unhandled rejections for telemetry
                window.addEventListener('unhandledrejection', function(event) {
                  const err = event.reason;
                  const msg = err?.message || err?.toString() || '';
                  const stack = err?.stack || '';
                  if ((msg.includes('ERR_CONNECTION_REFUSED') || 
                       msg.includes('Failed to fetch') || 
                       msg.includes('NetworkError')) && 
                      (stack.includes('127.0.0.1') || stack.includes('localhost') || 
                       stack.includes('/ingest/') || msg.includes('/ingest/') || 
                       msg.includes(':7245') || stack.includes(':7245'))) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                  }
                }, true);
                
                // Suppress console errors for telemetry
                const origError = console.error;
                console.error = function(...args) {
                  const msg = args.join(' ');
                  if ((msg.includes('ERR_CONNECTION_REFUSED') || 
                       msg.includes('Failed to fetch')) && 
                      (msg.includes('127.0.0.1') || msg.includes('/ingest/') || 
                       msg.includes(':7245'))) {
                    return;
                  }
                  origError.apply(console, args);
                };
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
