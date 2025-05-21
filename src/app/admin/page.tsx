'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost, apiPut } from '@/lib/api/apiService';
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
  const { accessToken, isAuthenticated } = useAuth();
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
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

    fetchApiKeys();
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

  const fetchApiKeys = async () => {
    try {
      console.log('Fetching API keys');
      const response = await apiGet<ApiKey[]>('https://api.mor.org/api/v1/auth/keys', accessToken || '');

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setApiKeys(response.data);
        setIsLoading(false);
      }
    } catch (err) {
      setError('Failed to load API keys');
      console.error('Error fetching API keys:', err);
      setIsLoading(false);
    }
  };

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
        'https://api.mor.org/api/v1/automation/settings', 
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
        'https://api.mor.org/api/v1/auth/keys',
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
        
        // Set the selected key prefix for viewing
        setSelectedApiKeyPrefix(response.data.key_prefix);
        
        // Clear the form
        setNewKeyName('');
        
        // Show success message
        setSuccessMessage('API key created successfully');
        
        // Refresh the API keys list but wait a moment to avoid race conditions
        setTimeout(fetchApiKeys, 1000);
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
        'https://api.mor.org/api/v1/automation/settings',
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
        'https://api.mor.org/api/v1/automation/settings', 
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
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-4 px-4 sm:px-0">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <Link href="/" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
          Home
        </Link>
      </div>

      <div className="px-4 py-6 sm:px-0">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex justify-between">
            <span>{error}</span>
            <button 
              onClick={() => setError('')} 
              className="ml-2 text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex justify-between">
            <span>{successMessage}</span>
            <button 
              onClick={() => setSuccessMessage(null)} 
              className="ml-2 text-green-700 hover:text-green-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Newly created API key notification */}
        {newlyCreatedKey && (
          <div className="mb-6 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">Your new API key has been created</h3>
            <p className="text-yellow-700 mb-4">
              Copy this key now. You won't be able to see it again!
            </p>
            <div className="flex items-center mb-4">
              <input
                type="text"
                readOnly
                value={newlyCreatedKey}
                className="flex-1 p-3 border border-yellow-400 bg-yellow-100 text-yellow-900 rounded-md font-mono text-sm"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                onClick={() => copyToClipboard(newlyCreatedKey)}
                className="ml-2 px-4 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Copy
              </button>
            </div>
            <p className="text-yellow-700 mb-2">
              Use this key when prompted in the automation settings section.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* API Keys Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">API Keys</h2>
            
            <form onSubmit={createApiKey} className="mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Enter key name"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Create Key
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className={`flex items-center justify-between p-4 rounded-md ${
                    selectedApiKeyPrefix === key.key_prefix
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50'
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-900">{key.name}</p>
                    <p className="text-sm text-gray-500">{key.key_prefix}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        key.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {key.is_active ? 'Active' : 'Inactive'}
                    </span>
                    
                    {/* Check automation button */}
                    <button
                      onClick={() => checkAutomationSettings(key.key_prefix)}
                      className={`px-2 py-1 text-xs rounded hover:bg-opacity-80 ${
                        selectedApiKeyPrefix === key.key_prefix
                          ? 'bg-green-500 text-white'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {selectedApiKeyPrefix === key.key_prefix ? 'Selected' : 'Check Automation'}
                    </button>
                  </div>
                </div>
              ))}
              
              {apiKeys.length === 0 && (
                <p className="text-gray-500 text-center py-4">No API keys found. Create one to get started.</p>
              )}
            </div>
          </div>

          {/* Automation Settings Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Automation Settings
            </h2>

            {selectedApiKeyPrefix ? (
              <>
                <div className="mb-4 p-3 bg-green-50 rounded text-sm text-green-800">
                  Working with API key: {selectedApiKeyPrefix}...
                </div>

                {!automationSettings && !showKeyInput && (
                  <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                      To view or update automation settings, you need to enter your full API key.
                    </p>
                    <button
                      onClick={() => setShowKeyInput(true)}
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Enter API Key
                    </button>
                  </div>
                )}

                {showKeyInput && (
                  <form onSubmit={handleKeyInputSubmit} className="mb-6">
                    <div className="mb-4">
                      <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                        Enter your full API key that starts with {selectedApiKeyPrefix}
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          id="apiKey"
                          placeholder={`${selectedApiKeyPrefix}...`}
                          value={keyInputValue}
                          onChange={(e) => setKeyInputValue(e.target.value)}
                          onPaste={(e) => {
                            // Prevent default to handle the paste manually
                            e.preventDefault();
                            // Get pasted content and clean it
                            const pastedText = e.clipboardData.getData('text').trim();
                            setKeyInputValue(pastedText);
                          }}
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          autoComplete="off"
                          spellCheck="false"
                        />
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Submit
                        </button>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-500">
                          Your API key is never stored in the browser and is only used for the current request.
                        </p>
                        <p className="text-xs text-gray-500">
                          Make sure to paste the full key without any extra spaces.
                        </p>
                      </div>
                    </div>
                  </form>
                )}

                {automationSettings && (
                  <>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Enable Automation
                        </label>
                        <div className="flex items-center">
                          <span
                            className={`mr-2 px-2 py-1 text-xs rounded-full ${
                              localIsEnabled
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {localIsEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                          <button
                            onClick={() => setLocalIsEnabled(!localIsEnabled)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                              localIsEnabled
                                ? 'bg-green-600'
                                : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                localIsEnabled
                                  ? 'translate-x-5'
                                  : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Session Duration (seconds)
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="number"
                            value={localSessionDuration}
                            onChange={(e) => setLocalSessionDuration(parseInt(e.target.value))}
                            min="1"
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-black bg-white"
                          />
                        </div>
                      </div>

                      {hasUnsavedChanges && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-xs text-yellow-700">
                            You have unsaved changes. Click "Update Settings" to save.
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex justify-between">
                        <button
                          type="button"
                          onClick={updateAutomationSettings}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Update Settings
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowKeyInput(true);
                            setKeyInputValue('');
                          }}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Update with Different Key
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Click "Check Automation" on a key to view settings</p>
                <p className="text-sm text-gray-500">You'll need your full API key to view and update automation settings</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 