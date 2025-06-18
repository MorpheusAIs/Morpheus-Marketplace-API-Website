'use client';

import React from 'react';
import Link from 'next/link';

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
  return (
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
  );
} 