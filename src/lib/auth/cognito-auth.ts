'use client';

// Cognito Authentication Utilities
// This module handles AWS Cognito authentication and token management

interface CognitoTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

interface CognitoUserInfo {
  sub: string;  // Cognito user ID
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
}

const COGNITO_CONFIG = {
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || '',
  domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || 'auth.mor.org',
  redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '',
  logoutUri: typeof window !== 'undefined' ? `${window.location.origin}/` : '',
  scope: 'openid email profile'
};

export class CognitoAuth {
  /**
   * Redirect user to Cognito login page
   */
  static login(): void {
    if (typeof window === 'undefined') return;
    
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('cognito_auth_state', state);
    
    const loginUrl = new URL(`https://${COGNITO_CONFIG.domain}/oauth2/authorize`);
    loginUrl.searchParams.set('response_type', 'code');
    loginUrl.searchParams.set('client_id', COGNITO_CONFIG.userPoolId);
    loginUrl.searchParams.set('redirect_uri', COGNITO_CONFIG.redirectUri);
    loginUrl.searchParams.set('scope', COGNITO_CONFIG.scope);
    loginUrl.searchParams.set('state', state);
    
    window.location.href = loginUrl.toString();
  }

  /**
   * Redirect user to Cognito signup page
   */
  static signup(): void {
    if (typeof window === 'undefined') return;
    
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('cognito_auth_state', state);
    
    // Use the Cognito signup URL which redirects to the user pool sign-up page
    const signupUrl = new URL(`https://${COGNITO_CONFIG.domain}/signup`);
    signupUrl.searchParams.set('response_type', 'code');
    signupUrl.searchParams.set('client_id', COGNITO_CONFIG.userPoolId);
    signupUrl.searchParams.set('redirect_uri', COGNITO_CONFIG.redirectUri);
    signupUrl.searchParams.set('scope', COGNITO_CONFIG.scope);
    signupUrl.searchParams.set('state', state);
    
    window.location.href = signupUrl.toString();
  }

  /**
   * Handle OAuth callback and exchange code for tokens
   */
  static async handleCallback(code: string, state: string): Promise<CognitoTokens> {
    const storedState = localStorage.getItem('cognito_auth_state');
    
    // More robust state validation
    if (!storedState) {
      throw new Error('No stored state found - authentication may have already been processed');
    }
    
    if (state !== storedState) {
      throw new Error('Invalid state parameter - possible CSRF attack or duplicate callback');
    }
    
    // Remove state immediately to prevent reuse
    localStorage.removeItem('cognito_auth_state');

    const tokenUrl = `https://${COGNITO_CONFIG.domain}/oauth2/token`;
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: COGNITO_CONFIG.userPoolId,
      code: code,
      redirect_uri: COGNITO_CONFIG.redirectUri
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token exchange failed: ${errorText}`);
    }

    const tokens = await response.json();
    
    return {
      accessToken: tokens.access_token,
      idToken: tokens.id_token,
      refreshToken: tokens.refresh_token
    };
  }

  /**
   * Parse user info from ID token
   */
  static parseIdToken(idToken: string): CognitoUserInfo {
    try {
      const payload = idToken.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      
      return {
        sub: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        given_name: decoded.given_name,
        family_name: decoded.family_name
      };
    } catch (error) {
      throw new Error('Failed to parse ID token');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshTokens(refreshToken: string): Promise<CognitoTokens> {
    const tokenUrl = `https://${COGNITO_CONFIG.domain}/oauth2/token`;
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: COGNITO_CONFIG.userPoolId,
      refresh_token: refreshToken
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString()
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const tokens = await response.json();
    
    return {
      accessToken: tokens.access_token,
      idToken: tokens.id_token,
      refreshToken: refreshToken // Refresh token might not be returned, keep the old one
    };
  }

  /**
   * Logout user and redirect to Cognito logout
   */
  static logout(): void {
    if (typeof window === 'undefined') return;
    
    // Clear local storage
    localStorage.removeItem('cognito_tokens');
    localStorage.removeItem('user_info');
    localStorage.removeItem('authToken'); // Legacy
    
    // Redirect to Cognito logout
    const logoutUrl = new URL(`https://${COGNITO_CONFIG.domain}/logout`);
    logoutUrl.searchParams.set('client_id', COGNITO_CONFIG.userPoolId);
    logoutUrl.searchParams.set('logout_uri', COGNITO_CONFIG.logoutUri);
    
    window.location.href = logoutUrl.toString();
  }

  /**
   * Store tokens in localStorage
   */
  static storeTokens(tokens: CognitoTokens): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cognito_tokens', JSON.stringify(tokens));
  }

  /**
   * Get stored tokens from localStorage
   */
  static getStoredTokens(): CognitoTokens | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem('cognito_tokens');
    if (!stored) return null;
    
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  /**
   * Check if access token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      const exp = decoded.exp * 1000; // Convert to milliseconds
      return Date.now() >= exp;
    } catch {
      return true; // Assume expired if we can't parse
    }
  }

  /**
   * Get valid access token, refreshing if necessary
   */
  static async getValidAccessToken(): Promise<string | null> {
    const tokens = this.getStoredTokens();
    if (!tokens) return null;

    if (!this.isTokenExpired(tokens.accessToken)) {
      return tokens.accessToken;
    }

    // Token is expired, try to refresh
    try {
      const newTokens = await this.refreshTokens(tokens.refreshToken);
      this.storeTokens(newTokens);
      return newTokens.accessToken;
    } catch {
      // Refresh failed, user needs to login again
      this.logout();
      return null;
    }
  }
}

export default CognitoAuth;
