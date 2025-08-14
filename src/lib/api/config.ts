'use client';

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.dev.mor.org',
  VERSION: '/api/v1',
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      KEYS: '/auth/keys',
      PRIVATE_KEY: '/auth/private-key',
      DELEGATION: '/auth/delegation'
    },
    // Chat endpoints
    CHAT: {
      COMPLETIONS: '/chat/completions',
      HISTORY: '/chat-history/chats',
      CHAT_DETAIL: '/chat-history/chats',
      MESSAGES: '/chat-history/chats'
    },
    // Session endpoints
    SESSION: {
      INITIALIZE: '/session/initialize',
      PING: '/session/pingsession',
      CLOSE: '/session/close'
    },
    // Automation endpoints
    AUTOMATION: {
      SETTINGS: '/automation/settings'
    },
    // Model endpoints
    MODELS: '/models'
  }
};

// Helper function to build full API URLs
export function buildApiUrl(endpoint: string): string {
  const baseUrl = API_CONFIG.BASE_URL.endsWith('/') 
    ? API_CONFIG.BASE_URL.slice(0, -1) 
    : API_CONFIG.BASE_URL;
  
  const version = API_CONFIG.VERSION.startsWith('/') 
    ? API_CONFIG.VERSION 
    : `/${API_CONFIG.VERSION}`;
    
  const endpointPath = endpoint.startsWith('/') 
    ? endpoint 
    : `/${endpoint}`;
    
  return `${baseUrl}${version}${endpointPath}`;
}

// Convenience functions for common endpoint types
export const API_URLS = {
  // Auth URLs
  register: () => buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER),
  login: () => buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN),
  keys: () => buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.KEYS),
  deleteKey: (keyId: number) => buildApiUrl(`${API_CONFIG.ENDPOINTS.AUTH.KEYS}/${keyId}`),
  privateKey: () => buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.PRIVATE_KEY),
  delegation: () => buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.DELEGATION),
  
  // Chat URLs
  chatCompletions: () => buildApiUrl(API_CONFIG.ENDPOINTS.CHAT.COMPLETIONS),
  chatHistory: () => buildApiUrl(API_CONFIG.ENDPOINTS.CHAT.HISTORY),
  chatDetail: (chatId: string) => buildApiUrl(`${API_CONFIG.ENDPOINTS.CHAT.CHAT_DETAIL}/${chatId}`),
  chatMessages: (chatId: string) => buildApiUrl(`${API_CONFIG.ENDPOINTS.CHAT.MESSAGES}/${chatId}/messages`),
  
  // Session URLs
  sessionInitialize: () => buildApiUrl(API_CONFIG.ENDPOINTS.SESSION.INITIALIZE),
  sessionPing: () => buildApiUrl(API_CONFIG.ENDPOINTS.SESSION.PING),
  sessionClose: () => buildApiUrl(API_CONFIG.ENDPOINTS.SESSION.CLOSE),
  
  // Automation URLs
  automationSettings: () => buildApiUrl(API_CONFIG.ENDPOINTS.AUTOMATION.SETTINGS),
  
  // Model URLs
  models: () => buildApiUrl(API_CONFIG.ENDPOINTS.MODELS),
};

export default API_CONFIG;
