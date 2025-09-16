'use client';

import React, { useState } from 'react';
import { useCognitoAuth } from '@/lib/auth/CognitoAuthContext';
import Link from 'next/link';

export default function TestPage() {
  const { isAuthenticated } = useCognitoAuth();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isAuthenticated) return;

    setIsLoading(true);
    try {
      // TODO: Implement chat functionality
      console.log('Sending message:', message);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--matrix-green)]">
        <div className="max-w-md w-full space-y-8 p-8 bg-[var(--eclipse)] rounded-lg shadow-lg border border-[var(--emerald)]/30">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--neon-mint)]">
              Please log in to access the chat
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--platinum)]">
              You need to be logged in to use the chat functionality.
            </p>
            <div className="mt-6 flex justify-center">
              <Link 
                href="/" 
                className="px-4 py-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] font-medium rounded-md hover:bg-[var(--emerald)] transition-colors"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--matrix-green)]">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--eclipse)] shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-[var(--neon-mint)] mb-4">
              Chat Testing (Coming Soon)
            </h1>
            <p className="text-[var(--platinum)] mb-6">
              This feature is currently under development. Soon you'll be able to test
              your API integration with a simple chat interface.
            </p>

            <div className="border-t border-[var(--emerald)]/30 pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[var(--platinum)]"
                  >
                    Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="shadow-sm focus:ring-[var(--neon-mint)] focus:border-[var(--neon-mint)] block w-full sm:text-sm border-[var(--neon-mint)]/30 rounded-md bg-[var(--midnight)] text-[var(--platinum)]"
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading || !message.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--matrix-green)] bg-[var(--neon-mint)] hover:bg-[var(--emerald)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--emerald)] disabled:opacity-50"
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 