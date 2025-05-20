'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HowToUseApiGateway() {
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
        Morpheus API Gateway
      </h1>
      
      <p className="text-lg mb-6">
        Using the Morpheus API is truly simple. The structure of this gateway allows you to access the Morpheus Compute Marketplace just as you would with any other AI Provider (like OpenAI).
      </p>

      <div className="space-y-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 1: Sign Up or Login
          </h3>
          <p className="text-lg mb-4">
            First, head over to <Link href="/admin" className="text-indigo-400 hover:underline font-medium">the admin page</Link> and sign up or login to your account
          </p>
          <div className="relative h-80 w-full border border-gray-600 rounded-lg overflow-hidden mb-4 bg-gray-700">
            <Image 
              src="/images/startup/login.png"
              alt="Login Page"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 2: Access Admin Dashboard
          </h3>
          <p className="text-lg mb-4">
            Then, you will be brought to your admin dashboard where you can manage your API Keys or configure your automation
          </p>
          <div className="relative h-80 w-full border border-gray-600 rounded-lg overflow-hidden mb-4 bg-gray-700">
            <Image 
              src="/images/startup/manage.png"
              alt="Admin Dashboard"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 3: Create API Key
          </h3>
          <p className="text-lg mb-4">
            Next, create your first API Key by naming your key and clicking "Create Key". A new box will appear with your API key. Make sure you copy this down.
          </p>
          <div className="relative h-80 w-full border border-gray-600 rounded-lg overflow-hidden mb-4 bg-gray-700">
            <Image 
              src="/images/startup/apikey.png"
              alt="API Key Creation"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 4: Configure Automation
          </h3>
          <p className="text-lg mb-4">
            Then, enter the API key into the Automation settings tab to configure automatic session generation. This removes the need to create sessions with individual providers hosting your model of choice.
          </p>
          <div className="relative h-80 w-full border border-gray-600 rounded-lg overflow-hidden mb-4 bg-gray-700">
            <Image 
              src="/images/startup/automation.png"
              alt="Automation Configuration"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 5: Start Testing
          </h3>
          <p className="text-lg mb-4">
            Now you're ready to go! You can head over to <Link href="/test" className="text-indigo-400 hover:underline font-medium">the test page</Link> to begin some test chats with your API key
          </p>
          <div className="relative h-80 w-full border border-gray-600 rounded-lg overflow-hidden mb-4 bg-gray-700">
            <Image 
              src="/images/startup/chat.png"
              alt="Test Chat Interface"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-xl font-medium text-white mb-3">
            Ready to Use!
          </h3>
          <p className="text-lg mb-4">
            Now you can begin using the Morpheus Compute Node through the API Gateway! For integrations, use the following information:
          </p>
          <div className="bg-blue-900 border-l-4 border-blue-500 p-4 mb-4">
            <p className="text-white font-medium">
              <strong>Base URL:</strong> https://api.mor.org/api/v1
            </p>
            <p className="text-white font-medium">
              <strong>API Key:</strong> [Your API key]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 