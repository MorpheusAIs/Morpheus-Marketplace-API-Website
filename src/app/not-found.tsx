'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();

  // Auto-redirect to home page after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl font-bold text-purple-400">404</div>
        
        <h1 className="text-3xl font-bold text-white">
          Page Not Found
        </h1>
        
        <p className="text-gray-300 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4">
          <p className="text-gray-400">
            Redirecting to home page in 3 seconds...
          </p>
          
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Go to Home Now
          </Link>
        </div>
        
        <div className="pt-8 space-y-2">
          <p className="text-sm text-gray-500">Quick Links:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/admin" className="text-purple-400 hover:text-purple-300 underline">
              Admin
            </Link>
            <Link href="/chat" className="text-purple-400 hover:text-purple-300 underline">
              Chat
            </Link>
            <Link href="/test" className="text-purple-400 hover:text-purple-300 underline">
              Test
            </Link>
            <Link href="/docs" className="text-purple-400 hover:text-purple-300 underline">
              Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

