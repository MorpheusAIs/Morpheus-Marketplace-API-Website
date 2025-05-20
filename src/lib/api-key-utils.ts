import crypto from 'crypto';

/**
 * Hashes an API key using SHA-256 for secure storage
 */
export function hashApiKey(apiKey: string): string {
  return crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex');
}

/**
 * Gets a user ID from an API key, returns null if not found
 */
export async function getUserIdFromApiKey(
  apiKey: string, 
  getUserByApiKeyHash: (hash: string) => Promise<{ id: string } | null>
): Promise<string | null> {
  if (!apiKey) return null;
  
  try {
    const apiKeyHash = hashApiKey(apiKey);
    const user = await getUserByApiKeyHash(apiKeyHash);
    return user?.id || null;
  } catch (error) {
    console.error('Error looking up API key:', error);
    return null;
  }
}

/**
 * Validates an API key format - basic check only
 */
export function isValidApiKeyFormat(apiKey: string): boolean {
  return /^[a-zA-Z0-9_\-]{20,}$/.test(apiKey);
} 