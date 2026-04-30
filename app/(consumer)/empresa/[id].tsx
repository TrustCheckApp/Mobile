import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { mobileApi } from '@/api/mobile-api';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';

export default function CompanyProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);
  const [state, setState] = useState<'loading' | 'error' | 'empty' | 'success'>('loading');

  useEffect(() => {
    mobileApi
      .getCompany(String(id))
      .then((data) => {
        setCompany(data);
        setState(data ? 'success' : 'empty');
      })
      .catch(() => setState('error'));
  }, [id]);

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.md, backgroundColor: tokens.colors.bg }}>
      {state === 'loading' && <FeedbackState kind="loading" message="Carregando perfil..." />}
      {state === 'error' && <FeedbackState kind="error" message="Erro ao carregar empresa." />}
      {state === 'empty' && <FeedbackState kind="empty" message="Empresa não encontrada." />}
      {state === 'success' && (
        <>
          <Text style={{ fontSize: 24, fontWeight: '800' }}>{company.legalName}</Text>
          <Text>Trust Score: {company.trustScore}</Text>
          <Text>Selo: {company.badge}</Text>
          <Text>{company.description}</Text>
        </>
      )}
    </View>
  );
}
