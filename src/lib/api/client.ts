// Re-export existing API utilities for cleaner imports
export { apiGet, apiPost, apiPut, apiDelete, apiRequest } from './apiService';
export { API_URLS, API_CONFIG, buildApiUrl } from './config';
export type { ApiResponse } from './apiService';
