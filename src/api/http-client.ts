import { apiBaseUrl } from '@/config/env';
import { getAccessToken, clearTokens } from '@/auth/token-storage';
import { notifyUnauthorized } from '@/navigation/auth-events';
import { parseNestError } from '@/api/error-map';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function apiFetch<T>(path: string, init: RequestInit & { method?: HttpMethod } = {}): Promise<T> {
  const token = await getAccessToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };
  if (init.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
  });

  const text = await response.text();
  let json: unknown = {};
  if (text) {
    try {
      json = JSON.parse(text) as unknown;
    } catch {
      json = {};
    }
  }

  const publicAuthPrefix = [
    '/auth/consumer/register',
    '/auth/consumer/register/confirm',
    '/auth/consumer/login',
    '/auth/company/register',
    '/auth/company/register/confirm',
    '/auth/company/claim',
  ];
  const isPublicAuth = publicAuthPrefix.some((p) => path === p || path.startsWith(`${p}?`));
  if ((response.status === 401 || response.status === 403) && !isPublicAuth) {
    await clearTokens();
    notifyUnauthorized();
  }

  if (!response.ok) {
    throw parseNestError(response.status, json);
  }

  return json as T;
}
