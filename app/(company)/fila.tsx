import { useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useCompanyDashboard } from '@/features/company/useCompanyDashboard';
import { tokens } from '@/theme/tokens';

const STATUS_FILTERS: Array<{ value: 'all' | 'awaiting_response' | 'negotiating' | 'analyzing' | 'closed'; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'awaiting_response', label: 'Aguardando resposta' },
  { value: 'negotiating', label: 'Em negociação' },
  { value: 'analyzing', label: 'Em análise' },
  { value: 'closed', label: 'Fechados' },
];

export default function CompanyQueueScreen() {
  const router = useRouter();
  const {
    dashboardData,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    fetchDashboardData,
    getFilteredQueue,
    getPriorityColor,
    getPriorityLabel,
  } = useCompanyDashboard();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const filteredQueue = getFilteredQueue();

  function handleCasePress(caseId: string) {
    router.push({
      pathname: '/(company)/casos/[id]',
      params: { id: caseId },
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.bg }}>
      <View style={{ padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 22, fontWeight: '800' }}>Fila de Casos</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {STATUS_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              onPress={() => setStatusFilter(filter.value)}
              style={{
                backgroundColor: statusFilter === filter.value ? tokens.colors.primary : '#f3f4f6',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: statusFilter === filter.value ? '#fff' : '#374151', fontSize: 12, fontWeight: '500' }}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading ? (
        <View style={{ padding: tokens.spacing.lg }}>
          <Text>Carregando...</Text>
        </View>
      ) : error ? (
        <View style={{ padding: tokens.spacing.lg }}>
          <Text style={{ color: '#ef4444' }}>{error}</Text>
        </View>
      ) : filteredQueue.length === 0 ? (
        <View style={{ padding: tokens.spacing.lg, justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text style={{ fontSize: 48 }}>📭</Text>
          <Text style={{ fontSize: 16, marginTop: 16, textAlign: 'center' }}>Nenhum caso encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={filteredQueue}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: tokens.spacing.lg }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleCasePress(item.id)}
              style={{
                backgroundColor: '#fff',
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: item.slaExceeded ? '#ef4444' : '#e5e7eb',
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', flex: 1 }}>{item.publicId}</Text>
                <View
                  style={{
                    backgroundColor: getPriorityColor(item.priority),
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>{getPriorityLabel(item.priority)}</Text>
                </View>
              </View>

              <Text style={{ fontSize: 14, color: '#374151', marginBottom: 4 }}>{item.summary}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                {item.consumerDisplayName}
              </Text>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Text style={{ fontSize: 11, color: '#6b7280' }}>{item.daysOpen} dias em aberto</Text>
                {item.slaExceeded && (
                  <Text style={{ fontSize: 11, color: '#ef4444', fontWeight: '600' }}>SLA estourado</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
