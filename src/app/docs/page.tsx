'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const docs = [
  {
    title: 'Getting Started',
    items: [
      { title: 'What is the API Gateway', path: '/docs/what-is-api-gateway' },
      { title: 'How to use the API Gateway', path: '/docs/how-to-use-api-gateway' },
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
      { title: 'Cursor', path: '/docs/integration-cursor' },
      { title: 'Brave Leo', path: '/docs/integration-brave-leo' },
      { title: 'Open Web-UI', path: '/docs/integration-open-web-ui' },
      { title: 'Eliza', path: '/docs/integration-eliza' },
    ],
  },
];

export default function DocsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="h-full overflow-y-auto">
          <div className="px-4 py-6">
            <h2 className="text-2xl font-bold text-gray-900">Documentation</h2>
          </div>
          <nav className="px-4">
            {docs.map((section) => (
              <div key={section.title} className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="mt-2 space-y-1">
                  {section.items.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                      >
                        {item.title}
                      </Link>
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
        <div className="md:hidden bg-white shadow-sm">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
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
            <h1 className="text-xl font-semibold text-gray-900">
              Documentation
            </h1>
          </div>
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Welcome to the API Gateway Documentation
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              This documentation will help you get started with the API Gateway and
              integrate it into your applications. Choose a topic from the sidebar
              to learn more.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {docs.map((section) => (
                <div
                  key={section.title}
                  className="bg-gray-50 rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 