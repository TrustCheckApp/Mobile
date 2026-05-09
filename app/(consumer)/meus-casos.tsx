import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useMyCases, type CaseStatus } from '@/features/cases/useMyCases';
import { CaseCard } from '@/components/CaseCard';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';

const STATUS_FILTERS: Array<{ value: CaseStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'draft', label: 'Rascunho' },
  { value: 'pending_moderation', label: 'Em moderação' },
  { value: 'published', label: 'Publicado' },
  { value: 'negotiating', label: 'Em negociação' },
  { value: 'resolved', label: 'Resolvido' },
  { value: 'closed_unresolved', label: 'Fechado' },
];

export default function MeusCasos() {
  const router = useRouter();
  const {
    cases,
    isLoading,
    error,
    statusFilter,
    searchQuery,
    setStatusFilter,
    setSearchQuery,
    fetchCases,
    getStatusColor,
    getStatusLabel,
    formatRelativeTime,
  } = useMyCases();

  const [refreshing, setRefreshing] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(debouncedSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [debouncedSearch, setSearchQuery]);

  function onRefresh() {
    setRefreshing(true);
    fetchCases().finally(() => setRefreshing(false));
  }

  function handleCasePress(caseId: string) {
    router.push({
      pathname: '/(consumer)/case-detail',
      params: { caseId },
    });
  }

  function handleNewCase() {
    router.push('/(consumer)/wizard-step1');
  }

  function renderSkeleton() {
    return (
      <View style={{ gap: 12 }}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={{
              backgroundColor: '#f3f4f6',
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
            }}
          >
            <View style={{ height: 20, width: '60%', backgroundColor: '#e5e7eb', borderRadius: 4, marginBottom: 8 }} />
            <View style={{ height: 16, width: '80%', backgroundColor: '#e5e7eb', borderRadius: 4, marginBottom: 4 }} />
            <View style={{ height: 14, width: '40%', backgroundColor: '#e5e7eb', borderRadius: 4 }} />
          </View>
        ))}
      </View>
    );
  }

  function renderEmptyState() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text style={{ fontSize: 48 }}>📋</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 16, textAlign: 'center' }}>
          Você ainda não abriu denúncias
        </Text>
        <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
          Comece a acompanhar seus casos abrindo sua primeira denúncia
        </Text>
        <TouchableOpacity
          onPress={handleNewCase}
          style={{
            backgroundColor: tokens.colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            marginTop: 24,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Abrir denúncia</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.bg }}>
      <View style={{ padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 22, fontWeight: '800' }}>Meus Casos</Text>
        
        <TextInput
          placeholder="Buscar por ID ou empresa..."
          value={debouncedSearch}
          onChangeText={setDebouncedSearch}
          style={{
            backgroundColor: '#f3f4f6',
            padding: 12,
            borderRadius: 8,
            fontSize: 14,
          }}
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ gap: 8 }}>
          {STATUS_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              onPress={() => setStatusFilter(filter.value)}
              style={{
                backgroundColor: statusFilter === filter.value ? tokens.colors.primary : '#f3f4f6',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
              }}
            >
              <Text style={{ color: statusFilter === filter.value ? '#fff' : '#374151', fontSize: 12, fontWeight: '500' }}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {error && <FeedbackState kind="error" message={error} />}
      
      {isLoading && !refreshing ? (
        <View style={{ padding: tokens.spacing.lg }}>{renderSkeleton()}</View>
      ) : cases.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={cases}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: tokens.spacing.lg }}
          renderItem={({ item }) => (
            <CaseCard
              caseItem={item}
              statusColor={getStatusColor(item.status)}
              statusLabel={getStatusLabel(item.status)}
              relativeTime={formatRelativeTime(item.updatedAt)}
              onPress={() => handleCasePress(item.id)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
