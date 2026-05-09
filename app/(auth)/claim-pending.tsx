import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCompanyAuth } from '@/features/auth/useCompanyAuth';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';

export default function ClaimPendingScreen() {
  const { claimId } = useLocalSearchParams<{ claimId: string }>();
  const router = useRouter();
  const { checkClaimStatus } = useCompanyAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleCheckStatus() {
    setIsLoading(true);
    setMessage('');

    try {
      const status = await checkClaimStatus(claimId);

      if (status === 'approved') {
        setMessage('Claim aprovado! Redirecionando para 2FA...');
        setTimeout(() => {
          router.push('/(auth)/company-2fa');
        }, 1500);
      } else if (status === 'rejected') {
        setMessage('Claim rejeitado. Entre em contato com o suporte.');
        setTimeout(() => {
          router.push({
            pathname: '/(auth)/claim-rejected',
            params: { claimId },
          });
        }, 2000);
      } else {
        setMessage('Ainda em análise. Tente novamente em alguns minutos.');
      }
    } catch (error) {
      setMessage('Erro ao verificar status. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.lg, backgroundColor: tokens.colors.bg, justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: '800', textAlign: 'center' }}>Claim em Análise</Text>
      <Text style={{ fontSize: 14, textAlign: 'center', color: '#666' }}>
        Seu CNPJ está sendo verificado. Este processo pode levar até 24 horas úteis.
      </Text>
      <Text style={{ fontSize: 14, textAlign: 'center', color: '#666' }}>
        Você receberá um email quando a verificação for concluída.
      </Text>

      <View style={{ backgroundColor: '#fff', padding: tokens.spacing.md, borderRadius: 8, gap: tokens.spacing.sm }}>
        <Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'center' }}>O que acontece agora?</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>• Verificamos a existência do CNPJ</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>• Validamos a titularidade</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>• Confirmamos os documentos enviados</Text>
      </View>

      <TouchableOpacity
        onPress={handleCheckStatus}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? '#ccc' : tokens.colors.primary,
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
          {isLoading ? 'Verificando...' : 'Verificar Status'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/(auth)/company-login')}
        style={{ padding: 12 }}
      >
        <Text style={{ color: tokens.colors.primary, textAlign: 'center', fontSize: 14 }}>
          Voltar para Login
        </Text>
      </TouchableOpacity>

      {message && <FeedbackState kind={isLoading ? 'loading' : 'success'} message={message} />}
    </View>
  );
}
