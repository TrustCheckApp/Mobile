import { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useCompanyDashboard } from '@/features/company/useCompanyDashboard';
import { tokens } from '@/theme/tokens';

export default function CompanyDashboardScreen() {
  const router = useRouter();
  const {
    dashboardData,
    isLoading,
    error,
    fetchDashboardData,
    formatTrustScoreChange,
  } = useCompanyDashboard();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const trustScoreChange = dashboardData?.trustScore
    ? formatTrustScoreChange(dashboardData.trustScore.score, dashboardData.trustScore.previousScore)
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.bg, padding: tokens.spacing.lg, gap: tokens.spacing.sm }}>
      <Text style={{ fontSize: 24, fontWeight: '800' }}>Dashboard Empresa</Text>

      {dashboardData?.trustScore.isPending ? (
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>Trust Score</Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>Em apuração</Text>
        </View>
      ) : dashboardData?.trustScore ? (
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>Trust Score</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
            <Text style={{ fontSize: 32, fontWeight: '800', color: tokens.colors.primary }}>
              {dashboardData.trustScore.score.toFixed(1)}
            </Text>
            {trustScoreChange && trustScoreChange.direction !== 'neutral' && (
              <Text style={{ fontSize: 14, color: trustScoreChange.direction === 'up' ? '#10b981' : '#ef4444' }}>
                {trustScoreChange.direction === 'up' ? '▲' : '▼'} {trustScoreChange.value.toFixed(1)}
              </Text>
            )}
          </View>
        </View>
      ) : (
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>Trust Score</Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>Sem dados ainda</Text>
        </View>
      )}

      {dashboardData?.casesByStatus && (
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Casos por Status</Text>
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14 }}>Aguardando resposta</Text>
              <Text style={{ fontSize: 14, fontWeight: '600' }}>{dashboardData.casesByStatus.published || 0}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14 }}>Em negociação</Text>
              <Text style={{ fontSize: 14, fontWeight: '600' }}>{dashboardData.casesByStatus.negotiating || 0}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14 }}>Em análise</Text>
              <Text style={{ fontSize: 14, fontWeight: '600' }}>{dashboardData.casesByStatus.pending_moderation || 0}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14 }}>Fechados</Text>
              <Text style={{ fontSize: 14, fontWeight: '600' }}>{(dashboardData.casesByStatus.resolved || 0) + (dashboardData.casesByStatus.closed_unresolved || 0)}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
        <TouchableOpacity
          onPress={() => router.push('/(company)/fila')}
          style={{ flex: 1, backgroundColor: tokens.colors.primary, padding: 16, borderRadius: 12 }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Fila de Casos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/(company)/configuracoes')}
          style={{ flex: 1, backgroundColor: '#6b7280', padding: 16, borderRadius: 12 }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Configurações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
