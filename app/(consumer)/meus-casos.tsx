import { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { mobileApi } from '@/api/mobile-api';
import { userFacingMessage } from '@/api/error-map';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import type { ConsumerCaseListItem } from '@/mocks/handlers';

const STATUS_FILTERS = ['TODOS', 'ENVIADO', 'EM_MODERACAO', 'PUBLICADO', 'EM_NEGOCIACAO', 'RESOLVIDO', 'NAO_RESOLVIDO'] as const;

export default function MeusCasosScreen() {
  const router = useRouter();
  const [items, setItems] = useState<ConsumerCaseListItem[]>([]);
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>('TODOS');
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
        .catch((e) => {
          if (!active) return;
          setState('error');
          setMessage(userFacingMessage(e, 'Erro ao carregar casos.'));
        });
      return () => {
        active = false;
      };
    }, []),
  );

  const filtered = filter === 'TODOS' ? items : items.filter((i: ConsumerCaseListItem) => i.status === filter);

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.bg, padding: tokens.spacing.lg, gap: tokens.spacing.sm }}>
      <Text style={{ fontSize: 24, fontWeight: '800' }}>Meus casos</Text>
      <FeedbackState kind="empty" message="Lista real ainda não exposta no OpenAPI Sprint 1 — dados de demonstração." />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {STATUS_FILTERS.map((s) => (
          <TouchableOpacity key={s} onPress={() => setFilter(s)} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, backgroundColor: filter === s ? tokens.colors.primary : '#e0e4ec' }}>
            <Text style={{ color: filter === s ? '#fff' : tokens.colors.text, fontSize: 12 }}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {state === 'loading' && <FeedbackState kind="loading" message="A carregar…" />}
      {state === 'error' && <FeedbackState kind="error" message={message} />}
      {state === 'empty' && (
        <FeedbackState kind="empty" message="Ainda não tem casos. Crie uma nova denúncia a partir da home." />
      )}
      {state === 'success' && filtered.length === 0 ? (
        <FeedbackState kind="empty" message="Nenhum caso neste estado. Escolha outro filtro." />
      ) : null}
      <FlatList
        data={filtered}
        keyExtractor={(item: ConsumerCaseListItem) => item.id}
        renderItem={({ item }: { item: ConsumerCaseListItem }) => (
          <TouchableOpacity
            onPress={() => router.push(`/(consumer)/casos/${encodeURIComponent(item.id)}`)}
            style={{ backgroundColor: '#fff', padding: tokens.spacing.md, borderRadius: 10, marginBottom: tokens.spacing.sm }}
          >
            <Text style={{ fontWeight: '800' }}>{item.publicId ?? item.id}</Text>
            <Text>{item.companyName}</Text>
            <Text style={{ color: tokens.colors.muted }}>Estado: {item.status}</Text>
            <Text style={{ color: tokens.colors.muted, fontSize: 12 }}>Atualizado: {new Date(item.updatedAt).toLocaleString()}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity onPress={() => router.push('/(consumer)/wizard-step1')} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Nova denúncia</Text>
      </TouchableOpacity>
    </View>
  );
}
