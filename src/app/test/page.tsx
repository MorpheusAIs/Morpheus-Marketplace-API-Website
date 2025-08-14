'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URLS } from '@/lib/api/config';
import { useCognitoAuth } from '@/lib/auth/CognitoAuthContext';

// Type definition for models
type Model = {
  id: string;
  blockchainId?: string;
  created?: number;
  tags?: Array<any>;
};

export default function TestPage() {
  const [userPrompt, setUserPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [serverResponse, setServerResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  
  // API key state from sessionStorage
  const [fullApiKey, setFullApiKey] = useState<string>('');
  const [selectedApiKeyPrefix, setSelectedApiKeyPrefix] = useState<string>('');
  
  // Model state
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('default');
  const [loadingModels, setLoadingModels] = useState(false);
  
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useCognitoAuth();

  // Load API key from sessionStorage on component mount
  useEffect(() => {
    try {
      const storedFullApiKey = sessionStorage.getItem('fullApiKey');
      const storedApiKeyPrefix = sessionStorage.getItem('selectedApiKeyPrefix');
      
      if (storedFullApiKey && storedApiKeyPrefix) {
        setFullApiKey(storedFullApiKey);
        setSelectedApiKeyPrefix(storedApiKeyPrefix);
      }
    } catch (error) {
      console.error('Error accessing sessionStorage:', error);
    }
  }, []);

  // Fetch available models on component mount
  useEffect(() => {
    fetchAvailableModels();
  }, []);

  // Fetch available models from the API
  const fetchAvailableModels = async () => {
    setLoadingModels(true);
    try {
      console.log('Fetching models from API...');
      
      const response = await fetch(API_URLS.models(), {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Models API response:', data);
      
      // Handle the data structure we see in the console
      if (data.data && Array.isArray(data.data)) {
        console.log(`Retrieved ${data.data.length} models from data.data array`);
        const formattedModels = data.data.map((model: any) => ({
          id: model.id,
          blockchainId: model.blockchainId,
          created: model.created
        }));
        
        // Sort models alphabetically by ID
        const sortedModels = formattedModels.sort((a: Model, b: Model) => a.id.localeCompare(b.id));
        setModels(sortedModels);
        
        // Set llama-3.3-70b as default if available, otherwise use the first model
        const defaultModel = sortedModels.find((model: Model) => model.id === 'llama-3.3-70b');
        if (defaultModel) {
          setSelectedModel('llama-3.3-70b');
        } else if (sortedModels.length > 0) {
          setSelectedModel(sortedModels[0].id);
        }
      } else if (Array.isArray(data)) {
        console.log(`Retrieved ${data.length} models from direct array`);
        
        // Sort models alphabetically by ID
        const sortedModels = data.sort((a: Model, b: Model) => a.id.localeCompare(b.id));
        setModels(sortedModels);
        
        // Set llama-3.3-70b as default if available, otherwise use the first model
        const defaultModel = sortedModels.find((model: Model) => model.id === 'llama-3.3-70b');
        if (defaultModel) {
          setSelectedModel('llama-3.3-70b');
        } else if (sortedModels.length > 0) {
          setSelectedModel(sortedModels[0].id);
        }
      } else {
        console.error('Unexpected API response format:', data);
        // Set a fallback model
        setModels([{ id: 'default' }]);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      // Set a fallback model
      setModels([{ id: 'default' }]);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(false);
    
    try {
      // Create the request body
      const requestBody = {
        model: selectedModel, // Use the selected model instead of "default"
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

      // Make the actual API call using the stored API key
      const res = await fetch(API_URLS.chatCompletions(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${fullApiKey}` // Use Bearer format for API key
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
  '${API_URLS.chatCompletions()}' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer ${fullApiKey || '[YOUR_API_KEY]'}' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "model": "${selectedModel}",
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
    <main className="min-h-screen p-8 pt-20 max-w-4xl mx-auto" style={{
      backgroundImage: "url('/images/942b261a-ecc5-420d-9d4b-4b2ae73cab6d.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed"
    }}>
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center p-4 border-b border-[var(--emerald)]/30 bg-[var(--matrix-green)]">
        <div className="text-xl font-bold text-[var(--neon-mint)]">
          Morpheus API Gateway
        </div>
        <div className="flex gap-4">
          <Link href="/chat" className="px-4 py-2 bg-[var(--eclipse)] hover:bg-[var(--neon-mint)] text-[var(--platinum)] hover:text-[var(--matrix-green)] rounded-md transition-colors">
            Chat
          </Link>
          <Link href="/test" className="px-4 py-2 bg-[var(--eclipse)] hover:bg-[var(--neon-mint)] text-[var(--platinum)] hover:text-[var(--matrix-green)] rounded-md transition-colors">
            Test
          </Link>
          <Link href="/docs" className="px-4 py-2 bg-[var(--eclipse)] hover:bg-[var(--neon-mint)] text-[var(--platinum)] hover:text-[var(--matrix-green)] rounded-md transition-colors">
            Docs
          </Link>
          <Link href="/" className="px-4 py-2 bg-[var(--eclipse)] hover:bg-[var(--neon-mint)] text-[var(--platinum)] hover:text-[var(--matrix-green)] rounded-md transition-colors">
            Home
          </Link>
        </div>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--neon-mint)]">API Test Interface</h1>
      </div>
      
      {/* Authentication Status */}
      {!isAuthenticated ? (
        <div className="mb-8 p-4 bg-[var(--matrix-green)] border border-[var(--emerald)]/30 rounded-md">
          <div className="text-[var(--platinum)] mb-2">
            You need to be authenticated to use the API test interface.
          </div>
          <Link 
            href="/admin" 
            className="px-4 py-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] rounded-md hover:bg-[var(--emerald)] transition-colors"
          >
            Go to Admin to Login & Select API Key
          </Link>
        </div>
      ) : !fullApiKey ? (
        <div className="mb-8 p-4 bg-[var(--matrix-green)] border border-[var(--emerald)]/30 rounded-md">
          <div className="text-[var(--platinum)] mb-2">
            No API key selected. Please go to the Admin page to select an API key.
          </div>
          <Link 
            href="/admin" 
            className="px-4 py-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] rounded-md hover:bg-[var(--emerald)] transition-colors"
          >
            Go to Admin to Select API Key
          </Link>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-[var(--matrix-green)] border border-[var(--emerald)]/30 rounded-md">
          <div className="text-[var(--platinum)] mb-2">
            <strong>Using API key:</strong> {selectedApiKeyPrefix}...
          </div>
          <div className="text-sm text-[var(--platinum)]/70">
            Ready to test API endpoints
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        {authError && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md">
            <div className="text-red-400">
              Authentication error: Please provide a valid API key or log in to get one.
            </div>
          </div>
        )}
        
        {/* Model Selection Dropdown */}
        <div className="mb-4">
          <label htmlFor="modelSelect" className="block text-sm font-medium mb-1 text-[var(--platinum)]">
            Model
          </label>
          <select
            id="modelSelect"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 border border-[var(--neon-mint)]/30 rounded-md text-[var(--platinum)] bg-[var(--matrix-green)] placeholder-[var(--platinum)]/70 focus:ring-0 focus:border-[var(--emerald)]"
            disabled={loadingModels}
            style={{color: 'var(--platinum)', caretColor: 'var(--platinum)'}}
          >
            {loadingModels ? (
              <option value="default">Loading models...</option>
            ) : models.length === 0 ? (
              <option value="default">Default</option>
            ) : (
              models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.id}
                </option>
              ))
            )}
          </select>
          <div className="text-xs text-[var(--platinum)]/70 mt-1">
            {loadingModels ? 'Fetching available models...' : 
             models.length === 0 ? 'No models found, using default' : 
             `${models.length} model${models.length !== 1 ? 's' : ''} available`}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium mb-1 text-[var(--platinum)]">
            User Prompt
          </label>
          <textarea
            id="prompt"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="w-full p-2 border border-[var(--neon-mint)]/30 rounded-md h-32 text-[var(--platinum)] bg-[var(--matrix-green)] placeholder-[var(--platinum)]/70 focus:ring-0 focus:border-[var(--emerald)]"
            placeholder="Enter your prompt"
            style={{color: 'var(--platinum)', caretColor: 'var(--platinum)'}}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !fullApiKey || !isAuthenticated}
          className="px-4 py-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] rounded-md hover:bg-[var(--emerald)] disabled:bg-[var(--eclipse)] disabled:text-[var(--platinum)]/50 transition-colors"
        >
          {isLoading ? 'Sending...' : !fullApiKey || !isAuthenticated ? 'API Key Required' : 'Send Request'}
        </button>
      </form>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-[var(--neon-mint)]">CURL Request</h2>
        <div className="bg-[var(--matrix-green)] p-4 rounded-md border border-[var(--emerald)]/30">
          <pre className="whitespace-pre-wrap break-words text-sm text-[var(--platinum)]">{curlCommand}</pre>
          <button
            onClick={() => navigator.clipboard.writeText(curlCommand)}
            className="mt-2 px-3 py-1 bg-[var(--eclipse)] text-sm rounded-md hover:bg-[var(--neon-mint)] text-[var(--platinum)] hover:text-[var(--matrix-green)] transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
      </div>
      
      {serverResponse && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-[var(--neon-mint)]">Server Response</h2>
          <div className="bg-[var(--matrix-green)] p-4 rounded-md border border-[var(--emerald)]/30">
            <pre className="whitespace-pre-wrap break-words text-sm text-[var(--platinum)]">{serverResponse}</pre>
          </div>
        </div>
      )}
      
      {response && (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-[var(--neon-mint)]">Response Content</h2>
          <div className="bg-[var(--matrix-green)] p-4 rounded-md border border-[var(--emerald)]/30">
            <pre className="whitespace-pre-wrap break-words text-[var(--platinum)]">{response}</pre>
          </div>
        </div>
      )}
    </main>
  );
} 