import * as SecureStore from 'expo-secure-store';

const ACCESS = 'tc_access_token';
const REFRESH = 'tc_refresh_token';

export async function saveTokens(accessToken: string, refreshToken?: string | null): Promise<void> {
  await SecureStore.setItemAsync(ACCESS, accessToken, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
  if (refreshToken) {
    await SecureStore.setItemAsync(REFRESH, refreshToken, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  } else {
    await SecureStore.deleteItemAsync(REFRESH).catch(() => undefined);
  }
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS).catch(() => undefined);
  await SecureStore.deleteItemAsync(REFRESH).catch(() => undefined);
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH);
}
