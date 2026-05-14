import { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { tokens } from '@/theme/tokens';
import { FeedbackState } from '@/components/FeedbackState';
import { mobileApi } from '@/api/mobile-api';
import { userFacingMessage } from '@/api/error-map';
import {
  countCompanyCasesByStatus,
  filterCompanyCasesByStatus,
  formatCompanyCaseStatus,
  formatCompanyCaseUpdatedAt,
  getCompanyCasePrimaryActionLabel,
  getCompanyCaseStatusFilters,
  getCompanyCasesEmptyMessage,
  getCompanyCasesErrorMessage,
  type CompanyCaseListRow,
} from '@/company-cases/company-cases-ui';

type Row = CompanyCaseListRow;

export default function CompanyDashboardScreen() {
  const [filter, setFilter] = useState('TODOS');
  const [rows, setRows] = useState<Row[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'empty' | 'success'>('loading');
  const [message, setMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setState('loading');

      mobileApi
        .listCompanyCases()
        .then((list) => {
          if (!active) return;
          const mapped: Row[] = list.map((item) => ({
            id: item.id,
            publicId: item.publicId ?? item.id,
            status: item.status,
            consumer: item.consumer ?? 'Consumidor',
            companyName: item.companyName,
            updatedAt: item.updatedAt,
          }));
          setRows(mapped);
          setState(mapped.length ? 'success' : 'empty');
        })
        .catch((error) => {
          if (!active) return;
          setState('error');
          setMessage(userFacingMessage(error, getCompanyCasesErrorMessage()));
        });

      return () => {
        active = false;
      };
    }, []),
  );

  const counters = countCompanyCasesByStatus(rows);
  const filters = getCompanyCaseStatusFilters();
  const filteredRows = filterCompanyCasesByStatus(rows, filter);
  const showFilteredEmpty = state === 'success' && filteredRows.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.bg, padding: tokens.spacing.lg, gap: tokens.spacing.sm }}>
      <Text style={{ fontSize: 24, fontWeight: '800' }}>Fila da empresa</Text>
      <Text style={{ color: tokens.colors.muted }}>
        Acompanhe casos recebidos, priorize respostas e identifique negociações em andamento.
      </Text>

      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 10, minWidth: 96 }}>
          <Text style={{ fontWeight: '800', fontSize: 20 }}>{counters.total}</Text>
          <Text style={{ color: tokens.colors.muted, fontSize: 12 }}>Total</Text>
        </View>
        <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 10, minWidth: 132 }}>
          <Text style={{ fontWeight: '800', fontSize: 20 }}>{counters.aguardandoResposta}</Text>
          <Text style={{ color: tokens.colors.muted, fontSize: 12 }}>Aguardando resposta</Text>
        </View>
        <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 10, minWidth: 116 }}>
          <Text style={{ fontWeight: '800', fontSize: 20 }}>{counters.emNegociacao}</Text>
          <Text style={{ color: tokens.colors.muted, fontSize: 12 }}>Em negociação</Text>
        </View>
      </View>

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

      {state === 'loading' && <FeedbackState kind="loading" message="Carregando fila de casos..." />}
      {state === 'error' && <FeedbackState kind="error" message={message} />}
      {state === 'empty' && <FeedbackState kind="empty" message={getCompanyCasesEmptyMessage('TODOS')} />}
      {showFilteredEmpty && <FeedbackState kind="empty" message={getCompanyCasesEmptyMessage(filter)} />}

      <FlatList
        data={state === 'success' ? filteredRows : []}
        keyExtractor={(item: Row) => item.id}
        renderItem={({ item }: { item: Row }) => (
          <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 8, gap: 4 }}>
            <Text style={{ fontWeight: '800' }}>{item.publicId ?? item.id}</Text>
            <Text style={{ color: tokens.colors.muted }}>Status: {formatCompanyCaseStatus(item.status)}</Text>
            <Text style={{ color: tokens.colors.muted }}>Atualizado: {formatCompanyCaseUpdatedAt(item.updatedAt)}</Text>
            <TouchableOpacity disabled style={{ backgroundColor: '#e0e4ec', padding: 10, borderRadius: 8, marginTop: 4 }}>
              <Text style={{ textAlign: 'center', fontWeight: '700' }}>{getCompanyCasePrimaryActionLabel(item.status)}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Text style={{ color: tokens.colors.muted, fontSize: 12 }}>
        O detalhe do caso da empresa será habilitado na próxima etapa da jornada.
      </Text>
    </View>
  );
}
