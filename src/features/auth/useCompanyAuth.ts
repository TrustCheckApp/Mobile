import { useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { mobileApi } from '@/api/mobile-api';
import type { ClaimCompanyInput } from '@/api/types';

const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const CLAIM_STATUS_KEY = 'claim_status';
const IS_2FA_VERIFIED_KEY = 'is_2fa_verified';

export type ClaimStatus = 'pending' | 'approved' | 'rejected';

interface CompanyAuthState {
  isAuthenticated: boolean;
  is2faVerified: boolean;
  claimStatus: ClaimStatus | null;
}

export function useCompanyAuth() {
  const [state, setState] = useState<CompanyAuthState>({
    isAuthenticated: false,
    is2faVerified: false,
    claimStatus: null,
  });

  const checkClaimStatus = useCallback(async (claimId: string): Promise<ClaimStatus> => {
    try {
      const response = await mobileApi.auth.getCompanyClaimStatus(claimId);
      const status = response.data.status as ClaimStatus;
      await SecureStore.setItemAsync(CLAIM_STATUS_KEY, status);
      setState((prev: CompanyAuthState) => ({ ...prev, claimStatus: status }));
      return status;
    } catch (error) {
      console.error('Failed to check claim status:', error);
      return 'pending';
    }
  }, []);

  const registerCompany = useCallback(async (
    email: string,
    password: string,
    cnpj: string,
    legalName: string,
    fullName: string,
    documents: ClaimCompanyInput['documents']
  ) => {
    try {
      const response = await mobileApi.auth.claimCompany({
        email,
        password,
        cnpj,
        legalName,
        fullName,
        documents,
        lgpdAccepted: true,
        lgpdVersion: '1.0.0',
      });

      const claimId = response.data.claimId;
      const status = await checkClaimStatus(claimId);

      if (status === 'approved') {
        router.push('/(auth)/company-2fa');
      } else if (status === 'pending') {
        router.push({
          pathname: '/(auth)/claim-pending',
          params: { claimId },
        });
      } else if (status === 'rejected') {
        router.push({
          pathname: '/(auth)/claim-rejected',
          params: { claimId },
        });
      }
    } catch (error: any) {
      throw error;
    }
  }, [checkClaimStatus]);

  const loginCompany = useCallback(async (email: string, password: string) => {
    try {
      // This would call a login endpoint - for now we'll use claim as placeholder
      const response = await mobileApi.auth.claimCompany({
        email,
        password,
        cnpj: '',
        legalName: '',
        fullName: '',
        documents: [],
        lgpdAccepted: true,
        lgpdVersion: '1.0.0',
      });

      if (response.data.requires_2fa) {
        router.push('/(auth)/company-2fa');
      } else {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.data.accessToken || '');
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.data.refreshToken || '');
        await SecureStore.setItemAsync(IS_2FA_VERIFIED_KEY, 'true');
        setState({ isAuthenticated: true, is2faVerified: true, claimStatus: null });
        router.replace('/(company)/dashboard');
      }
    } catch (error: any) {
      throw error;
    }
  }, []);

  const verify2FA = useCallback(async (totpCode: string) => {
    try {
      const response = await mobileApi.auth.confirmCompany({
        registrationToken: '',
        otp: totpCode,
      });

      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.data.accessToken || '');
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.data.refreshToken || '');
      await SecureStore.setItemAsync(IS_2FA_VERIFIED_KEY, 'true');
      setState({ isAuthenticated: true, is2faVerified: true, claimStatus: null });

      router.replace('/(company)/dashboard');
    } catch (error: any) {
      throw error;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      const is2faVerified = await SecureStore.getItemAsync(IS_2FA_VERIFIED_KEY) === 'true';
      const claimStatus = await SecureStore.getItemAsync(CLAIM_STATUS_KEY) as ClaimStatus | null;

      setState({
        isAuthenticated: !!token,
        is2faVerified: is2faVerified || false,
        claimStatus,
      });

      return { isAuthenticated: !!token, is2faVerified, claimStatus };
    } catch (error) {
      console.error('Failed to check auth status:', error);
      return { isAuthenticated: false, is2faVerified: false, claimStatus: null };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(IS_2FA_VERIFIED_KEY);
      await SecureStore.deleteItemAsync(CLAIM_STATUS_KEY);
      setState({ isAuthenticated: false, is2faVerified: false, claimStatus: null });
      router.replace('/(auth)/company-login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }, []);

  return {
    state,
    registerCompany,
    loginCompany,
    verify2FA,
    checkAuth,
    checkClaimStatus,
    logout,
  };
}
