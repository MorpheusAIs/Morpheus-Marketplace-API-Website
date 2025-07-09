'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, signInWithRedirect } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect them to the admin page.
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);
  
  // Don't render the login button if the user is already signed in.
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--matrix-green)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[var(--eclipse)] p-8 rounded-lg shadow-lg border border-[var(--emerald)]/30 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-[var(--neon-mint)]">
            Morpheus API Gateway
          </h2>
          <p className="mt-2 text-sm text-[var(--platinum)]">
            Please sign in to continue
          </p>
        </div>
        <button
          onClick={signInWithRedirect}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[var(--matrix-green)] bg-[var(--neon-mint)] hover:bg-[var(--emerald)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--emerald)]"
        >
          Sign In
        </button>
        <div className="mt-4">
          <Link href="/" className="text-sm font-medium text-[var(--platinum)] hover:text-[var(--neon-mint)]">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 