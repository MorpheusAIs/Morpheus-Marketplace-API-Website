'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const YouTubeEmbed = ({ videoId }: { videoId: string }) => {
  return (
    <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden bg-[#0a1f14] mb-6">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Brave Leo Integration Tutorial"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default function BraveLeoIntegration() {
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
        How To Integrate (Brave Leo)
      </h1>
      
      <YouTubeEmbed videoId="wS39d0SQWVE" />
      
      <h2 className="text-2xl font-semibold text-white mb-4">
        Morpheus ↔ Brave Leo
      </h2>

      <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39] mb-8">
        <h3 className="text-xl font-medium text-white mb-3">
          What is Brave Leo?
        </h3>
        <p className="text-lg mb-4">
          Brave Leo is an AI assistant integrated into the Brave browser, providing privacy-first AI capabilities. 
          It allows users to interact with AI while browsing the web, ask questions about content on the page, 
          and get helpful responses without compromising privacy. Brave Leo can be configured to use 
          your preferred AI models, including models from Morpheus.
        </p>
      </div>

      <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39] mb-8">
        <h3 className="text-xl font-medium text-white mb-3">
          Prerequisites
        </h3>
        <ul className="list-disc list-inside space-y-2 text-lg mb-4 ml-4">
          <li>Morpheus API Key</li>
          <li>Brave Installed</li>
          <li>Morpheus Model Identified</li>
        </ul>
      </div>

      <div className="space-y-12">
        <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39]">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 1: Download and Install Brave
          </h3>
          <p className="text-lg mb-4">
            Download and Install the Brave browser (version &gt;1.76.52) through <a href="https://brave.com" className="text-[#57a87a] hover:underline font-medium" target="_blank" rel="noreferrer">brave.com</a>
          </p>
          <div className="relative h-80 w-full border-2 border-[#2d4c39] rounded-lg overflow-hidden mb-4 bg-[#0a1f14]">
            <Image 
              src="/images/brave/bravehome.png"
              alt="Brave Browser Homepage"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39]">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 2: Open Settings
          </h3>
          <p className="text-lg mb-4">
            Open Brave browser and Click the hamburger icon on the top right and then settings
          </p>
          <div className="relative h-80 w-full border-2 border-[#2d4c39] rounded-lg overflow-hidden mb-4 bg-[#0a1f14]">
            <Image 
              src="/images/brave/bravesettings.png"
              alt="Brave Settings"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39]">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 3: Access Leo Settings
          </h3>
          <p className="text-lg mb-4">
            On the lefthand side click "Leo", and then go to the "Bring your own model" section
          </p>
          <div className="relative h-80 w-full border-2 border-[#2d4c39] rounded-lg overflow-hidden mb-4 bg-[#0a1f14]">
            <Image 
              src="/images/brave/bravebyom.png"
              alt="Brave Leo Settings"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39]">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 4: Add New Model
          </h3>
          <p className="text-lg mb-4">
            Click "Add new model" and start configuring the model:
          </p>
          <div className="bg-[#0a1f14] p-4 rounded-lg mb-4">
            <ul className="list-disc list-inside space-y-2 text-lg mb-4 ml-4">
              <li><strong>Label:</strong> MorpheusAI</li>
              <li><strong>Model request name:</strong> Choose model from Morpheus Marketplace</li>
              <li><strong>Server endpoint:</strong> https://api.mor.org/api/v1/chat/completions</li>
              <li><strong>Context size:</strong> Customize or leave as 4000</li>
              <li><strong>API Key:</strong> Morpheus API Key</li>
              <li><strong>System Prompt:</strong> Customize or leave as default</li>
            </ul>
          </div>
          <div className="relative h-80 w-full border-2 border-[#2d4c39] rounded-lg overflow-hidden mb-4 bg-[#0a1f14]">
            <Image 
              src="/images/brave/bravemodels.png"
              alt="Brave Model Configuration"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39]">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 5: Select The Model
          </h3>
          <p className="text-lg mb-4">
            Click add model at the bottom of the screen and go back to the "Bring your own model" section
          </p>
          <div className="relative h-80 w-full border-2 border-[#2d4c39] rounded-lg overflow-hidden mb-4 bg-[#0a1f14]">
            <Image 
              src="/images/brave/braveselect.png"
              alt="Select Morpheus model"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39]">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 6: Set As Default
          </h3>
          <p className="text-lg mb-4">
            Find the "Default model for new conversations" box, and change it to MorpheusAI
          </p>
          <div className="relative h-80 w-full border-2 border-[#2d4c39] rounded-lg overflow-hidden mb-4 bg-[#0a1f14]">
            <Image 
              src="/images/brave/bravedefault.png"
              alt="Set as default model"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39]">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 7: Select Model In Leo
          </h3>
          <p className="text-lg mb-4">
            Go back to the main Leo Assistant page and click the 3 dots next to the "X" on the top bar, and select the MorpheusAI model if not already selected
          </p>
          <div className="relative h-80 w-full border-2 border-[#2d4c39] rounded-lg overflow-hidden mb-4 bg-[#0a1f14]">
            <Image 
              src="/images/brave/leoselect.png"
              alt="Select model in Leo interface"
              fill
              style={{ objectFit: 'contain' }}
            />
        </div>
      </div>

        <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39]">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 8: Start Using Brave Leo with Morpheus
          </h3>
          <p className="text-lg mb-4">
            Go to a website and enter your prompt to use Brave Leo with Morpheus AI
          </p>
          <div className="relative h-80 w-full border-2 border-[#2d4c39] rounded-lg overflow-hidden mb-4 bg-[#0a1f14]">
            <Image 
              src="/images/brave/usebrave.png"
              alt="Using Brave Leo with Morpheus"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 