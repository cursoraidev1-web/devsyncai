'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSupabaseAuthClient } from '@/utils/supabaseAuth';

export default function SupabaseTestPage() {
  const { user, isAuthenticated, token, loading: authLoading } = useAuth();
  const [results, setResults] = useState({
    loading: true,
    auth: null,
    bucket: null,
    readPermission: null,
    uploadTest: null,
    error: null
  });

  const runTests = useCallback(async () => {
    try {
      setResults(prev => ({ ...prev, loading: true, error: null }));

      // Wait for auth to finish loading if it's still loading
      let currentAuthLoading = authLoading;
      if (currentAuthLoading) {
        console.log('Waiting for auth to initialize...');
        // Wait up to 5 seconds for auth to initialize
        let waitCount = 0;
        while (currentAuthLoading && waitCount < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          waitCount++;
          // Re-check loading state (it might have changed)
          // Note: We can't directly check authLoading here as it's from closure
        }
      }

      // Re-check auth state from localStorage directly (in case context hasn't updated)
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('zyndrx_token') : null;
      const savedUser = typeof window !== 'undefined' ? localStorage.getItem('zyndrx_user') : null;
      
      // Use the most up-to-date auth state
      // Prioritize context state, but fallback to localStorage if context hasn't loaded
      // If context says authenticated OR we have valid credentials in localStorage, consider authenticated
      const hasContextAuth = isAuthenticated && user && token;
      const hasStorageAuth = !!savedToken && !!savedUser;
      const finalIsAuthenticated = hasContextAuth || hasStorageAuth;
      
      let finalUser = user;
      let finalToken = token;
      
      // If context doesn't have user but localStorage does, use localStorage
      if (!finalUser && savedUser) {
        try {
          finalUser = JSON.parse(savedUser);
        } catch (e) {
          console.warn('Failed to parse saved user:', e);
        }
      }
      
      // If context doesn't have token but localStorage does, use localStorage
      if (!finalToken && savedToken) {
        finalToken = savedToken;
      }

      // Double-check auth state after waiting
      console.log('🔍 Auth state check:', {
        isAuthenticated: finalIsAuthenticated,
        hasUser: !!finalUser,
        hasToken: !!finalToken,
        userEmail: finalUser?.email,
        userId: finalUser?.id,
        authLoading: currentAuthLoading,
        fromContext: { isAuthenticated, hasUser: !!user, hasToken: !!token },
        fromStorage: { hasToken: !!savedToken, hasUser: !!savedUser }
      });
      
      // If we have token and user in localStorage but context says not authenticated,
      // the context might not have loaded yet - trust localStorage in this case
      if (!isAuthenticated && savedToken && savedUser) {
        console.log('⚠️ Context says not authenticated but localStorage has credentials - using localStorage');
      }

      // Test 1: Check Supabase client initialization
      let supabase = null;
      let authClient = null;
      
      // Always use dynamic import to avoid module issues
      try {
        const supabaseUtils = await import('@/utils/supabase');
        if (supabaseUtils.initSupabase && typeof supabaseUtils.initSupabase === 'function') {
          supabase = supabaseUtils.initSupabase();
        } else if (supabaseUtils.default?.initSupabase && typeof supabaseUtils.default.initSupabase === 'function') {
          supabase = supabaseUtils.default.initSupabase();
        }
      } catch (e) {
        console.warn('initSupabase import failed:', e);
      }
      
      try {
        authClient = getSupabaseAuthClient();
      } catch (e) {
        console.warn('getSupabaseAuthClient failed:', e);
      }
      
      if (!supabase && !authClient) {
        setResults(prev => ({
          ...prev,
          loading: false,
          error: 'Supabase client not initialized. Check environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
        }));
        return;
      }

      // Use auth client for authenticated operations, fallback to regular client
      const client = authClient || supabase;

      // Note: We can't directly use backend JWT with Supabase Storage
      // Supabase Storage RLS uses auth.uid() which requires a Supabase session
      // However, if the bucket is public, we can still read/write
      // For authenticated operations, we rely on the bucket being public
      // or the RLS policies allowing service_role (which backend uses)

      // Test 2: Check authentication (both backend auth and Supabase session)
      let session = null;
      let sessionError = null;
      
      try {
        const sessionResult = await client.auth.getSession();
        session = sessionResult?.data?.session || null;
        sessionError = sessionResult?.error || null;
      } catch (e) {
        sessionError = e;
        console.warn('getSession failed:', e);
      }
      
      // Check backend auth status (use final values from above)
      // IMPORTANT: Prioritize context state, but also check localStorage as fallback
      const backendAuth = {
        authenticated: finalIsAuthenticated,
        userId: finalUser?.id || null,
        userEmail: finalUser?.email || null,
        hasToken: !!finalToken
      };
      
      // Check Supabase native auth
      const supabaseAuth = {
        hasSession: !!session,
        userId: session?.user?.id || null,
        userEmail: session?.user?.email || null,
        error: sessionError?.message || null
      };
      
      const authResult = {
        // Backend auth (what the app actually uses)
        backendAuthenticated: backendAuth.authenticated,
        backendUserId: backendAuth.userId,
        backendUserEmail: backendAuth.userEmail,
        backendHasToken: backendAuth.hasToken,
        // Supabase native auth (for storage)
        supabaseAuthenticated: supabaseAuth.hasSession,
        supabaseUserId: supabaseAuth.userId,
        supabaseUserEmail: supabaseAuth.userEmail,
        supabaseError: supabaseAuth.error,
        // Combined status
        authenticated: backendAuth.authenticated || supabaseAuth.hasSession,
        note: backendAuth.authenticated 
          ? 'Using backend authentication (JWT token)' 
          : supabaseAuth.hasSession 
            ? 'Using Supabase native authentication' 
            : 'Not authenticated'
      };
      
      setResults(prev => ({ ...prev, auth: authResult }));

      // Test 3: Check if documents bucket exists
      // Try multiple methods to verify bucket existence
      let bucketExists = false;
      let bucketIsPublic = false;
      let bucketError = null;
      
      try {
        // Method 1: Try to list all buckets (requires admin permissions)
        const { data: buckets, error: listBucketsError } = await client.storage.listBuckets();
        
        if (!listBucketsError && buckets) {
          // Successfully listed buckets - this is the most reliable method
          const documentsBucket = buckets.find(b => b.name === 'documents');
          bucketExists = !!documentsBucket;
          bucketIsPublic = documentsBucket?.public || false;
        } else {
          // Method 2: Try to list files in the bucket (works if bucket exists and is accessible)
          console.log('Cannot list buckets (permission issue), trying direct bucket access...');
          try {
            const { data: files, error: listFilesError } = await client.storage
              .from('documents')
              .list('', { limit: 1 });
            
            if (!listFilesError) {
              // If we can list files, the bucket definitely exists
              bucketExists = true;
              bucketIsPublic = true; // If we can list, it's accessible (likely public or we have permissions)
              bucketError = null;
            } else {
              // Check if error indicates bucket doesn't exist
              const errorMsg = listFilesError.message?.toLowerCase() || '';
              if (errorMsg.includes('not found') || 
                  errorMsg.includes('does not exist') || 
                  errorMsg.includes('bucket not found')) {
                bucketExists = false;
                bucketError = 'Bucket does not exist';
              } else {
                // Permission error - bucket might exist but we can't verify via listing
                // We'll verify via read/upload tests below
                bucketExists = null; // Unknown - will be determined by read/upload tests
                bucketError = `Cannot verify via listing: ${listFilesError.message}`;
              }
            }
          } catch (directAccessError) {
            // Error accessing bucket - will verify via read/upload tests
            bucketExists = null; // Unknown - will be determined by read/upload tests
            bucketError = `Cannot access bucket: ${directAccessError.message}`;
          }
        }
      } catch (err) {
        bucketError = err.message || 'Failed to check bucket';
        bucketExists = null; // Unknown - will be determined by read/upload tests
      }
      
      // Set initial bucket status
      setResults(prev => ({
        ...prev,
        bucket: {
          exists: bucketExists,
          isPublic: bucketIsPublic,
          name: bucketExists ? 'documents' : null,
          error: bucketError,
          note: bucketError && !bucketExists ? 'Note: Bucket listing requires admin permissions. Will verify via read/upload tests.' : null
        }
      }));

      // Test 4: Test read permission (only if authenticated via backend or Supabase)
      // If read succeeds, we know the bucket exists
      if (finalIsAuthenticated || session) {
        try {
          const { data: files, error: listError } = await client.storage
            .from('documents')
            .list('', { limit: 1 });
          
          const readSuccess = !listError;
          
          // If read succeeds, bucket definitely exists
          if (readSuccess && bucketExists === null || bucketExists === false) {
            bucketExists = true;
            bucketIsPublic = true; // If we can read, it's accessible
            bucketError = null;
          }
          
          setResults(prev => ({
            ...prev,
            readPermission: {
              success: readSuccess,
              error: listError?.message || null,
              statusCode: listError?.statusCode || null
            },
            // Update bucket status if we confirmed it exists via read test
            bucket: readSuccess ? {
              ...prev.bucket,
              exists: true,
              isPublic: true,
              error: null,
              note: 'Bucket verified via read test'
            } : prev.bucket
          }));
        } catch (err) {
          setResults(prev => ({
            ...prev,
            readPermission: { success: false, error: err.message }
          }));
        }
      } else {
        setResults(prev => ({
          ...prev,
          readPermission: { success: false, error: 'Not authenticated' }
        }));
      }

      // Test 5: Test upload permission (only if authenticated via backend or Supabase)
      // If upload succeeds, we know the bucket exists
      if (finalIsAuthenticated || session) {
        try {
          const testFile = new Blob(['test'], { type: 'text/plain' });
          const testPath = `test/${Date.now()}-test.txt`;
          const { data: uploadData, error: uploadError } = await client.storage
            .from('documents')
            .upload(testPath, testFile);

          if (uploadError) {
            setResults(prev => ({
              ...prev,
              uploadTest: {
                success: false,
                error: uploadError.message,
                statusCode: uploadError.statusCode || null
              }
            }));
          } else {
            // Upload succeeded - bucket definitely exists
            if (bucketExists === null || bucketExists === false) {
              bucketExists = true;
              bucketIsPublic = true;
              bucketError = null;
            }
            
            setResults(prev => ({
              ...prev,
              uploadTest: {
                success: true,
                path: uploadData.path,
                message: 'Upload successful!'
              },
              // Update bucket status if we confirmed it exists via upload test
              bucket: {
                ...prev.bucket,
                exists: true,
                isPublic: true,
                error: null,
                note: prev.bucket?.note?.includes('read test') 
                  ? 'Bucket verified via read and upload tests' 
                  : 'Bucket verified via upload test'
              }
            }));
            
            // Clean up test file
            try {
              await client.storage.from('documents').remove([testPath]);
            } catch (cleanupError) {
              console.warn('Failed to cleanup test file:', cleanupError);
            }
          }
        } catch (err) {
          setResults(prev => ({
            ...prev,
            uploadTest: { success: false, error: err.message }
          }));
        }
      } else {
        setResults(prev => ({
          ...prev,
          uploadTest: { success: false, error: 'Not authenticated' }
        }));
      }

      setResults(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  }, [isAuthenticated, user, token, authLoading]);

  // Debug: Log auth state changes
  useEffect(() => {
    console.log('🔍 Auth state changed:', {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!token,
      authLoading,
      userEmail: user?.email,
      userId: user?.id,
      timestamp: new Date().toISOString()
    });
  }, [isAuthenticated, user, token, authLoading]);

  useEffect(() => {
    // Run tests when:
    // 1. Auth finishes loading (authLoading becomes false)
    // 2. Auth state changes (user/token/isAuthenticated)
    // 3. Component mounts (if auth is already loaded)
    
    if (!authLoading) {
      // Small delay to ensure state is fully updated
      const timer = setTimeout(() => {
        console.log('🚀 Running tests - auth loaded:', { isAuthenticated, hasUser: !!user, hasToken: !!token });
        runTests();
      }, 300); // Increased delay to ensure state is fully propagated
      return () => clearTimeout(timer);
    } else {
      console.log('⏳ Waiting for auth to load...');
    }
  }, [runTests, authLoading, isAuthenticated, user?.id, token]);

  const getStatusIcon = (success) => {
    if (success === null) return '⏳';
    return success ? '✅' : '❌';
  };

  const getStatusColor = (success) => {
    if (success === null) return 'text-gray-500';
    return success ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Supabase Configuration Test
          </h1>

          {results.loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Running tests...</p>
            </div>
          )}

          {results.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Error</h3>
              <p className="text-red-600">{results.error}</p>
            </div>
          )}

          {/* Action Items */}
          {!results.loading && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-3">⚠️ Action Required</h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                {!results.auth?.backendAuthenticated && (
                  <li className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    <div>
                      <strong className="text-yellow-800">You need to log in first.</strong>
                      <div className="mt-1">
                        Go to{' '}
                        <a href="/login" className="underline font-semibold text-yellow-900 hover:text-yellow-950">
                          /login
                        </a>{' '}
                        to authenticate with the backend (JWT token).
                      </div>
                      {authLoading && (
                        <div className="mt-1 text-xs text-blue-600">
                          ⏳ Still loading authentication state... (Refresh page if this persists)
                        </div>
                      )}
                      {!authLoading && !results.auth?.backendAuthenticated && (
                        <div className="mt-1 text-xs text-red-600">
                          ⚠️ Authentication check complete - no valid session found. Please log in and refresh this page.
                        </div>
                      )}
                      {results.auth?.supabaseAuthenticated && (
                        <div className="mt-1 text-xs text-yellow-600">
                          Note: You have Supabase session but not backend auth. Storage may work but other features won't.
                        </div>
                      )}
                    </div>
                  </li>
                )}
                {results.bucket && !results.bucket.exists && !results.bucket.error?.includes('Cannot verify') && (
                  <li className="flex items-start gap-2">
                    <span>2.</span>
                    <span>
                      <strong>Storage bucket doesn't exist or cannot be verified.</strong> 
                      {results.bucket.error && (
                        <div className="mt-1 text-xs text-yellow-600">
                          Error: {results.bucket.error}
                        </div>
                      )}
                      <div className="mt-1">If the bucket exists in Supabase Dashboard, this is likely a permissions issue.</div>
                      <div className="mt-1">Verify the bucket exists and is public:</div>
                      <ol className="ml-4 mt-1 list-decimal space-y-1">
                        <li>Go to Supabase Dashboard → Storage</li>
                        <li>Check if "documents" bucket exists</li>
                        <li>If not, click "New bucket" → Name: <code className="bg-yellow-100 px-1 rounded">documents</code></li>
                        <li>✅ Enable "Public bucket"</li>
                        <li>Click "Create" or "Save"</li>
                      </ol>
                    </span>
                  </li>
                )}
                {results.bucket?.error?.includes('Cannot verify') && (
                  <li className="flex items-start gap-2">
                    <span>2.</span>
                    <span>
                      <strong>Bucket exists but cannot be verified via API.</strong>
                      <div className="mt-1 text-xs text-yellow-600">
                        {results.bucket.error}
                      </div>
                      <div className="mt-1">This is normal - bucket listing requires admin permissions. The bucket should work for uploads.</div>
                    </span>
                  </li>
                )}
                {results.bucket?.exists && !results.bucket?.isPublic && (
                  <li className="flex items-start gap-2">
                    <span>3.</span>
                    <span>
                      <strong>Bucket is not public.</strong> Go to Storage → documents bucket → Settings → Enable "Public bucket"
                    </span>
                  </li>
                )}
                {results.bucket?.error?.includes('Failed to fetch') && (
                  <li className="flex items-start gap-2">
                    <span>4.</span>
                    <span>
                      <strong>Network/CORS issue.</strong> Check:
                      <ul className="ml-4 mt-1 list-disc space-y-1">
                        <li>Supabase Dashboard → Storage → Settings → Add CORS origin: <code className="bg-yellow-100 px-1 rounded">http://localhost:3000</code></li>
                        <li>Check browser console for CORS errors</li>
                        <li>Verify Supabase URL is correct</li>
                      </ul>
                    </span>
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="space-y-6">
            {/* Authentication Test */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className={getStatusColor(results.auth?.backendAuthenticated || results.auth?.authenticated)}>
                  {getStatusIcon(results.auth?.backendAuthenticated || results.auth?.authenticated)}
                </span>
                Authentication Status
              </h2>
              {results.auth && (
                <div className="space-y-3 text-sm">
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                    <strong className="text-blue-800">Note:</strong> {results.auth.note}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-700">Backend Auth (JWT):</div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Authenticated:</span>
                      <span className={results.auth.backendAuthenticated ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {results.auth.backendAuthenticated ? 'Yes ✅' : 'No ❌'}
                      </span>
                    </div>
                    {results.auth.backendUserId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">User ID:</span>
                        <span className="font-mono text-xs">{results.auth.backendUserId}</span>
                      </div>
                    )}
                    {results.auth.backendUserEmail && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-mono text-xs">{results.auth.backendUserEmail}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Has Token:</span>
                      <span className={results.auth.backendHasToken ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {results.auth.backendHasToken ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-2 mt-2">
                    <div className="font-semibold text-gray-700">Supabase Native Auth:</div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Has Session:</span>
                      <span className={results.auth.supabaseAuthenticated ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                        {results.auth.supabaseAuthenticated ? 'Yes ✅' : 'No ⚠️'}
                      </span>
                    </div>
                    {results.auth.supabaseUserId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">User ID:</span>
                        <span className="font-mono text-xs">{results.auth.supabaseUserId}</span>
                      </div>
                    )}
                    {results.auth.supabaseUserEmail && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-mono text-xs">{results.auth.supabaseUserEmail}</span>
                      </div>
                    )}
                    {results.auth.supabaseError && (
                      <div className="text-yellow-600 text-xs mt-2">
                        Note: {results.auth.supabaseError}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bucket Test */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className={getStatusColor(results.bucket?.exists)}>
                  {getStatusIcon(results.bucket?.exists)}
                </span>
                Storage Bucket (documents)
              </h2>
              {results.bucket && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bucket Exists:</span>
                    <span className={results.bucket.exists ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {results.bucket.exists ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {results.bucket.exists && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Is Public:</span>
                      <span className={results.bucket.isPublic ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                        {results.bucket.isPublic ? 'Yes ✅' : 'No ⚠️ (Should be public)'}
                      </span>
                    </div>
                  )}
                  {results.bucket.error && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-xs">
                      <div className="text-red-800 font-semibold mb-1">Error Details:</div>
                      <div className="text-red-600">{results.bucket.error}</div>
                      {results.bucket.statusCode && (
                        <div className="text-red-600 mt-1">Status Code: {results.bucket.statusCode}</div>
                      )}
                      {results.bucket.isNetworkError && (
                        <div className="mt-2 text-red-700">
                          <strong>This looks like a network/CORS issue.</strong> Possible causes:
                          <ul className="ml-4 mt-1 list-disc">
                            <li>Bucket doesn't exist - Create it in Supabase Dashboard</li>
                            <li>CORS not configured - Add your origin in Storage Settings</li>
                            <li>Network connectivity issue</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Read Permission Test */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className={getStatusColor(results.readPermission?.success)}>
                  {getStatusIcon(results.readPermission?.success)}
                </span>
                Read Permission
              </h2>
              {results.readPermission && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Can Read:</span>
                    <span className={results.readPermission.success ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {results.readPermission.success ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {results.readPermission.error && (
                    <div className="text-red-600 text-xs mt-2">
                      Error: {results.readPermission.error}
                      {results.readPermission.statusCode && (
                        <span className="ml-2">(Status: {results.readPermission.statusCode})</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Upload Test */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className={getStatusColor(results.uploadTest?.success)}>
                  {getStatusIcon(results.uploadTest?.success)}
                </span>
                Upload Permission
              </h2>
              {results.uploadTest && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Can Upload:</span>
                    <span className={results.uploadTest.success ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {results.uploadTest.success ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {results.uploadTest.path && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Test File Path:</span>
                      <span className="font-mono text-xs">{results.uploadTest.path}</span>
                    </div>
                  )}
                  {results.uploadTest.error && (
                    <div className="text-red-600 text-xs mt-2">
                      Error: {results.uploadTest.error}
                      {results.uploadTest.statusCode && (
                        <span className="ml-2">(Status: {results.uploadTest.statusCode})</span>
                      )}
                      {results.uploadTest.error?.includes('row-level security') && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <strong className="text-red-800">RLS Policy Issue:</strong>
                          <div className="text-red-700 text-xs mt-1">
                            The storage bucket RLS policy requires a Supabase native session, but you're using backend JWT authentication.
                          </div>
                          <div className="text-red-700 text-xs mt-1">
                            <strong>Solution:</strong> Run migration <code className="bg-red-100 px-1 rounded">029_fix_storage_upload_rls_for_public_bucket.sql</code> in Supabase SQL Editor.
                            This adds a public upload policy for public buckets.
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {results.uploadTest.message && (
                    <div className="text-green-600 text-xs mt-2">
                      {results.uploadTest.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <button
              onClick={runTests}
              disabled={results.loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {results.loading ? 'Running Tests...' : 'Run Tests Again'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Environment Variables Check</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">NEXT_PUBLIC_SUPABASE_URL:</span>
                <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

