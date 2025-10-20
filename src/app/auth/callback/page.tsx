'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCognitoAuth } from '@/lib/auth/CognitoAuthContext';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleAuthCallback } = useCognitoAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    // Prevent multiple processing attempts (React Strict Mode, etc.)
    if (hasProcessed) return;

    const processCallback = async () => {
      try {
        setHasProcessed(true); // Mark as processed immediately
        
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setError(`Authentication error: ${error}. ${errorDescription || ''}`);
          setIsProcessing(false);
          return;
        }

        if (!code || !state) {
          setError('Missing authorization code or state parameter');
          setIsProcessing(false);
          return;
        }

        // Handle the authentication callback
        await handleAuthCallback(code, state);
        
        // Redirect to admin page on success
        router.push('/admin');
        
      } catch (err) {
        console.error('Authentication callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, handleAuthCallback, router, hasProcessed]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--matrix-green)]">
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--neon-mint)]"></div>
          </div>
          <h1 className="text-xl font-semibold text-[var(--neon-mint)] mb-2">
            Completing Authentication...
          </h1>
          <p className="text-[var(--platinum)]/70">
            Please wait while we process your login.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--matrix-green)]">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-4">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
          </div>
          <h1 className="text-xl font-semibold text-[var(--neon-mint)] mb-4">
            Authentication Error
          </h1>
          <p className="text-[var(--platinum)]/80 mb-6">
            {error}
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/admin')}
              className="w-full px-4 py-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] rounded-md hover:bg-[var(--emerald)] transition-colors"
            >
              Go to Admin & Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-[var(--eclipse)] text-[var(--platinum)] rounded-md hover:bg-[var(--emerald)]/20 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--matrix-green)]">
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--neon-mint)]"></div>
          </div>
          <h1 className="text-xl font-semibold text-[var(--neon-mint)] mb-2">
            Loading...
          </h1>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
