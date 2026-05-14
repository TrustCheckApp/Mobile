import { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { mobileApi } from '@/api/mobile-api';
import { userFacingMessage } from '@/api/error-map';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import type { ConsumerCaseListItem } from '@/mocks/handlers';
import {
  formatCaseStatus,
  formatCaseUpdatedAt,
  getCaseEmptyMessage,
  getCaseStatusFilters,
} from '@/cases/case-ui';

export default function MeusCasosScreen() {
  const router = useRouter();
  const [items, setItems] = useState<ConsumerCaseListItem[]>([]);
  const [filter, setFilter] = useState('TODOS');
  const [state, setState] = useState<'loading' | 'error' | 'empty' | 'success'>('loading');
  const [message, setMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setState('loading');
      mobileApi
        .listMyCases()
        .then((data) => {
          if (!active) return;
          setItems(data);
          setState(data.length ? 'success' : 'empty');
        })
        .catch((error) => {
          if (!active) return;
          setState('error');
          setMessage(userFacingMessage(error, 'Não foi possível carregar seus casos.'));
        });
      return () => {
        active = false;
      };
    }, []),
  );

  const filters = getCaseStatusFilters();
  const filtered = filter === 'TODOS' ? items : items.filter((item: ConsumerCaseListItem) => item.status === filter);
  const showFilteredEmpty = state === 'success' && filtered.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.bg, padding: tokens.spacing.lg, gap: tokens.spacing.sm }}>
      <Text style={{ fontSize: 24, fontWeight: '800' }}>Meus casos</Text>
      <Text style={{ color: tokens.colors.muted }}>
        Acompanhe status, atualizações e histórico dos casos enviados para moderação e negociação.
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {filters.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => setFilter(option.value)}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 16,
              backgroundColor: filter === option.value ? tokens.colors.primary : '#e0e4ec',
            }}
          >
            <Text style={{ color: filter === option.value ? '#fff' : tokens.colors.text, fontSize: 12 }}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {state === 'loading' && <FeedbackState kind="loading" message="Carregando seus casos..." />}
      {state === 'error' && <FeedbackState kind="error" message={message} />}
      {state === 'empty' && <FeedbackState kind="empty" message={getCaseEmptyMessage('TODOS')} />}
      {showFilteredEmpty && <FeedbackState kind="empty" message={getCaseEmptyMessage(filter)} />}

      <FlatList
        data={state === 'success' ? filtered : []}
        keyExtractor={(item: ConsumerCaseListItem) => item.id}
        renderItem={({ item }: { item: ConsumerCaseListItem }) => (
          <TouchableOpacity
            onPress={() => router.push(`/(consumer)/casos/${encodeURIComponent(item.id)}`)}
            style={{ backgroundColor: '#fff', padding: tokens.spacing.md, borderRadius: 10, marginBottom: tokens.spacing.sm }}
          >
            <Text style={{ fontWeight: '800' }}>{item.publicId ?? item.id}</Text>
            <Text>{item.companyName}</Text>
            <Text style={{ color: tokens.colors.muted }}>Status: {formatCaseStatus(item.status)}</Text>
            <Text style={{ color: tokens.colors.muted, fontSize: 12 }}>Atualizado: {formatCaseUpdatedAt(item.updatedAt)}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={() => router.push('/(consumer)/wizard-step1')}
        style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Nova denúncia</Text>
      </TouchableOpacity>
    </View>
  );
}
