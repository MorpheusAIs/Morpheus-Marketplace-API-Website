'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CognitoDirectAuth } from './cognito-direct-auth';
import { apiGet, API_URLS } from '@/lib/api/client';

interface CognitoUser {
  sub: string;
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
}

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  is_active: boolean;
  created_at: string;
  last_used?: string;
}

interface CognitoDirectAuthContextType {
  user: CognitoUser | null;
  accessToken: string | null;
  idToken: string | null;
  apiKeys: ApiKey[];
  isAuthenticated: boolean;
  isLoading: boolean;
  
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  
  handleAuthSuccess: (tokens: any, userInfo: any) => void;
  signOut: () => void;
  refreshApiKeys: () => Promise<void>;
}

const CognitoDirectAuthContext = createContext<CognitoDirectAuthContextType | undefined>(undefined);

export function CognitoDirectAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setIsLoading(true);
    
    try {
      // Try to get a valid access token (will refresh if needed)
      const validAccessToken = await CognitoDirectAuth.getValidAccessToken();
      
      if (validAccessToken) {
        const tokens = CognitoDirectAuth.getStoredTokens();
        if (tokens) {
          setAccessToken(validAccessToken);
          setIdToken(tokens.idToken);
          
          // Parse user info from ID token
          const userInfo = CognitoDirectAuth.parseIdToken(tokens.idToken);
          setUser(userInfo);
          
          // Fetch API keys
          await fetchApiKeys(validAccessToken);
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear any invalid tokens
      signOut();
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
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  };

  const handleAuthSuccess = async (tokens: any, userInfo: any) => {
    // Store tokens
    CognitoDirectAuth.storeTokens(tokens);
    
    // Update state
    setAccessToken(tokens.accessToken);
    setIdToken(tokens.idToken);
    setUser(userInfo);
    
    // Fetch API keys
    await fetchApiKeys(tokens.accessToken);
    
    // Close modal
    setShowAuthModal(false);
  };

  const signOut = () => {
    setUser(null);
    setAccessToken(null);
    setIdToken(null);
    setApiKeys([]);
    
    // Clear API key storage
    sessionStorage.removeItem('verified_api_key');
    sessionStorage.removeItem('verified_api_key_prefix');
    sessionStorage.removeItem('verified_api_key_timestamp');
    localStorage.removeItem('selected_api_key_prefix');
    
    // Clear Cognito tokens (NO REDIRECT!)
    CognitoDirectAuth.signOut();
  };

  const refreshApiKeys = async () => {
    const validToken = await CognitoDirectAuth.getValidAccessToken();
    if (validToken) {
      await fetchApiKeys(validToken);
    }
  };

  const value = {
    user,
    accessToken,
    idToken,
    apiKeys,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    showAuthModal,
    setShowAuthModal,
    handleAuthSuccess,
    signOut,
    refreshApiKeys,
  };

  return (
    <CognitoDirectAuthContext.Provider value={value}>
      {children}
    </CognitoDirectAuthContext.Provider>
  );
}

export function useCognitoDirectAuth() {
  const context = useContext(CognitoDirectAuthContext);
  if (context === undefined) {
    throw new Error('useCognitoDirectAuth must be used within a CognitoDirectAuthProvider');
  }
  return context;
}
