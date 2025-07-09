'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hub } from 'aws-amplify/utils';
import { signInWithRedirect, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import type { AuthUser } from 'aws-amplify/auth';

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  signInWithRedirect: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      setUser(currentUser);
      setAccessToken(session.tokens?.accessToken.toString() || null);
    } catch (error) {
      setUser(null);
      setAccessToken(null);
    }
  };

  useEffect(() => {
    checkUser();

    const hubListener = (data: any) => {
      switch (data.payload.event) {
        case 'signedIn':
        case 'tokenRefresh':
          checkUser();
          break;
        case 'signedOut':
          setUser(null);
          setAccessToken(null);
          break;
        case 'signInWithRedirect_failure':
          console.error('Sign in with redirect failed', data.payload.data);
          break;
      }
    };

    const listener = Hub.listen('auth', hubListener);
    return () => listener();
  }, []);

  const handleSignInWithRedirect = async () => {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('error signing in with redirect: ', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('error signing out: ', error);
    }
  };

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    signInWithRedirect: handleSignInWithRedirect,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 