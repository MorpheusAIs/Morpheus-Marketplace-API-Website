'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Integration Guide Template
 * 
 * This is a reusable template for creating integration guide pages
 * with consistent styling and improved readability.
 * 
 * How to use:
 * 1. Copy this file to a new page
 * 2. Replace the title, content, and code examples
 * 3. Add images when available
 */
export default function IntegrationGuideTemplate() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Integration Guide Title
      </h1>
      
      <p className="text-lg mb-6">
        This template provides a consistent design for integration guides with improved
        readability and styling. Each section below shows the styling for different
        elements that might be used in a guide.
      </p>
      
      {/* Important information box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-blue-800 font-medium">
          <strong>Important:</strong> Use this box for key information or requirements.
        </p>
      </div>
      
      {/* Main sections */}
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Guide Sections
      </h2>
      
      <div className="space-y-12">
        {/* Section with image placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-medium text-gray-900 mb-3">
            Section with Image
          </h3>
          <p className="text-lg mb-4">
            This shows how a section with an image should be styled. Images should be placed
            in a consistent container with proper spacing.
          </p>
          
          {/* Image placeholder - replace with actual images when available */}
          <div className="relative h-80 w-full border border-gray-300 rounded-lg overflow-hidden mb-4 bg-gray-100">
            {/* Uncomment this section when images are available 
            <Image 
              src="/images/guides/example-image.png"
              alt="Example image"
              fill
              style={{ objectFit: 'contain' }}
            /> */}
            <p className="absolute inset-0 flex items-center justify-center text-gray-500 italic">
              Image placeholder
            </p>
          </div>
        </div>
        
        {/* Section with code sample */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-medium text-gray-900 mb-3">
            Section with Code Sample
          </h3>
          <p className="text-lg mb-4">
            This shows how code samples should be presented. Use dark backgrounds and proper
            contrast for readability.
          </p>
          
          {/* Code block */}
          <div className="bg-gray-800 text-gray-100 p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`// Example code block
function exampleFunction() {
  const data = {
    key: "value",
    number: 42,
    nested: {
      property: true
    }
  };
  
  return data;
}`}
            </pre>
          </div>
          
          <p className="text-lg mb-4">
            Explanatory text after the code block can help clarify usage or expected results.
          </p>
          
          {/* Example response */}
          <div className="bg-gray-800 text-gray-100 p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`{
  "result": "success",
  "data": {
    "key": "value",
    "number": 42,
    "nested": {
      "property": true
    }
  }
}`}
            </pre>
          </div>
        </div>
        
        {/* Section with steps */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-medium text-gray-900 mb-3">
            Section with Steps
          </h3>
          <p className="text-lg mb-4">
            When providing step-by-step instructions, use numbered or bulleted lists
            for clarity.
          </p>
          
          <ol className="list-decimal list-inside space-y-2 ml-2 mb-6">
            <li className="text-lg">
              <span className="font-medium">First step:</span> Description of what to do first
            </li>
            <li className="text-lg">
              <span className="font-medium">Second step:</span> Description of what to do next
            </li>
            <li className="text-lg">
              <span className="font-medium">Third step:</span> Description of the final step
            </li>
          </ol>
        </div>
      </div>
      
      {/* Success or completion message */}
      <div className="bg-green-50 border-l-4 border-green-600 p-6 mt-8 mb-8">
        <h3 className="text-xl font-medium text-green-900 mb-2">
          Success Section
        </h3>
        <p className="text-lg text-green-800">
          Use this section to indicate successful completion of the guide or to provide
          a summary of what was accomplished.
        </p>
      </div>
      
      {/* Navigation back to docs */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <Link href="/docs" className="text-indigo-600 hover:text-indigo-900 font-medium">
          &larr; Back to Documentation
        </Link>
      </div>
    </div>
  );
} 