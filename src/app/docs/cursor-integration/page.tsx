'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CursorIntegration() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-[var(--platinum)]">
      <div className="flex items-center justify-start space-x-4 mb-6">
        <Link href="/" className="px-4 py-2 bg-[var(--eclipse)] hover:bg-[var(--eclipse)] rounded-md text-[var(--platinum)] font-medium transition-colors">
          Home
        </Link>
        <Link href="/docs" className="px-4 py-2 bg-[var(--eclipse)] hover:bg-[var(--eclipse)] rounded-md text-[var(--platinum)] font-medium transition-colors">
          Docs
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-[var(--platinum)] mb-6">
        How To Integrate (Cursor)
      </h1>
      
      <h2 className="text-2xl font-semibold text-[var(--platinum)] mb-4">
        Morpheus ↔ Cursor
      </h2>

      <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30 mb-8">
        <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
          What is Cursor?
        </h3>
        <p className="text-lg mb-4">
          Cursor IDE is an AI-powered code editor designed to enhance developer productivity by enabling code generation from natural language, 
          intelligent autocompletion, and context-aware refactoring. Its strength lies in AI-driven tools that understand coding context, 
          automate repetitive tasks, optimize complex logic, and more. Cursors allows seasoned developers to focus on higher-level problem-solving 
          while also assisting new developers learning to code. Cursor allows you to bring your own OpenAI API Compatible source of inference, 
          and Morpheus can be integrated in just a few simple steps.
        </p>
      </div>

      <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30 mb-8">
        <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
          Prerequisites
        </h3>
        <ul className="list-disc list-inside space-y-2 text-lg mb-4 ml-4">
          <li>Morpheus API Key</li>
          <li>Cursor Installed</li>
          <li>Morpheus Model Identified</li>
        </ul>
      </div>

      <div className="space-y-12">
        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 1: Download and Install Cursor
          </h3>
          <p className="text-lg mb-4">
            Download and Install Cursor through <a href="https://cursor.sh" className="text-[var(--neon-mint)] hover:text-[var(--emerald)] font-medium" target="_blank" rel="noreferrer">Cursor.com</a>
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/Cursor/download.png"
              alt="Download Cursor"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 2: Open Settings
          </h3>
          <p className="text-lg mb-4">
            Open Cursor and Click the gear icon on the top right for Settings
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/Cursor/gear.png"
              alt="Settings gear icon"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 3: Access Models Tab
          </h3>
          <p className="text-lg mb-4">
            Click the "Models" Tab for AI Integrations
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/Cursor/cursormodels.png"
              alt="Models tab"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 4: Add Your Model
          </h3>
          <p className="text-lg mb-4">
            Scroll down to the models and click the "+Add Model" button, then input the model name of the model you identified 
            in the Morpheus Marketplace. Then click "+ Add Model". You will see it populate in the list above
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/Cursor/addmodel.png"
              alt="Add model interface"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 5: Configure API Settings
          </h3>
          <p className="text-lg mb-4">
            Go to the "OpenAI API Key" section and input the following:
          </p>
          <div className="bg-[var(--eclipse)] p-4 rounded-lg mb-4">
            <p className="text-lg mb-2">
              <strong>OpenAI API Key:</strong> Use your Morpheus API Key
            </p>
            <p className="text-lg">
              <strong>Override OpenAI Base URL:</strong> https://api.mor.org/api/v1
            </p>
          </div>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/Cursor/openaikey.png"
              alt="OpenAI API key configuration"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 6: Enable Integration
          </h3>
          <p className="text-lg mb-4">
            Click "Save" next to the base URL and then click "Verify" next to the API key. Once verified, click on the red radio button 
            to enable the integration. Click "Enable OpenAI API Key" when prompted
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/Cursor/enableopenai.png"
              alt="Enable OpenAI integration"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 7: Verify Success
          </h3>
          <p className="text-lg mb-4">
            If successful, you will see the radio button turn from red to green indicating success.
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/Cursor/cursorsuccess.png"
              alt="Success indication"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 