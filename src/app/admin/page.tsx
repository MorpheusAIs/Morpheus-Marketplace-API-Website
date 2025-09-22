'use client';

import React, { useState, useEffect } from 'react';
import { useCognitoAuth } from '@/lib/auth/CognitoAuthContext';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/apiService';
import { useGTM } from '@/components/providers/GTMProvider';
import { API_URLS } from '@/lib/api/config';
import Link from 'next/link';

interface ApiKey {
  id: number;
  key_prefix: string;
  name: string;
  created_at: string;
  is_active: boolean;
  is_default: boolean;
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
  const { accessToken, isAuthenticated, apiKeys, defaultApiKey, refreshApiKeys, isLoading: authLoading } = useCognitoAuth();
  const router = useRouter();
  const { trackApiKey } = useGTM();
  const [automationSettings, setAutomationSettings] = useState<AutomationSettings | null>(null);
  const [localSessionDuration, setLocalSessionDuration] = useState<number>(0);
  const [localIsEnabled, setLocalIsEnabled] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedApiKeyPrefix, setSelectedApiKeyPrefix] = useState<string>('');
  const [fullApiKey, setFullApiKey] = useState<string>('');
  const [error, setError] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInputValue, setKeyInputValue] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<{id: number, name: string, prefix: string} | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Try to restore previously selected API key when authenticated
    if (isAuthenticated) {
      try {
        const storedPrefix = localStorage.getItem('selected_api_key_prefix');
        const storedFullKey = sessionStorage.getItem('verified_api_key');
        const storedTimestamp = sessionStorage.getItem('verified_api_key_timestamp');
        
        // Check if the stored key is still valid (within 24 hours)
        if (storedPrefix && storedFullKey && storedTimestamp) {
          const keyAge = Date.now() - parseInt(storedTimestamp);
          const twentyFourHours = 24 * 60 * 60 * 1000;
          
          if (keyAge < twentyFourHours) {
            setSelectedApiKeyPrefix(storedPrefix);
            setFullApiKey(storedFullKey);
            // Automatically fetch automation settings if we have a valid key
            fetchAutomationSettings();
            return;
          } else {
            // Clear expired keys
            sessionStorage.removeItem('verified_api_key');
            sessionStorage.removeItem('verified_api_key_prefix');
            sessionStorage.removeItem('verified_api_key_timestamp');
            localStorage.removeItem('selected_api_key_prefix');
          }
        }

        // If no valid stored key, check for auto-selected default key
        if (defaultApiKey && !selectedApiKeyPrefix && !fullApiKey) {
          // Use the new function that doesn't auto-trigger verification modal
          selectDefaultApiKey(defaultApiKey.key_prefix, defaultApiKey.name, defaultApiKey.is_default);
        } else if (!defaultApiKey && apiKeys.length === 0) {
          // First-time user with no API keys
          setSuccessMessage('Welcome! Create your first API key below to get started with Chat and Test functionality.');
        }
      } catch (error) {
        console.error('Error restoring API key:', error);
      }
    }
  }, [isAuthenticated, authLoading, router, defaultApiKey, selectedApiKeyPrefix]);

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
    setKeyInputValue(''); // Clear any existing value
    setFullApiKey(''); // Clear any existing full key
    setError(''); // Clear any errors
    
    // Immediately open the verification modal
    setShowKeyInput(true);
    setSuccessMessage(`Selected ${keyPrefix} - please verify your full API key`);
  };

  const selectDefaultApiKey = async (keyPrefix: string, keyName: string, isDefault: boolean) => {
    setSelectedApiKeyPrefix(keyPrefix);
    setAutomationSettings(null); // Clear previous settings
    setError(''); // Clear any errors
    
    // For default key, automatically open verification modal but with friendly messaging
    setShowKeyInput(true);
    setSuccessMessage(`Welcome! Your ${isDefault ? 'default' : 'first'} API key (${keyName}) has been pre-selected. Please verify it to enable Chat and Test functionality.`);
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

  const showDeleteConfirmation = (keyId: number, keyName: string, keyPrefix: string) => {
    setKeyToDelete({ id: keyId, name: keyName, prefix: keyPrefix });
    setShowDeleteModal(true);
  };

  const confirmDeleteApiKey = async () => {
    if (!keyToDelete || !accessToken) {
      setError('No access token available');
      return;
    }

    try {
      console.log('Deleting API key:', keyToDelete.id);
      const response = await apiDelete(API_URLS.deleteKey(keyToDelete.id), accessToken);

      if (response.error) {
        throw new Error(response.error);
      }

      // Refresh the API keys list from the server
      await refreshApiKeys();
      
      // If this was the selected key, clear the selection
      if (selectedApiKeyPrefix === keyToDelete.prefix) {
        setSelectedApiKeyPrefix('');
        setFullApiKey('');
        setAutomationSettings(null);
        // Clear stored keys
        sessionStorage.removeItem('verified_api_key');
        sessionStorage.removeItem('verified_api_key_prefix');
        sessionStorage.removeItem('verified_api_key_timestamp');
        localStorage.removeItem('selected_api_key_prefix');
      }

      setSuccessMessage(`API key "${keyToDelete.name}" deleted successfully`);
      trackApiKey('deleted', keyToDelete.name);
      
      // Close modal and reset state
      setShowDeleteModal(false);
      setKeyToDelete(null);
    } catch (err) {
      setError(`Failed to delete API key: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Error deleting API key:', err);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setKeyToDelete(null);
  };

  const handleSetDefaultKey = async (keyId: number, keyName: string) => {
    if (!accessToken) {
      setError('No access token available');
      return;
    }

    try {
      console.log('Setting default API key:', keyId);
      const response = await apiPut(API_URLS.setDefaultKey(keyId), {}, accessToken);

      if (response.error) {
        throw new Error(response.error);
      }

      // Refresh the API keys list to update the UI
      await refreshApiKeys();
      
      setSuccessMessage(`"${keyName}" is now your default API key`);
      
    } catch (err) {
      setError(`Failed to set default API key: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Error setting default API key:', err);
    }
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
        
        // Store the verified API key for use in chat/test pages with timestamp
        sessionStorage.setItem('verified_api_key', apiKey);
        sessionStorage.setItem('verified_api_key_prefix', selectedApiKeyPrefix);
        sessionStorage.setItem('verified_api_key_timestamp', Date.now().toString());
        
        // Also store in localStorage for longer persistence (but clear on browser close)
        localStorage.setItem('selected_api_key_prefix', selectedApiKeyPrefix);
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
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
              {defaultApiKey && (
                <div className="mb-4 p-3 bg-[var(--neon-mint)]/10 border border-[var(--neon-mint)]/30 rounded-md">
                  <p className="text-sm text-[var(--neon-mint)]">
                    ⭐ <strong>{defaultApiKey.name}</strong> is your default API key and has been auto-selected for quick access to Chat and Test features.
                  </p>
                  <p className="text-xs text-[var(--neon-mint)]/70 mt-1">
                    You can change your default key using the checkboxes below.
                  </p>
                </div>
              )}
              {authLoading ? (
                <p className="text-[var(--platinum)]/70">Loading API keys...</p>
              ) : apiKeys.length > 0 ? (
                <ul className="space-y-4">
                  {apiKeys.map((key) => (
                    <li key={key.id} className="p-4 bg-[var(--midnight)] border border-[var(--neon-mint)]/30 rounded-md">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-medium text-[var(--platinum)]">{key.name}</p>
                            {key.is_default && (
                              <span className="px-2 py-1 text-xs bg-[var(--neon-mint)]/20 text-[var(--neon-mint)] rounded-full border border-[var(--neon-mint)]/30">
                                Default ⭐
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[var(--platinum)]/70 mb-2">
                            <span className="font-mono">{key.key_prefix}...</span> • 
                            Created {new Date(key.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`default-${key.id}`}
                              checked={key.is_default}
                              onChange={() => {
                                if (!key.is_default) {
                                  handleSetDefaultKey(key.id, key.name);
                                }
                              }}
                              className="h-4 w-4 text-[var(--neon-mint)] rounded border-[var(--neon-mint)]/30 focus:ring-0 focus:ring-offset-0"
                            />
                            <label htmlFor={`default-${key.id}`} className="ml-2 text-sm text-[var(--platinum)]/70">
                              Set as default for quick access
                            </label>
                          </div>
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
                            {selectedApiKeyPrefix === key.key_prefix ? (
                              <>
                                Selected
                                {defaultApiKey?.key_prefix === key.key_prefix && (
                                  <span className="ml-1 text-xs">⭐</span>
                                )}
                              </>
                            ) : 'Select'}
                          </button>
                          <button
                            onClick={() => showDeleteConfirmation(key.id, key.name, key.key_prefix)}
                            className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                            title={`Delete ${key.name}`}
                          >
                            Delete
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
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[var(--platinum)]">
                      Selected API Key: <span className="font-mono">{selectedApiKeyPrefix}...</span>
                    </p>
                    {fullApiKey && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs text-green-400 font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                  {fullApiKey && (
                    <div className="text-xs text-green-400/70 mt-2">
                      ✓ Ready for Chat and Test functionality
                    </div>
                  )}
                </div>

                {!automationSettings ? (
                  <>
                    {showKeyInput ? (
                      <>
                        {/* API Key Verification Modal */}
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                          <div className="bg-[var(--midnight)] border border-[var(--neon-mint)]/30 rounded-lg p-6 max-w-md w-full mx-4">
                            <div className="flex items-center mb-4">
                              <div className="w-8 h-8 bg-[var(--neon-mint)]/20 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-[var(--neon-mint)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold text-[var(--neon-mint)]">Verify API Key</h3>
                            </div>
                            
                            <div className="mb-4">
                              <p className="text-[var(--platinum)]/80 text-sm mb-2">
                                You've selected: <span className="font-mono text-[var(--neon-mint)]">{selectedApiKeyPrefix}...</span>
                              </p>
                              <p className="text-[var(--platinum)]/60 text-xs">
                                For security, we need you to verify the full API key to enable Chat and Test functionality.
                              </p>
                            </div>

                            <form onSubmit={handleKeyInputSubmit} className="space-y-4">
                              <div>
                                <label htmlFor="fullApiKey" className="block text-sm font-medium text-[var(--platinum)]/70 mb-2">
                                  Enter Full API Key
                                </label>
                                <input
                                  type="password"
                                  id="fullApiKey"
                                  value={keyInputValue}
                                  onChange={(e) => setKeyInputValue(e.target.value)}
                                  className="w-full p-3 rounded-md border border-[var(--neon-mint)]/30 bg-[var(--eclipse)] text-[var(--platinum)] focus:ring-2 focus:ring-[var(--neon-mint)]/50 focus:border-[var(--emerald)]"
                                  placeholder={`${selectedApiKeyPrefix}...`}
                                  required
                                  autoFocus
                                />
                                <div className="text-xs text-[var(--platinum)]/50 mt-1">
                                  Must start with {selectedApiKeyPrefix}
                                </div>
                              </div>
                              
                              <div className="flex gap-3 pt-2">
                                <button
                                  type="submit"
                                  className="flex-1 px-4 py-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] rounded-md hover:bg-[var(--emerald)] transition-colors font-medium"
                                >
                                  Verify & Continue
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowKeyInput(false);
                                    setSelectedApiKeyPrefix('');
                                    setKeyInputValue('');
                                    setError('');
                                  }}
                                  className="px-4 py-2 bg-[var(--eclipse)] text-[var(--platinum)] rounded-md hover:bg-[var(--midnight)] transition-colors border border-[var(--platinum)]/20"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="mb-6 p-4 bg-[var(--eclipse)]/50 border border-[var(--neon-mint)]/20 rounded-md">
                        <p className="text-[var(--platinum)]/80 text-sm">
                          Click "Select" on an API key above to verify and access automation settings.
                        </p>
                      </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && keyToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--midnight)] border border-red-500/30 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-400">Delete API Key</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-[var(--platinum)]/80 mb-3">
                Are you sure you want to delete this API key?
              </p>
              <div className="bg-[var(--eclipse)] p-3 rounded-md border border-red-500/20">
                <p className="text-sm text-[var(--platinum)]">
                  <strong>Name:</strong> {keyToDelete?.name}
                </p>
                <p className="text-sm text-[var(--platinum)] font-mono">
                  <strong>Key:</strong> {keyToDelete?.prefix}...
                </p>
              </div>
              <p className="text-red-400/80 text-sm mt-3">
                ⚠️ This action cannot be undone. The API key will be permanently deleted.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmDeleteApiKey}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                Delete Permanently
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-[var(--eclipse)] text-[var(--platinum)] rounded-md hover:bg-[var(--midnight)] transition-colors border border-[var(--platinum)]/20"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 