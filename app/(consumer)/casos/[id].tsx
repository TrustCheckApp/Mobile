import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { mobileApi } from '@/api/mobile-api';
import { userFacingMessage } from '@/api/error-map';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import { useMockApi } from '@/config/env';

export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [state, setState] = useState<'loading' | 'error' | 'success'>('loading');
  const [message, setMessage] = useState('');
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof mobileApi.getCase>> | null>(null);
  const [audit, setAudit] = useState<Awaited<ReturnType<typeof mobileApi.getCaseAudit>> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cid = Array.isArray(id) ? id[0] : id;
    if (!cid) {
      setState('error');
      setMessage('Identificador em falta.');
      return;
    }
    Promise.all([mobileApi.getCase(cid), mobileApi.getCaseAudit(cid).catch(() => null)])
      .then(([d, a]) => {
        if (cancelled) return;
        setDetail(d);
        setAudit(a);
        setState('success');
      })
      .catch((e) => {
        if (cancelled) return;
        setState('error');
        setMessage(userFacingMessage(e, 'Não foi possível carregar o caso.'));
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function rejectNegotiation() {
    const cid = Array.isArray(id) ? id[0] : id;
    if (!cid) return;
    try {
      setState('loading');
      await mobileApi.closeCaseUnresolved(cid, 'Consumidor recusou proposta de acordo (fluxo simplificado).');
      setState('success');
      setMessage('Estado atualizado.');
      const d = await mobileApi.getCase(cid);
      setDetail(d);
    } catch (e) {
      setState('error');
      setMessage(userFacingMessage(e, 'Ação indisponível.'));
    }
  }

  if (!detail && state === 'loading') {
    return (
      <View style={{ flex: 1, padding: tokens.spacing.lg, backgroundColor: tokens.colors.bg }}>
        <FeedbackState kind="loading" message="A carregar detalhe…" />
      </View>
    );
  }

  if (state === 'error' && !detail) {
    return (
      <View style={{ flex: 1, padding: tokens.spacing.lg, backgroundColor: tokens.colors.bg }}>
        <FeedbackState kind="error" message={message} />
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: tokens.colors.primary }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const c = detail!.case;
  const canRejectNegotiation = c.status === 'EM_NEGOCIACAO';

  return (
    <ScrollView contentContainerStyle={{ padding: tokens.spacing.lg, gap: tokens.spacing.md, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>{c.publicId ?? c.id}</Text>
      <Text>Estado: {c.status}</Text>
      <Text>Empresa: {c.company.legalName}</Text>
      <Text>{c.description}</Text>
      {!useMockApi ? (
        <FeedbackState
          kind="empty"
          message="O GET /cases/:id/audit devolve caso + aceite legal, sem lista cronológica no payload atual — use modo mock para timeline de demonstração."
        />
      ) : null}
      <Text style={{ fontWeight: '700' }}>Linha do tempo</Text>
      {detail!.timeline.length ? (
        detail!.timeline.map((row: { at: string; label: string }, idx: number) => (
          <Text key={idx} style={{ color: tokens.colors.muted }}>
            {new Date(row.at).toLocaleString()} — {row.label}
          </Text>
        ))
      ) : audit?.termAcceptance ? (
        <Text style={{ color: tokens.colors.muted }}>Aceite legal registado em {String((audit.termAcceptance as { acceptedAt?: string }).acceptedAt ?? '')}</Text>
      ) : (
        <Text style={{ color: tokens.colors.muted }}>Sem eventos de linha do tempo disponíveis.</Text>
      )}
      <Text style={{ fontWeight: '700' }}>Evidências autorizadas</Text>
      {detail!.evidences.length === 0 ? (
        <Text style={{ color: tokens.colors.muted }}>Sem evidências listadas.</Text>
      ) : (
        detail!.evidences.map((ev: { id: string; fileName: string; status: string }) => (
          <Text key={ev.id} style={{ color: tokens.colors.text }}>
            {ev.fileName} ({ev.status})
          </Text>
        ))
      )}
      <Text style={{ fontWeight: '700' }}>Negociação</Text>
      {detail!.proposals.map((p: { id: string; title: string; status: string }) => (
        <View key={p.id} style={{ padding: 8, backgroundColor: '#fff', borderRadius: 8 }}>
          <Text>{p.title}</Text>
          <Text style={{ fontSize: 12, color: tokens.colors.muted }}>Estado: {p.status}</Text>
        </View>
      ))}
      <TouchableOpacity
        disabled={!canRejectNegotiation}
        onPress={rejectNegotiation}
        style={{ padding: 12, borderRadius: 8, backgroundColor: canRejectNegotiation ? tokens.colors.danger : '#ccc' }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Recusar acordo (encerra como não resolvido)</Text>
      </TouchableOpacity>
      {!canRejectNegotiation ? (
        <Text style={{ fontSize: 12, color: tokens.colors.muted }}>
          Disponível apenas em EM_NEGOCIACAO, conforme POST /cases/:id/close-unresolved (consumidor).
        </Text>
      ) : null}
      <TouchableOpacity disabled style={{ padding: 12, borderRadius: 8, backgroundColor: '#e0e4ec' }}>
        <Text style={{ textAlign: 'center' }}>Aceitar resolução (POST /cases/:id/resolve — requer confirmações; hoje só admin no contrato)</Text>
      </TouchableOpacity>
      {state === 'error' && detail ? <FeedbackState kind="error" message={message} /> : null}
      {state === 'success' && message && detail ? <FeedbackState kind="success" message={message} /> : null}
    </ScrollView>
  );
}
