'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const { user, isAuthenticated, signOut, accessToken } = useAuth();
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
      const response = await apiGet<ApiKey[]>('https://api.dev.mor.org/api/v1/auth/keys', accessToken || '');
      if (response.error) throw new Error(response.error);
      if (response.data) {
        setApiKeys(response.data);
        setIsLoading(false);
      }
    } catch (err) {
      setError('Failed to load API keys');
      setIsLoading(false);
    }
  };

  const checkAutomationSettings = async (keyPrefix: string) => {
    setSelectedApiKeyPrefix(keyPrefix);
    setAutomationSettings(null);
    setShowKeyInput(false);
    setKeyInputValue('');
    setFullApiKey('');
    setSuccessMessage(`Selected ${keyPrefix} for automation settings view`);
  };

  const createApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    try {
      const response = await apiPost<ApiKeyResponse>('https://api.dev.mor.org/api/v1/auth/keys', { name: newKeyName }, accessToken || '');
      if (response.error) throw new Error(response.error);
      if (response.data?.key) {
        setNewlyCreatedKey(response.data.key);
        setSelectedApiKeyPrefix(response.data.key_prefix);
        setNewKeyName('');
        setTimeout(fetchApiKeys, 1000);
      } else {
        throw new Error('Invalid response from API key creation');
      }
    } catch (err) {
      setError('Failed to create API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => setSuccessMessage('API key copied!'), () => setError('Failed to copy.'));
  };

  const updateAutomationSettings = async () => {
    if (!fullApiKey) {
      setError('Please enter your full API key to update settings.');
      return;
    }
    try {
      const response = await apiPut<AutomationSettings>('https://api.dev.mor.org/api/v1/automation/settings', { is_enabled: localIsEnabled, session_duration: localSessionDuration }, fullApiKey);
      if (response.error) throw new Error(response.error);
      if (response.data) {
        setAutomationSettings(response.data);
        setHasUnsavedChanges(false);
        setSuccessMessage('Automation settings updated successfully');
      }
    } catch (err) {
      setError('Failed to update automation settings');
    }
  };

  const handleKeyInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInputValue) return setError('Please enter your API key');
    if (selectedApiKeyPrefix && !keyInputValue.trim().startsWith(selectedApiKeyPrefix)) {
      return setError(`The key must start with ${selectedApiKeyPrefix}`);
    }
    const apiKey = keyInputValue.trim();
    setFullApiKey(apiKey);
    try {
      const response = await apiGet<AutomationSettings>('https://api.dev.mor.org/api/v1/automation/settings', apiKey);
      if (response.error) throw new Error(response.error);
      if (response.data) {
        setAutomationSettings(response.data);
        setLocalSessionDuration(response.data.session_duration);
        setLocalIsEnabled(response.data.is_enabled);
        setShowKeyInput(false);
        setKeyInputValue('');
      } else {
        setError('No automation settings data received');
      }
    } catch (err) {
      setError(err instanceof Error ? `Failed to load settings: ${err.message}` : 'An unknown error occurred.');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[var(--matrix-green)] text-[var(--neon-mint)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button onClick={signOut} className="px-4 py-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] rounded-md hover:bg-[var(--emerald)] transition-colors">Sign Out</button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-100 rounded-md">{error}</div>}
        {successMessage && <div className="mb-4 p-3 bg-[var(--emerald)]/20 border border-[var(--emerald)] text-[var(--emerald)] rounded-md">{successMessage}</div>}

        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-lg border border-[var(--emerald)]/30 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--neon-mint)]">User Information</h2>
          {user && (
            <div>
              <p><span className="font-bold">Username:</span> {user.username}</p>
              <p><span className="font-bold">User ID:</span> {user.userId}</p>
              {user.signInDetails?.loginId && <p><span className="font-bold">Email:</span> {user.signInDetails.loginId}</p>}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-[var(--emerald)]/30 rounded-lg p-6 bg-[var(--midnight)]">
            <h2 className="text-xl font-bold text-[var(--neon-mint)] mb-4">API Keys</h2>
            <div className="mb-8 pb-6 border-b border-[var(--emerald)]/30">
              <h3 className="text-lg font-medium text-[var(--platinum)] mb-3">Create New API Key</h3>
              <form onSubmit={createApiKey} className="flex flex-col space-y-4">
                <input type="text" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} className="w-full p-2 rounded-md border border-[var(--neon-mint)]/30 bg-[var(--midnight)] text-[var(--platinum)] focus:ring-0 focus:border-[var(--emerald)]" placeholder="Enter a name for your API key" required />
                <button type="submit" className="px-4 py-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] font-medium rounded-md hover:bg-[var(--emerald)] transition-colors">Create API Key</button>
              </form>
              {newlyCreatedKey && (
                <div className="mt-4 p-4 bg-[var(--midnight)] border border-[var(--neon-mint)]/30 rounded-md">
                  <p className="text-sm text-[var(--platinum)]/70 mb-2">Your new API key (save it securely, it won't be shown again):</p>
                  <div className="flex items-center"><code className="p-2 bg-[var(--midnight)] text-[var(--neon-mint)] font-mono text-sm flex-1 rounded overflow-x-auto">{newlyCreatedKey}</code><button onClick={() => copyToClipboard(newlyCreatedKey)} className="ml-2 p-2 bg-[var(--eclipse)] text-[var(--platinum)] rounded-md hover:bg-[var(--emerald)]/20 transition-colors">📋</button></div>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-[var(--platinum)] mb-3">Your API Keys</h3>
              {isLoading ? <p>Loading...</p> : apiKeys.length > 0 ? (
                <ul className="space-y-4">
                  {apiKeys.map((key) => (
                    <li key={key.id} className="p-4 bg-[var(--midnight)] border border-[var(--neon-mint)]/30 rounded-md flex justify-between items-center">
                      <div><p className="font-medium text-[var(--platinum)]">{key.name}</p><p className="text-sm text-[var(--platinum)]/70"><span className="font-mono">{key.key_prefix}...</span> • Created {new Date(key.created_at).toLocaleDateString()}</p></div>
                      <button onClick={() => checkAutomationSettings(key.key_prefix)} className={`px-3 py-1 text-sm rounded-md ${selectedApiKeyPrefix === key.key_prefix ? 'bg-[var(--emerald)] text-[var(--matrix-green)]' : 'bg-[var(--eclipse)] text-[var(--platinum)] hover:bg-[var(--emerald)]/30'} transition-colors`}>{selectedApiKeyPrefix === key.key_prefix ? 'Selected' : 'Select'}</button>
                    </li>
                  ))}
                </ul>
              ) : <p>No API keys found.</p>}
            </div>
          </div>
          <div className="border border-[var(--emerald)]/30 rounded-lg p-6 bg-[var(--midnight)]">
            <h2 className="text-xl font-bold text-[var(--neon-mint)] mb-4">Automation Settings</h2>
            {selectedApiKeyPrefix ? (<>
              <div className="mb-4 p-3 bg-[var(--midnight)] border border-[var(--neon-mint)]/30 rounded-md"><p>Selected API Key: <span className="font-mono">{selectedApiKeyPrefix}...</span></p></div>
              {!automationSettings ? (<>
                {!showKeyInput ? (
                  <button onClick={() => setShowKeyInput(true)} className="px-4 py-2 bg-[var(--eclipse)] text-[var(--platinum)] font-medium rounded-md hover:bg-[var(--emerald)]/20 transition-colors">Enter API Key to View/Edit Settings</button>
                ) : (
                  <form onSubmit={handleKeyInputSubmit} className="space-y-4">
                    <input type="password" value={keyInputValue} onChange={(e) => setKeyInputValue(e.target.value)} className="w-full p-2 rounded-md border border-[var(--neon-mint)]/30 bg-[var(--midnight)] text-[var(--platinum)] focus:ring-0 focus:border-[var(--emerald)]" placeholder="Enter your full API key" required />
                    <div className="flex space-x-2"><button type="submit" className="px-4 py-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] font-medium rounded-md hover:bg-[var(--emerald)]">Submit</button><button type="button" onClick={() => setShowKeyInput(false)} className="px-4 py-2 bg-[var(--eclipse)] text-[var(--platinum)]">Cancel</button></div>
                  </form>
                )}
              </>) : (
                <div className="space-y-6">
                  <div><label htmlFor="sessionDuration" className="block text-sm font-medium text-[var(--platinum)]/70 mb-1">Session Duration (seconds)</label><input type="number" id="sessionDuration" value={localSessionDuration} onChange={(e) => setLocalSessionDuration(Number(e.target.value))} min="1" className="w-full p-2 rounded-md border border-[var(--neon-mint)]/30 bg-[var(--midnight)] text-[var(--platinum)]" /></div>
                  <div className="flex items-center"><input type="checkbox" id="isEnabled" checked={localIsEnabled} onChange={(e) => setLocalIsEnabled(e.target.checked)} className="h-4 w-4 text-[var(--neon-mint)] rounded border-[var(--neon-mint)]/30 focus:ring-0" /><label htmlFor="isEnabled" className="ml-2 block text-sm text-[var(--platinum)]">Enable Automation</label></div>
                  <button onClick={updateAutomationSettings} disabled={!hasUnsavedChanges} className={`px-4 py-2 font-medium rounded-md ${hasUnsavedChanges ? 'bg-[var(--neon-mint)] text-[var(--matrix-green)] hover:bg-[var(--emerald)]' : 'bg-[var(--eclipse)] text-[var(--platinum)]/50 cursor-not-allowed'}`}>Save Changes</button>
                </div>
              )}
            </>) : (<p>Select an API key to manage its automation settings.</p>)}
          </div>
        </div>
      </div>
    </div>
  );
} 