import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { mobileApi } from '@/api/mobile-api';
import type { CompanyListItem } from '@/mocks/handlers';
import { FeedbackState } from '@/components/FeedbackState';
import { useRouter } from 'expo-router';
import { tokens } from '@/theme/tokens';
import {
  buildCompanyReportRoute,
  formatCompanyBadge,
  formatTrustScore,
  getCompanyEmptyMessage,
  getCompanyErrorMessage,
} from '@/companies/company-ui';

export default function ConsumerHomeScreen() {
  const router = useRouter();
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'empty' | 'success'>('loading');

  useEffect(() => {
    let active = true;
    setState('loading');

    mobileApi
      .listCompanies()
      .then((data) => {
        if (!active) return;
        setCompanies(data);
        setState(data.length ? 'success' : 'empty');
      })
      .catch(() => {
        if (!active) return;
        setState('error');
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: tokens.spacing.lg, gap: tokens.spacing.md, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 24, fontWeight: '800' }}>Home / Explorar</Text>
      <Text style={{ color: tokens.colors.muted }}>
        Encontre empresas, consulte indicadores públicos e abra uma denúncia com a empresa já selecionada.
      </Text>

      {state === 'loading' && <FeedbackState kind="loading" message="Carregando empresas..." />}
      {state === 'error' && <FeedbackState kind="error" message={getCompanyErrorMessage('Falha ao carregar empresas.')} />}
      {state === 'empty' && <FeedbackState kind="empty" message={getCompanyEmptyMessage()} />}

      {state === 'success' &&
        companies.map((company: CompanyListItem) => (
          <TouchableOpacity
            key={company.id}
            onPress={() => router.push(`/(consumer)/empresa/${company.id}` as any)}
            style={{ backgroundColor: '#fff', padding: tokens.spacing.md, borderRadius: 10, gap: 4 }}
          >
            <Text style={{ fontWeight: '700' }}>{company.legalName}</Text>
            <Text>Trust Score: {formatTrustScore(company.trustScore)}</Text>
            <Text>Selo: {formatCompanyBadge(company.badge)}</Text>
            <Text style={{ color: tokens.colors.primary, fontWeight: '700' }}>Ver perfil da empresa</Text>
          </TouchableOpacity>
        ))}

      <TouchableOpacity
        onPress={() => router.push('/(consumer)/wizard-step1')}
        style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Nova denúncia</Text>
      </TouchableOpacity>

      {state === 'success' && companies.length ? (
        <TouchableOpacity
          onPress={() => router.push(buildCompanyReportRoute(companies[0].id) as any)}
          style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: tokens.colors.primary }}
        >
          <Text style={{ textAlign: 'center', color: tokens.colors.primary, fontWeight: '700' }}>
            Abrir denúncia para {companies[0].legalName}
          </Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}
