'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URLS } from '@/lib/api/config';
import { useCognitoAuth } from '@/lib/auth/CognitoAuthContext';
import { getAllowedModelTypes, filterModelsByType, getFilterOptions, getFilterDescription, selectDefaultModel } from '@/lib/model-filter-utils';
import AuthModal from '@/components/auth/AuthModal';
import { CognitoDirectAuth } from '@/lib/auth/cognito-direct-auth';

// Type definition for models
type Model = {
  id: string;
  blockchainId?: string;
  created?: number;
  tags?: Array<any>;
  ModelType?: string;
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
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('default');
  const [loadingModels, setLoadingModels] = useState(false);
  const [selectedModelType, setSelectedModelType] = useState<string>('all');
  const [filterOptions, setFilterOptions] = useState<Array<{value: string, label: string}>>([]);
  const [allowedTypes] = useState<string[]>(getAllowedModelTypes());
  
  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useCognitoAuth();


  // Load API key from sessionStorage on component mount
  useEffect(() => {
    try {
      const storedFullApiKey = sessionStorage.getItem('verified_api_key');
      const storedApiKeyPrefix = sessionStorage.getItem('verified_api_key_prefix');
      
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
          created: model.created,
          ModelType: model.ModelType || model.modelType || 'UNKNOWN'
        }));
        
        // Sort models alphabetically by ID
        const sortedModels = formattedModels.sort((a: Model, b: Model) => a.id.localeCompare(b.id));
        setModels(sortedModels);
        
        // Apply initial filter (LLM and UNKNOWN only)
        applyModelTypeFilter(sortedModels, 'all');
        
      } else if (Array.isArray(data)) {
        console.log(`Retrieved ${data.length} models from direct array`);
        
        const formattedModels = data.map((model: any) => ({
          id: model.id,
          blockchainId: model.blockchainId,
          created: model.created,
          ModelType: model.ModelType || model.modelType || 'UNKNOWN'
        }));
        
        // Sort models alphabetically by ID
        const sortedModels = formattedModels.sort((a: Model, b: Model) => a.id.localeCompare(b.id));
        setModels(sortedModels);
        
        // Apply initial filter (LLM and UNKNOWN only)
        applyModelTypeFilter(sortedModels, 'all');
      } else {
        console.error('Unexpected API response format:', data);
        // Set a fallback model
        const fallbackModels = [{ id: 'default', ModelType: 'LLM' }];
        setModels(fallbackModels);
        setFilteredModels(fallbackModels);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      // Set a fallback model
      const fallbackModels = [{ id: 'default', ModelType: 'LLM' }];
      setModels(fallbackModels);
      setFilteredModels(fallbackModels);
    } finally {
      setLoadingModels(false);
    }
  };

  // Filter models by type using environment configuration
  const applyModelTypeFilter = (modelsToFilter: Model[], filterType: string) => {
    const filtered = filterModelsByType(modelsToFilter, filterType, allowedTypes);
    setFilteredModels(filtered);
    
    // Update filter options based on available models
    const options = getFilterOptions(modelsToFilter, allowedTypes);
    setFilterOptions(options);
    
    // Set default model selection using environment configuration
    if (filtered.length > 0) {
      const defaultModelId = selectDefaultModel(filtered);
      if (defaultModelId) {
        setSelectedModel(defaultModelId);
      }
    }
  };

  // Handle model type filter change
  const handleModelTypeFilterChange = (filterType: string) => {
    setSelectedModelType(filterType);
    applyModelTypeFilter(models, filterType);
  };

  // Handle authentication success
  const handleAuthSuccess = (tokens: any, userInfo: any) => {
    // Store tokens and close modal
    CognitoDirectAuth.storeTokens(tokens);
    localStorage.setItem('user_info', JSON.stringify(userInfo));
    setShowAuthModal(false);
    // Refresh the page to update authentication state
    window.location.reload();
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
            <h3 className="text-lg font-medium text-[var(--neon-mint)] mb-3">Authentication Required</h3>
            <p className="mb-2">You need to be authenticated and validate an API key to use the API test interface.</p>
            <p className="text-sm text-[var(--platinum)]/70">After logging in, you'll be taken to the Admin page to select your API key.</p>
          </div>
          <button 
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] rounded-md hover:bg-[var(--emerald)] transition-colors"
          >
            Login to Continue
          </button>
        </div>
      ) : !fullApiKey ? (
        <div className="mb-8 p-4 bg-[var(--matrix-green)] border border-[var(--emerald)]/30 rounded-md">
          <div className="text-[var(--platinum)] mb-2">
            {localStorage.getItem('selected_api_key_prefix') 
              ? 'API key selected but not verified. Please go to the Admin page to verify your API key.'
              : 'No API key selected. Please go to the Admin page to select an API key.'
            }
          </div>
          <Link 
            href="/admin" 
            className="px-4 py-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] rounded-md hover:bg-[var(--emerald)] transition-colors"
          >
            {localStorage.getItem('selected_api_key_prefix')
              ? 'Go to Admin to Verify API Key'
              : 'Go to Admin to Select API Key'
            }
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
        
        {/* Model Selection Widget */}
        <div className="mb-4 bg-[var(--midnight)] p-4 rounded-lg shadow-md border border-[var(--emerald)]/30">
          <div className="flex items-start space-x-4">
            <div>
              <label htmlFor="modelTypeFilter" className="block text-xs font-medium mb-1 text-[var(--platinum)]">
                Model Type
              </label>
              <select
                id="modelTypeFilter"
                value={selectedModelType}
                onChange={(e) => handleModelTypeFilterChange(e.target.value)}
                className="p-2 border border-[var(--neon-mint)]/30 rounded-md text-[var(--platinum)] bg-[var(--matrix-green)] focus:ring-0 focus:border-[var(--emerald)]"
                disabled={loadingModels}
                style={{color: 'var(--platinum)', caretColor: 'var(--platinum)'}}
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="text-xs text-transparent mt-1 select-none">
                &nbsp;
              </div>
            </div>
            <div>
              <label htmlFor="modelSelect" className="block text-xs font-medium mb-1 text-[var(--platinum)]">
                Model
              </label>
              <select
                id="modelSelect"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="p-2 border border-[var(--neon-mint)]/30 rounded-md text-[var(--platinum)] bg-[var(--matrix-green)] focus:ring-0 focus:border-[var(--emerald)]"
                disabled={loadingModels}
                style={{color: 'var(--platinum)', caretColor: 'var(--platinum)'}}
              >
                {loadingModels ? (
                  <option value="default">Loading models...</option>
                ) : filteredModels.length === 0 ? (
                  <option value="default">No models available</option>
                ) : (
                  filteredModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.id}
                    </option>
                  ))
                )}
              </select>
              <div className="text-xs text-[var(--platinum)]/70 mt-1">
                {loadingModels ? 'Fetching available models...' : 
                 filteredModels.length === 0 ? 'No models found matching filter' : 
                 `${filteredModels.length} model${filteredModels.length !== 1 ? 's' : ''} available`}
              </div>
            </div>
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </main>
  );
} 