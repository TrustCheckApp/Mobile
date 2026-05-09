import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useCaseDetail } from '@/features/cases/useCaseDetail';
import { Timeline } from '@/components/Timeline';
import { tokens } from '@/theme/tokens';
import { FeedbackState } from '@/components/FeedbackState';

export default function CompanyCaseDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    caseDetail,
    isLoading,
    error,
    fetchCaseDetail,
    canPerformActions,
    getActionDisabledReason,
  } = useCaseDetail(id);

  useEffect(() => {
    fetchCaseDetail();
  }, [fetchCaseDetail]);

  if (isLoading && !caseDetail) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <FeedbackState kind="loading" message="Carregando caso..." />
      </View>
    );
  }

  if (error && error.includes('403')) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.colors.bg, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text style={{ fontSize: 48 }}>🔒</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 16, textAlign: 'center' }}>Acesso negado</Text>
        <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
          Você não tem permissão para visualizar este caso.
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

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.colors.bg, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <FeedbackState kind="error" message={error} />
        <TouchableOpacity
          onPress={fetchCaseDetail}
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
    <ScrollView style={{ flex: 1, backgroundColor: tokens.colors.bg }}>
      <View style={{ padding: tokens.spacing.lg, backgroundColor: '#fff', marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <Text style={{ fontSize: 24, fontWeight: '800', flex: 1 }}>{caseDetail.publicId}</Text>
          <View style={{ backgroundColor: '#3b82f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{caseDetail.status}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>
          Aberto em {new Date(caseDetail.createdAt).toLocaleDateString('pt-BR')}
        </Text>

        <Text style={{ fontSize: 14, color: '#374151', marginBottom: 16 }}>{caseDetail.description}</Text>
      </View>

      <Timeline events={caseDetail.timeline} />

      <View style={{ padding: tokens.spacing.lg, backgroundColor: '#fff', marginTop: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Ações disponíveis</Text>

        <TouchableOpacity
          onPress={() => {}}
          disabled={!canPerformActions()}
          style={{
            backgroundColor: !canPerformActions() ? '#ccc' : tokens.colors.primary,
            padding: 12,
            borderRadius: 8,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Responder</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {}}
          disabled={!canPerformActions()}
          style={{
            backgroundColor: !canPerformActions() ? '#ccc' : '#10b981',
            padding: 12,
            borderRadius: 8,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Propor solução</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {}}
          disabled={!canPerformActions()}
          style={{
            backgroundColor: !canPerformActions() ? '#ccc' : '#f59e0b',
            padding: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Solicitar evidência adicional</Text>
        </TouchableOpacity>

        {!canPerformActions() && getActionDisabledReason() && (
          <Text style={{ fontSize: 11, color: '#f59e0b', marginTop: 8 }}>{getActionDisabledReason()}</Text>
        )}
      </View>
    </ScrollView>
  );
}
