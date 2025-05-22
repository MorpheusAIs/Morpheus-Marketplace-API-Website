'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ApiGatewayOneSheeter() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      <div className="flex items-center justify-start space-x-4 mb-6">
        <Link href="/" className="px-4 py-2 bg-[#0f2c1e] hover:bg-[#143824] rounded-md text-white font-medium transition-colors">
          Home
        </Link>
        <Link href="/docs" className="px-4 py-2 bg-[#0f2c1e] hover:bg-[#143824] rounded-md text-white font-medium transition-colors">
          Docs
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-white mb-6">
        Morpheus API Gateway One-Sheeter
      </h1>
      
      <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39] mb-8">
        <div className="relative w-full h-[800px] sm:h-[1000px] md:h-[1400px] lg:h-[1600px] mb-6">
          <Image 
            src="/images/Morpheus API Gateway One-Sheeter.svg"
            alt="Morpheus API Gateway One-Sheeter"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        
        <div className="mb-6 md:hidden">
          <a 
            href="/images/Morpheus API Gateway One-Sheeter.svg" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#57a87a] hover:text-[#79c99a] underline text-center block"
          >
            View full-size image
          </a>
        </div>
        
        <div className="flex justify-center">
          <a 
            href="/images/Morpheus API Gateway One-Sheeter.svg" 
            download="Morpheus API Gateway One-Sheeter.svg"
            className="px-6 py-3 bg-[#1c402a] hover:bg-[#265138] rounded-md text-white font-medium transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download One-Sheeter
          </a>
        </div>
      </div>
    </div>
  );
} 