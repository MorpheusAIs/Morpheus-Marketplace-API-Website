'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCognitoAuth } from '@/lib/auth/CognitoAuthContext';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { signup, isAuthenticated } = useCognitoAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleSignup = () => {
    signup();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--matrix-green)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-end mb-8">
        <Link href="/" className="px-4 py-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] rounded-md hover:bg-[var(--emerald)] transition-colors">
          Home
        </Link>
      </div>
      
      <div className="flex items-center justify-center flex-grow">
        <div className="max-w-md w-full space-y-8 bg-[var(--eclipse)] p-8 rounded-lg shadow-lg border border-[var(--emerald)]/30">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--neon-mint)]">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--platinum)]">
              Or{' '}
              <Link href="/" className="font-medium text-[var(--platinum)] hover:text-[var(--neon-mint)]">
                sign in to your account
              </Link>
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <p className="mb-6 text-[var(--platinum)]/80">
                Create your account to access the Morpheus API Gateway and start building with AI.
                You'll be redirected to our secure registration service.
              </p>
              
              <button
                onClick={handleSignup}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-[var(--matrix-green)] bg-[var(--neon-mint)] hover:bg-[var(--emerald)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--emerald)] transition-colors"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  ✨
                </span>
                Create Account with Cognito
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--neon-mint)]/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[var(--eclipse)] text-[var(--platinum)]/70">
                    Secure Registration Process
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-[var(--platinum)]/60">
              <p>
                You'll be redirected to AWS Cognito to create your account securely.
                All personal information is protected and encrypted by AWS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 