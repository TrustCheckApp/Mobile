import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useCompanyAuth } from '@/features/auth/useCompanyAuth';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';

export default function Company2FAScreen() {
  const router = useRouter();
  const { verify2FA } = useCompanyAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
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
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  async function handleVerify() {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Digite o código completo de 6 dígitos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await verify2FA(otpCode);
    } catch (err: any) {
      const apiError = err as { code?: string; message?: string };
      
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
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.lg, backgroundColor: tokens.colors.bg, justifyContent: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '800', textAlign: 'center' }}>Verificação 2FA</Text>
        <Text style={{ fontSize: 14, textAlign: 'center', color: '#666' }}>
          Digite o código do seu autenticador TOTP
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: tokens.spacing.sm }}>
          {otp.map((digit: string, index: number) => (
            <TextInput
              key={index}
              value={digit}
              onChangeText={(value: string) => handleOtpChange(index, value)}
              onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(index, key)}
              maxLength={1}
              keyboardType="number-pad"
              style={{
                width: 50,
                height: 60,
                backgroundColor: '#fff',
                borderRadius: 8,
                borderWidth: 2,
                borderColor: digit ? tokens.colors.primary : '#ddd',
                fontSize: 24,
                fontWeight: '600',
                textAlign: 'center',
              }}
              secureTextEntry
            />
          ))}
        </View>

        {error && (
          <Text style={{ color: '#dc2626', textAlign: 'center', fontSize: 14 }}>
            {error}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleVerify}
          disabled={isLoading || otp.join('').length !== 6}
          style={{
            backgroundColor: isLoading || otp.join('').length !== 6 ? '#ccc' : tokens.colors.primary,
            padding: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
            {isLoading ? 'Verificando...' : 'Verificar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 12 }}
        >
          <Text style={{ color: tokens.colors.primary, textAlign: 'center', fontSize: 14 }}>
            Voltar
          </Text>
        </TouchableOpacity>

        {isLoading && <FeedbackState kind="loading" message="Verificando código..." />}
      </View>
    </KeyboardAvoidingView>
  );
}
