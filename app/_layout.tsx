import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { setUnauthorizedHandler } from '@/navigation/auth-events';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      router.replace('/(auth)/splash');
    });
    return () => setUnauthorizedHandler(null);
  }, [router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
