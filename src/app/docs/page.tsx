'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// Import Image from next/image but we'll use a simpler approach initially
// import Image from 'next/image';

const docs = [
  {
    title: 'Getting Started',
    items: [
      { title: 'What is the API Gateway', path: '/docs/what-is-api-gateway' },
      { title: 'How to use the API Gateway', path: '/docs/how-to-use-api-gateway' },
      { title: 'API Gateway One-Sheeter', path: '/docs/api-gateway-one-sheeter' },
    ],
  },
  {
    title: 'How-To Guides',
    items: [
      { title: 'Creating an API Key', path: '/docs/creating-api-key' },
      { title: 'Viewing Models', path: '/docs/viewing-models' },
      { title: 'Using Swagger UI', path: '/docs/using-swagger-ui' },
    ],
  },
  {
    title: 'Integration Guides',
    items: [
      { title: 'Cursor', path: '/docs/cursor-integration' },
      { title: 'Brave Leo', path: '/docs/integration-brave-leo' },
      { title: 'Open Web-UI', path: '/docs/integration-open-web-ui' },
      { title: 'Eliza', path: '/docs/integration-eliza' },
    ],
  },
  {
    title: 'Links',
    items: [
      { title: 'Swagger UI', path: 'https://api.mor.org/docs' },
      { title: 'Morpheus Website', path: 'https://mor.org' },
      { title: 'Twitter', path: 'https://x.com/MorpheusAIs' },
      { title: 'Discord', path: 'https://discord.gg/morpheusai' },
      { title: 'Github', path: 'https://github.com/MorpheusAIs/' },
    ],
  },
];

export default function DocsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 bg-[#0a1f14] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="h-full overflow-y-auto">
          <div className="px-4 py-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Documentation</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-white hover:text-[#57a87a] md:hidden"
            >
              ✕
            </button>
          </div>
          <nav className="px-4">
            {docs.map((section) => (
              <div key={section.title} className="mb-6">
                <h3 className="text-sm font-semibold text-[#57a87a] uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="mt-2 space-y-1">
                  {section.items.map((item) => (
                    <li key={item.path}>
                      {item.path.startsWith('http') ? (
                        <a
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#132b1c]/70 hover:text-white rounded-md transition-colors"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <Link
                          href={item.path}
                          className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#132b1c]/70 hover:text-white rounded-md transition-colors"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          {item.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden bg-[#0a1f14] shadow-lg">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white hover:text-[#57a87a] focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-white">
              Documentation
            </h1>
          </div>
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-[#11271b] p-8 rounded-lg shadow-xl border-2 border-[#2d4c39]">
              <div className="mb-8 text-center">
                {/* Simple text header instead of Image for now */}
                <div className="text-white text-2xl font-bold mb-4">Morpheus</div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  Welcome to the API Gateway Documentation
                </h1>
                <p className="text-lg text-gray-200 mb-6">
                  This documentation will help you get started with the API Gateway and
                  integrate it into your applications. Choose a topic from the sidebar
                  to learn more.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {docs.map((section) => (
                  <div
                    key={section.title}
                    className="bg-[#183a29] rounded-lg p-6 shadow-lg border-2 border-[#3d5c49]"
                  >
                    <h2 className="text-xl font-semibold text-white mb-4">
                      {section.title}
                    </h2>
                    <ul className="space-y-3">
                      {section.items.map((item) => (
                        <li key={item.path} className="pl-2 border-l-2 border-[#4d6c59]">
                          {item.path.startsWith('http') ? (
                            <a
                              href={item.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#57a87a] hover:text-[#79c99a] transition-colors"
                            >
                              {item.title}
                            </a>
                          ) : (
                            <Link
                              href={item.path}
                              className="text-[#57a87a] hover:text-[#79c99a] transition-colors"
                            >
                              {item.title}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 