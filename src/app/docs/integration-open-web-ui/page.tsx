'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import YouTubeEmbed from '../../components/YouTubeEmbed';

export default function OpenWebUIIntegration() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-[var(--platinum)]">
      <h1 className="text-3xl font-bold text-[var(--platinum)] mb-6">
        How To Integrate (Open Web-UI)
      </h1>

      <YouTubeEmbed videoId="3cKlKahMHqc" title="Open Web-UI Integration Tutorial" />
      
      <h2 className="text-2xl font-semibold text-[var(--platinum)] mb-4">
        Morpheus ↔ Open Web-UI
      </h2>

      <div className="bg-[var(--eclipse)] p-8 rounded-lg shadow-md border-2 border-[var(--emerald)]/30 mb-8">
        <div className="text-center">
          <h3 className="text-2xl font-medium text-[var(--platinum)] mb-4">
            Coming Soon
          </h3>
          <p className="text-lg mb-4">
            The Open Web-UI integration guide is currently under development. 
            Check back soon for detailed instructions on how to integrate Open Web-UI with Morpheus.
          </p>
          <div className="animate-pulse mt-8">
            <div className="h-4 bg-[var(--eclipse)] rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-[var(--eclipse)] rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-[var(--emerald)]/30 pt-6">
        <Link href="/docs" className="text-[#57a87a] hover:text-[#79c99a] font-medium">
          &larr; Back to Documentation
        </Link>
      </div>
    </div>
  );
} 