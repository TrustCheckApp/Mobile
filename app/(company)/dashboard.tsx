import { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { tokens } from '@/theme/tokens';
import { FeedbackState } from '@/components/FeedbackState';
import { mobileApi } from '@/api/mobile-api';
import { userFacingMessage } from '@/api/error-map';

type Row = { id: string; publicId: string; status: string; consumer: string };

export default function CompanyDashboardScreen() {
  const router = useRouter();
  const [trust, setTrust] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('TODOS');
  const [rows, setRows] = useState<Row[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'empty' | 'success'>('loading');
  const [msg, setMsg] = useState('');

  useFocusEffect(
    useCallback(() => {
      let a = true;
      setState('loading');
      mobileApi
        .listCompanyCases()
        .then((list) => {
          if (!a) return;
          const mapped: Row[] = list.map((c) => ({
            id: c.id,
            publicId: c.publicId ?? c.id,
            status: c.status,
            consumer: '—',
          }));
          setRows(mapped);
          setTrust(null);
          setState(mapped.length ? 'success' : 'empty');
        })
        .catch((e) => {
          if (!a) return;
          setState('error');
          setMsg(userFacingMessage(e, 'Erro ao carregar fila.'));
        });
      return () => {
        a = false;
      };
    }, []),
  );

  const filtered = filter === 'TODOS' ? rows : rows.filter((r: Row) => r.status === filter);

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.bg, padding: tokens.spacing.lg, gap: tokens.spacing.sm }}>
      <Text style={{ fontSize: 24, fontWeight: '800' }}>Dashboard empresa</Text>
      <FeedbackState
        kind="empty"
        message="Trust Score real por empresa: pendência de endpoint no contrato Sprint 1 — valor não exibido."
      />
      {trust === null ? <Text style={{ color: tokens.colors.muted }}>Trust Score: indisponível</Text> : <Text>Trust Score: {trust}</Text>}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {['TODOS', 'PUBLICADO', 'AGUARDANDO_RESPOSTA_EMPRESA', 'EM_NEGOCIACAO'].map((s) => (
          <TouchableOpacity key={s} onPress={() => setFilter(s)} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, backgroundColor: filter === s ? tokens.colors.primary : '#e0e4ec' }}>
            <Text style={{ color: filter === s ? '#fff' : tokens.colors.text, fontSize: 12 }}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {state === 'loading' && <FeedbackState kind="loading" message="A carregar…" />}
      {state === 'error' && <FeedbackState kind="error" message={msg} />}
      {state === 'empty' && <FeedbackState kind="empty" message="Sem casos na fila (dados de demonstração)." />}
      <FlatList
        data={filtered}
        keyExtractor={(item: Row) => item.id}
        renderItem={({ item }: { item: Row }) => (
          <TouchableOpacity style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 }} onPress={() => router.push(`/(consumer)/casos/${item.id}`)}>
            <Text style={{ fontWeight: '700' }}>{item.publicId}</Text>
            <Text style={{ color: tokens.colors.muted }}>{item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
