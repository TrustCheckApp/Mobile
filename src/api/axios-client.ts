import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { normalizeApiError, ApiError } from './errors';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

const AUTH_TOKEN_KEY = 'auth_token';

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
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to normalize errors
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const responseData = error.response.data as { code?: string; message?: string } | undefined;
      const apiError: ApiError = {
        code: responseData?.code || `HTTP_${error.response.status}`,
        message: responseData?.message || error.message,
        statusCode: error.response.status,
        details: error.response.data,
      };
      return Promise.reject(apiError);
    }
    
    if (error.request) {
      const apiError: ApiError = {
        code: 'NETWORK_ERROR',
        message: 'Network error occurred',
        details: error,
      };
      return Promise.reject(apiError);
    }
    
    const apiError: ApiError = normalizeApiError(error);
    return Promise.reject(apiError);
  }
);
