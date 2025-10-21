'use client';

// Direct Cognito Authentication - No Redirects!
// This module provides in-app authentication using Cognito APIs directly

// Note: We'll use Web Crypto API for browser compatibility

interface CognitoTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

interface CognitoUserInfo {
  sub: string;
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
}

interface AuthenticationResult {
  success: boolean;
  tokens?: CognitoTokens;
  userInfo?: CognitoUserInfo;
  error?: string;
  challengeName?: string;
  challengeParameters?: any;
  session?: string;
}

interface SignUpResult {
  success: boolean;
  userSub?: string;
  error?: string;
  codeDeliveryDetails?: any;
}

interface ConfirmSignUpResult {
  success: boolean;
  error?: string;
}

const COGNITO_CONFIG = {
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'us-east-2_tqCTHoSST',
  clientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || '',
  region: process.env.NEXT_PUBLIC_COGNITO_REGION || 'us-east-2',
};

export class CognitoDirectAuth {
  
  /**
   * Sign in user with email and password - NO REDIRECTS!
   */
  static async signIn(email: string, password: string): Promise<AuthenticationResult> {
    try {
      console.log('🔐 Cognito Config:', {
        userPoolId: COGNITO_CONFIG.userPoolId,
        clientId: COGNITO_CONFIG.clientId ? '[SET]' : '[MISSING]',
        region: COGNITO_CONFIG.region
      });

      if (!COGNITO_CONFIG.clientId) {
        return {
          success: false,
          error: 'Cognito Client ID not configured. Please set NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID environment variable.'
        };
      }

      const url = `https://cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/`;
      
      const payload = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: COGNITO_CONFIG.clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      };

      console.log('🚀 Sending auth request to:', url);
      console.log('📦 Payload:', { ...payload, AuthParameters: { ...payload.AuthParameters, PASSWORD: '[HIDDEN]' } });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
          'Content-Type': 'application/x-amz-json-1.1',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('📥 Response status:', response.status);
      console.log('📥 Response data:', data);

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.__type || 'Authentication failed'
        };
      }

      // Handle successful authentication
      if (data.AuthenticationResult) {
        const tokens: CognitoTokens = {
          accessToken: data.AuthenticationResult.AccessToken,
          idToken: data.AuthenticationResult.IdToken,
          refreshToken: data.AuthenticationResult.RefreshToken
        };

        const userInfo = this.parseIdToken(tokens.idToken);
        this.storeTokens(tokens);

        return {
          success: true,
          tokens,
          userInfo
        };
      }

      // Handle challenges (MFA, password reset, etc.)
      if (data.ChallengeName) {
        return {
          success: false,
          challengeName: data.ChallengeName,
          challengeParameters: data.ChallengeParameters,
          session: data.Session,
          error: `Challenge required: ${data.ChallengeName}`
        };
      }

      return {
        success: false,
        error: 'Unexpected authentication response'
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  /**
   * Sign up new user - NO REDIRECTS!
   */
  static async signUp(email: string, password: string, attributes?: Record<string, string>): Promise<SignUpResult> {
    try {
      const url = `https://cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/`;
      
      const userAttributes = [
        { Name: 'email', Value: email },
        ...(attributes ? Object.entries(attributes).map(([key, value]) => ({ Name: key, Value: value })) : [])
      ];

      const payload = {
        ClientId: COGNITO_CONFIG.clientId,
        Username: email,
        Password: password,
        UserAttributes: userAttributes
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp',
          'Content-Type': 'application/x-amz-json-1.1',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.__type || 'Sign up failed'
        };
      }

      return {
        success: true,
        userSub: data.UserSub,
        codeDeliveryDetails: data.CodeDeliveryDetails
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  /**
   * Confirm sign up with verification code - NO REDIRECTS!
   */
  static async confirmSignUp(email: string, confirmationCode: string): Promise<ConfirmSignUpResult> {
    try {
      const url = `https://cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/`;
      
      const payload = {
        ClientId: COGNITO_CONFIG.clientId,
        Username: email,
        ConfirmationCode: confirmationCode
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmSignUp',
          'Content-Type': 'application/x-amz-json-1.1',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.__type || 'Confirmation failed'
        };
      }

      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  /**
   * Forgot password - NO REDIRECTS!
   */
  static async forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const url = `https://cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/`;
      
      const payload = {
        ClientId: COGNITO_CONFIG.clientId,
        Username: email
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.ForgotPassword',
          'Content-Type': 'application/x-amz-json-1.1',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.__type || 'Failed to send reset code'
        };
      }

      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  /**
   * Confirm forgot password with code and new password - NO REDIRECTS!
   */
  static async confirmForgotPassword(email: string, confirmationCode: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const url = `https://cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/`;
      
      const payload = {
        ClientId: COGNITO_CONFIG.clientId,
        Username: email,
        ConfirmationCode: confirmationCode,
        Password: newPassword
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmForgotPassword',
          'Content-Type': 'application/x-amz-json-1.1',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.__type || 'Failed to reset password'
        };
      }

      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }



  /**
   * Parse user info from ID token (same as before)
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
   * Refresh tokens (same as before)
   */
  static async refreshTokens(refreshToken: string): Promise<CognitoTokens> {
    const url = `https://cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/`;
    
    const payload = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: COGNITO_CONFIG.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
        'Content-Type': 'application/x-amz-json-1.1',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    
    return {
      accessToken: data.AuthenticationResult.AccessToken,
      idToken: data.AuthenticationResult.IdToken,
      refreshToken: refreshToken // Keep existing refresh token
    };
  }

  /**
   * Store tokens (same as before)
   */
  static storeTokens(tokens: CognitoTokens): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cognito_tokens', JSON.stringify(tokens));
  }

  /**
   * Get stored tokens (same as before)
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
   * Clear tokens and sign out (NO REDIRECT to Cognito logout)
   */
  static signOut(): void {
    if (typeof window === 'undefined') return;
    
    // Clear all stored tokens
    localStorage.removeItem('cognito_tokens');
    localStorage.removeItem('user_info');
    localStorage.removeItem('authToken');
    
    // Clear API key storage
    sessionStorage.removeItem('verified_api_key');
    sessionStorage.removeItem('verified_api_key_prefix');
    sessionStorage.removeItem('verified_api_key_timestamp');
    localStorage.removeItem('selected_api_key_prefix');
    
    // No redirect - just stay in the app!
  }

  /**
   * Check if token is expired (same as before)
   */
  static isTokenExpired(token: string): boolean {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      const exp = decoded.exp * 1000;
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }

  /**
   * Get valid access token (same as before)
   */
  static async getValidAccessToken(): Promise<string | null> {
    const tokens = this.getStoredTokens();
    if (!tokens) return null;

    if (!this.isTokenExpired(tokens.accessToken)) {
      return tokens.accessToken;
    }

    try {
      const newTokens = await this.refreshTokens(tokens.refreshToken);
      this.storeTokens(newTokens);
      return newTokens.accessToken;
    } catch {
      this.signOut();
      return null;
    }
  }
}

export default CognitoDirectAuth;
