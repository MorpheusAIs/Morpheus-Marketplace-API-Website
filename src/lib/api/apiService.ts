'use client';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: any;
  };
  response: {
    headers: Record<string, string>;
    body: any;
  };
}

/**
 * Performs an API request with detailed logging
 */
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const method = options.method || 'GET';
  const headers = options.headers || {};
  const body = options.body;

  // Log the request
  console.group(`API Request: ${method} ${url}`);
  console.log('Request Headers:', headers);
  if (body) {
    console.log('Request Body:', typeof body === 'string' ? JSON.parse(body) : body);
  }
  
  try {
    const response = await fetch(url, options);
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    let responseData: any = null;
    let responseText = '';
    let parseError = null;
    
    try {
      responseText = await response.text();
      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          console.error('Error parsing JSON response:', e);
          console.log('Raw response text:', responseText);
          parseError = e instanceof Error ? e.message : 'Unknown parse error';
        }
      }
    } catch (e) {
      console.error('Error reading response text:', e);
      parseError = e instanceof Error ? e.message : 'Unknown response error';
    }

    // Log the response
    console.log('Response Status:', response.status);
    console.log('Response Headers:', responseHeaders);
    console.log('Response Body:', responseData || responseText || '(empty response)');
    
    // Create debug entry for browser console
    const debugInfo = {
      request: {
        url,
        method,
        headers,
        body: body ? (typeof body === 'string' ? JSON.parse(body) : body) : undefined
      },
      response: {
        status: response.status,
        headers: responseHeaders,
        body: responseData || responseText || null,
        parseError
      }
    };
    
    console.log('Debug Info:', debugInfo);
    
    const result: ApiResponse<T> = {
      data: response.ok ? responseData : null,
      error: !response.ok 
        ? responseData?.detail || `Error ${response.status}` 
        : parseError 
          ? `Invalid response format: ${parseError}`
          : null,
      status: response.status,
      request: {
        url,
        method,
        headers: headers as Record<string, string>,
        body: body ? (typeof body === 'string' ? JSON.parse(body) : body) : undefined
      },
      response: {
        headers: responseHeaders,
        body: responseData || responseText || null
      }
    };

    console.groupEnd();
    return result;
  } catch (error) {
    console.error('Network Error:', error);
    console.groupEnd();
    
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown network error',
      status: 0,
      request: {
        url,
        method,
        headers: headers as Record<string, string>,
        body: body ? (typeof body === 'string' ? JSON.parse(body) : body) : undefined
      },
      response: {
        headers: {},
        body: null
      }
    };
  }
}

// Convenience methods
export const apiGet = <T>(url: string, token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return apiRequest<T>(url, { 
    method: 'GET',
    headers
  });
};

export const apiPost = <T>(url: string, data: any, token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return apiRequest<T>(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
};

export const apiPut = <T>(url: string, data: any, token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return apiRequest<T>(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data)
  });
}; 