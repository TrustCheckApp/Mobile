import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useOtp } from '@/features/auth/useOtp';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';

export default function OtpVerifyScreen() {
  const { email, registrationToken } = useLocalSearchParams<{ email: string; registrationToken: string }>();
  const {
    otp,
    setOtp,
    handleOtpChange,
    handleVerify,
    handleResend,
    isLoading,
    error,
    canResend,
    countdown,
  } = useOtp(email, registrationToken);

  const handleInputChange = (index: number, value: string) => {
    handleOtpChange(index, value);
  };

  const handleKeyPress = (index: number, key: string) => {
    // Handle backspace to move to previous input
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.lg, backgroundColor: tokens.colors.bg, justifyContent: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '800', textAlign: 'center' }}>Verificação OTP</Text>
        <Text style={{ fontSize: 14, textAlign: 'center', color: '#666' }}>
          Enviamos um código de 6 dígitos para{'\n'}
          <Text style={{ fontWeight: '600' }}>{email}</Text>
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: tokens.spacing.sm }}>
          {otp.map((digit: string, index: number) => (
            <TextInput
              key={index}
              value={digit}
              onChangeText={(value: string) => handleInputChange(index, value)}
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
          onPress={handleResend}
          disabled={!canResend || isLoading}
          style={{ opacity: canResend ? 1 : 0.5 }}
        >
          <Text style={{ color: tokens.colors.primary, textAlign: 'center', fontSize: 14 }}>
            {canResend ? 'Reenviar código' : `Reenviar em ${countdown}s`}
          </Text>
        </TouchableOpacity>

        {isLoading && <FeedbackState kind="loading" message="Verificando código..." />}
      </View>
    </KeyboardAvoidingView>
  );
}
