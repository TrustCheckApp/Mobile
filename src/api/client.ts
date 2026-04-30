const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function apiRequest<T>(path: string, init?: RequestInit, fallback?: () => Promise<T>): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      ...init,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body?.message?.code ?? body?.message ?? `HTTP_${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (fallback) return fallback();
    throw error;
  }
}
