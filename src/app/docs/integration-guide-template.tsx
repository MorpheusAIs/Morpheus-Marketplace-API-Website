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
    <div className="max-w-4xl mx-auto px-4 py-8 text-[var(--platinum)]">
      {/* Navigation Bar */}
      <div className="flex items-center justify-start space-x-4 mb-6">
        <Link href="/" className="px-4 py-2 bg-[var(--eclipse)] hover:bg-[var(--emerald)]/30 text-[var(--platinum)] rounded-md transition-colors">
          Home
        </Link>
        <Link href="/docs" className="px-4 py-2 bg-[var(--eclipse)] hover:bg-[var(--emerald)]/30 text-[var(--platinum)] rounded-md transition-colors">
          Docs
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-[var(--neon-mint)] mb-6">
        Integration Guide Title
      </h1>
      
      <p className="text-lg mb-6">
        This template provides a consistent design for integration guides with improved
        readability and styling. Each section below shows the styling for different
        elements that might be used in a guide.
      </p>
      
      {/* Important information box */}
      <div className="bg-[var(--eclipse)] border-l-4 border-[var(--emerald)] p-4 mb-6">
        <p className="text-[var(--platinum)] font-medium">
          <strong>Important:</strong> Use this box for key information or requirements.
        </p>
      </div>
      
      {/* Main sections */}
      <h2 className="text-2xl font-semibold text-[var(--neon-mint)] mt-8 mb-4">
        Guide Sections
      </h2>
      
      <div className="space-y-12">
        {/* Section with image placeholder */}
        <div className="bg-[var(--matrix-green)] p-6 rounded-lg shadow-sm border border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--neon-mint)] mb-3">
            Section with Image
          </h3>
          <p className="text-lg mb-4">
            This shows how a section with an image should be styled. Images should be placed
            in a consistent container with proper spacing.
          </p>
          
          {/* Image placeholder - replace with actual images when available */}
          <div className="relative h-80 w-full border border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            {/* Uncomment this section when images are available 
            <Image 
              src="/images/guides/example-image.png"
              alt="Example image"
              fill
              style={{ objectFit: 'contain' }}
            /> */}
            <p className="absolute inset-0 flex items-center justify-center text-[var(--platinum)]/70 italic">
              Image placeholder
            </p>
          </div>
        </div>
        
        {/* Section with code sample */}
        <div className="bg-[var(--matrix-green)] p-6 rounded-lg shadow-sm border border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--neon-mint)] mb-3">
            Section with Code Sample
          </h3>
          <p className="text-lg mb-4">
            This shows how code samples should be presented. Use dark backgrounds and proper
            contrast for readability.
          </p>
          
          {/* Code block */}
          <div className="bg-[var(--midnight)] text-[var(--platinum)] p-4 rounded-lg mb-4 overflow-auto border border-[var(--emerald)]/20">
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
          <div className="bg-[var(--midnight)] text-[var(--platinum)] p-4 rounded-lg mb-4 overflow-auto border border-[var(--emerald)]/20">
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
        <div className="bg-[var(--matrix-green)] p-6 rounded-lg shadow-sm border border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--neon-mint)] mb-3">
            Section with Steps
          </h3>
          <p className="text-lg mb-4">
            When providing step-by-step instructions, use numbered or bulleted lists
            for clarity.
          </p>
          
          <ol className="list-decimal list-inside space-y-2 ml-2 mb-6">
            <li className="text-lg">
              <span className="font-medium text-[var(--platinum)]">First step:</span> Description of what to do first
            </li>
            <li className="text-lg">
              <span className="font-medium text-[var(--platinum)]">Second step:</span> Description of what to do next
            </li>
            <li className="text-lg">
              <span className="font-medium text-[var(--platinum)]">Third step:</span> Description of the final step
            </li>
          </ol>
        </div>
      </div>
      
      {/* Success or completion message */}
      <div className="bg-[var(--eclipse)] border-l-4 border-[var(--neon-mint)] p-6 mt-8 mb-8">
        <h3 className="text-xl font-medium text-[var(--neon-mint)] mb-2">
          Success Section
        </h3>
        <p className="text-lg text-[var(--platinum)]">
          Use this section to indicate successful completion of the guide or to provide
          a summary of what was accomplished.
        </p>
      </div>
      
      {/* Navigation back to docs */}
      <div className="mt-8 border-t border-[var(--emerald)]/30 pt-6">
        <Link href="/docs" className="text-[var(--neon-mint)] hover:text-[var(--emerald)] font-medium">
          &larr; Back to Documentation
        </Link>
      </div>
    </div>
  );
} 