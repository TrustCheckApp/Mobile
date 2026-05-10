import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { mobileApi } from '@/api/mobile-api';
import type { CompanyListItem } from '@/mocks/handlers';
import { FeedbackState } from '@/components/FeedbackState';
import { useRouter } from 'expo-router';
import { tokens } from '@/theme/tokens';

export default function ConsumerHomeScreen() {
  const router = useRouter();
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'empty' | 'success'>('loading');

  useEffect(() => {
    mobileApi
      .listCompanies()
      .then((data) => {
        setCompanies(data);
        setState(data.length ? 'success' : 'empty');
      })
      .catch(() => setState('error'));
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: tokens.spacing.lg, gap: tokens.spacing.md, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 24, fontWeight: '800' }}>Home / Explorar</Text>
      <FeedbackState
        kind="empty"
        message="Catálogo público de empresas não consta no OpenAPI Sprint 1 — lista abaixo é sempre demonstrativa."
      />
      {state === 'loading' && <FeedbackState kind="loading" message="Carregando empresas..." />}
      {state === 'error' && <FeedbackState kind="error" message="Falha ao carregar dados." />}
      {state === 'empty' && <FeedbackState kind="empty" message="Nenhuma empresa disponível." />}
      {state === 'success' &&
        companies.map((company: CompanyListItem) => (
          <TouchableOpacity key={company.id} onPress={() => router.push(`/(consumer)/empresa/${company.id}` as any)} style={{ backgroundColor: '#fff', padding: tokens.spacing.md, borderRadius: 10 }}>
            <Text style={{ fontWeight: '700' }}>{company.legalName}</Text>
            <Text>Score: {company.trustScore} • Selo: {company.badge}</Text>
          </TouchableOpacity>
        ))}
      <TouchableOpacity onPress={() => router.push('/(consumer)/wizard-step1')} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Nova denúncia</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(consumer)/meus-casos')} style={{ backgroundColor: '#1f7a45', padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Meus casos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
