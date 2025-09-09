'use client';

import React, { useState, useEffect } from 'react';
import { useCognitoAuth } from '@/lib/auth/CognitoAuthContext';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost, apiPut } from '@/lib/api/apiService';
import { useGTM } from '@/components/providers/GTMProvider';
import { API_URLS } from '@/lib/api/config';
import Link from 'next/link';

interface ApiKey {
  id: number;
  key_prefix: string;
  name: string;
  created_at: string;
  is_active: boolean;
}

interface ApiKeyResponse {
  key: string;
  key_prefix: string;
  name: string;
}

interface AutomationSettings {
  is_enabled: boolean;
  session_duration: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export default function AdminPage() {
  const { accessToken, isAuthenticated, apiKeys, refreshApiKeys } = useCognitoAuth();
  const router = useRouter();
  const { trackApiKey } = useGTM();
  const [automationSettings, setAutomationSettings] = useState<AutomationSettings | null>(null);
  const [localSessionDuration, setLocalSessionDuration] = useState<number>(0);
  const [localIsEnabled, setLocalIsEnabled] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedApiKeyPrefix, setSelectedApiKeyPrefix] = useState<string>('');
  const [fullApiKey, setFullApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInputValue, setKeyInputValue] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (automationSettings) {
      const isChanged = 
        localSessionDuration !== automationSettings.session_duration || 
        localIsEnabled !== automationSettings.is_enabled;
      setHasUnsavedChanges(isChanged);
    }
  }, [localSessionDuration, localIsEnabled, automationSettings]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);



  const checkAutomationSettings = async (keyPrefix: string) => {
    setSelectedApiKeyPrefix(keyPrefix);
    setAutomationSettings(null); // Clear previous settings
    setShowKeyInput(false); // Reset the form state
    setKeyInputValue(''); // Clear any existing value
    setFullApiKey(''); // Clear any existing full key
    setSuccessMessage(`Selected ${keyPrefix} for automation settings view`);
  };

  const fetchAutomationSettings = async () => {
    if (!fullApiKey) return;
    
    try {
      console.log('Fetching automation settings with API key');
      const response = await apiGet<AutomationSettings>(
        API_URLS.automationSettings(), 
        fullApiKey
      );

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        console.log('Successfully loaded automation settings:', response.data);
        setAutomationSettings(response.data);
        setLocalSessionDuration(response.data.session_duration);
        setLocalIsEnabled(response.data.is_enabled);
        setShowKeyInput(false);
        setKeyInputValue('');
      } else {
        console.log('No automation settings data received');
        setError('No automation settings data received');
      }
    } catch (err) {
      setError('Failed to load automation settings');
      console.error('Error fetching automation settings:', err);
    }
  };

  const createApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      console.log('Creating API key with name:', newKeyName);
      const response = await apiPost<ApiKeyResponse>(
        API_URLS.keys(),
        { name: newKeyName },
        accessToken || ''
      );

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data && response.data.key) {
        // Get the full key and display it in the UI
        const fullKey = response.data.key;
        console.log('API key created successfully:', response.data.key_prefix);
        setNewlyCreatedKey(fullKey);
        
        // Track API key creation event
        trackApiKey('created', response.data.name);
        
        // Set the selected key prefix for viewing
        setSelectedApiKeyPrefix(response.data.key_prefix);
        
        // Clear the form
        setNewKeyName('');
        
        // Automatically set up automation settings with default values
        try {
          console.log('Setting up automation settings for new API key with default values');
          const automationResponse = await apiPut<AutomationSettings>(
            API_URLS.automationSettings(),
            {
              is_enabled: true,
              session_duration: 86400, // 24 hours in seconds
            },
            fullKey
          );

          if (automationResponse.error) {
            throw new Error(automationResponse.error);
          }

          if (automationResponse.data) {
            console.log('Automation settings set successfully:', automationResponse.data);
            setAutomationSettings(automationResponse.data);
            setLocalSessionDuration(automationResponse.data.session_duration);
            setLocalIsEnabled(automationResponse.data.is_enabled);
            setHasUnsavedChanges(false);
            setSuccessMessage('API key created successfully with automation enabled (24 hour sessions)');
          }
        } catch (automationErr) {
          console.warn('Error setting automation settings:', automationErr);
          setSuccessMessage('API key created successfully, but automation settings could not be set automatically. You can set them manually.');
        }
        
        // Refresh the API keys list but wait a moment to avoid race conditions
        setTimeout(() => refreshApiKeys(), 1000);
      } else {
        throw new Error('Invalid response format from API key creation');
      }
    } catch (err) {
      setError('Failed to create API key');
      console.error('Error creating API key:', err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSuccessMessage('API key copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        setError('Failed to copy to clipboard');
      });
  };

  const updateAutomationSettings = async () => {
    if (!fullApiKey) {
      setError('No API key provided. Please enter your full API key to update settings.');
      return;
    }

    if (localSessionDuration <= 0) {
      setError('Session duration must be greater than 0.');
      return;
    }
    
    try {
      console.log('Updating automation settings with API key:', { isEnabled: localIsEnabled, duration: localSessionDuration });
      const response = await apiPut<AutomationSettings>(
        API_URLS.automationSettings(),
        {
          is_enabled: localIsEnabled,
          session_duration: localSessionDuration,
        },
        fullApiKey
      );

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setAutomationSettings(response.data);
        setHasUnsavedChanges(false);
        setSuccessMessage('Automation settings updated successfully');
      }
    } catch (err) {
      setError('Failed to update automation settings');
      console.error('Error updating automation settings:', err);
    }
  };

  const handleKeyInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyInputValue) {
      setError('Please enter your API key');
      return;
    }
    
    if (selectedApiKeyPrefix) {
      // Normalize the input by trimming whitespace
      const normalizedInput = keyInputValue.trim();
      
      // Check if it starts with the required prefix
      if (!normalizedInput.startsWith(selectedApiKeyPrefix)) {
        setError(`The key must start with ${selectedApiKeyPrefix}`);
        return;
      }
    }
    
    // Set the API key and immediately use it directly
    const apiKey = keyInputValue.trim();
    setFullApiKey(apiKey);
    
    // Immediately fetch with the key value instead of using state
    try {
      console.log('Fetching automation settings with API key');
      const response = await apiGet<AutomationSettings>(
        API_URLS.automationSettings(), 
        apiKey
      );

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        console.log('Successfully loaded automation settings:', response.data);
        setAutomationSettings(response.data);
        setLocalSessionDuration(response.data.session_duration);
        setLocalIsEnabled(response.data.is_enabled);
        setShowKeyInput(false);
        setKeyInputValue('');
      } else {
        console.log('No automation settings data received');
        setError('No automation settings data received');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load automation settings: ${errorMessage}. Please verify your API key is correct.`);
      console.error('Error fetching automation settings:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{
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

      {/* Main content with padding for the navbar */}
      <div className="max-w-7xl mx-auto mt-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--neon-mint)] mb-4">API Gateway Administration</h1>
          <p className="text-[var(--platinum)]/80">
            Manage your API keys and automation settings
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-100 rounded-md">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mt-4 p-3 bg-[var(--emerald)]/20 border border-[var(--emerald)] text-[var(--emerald)] rounded-md">
              {successMessage}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* API Keys Section */}
          <div className="border border-[var(--emerald)]/30 rounded-lg p-6 bg-[var(--midnight)]">
            <h2 className="text-xl font-bold text-[var(--neon-mint)] mb-4">API Keys</h2>
            
            {/* Create New API Key */}
            <div className="mb-8 pb-6 border-b border-[var(--emerald)]/30">
              <h3 className="text-lg font-medium text-[var(--platinum)] mb-3">Create New API Key</h3>
              <form onSubmit={createApiKey} className="flex flex-col space-y-4">
                <div>
                  <label htmlFor="keyName" className="block text-sm font-medium text-[var(--platinum)]/70 mb-1">
                    Key Name
                  </label>
                  <input
                    type="text"
                    id="keyName"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full p-2 rounded-md border border-[var(--neon-mint)]/30 bg-[var(--midnight)] text-[var(--platinum)] !text-[var(--platinum)] focus:ring-0 focus:border-[var(--emerald)]"
                    placeholder="Enter a name for your API key"
                    required
                    style={{color: 'var(--platinum)'}}
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] font-medium rounded-md hover:bg-[var(--emerald)] transition-colors"
                >
                  Create API Key
                </button>
              </form>
              
              {newlyCreatedKey && (
                <div className="mt-4 p-4 bg-[var(--midnight)] border border-[var(--neon-mint)]/30 rounded-md">
                  <p className="text-sm text-[var(--platinum)]/70 mb-2">
                    Your new API key (save it securely, it won't be shown again):
                  </p>
                  <div className="flex items-center">
                    <code className="p-2 bg-[var(--midnight)] text-[var(--neon-mint)] font-mono text-sm flex-1 rounded overflow-x-auto">
                      {newlyCreatedKey}
                    </code>
                    <button
                      onClick={() => copyToClipboard(newlyCreatedKey)}
                      className="ml-2 p-2 bg-[var(--eclipse)] text-[var(--platinum)] rounded-md hover:bg-[var(--emerald)]/20 transition-colors"
                      aria-label="Copy API key to clipboard"
                    >
                      📋
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Existing API Keys */}
            <div>
              <h3 className="text-lg font-medium text-[var(--platinum)] mb-3">Your API Keys</h3>
              {isLoading ? (
                <p className="text-[var(--platinum)]/70">Loading API keys...</p>
              ) : apiKeys.length > 0 ? (
                <ul className="space-y-4">
                  {apiKeys.map((key) => (
                    <li key={key.id} className="p-4 bg-[var(--midnight)] border border-[var(--neon-mint)]/30 rounded-md">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-[var(--platinum)]">{key.name}</p>
                          <p className="text-sm text-[var(--platinum)]/70">
                            <span className="font-mono">{key.key_prefix}...</span> • 
                            Created {new Date(key.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0 flex flex-wrap gap-2">
                          <button
                            onClick={() => checkAutomationSettings(key.key_prefix)}
                            className={`px-3 py-1 text-sm rounded-md ${
                              selectedApiKeyPrefix === key.key_prefix
                                ? 'bg-[var(--emerald)] text-[var(--matrix-green)]'
                                : 'bg-[var(--eclipse)] text-[var(--platinum)] hover:bg-[var(--emerald)]/30'
                            } transition-colors`}
                          >
                            {selectedApiKeyPrefix === key.key_prefix ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[var(--platinum)]/70">No API keys found. Create one above.</p>
              )}
            </div>
          </div>

          {/* Automation Settings Section */}
          <div className="border border-[var(--emerald)]/30 rounded-lg p-6 bg-[var(--midnight)]">
            <h2 className="text-xl font-bold text-[var(--neon-mint)] mb-4">Automation Settings</h2>
            
            {selectedApiKeyPrefix ? (
              <>
                <div className="mb-4 p-3 bg-[var(--midnight)] border border-[var(--neon-mint)]/30 rounded-md">
                  <p className="text-sm text-[var(--platinum)]">
                    Selected API Key: <span className="font-mono">{selectedApiKeyPrefix}...</span>
                  </p>
                </div>

                {!automationSettings ? (
                  <>
                    {!showKeyInput ? (
                      <div className="mb-6">
                        <p className="text-[var(--platinum)]/80 mb-4">
                          To view or update your automation settings, you need to enter your full API key.
                        </p>
                        <button
                          onClick={() => setShowKeyInput(true)}
                          className="px-4 py-2 bg-[var(--eclipse)] text-[var(--platinum)] font-medium rounded-md hover:bg-[var(--emerald)]/20 transition-colors"
                        >
                          Enter API Key
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleKeyInputSubmit} className="mb-6 space-y-4">
                        <div>
                          <label htmlFor="fullApiKey" className="block text-sm font-medium text-[var(--platinum)]/70 mb-1">
                            Enter your full API Key
                          </label>
                          <input
                            type="password"
                            id="fullApiKey"
                            value={keyInputValue}
                            onChange={(e) => setKeyInputValue(e.target.value)}
                            className="w-full p-2 rounded-md border border-[var(--neon-mint)]/30 bg-[var(--midnight)] text-[var(--platinum)] !text-[var(--platinum)] focus:ring-0 focus:border-[var(--emerald)]"
                            placeholder="Enter your full API key"
                            required
                            style={{color: 'var(--platinum)'}}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] font-medium rounded-md hover:bg-[var(--emerald)] transition-colors"
                          >
                            Submit
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowKeyInput(false)}
                            className="px-4 py-2 bg-[var(--eclipse)] text-[var(--platinum)] font-medium rounded-md hover:bg-[var(--emerald)]/20 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="sessionDuration" className="block text-sm font-medium text-[var(--platinum)]/70 mb-1">
                        Session Duration (seconds)
                      </label>
                      <input
                        type="number"
                        id="sessionDuration"
                        value={localSessionDuration}
                        onChange={(e) => setLocalSessionDuration(Number(e.target.value))}
                        min="1"
                        className="w-full p-2 rounded-md border border-[var(--neon-mint)]/30 bg-[var(--midnight)] text-[var(--platinum)] !text-[var(--platinum)] focus:ring-0 focus:border-[var(--emerald)]"
                        style={{color: 'var(--platinum)'}}
                      />
                      <p className="mt-1 text-sm text-[var(--platinum)]/60">
                        How long authentication sessions should last. Minimum 1 second.
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isEnabled"
                        checked={localIsEnabled}
                        onChange={(e) => setLocalIsEnabled(e.target.checked)}
                        className="h-4 w-4 text-[var(--neon-mint)] rounded border-[var(--neon-mint)]/30 focus:ring-0 focus:ring-offset-0"
                      />
                      <label htmlFor="isEnabled" className="ml-2 block text-sm text-[var(--platinum)]">
                        Enable Automation
                      </label>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        onClick={updateAutomationSettings}
                        disabled={!hasUnsavedChanges}
                        className={`px-4 py-2 font-medium rounded-md ${
                          hasUnsavedChanges
                            ? 'bg-[var(--neon-mint)] text-[var(--matrix-green)] hover:bg-[var(--emerald)]'
                            : 'bg-[var(--eclipse)] text-[var(--platinum)]/50 cursor-not-allowed'
                        } transition-colors`}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-[var(--platinum)]/70">
                Select an API key from the list to view or update automation settings.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 