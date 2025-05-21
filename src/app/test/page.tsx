'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TestPage() {
  const [apiKey, setApiKey] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [serverResponse, setServerResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const router = useRouter();

  // Try to get auth token from localStorage on component mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setApiKey(storedToken);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(false);
    
    try {
      // Create the request body
      const requestBody = {
        model: "default",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant."
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        stream: false
      };

      // Make the actual API call using the user-provided API key
      const res = await fetch('https://api.mor.org/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': apiKey || '' // Use empty string if no API key is provided
        },
        body: JSON.stringify(requestBody)
      });

      const data = await res.json();
      
      // Set the full response
      setServerResponse(JSON.stringify(data, null, 2));
      
      // Check for auth errors
      if (res.status === 401 || res.status === 403) {
        setAuthError(true);
        setResponse('Authentication error: Please provide a valid API key or log in to get one.');
      } else if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        setResponse(data.choices[0].message.content);
      } else {
        setResponse('No content found in the response');
      }
    } catch (error) {
      console.error('Error:', error);
      setServerResponse(JSON.stringify({ error: 'An error occurred while processing your request' }, null, 2));
      setResponse('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate the CURL command based on user input
  const curlCommand = `curl -X 'POST' \\
  'https://api.mor.org/api/v1/chat/completions' \\
  -H 'accept: application/json' \\
  -H 'Authorization: ${apiKey || '[YOUR_API_KEY]'}' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "model": "default",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "${userPrompt || 'Hello, how are you?'}"
    }
  ],
  "stream": false
}'`;

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">API Test Interface</h1>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 bg-[#0f2c1e] hover:bg-[#143824] text-white rounded-md transition-colors">
            Login
          </Link>
          <Link href="/" className="px-4 py-2 bg-[#0f2c1e] hover:bg-[#143824] text-white rounded-md transition-colors">
            Home
          </Link>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium mb-1 text-white">
            API Key
          </label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-black bg-white"
            placeholder="Enter your API key"
          />
          {authError && (
            <div className="mt-2 text-red-500">
              Authentication failed. Please provide a valid API key or&nbsp;
              <Link href="/login" className="text-[#57a87a] hover:text-[#79c99a]">
                log in to get one
              </Link>.
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium mb-1 text-white">
            User Prompt
          </label>
          <textarea
            id="prompt"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md h-32 text-black bg-white"
            placeholder="Enter your prompt"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-[#0f2c1e] text-white rounded-md hover:bg-[#143824] disabled:bg-[#183a29] disabled:opacity-70 transition-colors"
        >
          {isLoading ? 'Sending...' : 'Send Request'}
        </button>
      </form>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">CURL Request</h2>
        <div className="bg-[#0a1f14] p-4 rounded-md border-2 border-[#2d4c39]">
          <pre className="whitespace-pre-wrap break-words text-sm text-white">{curlCommand}</pre>
          <button
            onClick={() => navigator.clipboard.writeText(curlCommand)}
            className="mt-2 px-3 py-1 bg-[#183a29] text-sm rounded-md hover:bg-[#2d4c39] text-white transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
      </div>
      
      {serverResponse && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-white">Server Response</h2>
          <div className="bg-[#0a1f14] p-4 rounded-md border-2 border-[#2d4c39]">
            <pre className="whitespace-pre-wrap break-words text-sm text-white">{serverResponse}</pre>
          </div>
        </div>
      )}
      
      {response && (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-white">Response Content</h2>
          <div className="bg-[#0a1f14] p-4 rounded-md border-2 border-[#2d4c39]">
            <pre className="whitespace-pre-wrap break-words text-white">{response}</pre>
          </div>
        </div>
      )}
    </main>
  );
} 