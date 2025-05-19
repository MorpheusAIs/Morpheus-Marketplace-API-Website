'use client';

import Link from 'next/link';

export default function WhatIsApiGatewayPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/docs" className="text-indigo-600 hover:text-indigo-900">
          ← Back to Documentation
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        What is the API Gateway
      </h1>
      
      <div className="prose prose-lg max-w-none">
        <p>
          The API Gateway is a centralized service that provides a unified interface to access various API models and services.
          It acts as a single entry point for all client applications, managing requests and routing them to the appropriate backends.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Key Features</h2>
        
        <ul className="list-disc pl-6 space-y-2">
          <li>Centralized access to multiple AI models</li>
          <li>Authentication and authorization</li>
          <li>Rate limiting and quota management</li>
          <li>Request validation</li>
          <li>Response transformation</li>
          <li>Monitoring and analytics</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Benefits</h2>
        
        <ul className="list-disc pl-6 space-y-2">
          <li>Simplified client integration</li>
          <li>Consistent security implementation</li>
          <li>Reduced client-side development complexity</li>
          <li>Improved performance through caching</li>
          <li>Better monitoring and observability</li>
        </ul>
        
        <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-blue-800">
            <strong>Note:</strong> To use the API Gateway, you need to register an account, login, and create an API key.
            See the "How-To Guides" section for detailed instructions.
          </p>
        </div>
      </div>
    </div>
  );
} 