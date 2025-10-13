'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CognitoAuth } from './cognito-auth';
import { API_URLS } from '@/lib/api/config';
import { apiGet } from '@/lib/api/apiService';

interface CognitoUser {
  sub: string;
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
}

interface ApiKey {
  id: number;
  key_prefix: string;
  name: string;
  created_at: string;
  is_active: boolean;
  is_default: boolean;
}

interface CognitoAuthContextType {
  user: CognitoUser | null;
  accessToken: string | null;
  idToken: string | null;
  apiKeys: ApiKey[];
  defaultApiKey: ApiKey | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
  handleAuthCallback: (code: string, state: string) => Promise<void>;
  refreshApiKeys: () => Promise<void>;
}

const CognitoAuthContext = createContext<CognitoAuthContextType | undefined>(undefined);

export function CognitoAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [defaultApiKey, setDefaultApiKey] = useState<ApiKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored tokens and initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setIsLoading(true);
    
    try {
      // Try to get a valid access token (will refresh if needed)
      const validAccessToken = await CognitoAuth.getValidAccessToken();
      
      if (validAccessToken) {
        const tokens = CognitoAuth.getStoredTokens();
        if (tokens) {
          setAccessToken(validAccessToken);
          setIdToken(tokens.idToken);
          
          // Parse user info from ID token
          const userInfo = CognitoAuth.parseIdToken(tokens.idToken);
          setUser(userInfo);
          
          // Fetch API keys
          await fetchApiKeys(validAccessToken);
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear any invalid tokens
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApiKeys = async (token: string) => {
    try {
      const response = await apiGet<ApiKey[]>(API_URLS.keys(), token);
      if (response.data) {
        // Filter to only show active API keys
        const activeKeys = response.data.filter(key => key.is_active);
        setApiKeys(activeKeys);
        
        // Auto-select first API key if no key is already selected
        await autoSelectFirstApiKey(token, activeKeys);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  };

  const autoSelectFirstApiKey = async (token: string, userApiKeys?: ApiKey[]) => {
    try {
      // Check if we already have a valid API key selected
      const storedApiKey = sessionStorage.getItem('verified_api_key');
      const storedTimestamp = sessionStorage.getItem('verified_api_key_timestamp');
      
      if (storedApiKey && storedTimestamp) {
        const keyAge = Date.now() - parseInt(storedTimestamp);
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        // If we have a valid stored key, don't auto-select
        if (keyAge < twentyFourHours) {
          return;
        }
      }

      // First try to get the decrypted default key for seamless experience
      const decryptedResponse = await fetch(API_URLS.defaultKeyDecrypted(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (decryptedResponse.ok) {
        const decryptedData = await decryptedResponse.json();
        
        // Check if the response contains an error (even with 200 OK status)
        if (decryptedData.error || decryptedData.error_code) {
          console.warn('⚠️ Default API key auto-decryption failed:', decryptedData.error_code || decryptedData.error);
          console.log('User will need to manually select and verify their API key in the Admin page');
          
          // Don't store anything - let the user manually select/verify
          // This prevents the redirect loop where chat/test pages keep sending them back to admin
          return;
        }
        
        if (decryptedData && decryptedData.full_key) {
          // Store the decrypted key immediately for seamless Chat/Test access
          sessionStorage.setItem('verified_api_key', decryptedData.full_key);
          sessionStorage.setItem('verified_api_key_prefix', decryptedData.key_prefix);
          sessionStorage.setItem('verified_api_key_timestamp', Date.now().toString());
          localStorage.setItem('selected_api_key_prefix', decryptedData.key_prefix);
          
          // Set the default key metadata
          setDefaultApiKey({
            id: decryptedData.id,
            key_prefix: decryptedData.key_prefix,
            name: decryptedData.name,
            created_at: decryptedData.created_at,
            is_active: true,
            is_default: decryptedData.is_default
          });
          
          console.log('🔐 Auto-selected and decrypted default API key:', decryptedData.key_prefix);
          return;
        }
      }

      // If we reach here, decryption failed or no default key exists
      // Fetch the default key metadata (without full key) just to show in UI
      const defaultKeyResponse = await apiGet<ApiKey>(API_URLS.defaultKey(), token);
      
      if (defaultKeyResponse.data) {
        const defaultKey = defaultKeyResponse.data;
        setDefaultApiKey(defaultKey);
        
        console.log(`ℹ️ Default API key found but not auto-decrypted: ${defaultKey.key_prefix}... (${defaultKey.name})`);
        console.log('User can manually verify it by clicking "Select" in the Admin page');
        
        // IMPORTANT: Do NOT store the prefix in localStorage here
        // This prevents the redirect loop where chat/test pages detect an unverified key
        // and keep redirecting back to admin
      } else {
        // No API keys found - this is a first-time user
        console.log('No API keys found - user needs to create their first API key');
      }
    } catch (error) {
      console.error('Error auto-selecting first API key:', error);
    }
  };

  const login = () => {
    CognitoAuth.login();
  };

  const signup = () => {
    CognitoAuth.signup();
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setIdToken(null);
    setApiKeys([]);
    setDefaultApiKey(null);
    
    // Clear API key storage
    sessionStorage.removeItem('verified_api_key');
    sessionStorage.removeItem('verified_api_key_prefix');
    sessionStorage.removeItem('verified_api_key_timestamp');
    localStorage.removeItem('selected_api_key_prefix');
    
    CognitoAuth.logout();
  };

  const handleAuthCallback = async (code: string, state: string) => {
    try {
      setIsLoading(true);
      
      // Exchange code for tokens
      const tokens = await CognitoAuth.handleCallback(code, state);
      CognitoAuth.storeTokens(tokens);
      
      // Set tokens in state
      setAccessToken(tokens.accessToken);
      setIdToken(tokens.idToken);
      
      // Parse user info
      const userInfo = CognitoAuth.parseIdToken(tokens.idToken);
      setUser(userInfo);
      
      // Fetch API keys
      await fetchApiKeys(tokens.accessToken);
      
    } catch (error) {
      console.error('Error handling auth callback:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshApiKeys = async () => {
    const validToken = await CognitoAuth.getValidAccessToken();
    if (validToken) {
      await fetchApiKeys(validToken);
    }
  };

  const value = {
    user,
    accessToken,
    idToken,
    apiKeys,
    defaultApiKey,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    login,
    signup,
    logout,
    handleAuthCallback,
    refreshApiKeys,
  };

  return (
    <CognitoAuthContext.Provider value={value}>
      {children}
    </CognitoAuthContext.Provider>
  );
}

export function useCognitoAuth() {
  const context = useContext(CognitoAuthContext);
  if (context === undefined) {
    throw new Error('useCognitoAuth must be used within a CognitoAuthProvider');
  }
  return context;
}
