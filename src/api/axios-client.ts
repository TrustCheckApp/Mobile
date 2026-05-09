import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { normalizeApiError, ApiError } from './errors';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

const AUTH_TOKEN_KEY = 'auth_token';

// Sensitive fields to redact from logs
const SENSITIVE_FIELDS = ['password', 'token', 'authorization', 'secret', 'apiKey', 'api_key'];

function sanitizeForLogging(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeForLogging);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = sanitizeForLogging(value);
    }
  }
  return sanitized;
}

async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get auth token from SecureStore:', error);
    return null;
  }
}

export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log request with sanitized data
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: sanitizeForLogging(config.data),
    });
    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', sanitizeForLogging(error));
    return Promise.reject(error);
  }
);

// Response interceptor to normalize errors
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response with sanitized data
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: sanitizeForLogging(response.data),
    });
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const responseData = error.response.data as { code?: string; message?: string } | undefined;
      const apiError: ApiError = {
        code: responseData?.code || `HTTP_${error.response.status}`,
        message: responseData?.message || error.message,
        statusCode: error.response.status,
        details: error.response.data,
      };
      
      // Log error with sanitized data
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response.status,
        data: sanitizeForLogging(error.response.data),
      });
      
      // Redirect to login on 401/403
      if (error.response.status === 401 || error.response.status === 403) {
        // In a real app, this would trigger navigation to login
        // For now, we'll log the intent
        console.warn('Authentication required - redirecting to login');
        // TODO: Implement navigation to login screen
        // router.push('/login');
      }
      
      return Promise.reject(apiError);
    }
    
    if (error.request) {
      const apiError: ApiError = {
        code: 'NETWORK_ERROR',
        message: 'Network error occurred',
        details: error,
      };
      console.error('Network Error:', {
        url: error.config?.url,
      });
      return Promise.reject(apiError);
    }
    
    const apiError: ApiError = normalizeApiError(error);
    console.error('Unknown Error:', sanitizeForLogging(error));
    return Promise.reject(apiError);
  }
);
