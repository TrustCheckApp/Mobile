import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { mobileApi } from '@/api/mobile-api';

const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

interface OtpError {
  code: string;
  message: string;
}

export function useOtp(email: string, registrationToken: string) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = useCallback((index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste or auto-fill
      const digits = value.split('').slice(0, 6);
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
    } else {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  }, [otp]);

  const handleVerify = useCallback(async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Digite o código completo de 6 dígitos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await mobileApi.auth.confirmConsumer({
        registrationToken,
        otp: otpCode,
      });

      // Save tokens to SecureStore
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.data.accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.data.refreshToken);

      // Navigate to Home
      router.replace('/(consumer)/home');
    } catch (err: any) {
      const apiError = err as OtpError;
      
      if (apiError.code === 'OTP_INVALID') {
        setError('Código incorreto. Tente novamente.');
      } else if (apiError.code === 'OTP_EXPIRED') {
        setError('Código expirou. Solicite um novo.');
      } else {
        setError(apiError.message || 'Erro ao verificar código. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [otp, registrationToken]);

  const handleResend = useCallback(async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError(null);

    try {
      // Re-send OTP (this would call the send endpoint)
      // For now, we'll just reset the countdown
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    } catch (err: any) {
      setError('Erro ao reenviar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [canResend]);

  return {
    otp,
    setOtp,
    handleOtpChange,
    handleVerify,
    handleResend,
    isLoading,
    error,
    canResend,
    countdown,
  };
}
