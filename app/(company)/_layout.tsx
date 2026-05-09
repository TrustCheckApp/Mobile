import { useEffect } from 'react';
import { router } from 'expo-router';
import { useCompanyAuth } from '@/features/auth/useCompanyAuth';

export default function CompanyLayout() {
  const { checkAuth } = useCompanyAuth();

  useEffect(() => {
    async function checkAuthGuard() {
      const { isAuthenticated, is2faVerified } = await checkAuth();

      if (!isAuthenticated || !is2faVerified) {
        router.replace('/(auth)/company-login');
      }
    }

    checkAuthGuard();
  }, [checkAuth]);

  return null;
}
