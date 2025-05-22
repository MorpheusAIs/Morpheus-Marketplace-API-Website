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
    <div className="flex h-screen bg-[var(--matrix-green)]">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center p-4 border-b border-[var(--emerald)]/30 bg-[var(--matrix-green)]">
        <div className="text-xl font-bold text-[var(--neon-mint)]">
          Morpheus API Gateway
        </div>
        <div className="flex gap-4">
          <Link href="/chat" className="px-4 py-2 bg-[var(--eclipse)] hover:bg-[var(--emerald)]/30 text-[var(--platinum)] rounded-md transition-colors">
            Chat
          </Link>
          <Link href="/test" className="px-4 py-2 bg-[var(--eclipse)] hover:bg-[var(--emerald)]/30 text-[var(--platinum)] rounded-md transition-colors">
            Test
          </Link>
          <Link href="/docs" className="px-4 py-2 bg-[var(--eclipse)] hover:bg-[var(--emerald)]/30 text-[var(--platinum)] rounded-md transition-colors">
            Docs
          </Link>
          <Link href="/" className="px-4 py-2 bg-[var(--eclipse)] hover:bg-[var(--emerald)]/30 text-[var(--platinum)] rounded-md transition-colors">
            Home
          </Link>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[var(--midnight)] bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar - adjust top padding to account for nav bar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 bg-[var(--matrix-green)] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 pt-16`}
      >
        <div className="h-full overflow-y-auto">
          <div className="px-4 py-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[var(--neon-mint)]">Documentation</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-[var(--platinum)] hover:text-[var(--neon-mint)] md:hidden"
            >
              ✕
            </button>
          </div>
          <nav className="px-4">
            {docs.map((section) => (
              <div key={section.title} className="mb-6">
                <h3 className="text-sm font-semibold text-[var(--emerald)] uppercase tracking-wider">
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
                          className="block px-4 py-2 text-sm text-[var(--platinum)] hover:bg-[var(--eclipse)]/70 hover:text-[var(--neon-mint)] rounded-md transition-colors"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <Link
                          href={item.path}
                          className="block px-4 py-2 text-sm text-[var(--platinum)] hover:bg-[var(--eclipse)]/70 hover:text-[var(--neon-mint)] rounded-md transition-colors"
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

      {/* Main content - adjust top padding to account for nav bar */}
      <div className="flex-1 flex flex-col overflow-hidden pt-16">
        {/* Mobile header */}
        <div className="md:hidden bg-[var(--matrix-green)] shadow-lg">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-[var(--platinum)] hover:text-[var(--neon-mint)] focus:outline-none"
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
            <h1 className="text-xl font-semibold text-[var(--neon-mint)]">
              Documentation
            </h1>
          </div>
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-[var(--eclipse)] p-8 rounded-lg shadow-xl border-2 border-[var(--emerald)]/30">
              <div className="mb-8 text-center">
                {/* Simple text header instead of Image for now */}
                <div className="text-[var(--neon-mint)] text-2xl font-bold mb-4">Morpheus</div>
                <h1 className="text-3xl font-bold text-[var(--platinum)] mb-4">
                  Welcome to the API Gateway Documentation
                </h1>
                <p className="text-lg text-[var(--platinum)]/80 mb-6">
                  This documentation will help you get started with the API Gateway and
                  integrate it into your applications. Choose a topic from the sidebar
                  to learn more.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {docs.map((section) => (
                  <div
                    key={section.title}
                    className="bg-[var(--matrix-green)] rounded-lg p-6 shadow-lg border border-[var(--emerald)]/30"
                  >
                    <h2 className="text-xl font-semibold text-[var(--neon-mint)] mb-4">
                      {section.title}
                    </h2>
                    <ul className="space-y-3">
                      {section.items.map((item) => (
                        <li key={item.path} className="pl-2 border-l-2 border-[var(--emerald)]/50">
                          {item.path.startsWith('http') ? (
                            <a
                              href={item.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--platinum)] hover:text-[var(--neon-mint)] transition-colors"
                            >
                              {item.title}
                            </a>
                          ) : (
                            <Link
                              href={item.path}
                              className="text-[var(--platinum)] hover:text-[var(--neon-mint)] transition-colors"
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