'use client';

import React from 'react';
import Link from 'next/link';

export default function OpenWebUIIntegration() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      <div className="flex items-center justify-start space-x-4 mb-6">
        <Link href="/" className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md text-white font-medium transition-colors">
          Home
        </Link>
        <Link href="/docs" className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md text-white font-medium transition-colors">
          Docs
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-white mb-6">
        How To Integrate (Open Web-UI)
      </h1>
      
      <h2 className="text-2xl font-semibold text-white mb-4">
        Morpheus ↔ Open Web-UI
      </h2>

      <div className="bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-700 mb-8">
        <div className="text-center">
          <h3 className="text-2xl font-medium text-white mb-4">
            Coming Soon
          </h3>
          <p className="text-lg mb-4">
            The Open Web-UI integration guide is currently under development. 
            Check back soon for detailed instructions on how to integrate Open Web-UI with Morpheus.
          </p>
          <div className="animate-pulse mt-8">
            <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-600 pt-6">
        <Link href="/docs" className="text-indigo-400 hover:text-indigo-300 font-medium">
          &larr; Back to Documentation
        </Link>
      </div>
    </div>
  );
} 