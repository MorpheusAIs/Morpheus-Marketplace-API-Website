'use client';

import React, { useState, useEffect } from 'react';

type YouTubeEmbedProps = {
  videoId: string;
  title?: string;
};

export default function YouTubeEmbed({ videoId, title = 'YouTube Video' }: YouTubeEmbedProps) {
  const [clicked, setClicked] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // This ensures we only render interactive elements on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Generate the YouTube thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  
  if (!isClient) {
    // Server-side or initial render - just show a placeholder
    return (
      <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden bg-[var(--matrix-green)] mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[var(--neon-mint)] text-center">Loading video player...</div>
        </div>
      </div>
    );
  }
  
  if (!clicked) {
    // Show thumbnail with play button until clicked
    return (
      <div 
        className="relative w-full pt-[56.25%] rounded-lg overflow-hidden bg-[var(--matrix-green)] mb-6 cursor-pointer border border-[var(--neon-mint)]/20"
        onClick={() => setClicked(true)}
        role="button"
        aria-label={`Play ${title} video`}
      >
        <div className="absolute inset-0">
          {/* Thumbnail Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${thumbnailUrl})` }}
          >
            {/* Fallback color in case thumbnail fails */}
            <div className="absolute inset-0 bg-[var(--midnight)] bg-opacity-30"></div>
          </div>
          
          {/* YouTube-style play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-[var(--neon-mint)] rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-b-8 border-t-transparent border-b-transparent border-l-[16px] border-l-[var(--matrix-green)] ml-1"></div>
            </div>
          </div>
          
          {/* Video title */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--eclipse)] bg-opacity-80">
            <p className="text-[var(--platinum)] font-medium truncate">{title}</p>
          </div>
        </div>
      </div>
    );
  }
  
  // After clicking, show the actual iframe
  return (
    <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden bg-[var(--matrix-green)] mb-6 border border-[var(--neon-mint)]/20">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
} 