import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { mobileApi } from '@/api/mobile-api';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import {
  buildCompanyReportRoute,
  formatCompanyBadge,
  formatTrustScore,
  getCompanyProfileDescription,
  normalizeCompanyIdParam,
} from '@/companies/company-ui';

type CompanyProfile = Awaited<ReturnType<typeof mobileApi.getCompany>>;

export default function CompanyProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const companyId = normalizeCompanyIdParam(params.id);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'empty' | 'success'>('loading');

  useEffect(() => {
    let active = true;

    if (!companyId) {
      setState('empty');
      return;
    }

    setState('loading');
    mobileApi
      .getCompany(companyId)
      .then((data) => {
        if (!active) return;
        setCompany(data);
        setState(data ? 'success' : 'empty');
      })
      .catch(() => {
        if (!active) return;
        setState('error');
      });

    return () => {
      active = false;
    };
  }, [companyId]);

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.md, backgroundColor: tokens.colors.bg }}>
      {state === 'loading' && <FeedbackState kind="loading" message="Carregando perfil da empresa..." />}
      {state === 'error' && <FeedbackState kind="error" message="Não foi possível carregar o perfil da empresa." />}
      {state === 'empty' && <FeedbackState kind="empty" message="Empresa não encontrada." />}

      {state === 'success' && company ? (
        <>
          <Text style={{ fontSize: 24, fontWeight: '800' }}>{company.legalName}</Text>
          <Text style={{ color: tokens.colors.muted }}>{getCompanyProfileDescription(company.description)}</Text>

          <View style={{ backgroundColor: '#fff', padding: tokens.spacing.md, borderRadius: 10, gap: 6 }}>
            <Text style={{ fontWeight: '700' }}>Reputação pública</Text>
            <Text>Trust Score: {formatTrustScore(company.trustScore)}</Text>
            <Text>Selo: {formatCompanyBadge(company.badge)}</Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push(buildCompanyReportRoute(company.id) as any)}
            style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Abrir denúncia contra esta empresa</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={{ padding: 12 }}>
            <Text style={{ textAlign: 'center', color: tokens.colors.primary }}>Voltar</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
}
