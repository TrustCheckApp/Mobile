import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { normalizeApiError, ApiError } from './errors';
import { router } from 'expo-router';
import { getMockResponse } from './mocks';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS === 'true';

const AUTH_TOKEN_KEY = 'auth_token';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

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
  timeout: 15000,
});

// Track retry count per request
const retryCountMap = new Map<string, number>();

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // If using mocks, return mock response immediately
    if (USE_MOCKS) {
      const mockData = getMockResponse(config.method?.toUpperCase() || 'GET', config.url || '');
      if (mockData) {
        console.log('API Mock Response:', {
          url: config.url,
          method: config.method,
          data: sanitizeForLogging(mockData),
        });
        // Store mock data in config for response interceptor to use
        (config as any).__mockData = mockData;
        return config;
      }
    }
    
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
    // Clear retry count on success
    const requestId = response.config.url || '';
    retryCountMap.delete(requestId);
    
    // Log response with sanitized data
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: sanitizeForLogging(response.data),
    });
    return response;
  },
  async (error: AxiosError) => {
    // Check if mock data was set in request interceptor
    if (USE_MOCKS && error.config && (error.config as any).__mockData) {
      const mockData = (error.config as any).__mockData;
      console.log('API Mock Response (from error handler):', {
        url: error.config.url,
        data: sanitizeForLogging(mockData),
      });
      // Return mock data as successful response
      return Promise.resolve({
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config,
      } as AxiosResponse);
    }
    
    const requestId = error.config?.url || '';
    
    // Retry logic for idempotent GET requests
    if (
      error.config?.method === 'get' &&
      (error.code === 'ECONNABORTED' || (error.response?.status && error.response.status >= 500))
    ) {
      const currentRetryCount = retryCountMap.get(requestId) || 0;
      
      if (currentRetryCount < MAX_RETRIES) {
        retryCountMap.set(requestId, currentRetryCount + 1);
        const delay = RETRY_DELAY_MS * Math.pow(2, currentRetryCount);
        
        console.log(`Retrying GET request ${requestId} (attempt ${currentRetryCount + 1}/${MAX_RETRIES}) after ${delay}ms`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return axiosClient.request(error.config!);
      } else {
        retryCountMap.delete(requestId);
      }
    }
    
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
        // Clear auth token and navigate to login
        try {
          await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
          console.warn('Authentication required - redirecting to login');
          router.replace('/(auth)/login');
        } catch (error) {
          console.error('Failed to clear auth token:', error);
        }
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
