'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CognitoDirectAuth } from '@/lib/auth/cognito-direct-auth';
import AuthModal from '@/components/auth/AuthModal';
import Link from 'next/link';

export default function DirectLoginPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await CognitoDirectAuth.getValidAccessToken();
        if (token) {
          setIsAuthenticated(true);
          router.push('/admin');
        } else {
          setShowAuthModal(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setShowAuthModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleAuthSuccess = async (tokens: any, userInfo: any) => {
    // Store tokens using the direct auth utility
    CognitoDirectAuth.storeTokens(tokens);
    
    // Also store user info for compatibility with existing auth context
    localStorage.setItem('user_info', JSON.stringify(userInfo));
    
    setIsAuthenticated(true);
    setShowAuthModal(false);
    
    // Force a page reload to ensure the main auth context picks up the new tokens
    // This ensures compatibility with your existing authentication system
    window.location.href = '/admin';
  };

  const handleModalClose = () => {
    setShowAuthModal(false);
    router.push('/'); // Go back to home if they close the modal
  };

  // Show loading during SSR or initial auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--matrix-green)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--neon-mint)] mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--matrix-green)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-end mb-8">
        <Link href="/" className="px-4 py-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] rounded-md hover:bg-[var(--emerald)] transition-colors">
          Home
        </Link>
      </div>
      
      <div className="flex items-center justify-center flex-grow">
        <div className="max-w-md w-full space-y-8">
          {/* Main Content - shows when modal is closed but user not authenticated */}
          {!showAuthModal && !isAuthenticated && (
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white mb-8">
                Welcome to Morpheus API
              </h2>
              <p className="text-gray-300 mb-8">
                Sign in to access your API dashboard and manage your keys.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--matrix-green)] bg-[var(--neon-mint)] hover:bg-[var(--emerald)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--emerald)] transition-colors"
              >
                Sign In / Sign Up
              </button>
            </div>
          )}
          
          {/* Authenticated state */}
          {isAuthenticated && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--neon-mint)] mx-auto mb-4"></div>
              <p className="text-white">Redirecting to dashboard...</p>
            </div>
          )}
        </div>
      </div>

      {/* Authentication Modal - NO REDIRECTS! */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleModalClose}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
