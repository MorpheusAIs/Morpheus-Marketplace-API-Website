'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_CONFIG } from '@/lib/api/config';
import { useCognitoAuth } from '@/lib/auth/CognitoAuthContext';
import { BUILD_VERSION } from '@/lib/build-version';
import AuthModal from '@/components/auth/AuthModal';
import { CognitoDirectAuth } from '@/lib/auth/cognito-direct-auth';

export default function Home() {
  const { logout, isAuthenticated } = useCognitoAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Use build version from generated file
  const buildVersion = BUILD_VERSION;

  const handleLoginLogout = () => {
    if (isAuthenticated) {
      // If authenticated, logout and clear credentials
      logout();
    } else {
      // Open the beautiful direct auth modal instead of redirect
      setShowAuthModal(true);
    }
  };

  const handleRegister = () => {
    // Open the beautiful direct auth modal in signup mode
    setShowAuthModal(true);
  };

  const handleAdmin = () => {
    if (isAuthenticated) {
      // If already authenticated, go directly to admin
      window.location.href = '/admin';
    } else {
      // Open the beautiful direct auth modal instead of redirect
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = (tokens: any, userInfo: any) => {
    // Store tokens and redirect to admin
    CognitoDirectAuth.storeTokens(tokens);
    localStorage.setItem('user_info', JSON.stringify(userInfo));
    setShowAuthModal(false);
    window.location.href = '/admin';
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="relative bg-[var(--eclipse)]/80 p-8 rounded-lg max-w-5xl w-full backdrop-blur-md border border-[var(--neon-mint)]/20">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/images/Morpheus Logo - White.svg"
            alt="Morpheus Logo"
            width={120}
            height={120}
            className="mb-6"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--neon-mint)] text-center mb-2">
            Morpheus Compute Marketplace API Gateway
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-[var(--platinum)]/80 text-center">
            API Open Beta Docs
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button 
            onClick={handleAdmin}
            className="group relative p-6 bg-[var(--midnight)] rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-[var(--neon-mint)]/30 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-transparent after:to-[var(--neon-mint)]/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity text-left w-full"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--emerald)] to-[var(--neon-mint)]"></div>
            <h2 className="text-2xl font-semibold mb-2 text-[var(--neon-mint)]">Admin</h2>
            <p className="text-[var(--platinum)]/70">Manage your API keys and automation settings</p>
          </button>
          <Link href="/docs" className="group relative p-6 bg-[var(--midnight)] rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-[var(--neon-mint)]/30 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-transparent after:to-[var(--neon-mint)]/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--emerald)] to-[var(--neon-mint)]"></div>
            <h2 className="text-2xl font-semibold mb-2 text-[var(--neon-mint)]">Documentation</h2>
            <p className="text-[var(--platinum)]/70">Browse API documentation and integration guides</p>
          </Link>
          <Link href="/test" className="group relative p-6 bg-[var(--midnight)] rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-[var(--neon-mint)]/30 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-transparent after:to-[var(--neon-mint)]/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--emerald)] to-[var(--neon-mint)]"></div>
            <h2 className="text-2xl font-semibold mb-2 text-[var(--neon-mint)]">Testing</h2>
            <p className="text-[var(--platinum)]/70">Test API functionality</p>
          </Link>
          <Link href="/chat" className="group relative p-6 bg-[var(--midnight)] rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-[var(--neon-mint)]/30 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-transparent after:to-[var(--neon-mint)]/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--emerald)] to-[var(--neon-mint)]"></div>
            <h2 className="text-2xl font-semibold mb-2 text-[var(--neon-mint)]">Chat</h2>
            <p className="text-[var(--platinum)]/70">Interactive chat with model selection</p>
          </Link>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={handleLoginLogout}
            className="px-6 py-3 bg-[var(--eclipse)] text-[var(--platinum)] rounded-md text-center hover:shadow-lg hover:shadow-[var(--eclipse)]/20 transition-all hover:-translate-y-1 font-medium border border-[var(--emerald)]/30"
          >
            {isAuthenticated ? 'Logout' : 'Login'}
          </button>
          <button 
            onClick={handleRegister}
            className="px-6 py-3 bg-[var(--eclipse)] text-[var(--platinum)] rounded-md text-center hover:shadow-lg hover:shadow-[var(--eclipse)]/20 transition-all hover:-translate-y-1 font-medium border border-[var(--emerald)]/30"
          >
            Register
          </button>
          <Link href={`${API_CONFIG.BASE_URL}/docs`} className="px-6 py-3 bg-[var(--eclipse)] text-[var(--platinum)] rounded-md text-center hover:shadow-lg hover:shadow-[var(--eclipse)]/20 transition-all hover:-translate-y-1 font-medium border border-[var(--emerald)]/30">
            Swagger UI
          </Link>
        </div>
        
        {/* Version watermark */}
        <div className="absolute bottom-2 right-2 text-xs text-[var(--platinum)]/40 font-mono">
          v.{buildVersion}
        </div>
      </div>

      {/* Beautiful Direct Authentication Modal - NO REDIRECTS! */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </main>
  );
}
