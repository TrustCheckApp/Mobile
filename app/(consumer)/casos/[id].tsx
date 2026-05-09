import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View, RefreshControl, Image } from 'react-native';
import { useCaseDetail } from '@/features/cases/useCaseDetail';
import { Timeline } from '@/components/Timeline';
import { ProposalCard } from '@/components/ProposalCard';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';

export default function CaseDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    caseDetail,
    isLoading,
    error,
    fetchCaseDetail,
    acceptProposal,
    rejectProposal,
    canPerformActions,
    getActionDisabledReason,
  } = useCaseDetail(id);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCaseDetail();
  }, [fetchCaseDetail]);

  function onRefresh() {
    setRefreshing(true);
    fetchCaseDetail().finally(() => setRefreshing(false));
  }

  function handleAcceptProposal(proposalId: string) {
    acceptProposal(proposalId).catch(() => {});
  }

  function handleRejectProposal(proposalId: string, reason: string) {
    rejectProposal(proposalId, reason).catch(() => {});
  }

  function handleReportProblem() {
    // Navigate to support channel
    router.push('/(consumer)/support');
  }

  if (isLoading && !caseDetail) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <FeedbackState kind="loading" message="Carregando caso..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.colors.bg, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <FeedbackState kind="error" message={error} />
        <TouchableOpacity
          onPress={onRefresh}
          style={{ backgroundColor: tokens.colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 16 }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!caseDetail) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.colors.bg, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text style={{ fontSize: 48 }}>📭</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 16, textAlign: 'center' }}>Caso não encontrado</Text>
        <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
          O caso que você procura não existe ou você não tem permissão para visualizá-lo.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: tokens.colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 24 }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tokens.colors.bg }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={{ padding: tokens.spacing.lg, backgroundColor: '#fff', marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <Text style={{ fontSize: 24, fontWeight: '800', flex: 1 }}>{caseDetail.publicId}</Text>
          <View style={{ backgroundColor: '#3b82f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{caseDetail.status}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>{caseDetail.companyName}</Text>
        <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
          Aberto em {new Date(caseDetail.createdAt).toLocaleDateString('pt-BR')}
        </Text>

        <Text style={{ fontSize: 14, color: '#374151', marginBottom: 16 }}>{caseDetail.description}</Text>
      </View>

      <View style={{ backgroundColor: '#fff', padding: 16, marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Evidências</Text>
        {caseDetail.evidences.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 12 }}>
            {caseDetail.evidences.map((evidence: any) => (
              <TouchableOpacity
                key={evidence.id}
                onPress={() => {
                  // Open image preview
                }}
                style={{ width: 100, height: 100, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' }}
              >
                <Image source={{ uri: evidence.url }} style={{ width: '100%', height: '100%' }} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={{ fontSize: 14, color: '#6b7280' }}>Nenhuma evidência anexada</Text>
        )}
      </View>

      <Timeline events={caseDetail.timeline} />

      {caseDetail.proposals.length > 0 && (
        <View style={{ padding: tokens.spacing.lg, backgroundColor: tokens.colors.bg }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Propostas</Text>
          {caseDetail.proposals.map((proposal: any) => (
            <ProposalCard
              proposal={proposal}
              onAccept={() => handleAcceptProposal(proposal.id)}
              onReject={(reason) => handleRejectProposal(proposal.id, reason)}
              disabled={!canPerformActions()}
              disabledReason={getActionDisabledReason()}
            />
          ))}
        </View>
      )}

      <View style={{ padding: tokens.spacing.lg, backgroundColor: '#fff', marginTop: 12 }}>
        <TouchableOpacity
          onPress={handleReportProblem}
          style={{ backgroundColor: '#f59e0b', padding: 12, borderRadius: 8 }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Reportar problema</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
