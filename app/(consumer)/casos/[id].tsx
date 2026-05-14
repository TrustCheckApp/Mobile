import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { mobileApi } from '@/api/mobile-api';
import { userFacingMessage } from '@/api/error-map';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import {
  canConsumerRejectNegotiation,
  formatCaseStatus,
  formatCaseUpdatedAt,
  getCasePrimaryActionLabel,
} from '@/cases/case-ui';

export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [state, setState] = useState<'loading' | 'error' | 'success'>('loading');
  const [message, setMessage] = useState('');
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof mobileApi.getCase>> | null>(null);
  const [audit, setAudit] = useState<Awaited<ReturnType<typeof mobileApi.getCaseAudit>> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const caseId = Array.isArray(id) ? id[0] : id;

    if (!caseId) {
      setState('error');
      setMessage('Identificador do caso não informado.');
      return;
    }

    setState('loading');
    Promise.all([mobileApi.getCase(caseId), mobileApi.getCaseAudit(caseId).catch(() => null)])
      .then(([caseDetail, caseAudit]) => {
        if (cancelled) return;
        setDetail(caseDetail);
        setAudit(caseAudit);
        setState('success');
      })
      .catch((error) => {
        if (cancelled) return;
        setState('error');
        setMessage(userFacingMessage(error, 'Não foi possível carregar o caso.'));
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function rejectNegotiation() {
    const caseId = Array.isArray(id) ? id[0] : id;
    if (!caseId) return;

    try {
      setState('loading');
      await mobileApi.closeCaseUnresolved(caseId, 'Consumidor recusou proposta de acordo.');
      const updatedDetail = await mobileApi.getCase(caseId);
      setDetail(updatedDetail);
      setMessage('Caso encerrado como não resolvido.');
      setState('success');
    } catch (error) {
      setState('error');
      setMessage(userFacingMessage(error, 'Ação indisponível no momento.'));
    }
  }

  if (!detail && state === 'loading') {
    return (
      <View style={{ flex: 1, padding: tokens.spacing.lg, backgroundColor: tokens.colors.bg }}>
        <FeedbackState kind="loading" message="Carregando detalhe do caso..." />
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

  const currentCase = detail!.case;
  const canRejectNegotiation = canConsumerRejectNegotiation(currentCase.status);

  return (
    <ScrollView contentContainerStyle={{ padding: tokens.spacing.lg, gap: tokens.spacing.md, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>{currentCase.publicId ?? currentCase.id}</Text>
      <Text>Status: {formatCaseStatus(currentCase.status)}</Text>
      <Text>Empresa: {currentCase.company.legalName}</Text>
      <Text>{currentCase.description}</Text>

      <Text style={{ fontWeight: '700' }}>Linha do tempo</Text>
      {detail!.timeline.length ? (
        detail!.timeline.map((row: { at: string; label: string }, idx: number) => (
          <Text key={`${row.at}-${idx}`} style={{ color: tokens.colors.muted }}>
            {formatCaseUpdatedAt(row.at)} — {row.label}
          </Text>
        ))
      ) : audit?.termAcceptance ? (
        <Text style={{ color: tokens.colors.muted }}>
          Aceite legal registrado em {formatCaseUpdatedAt((audit.termAcceptance as { acceptedAt?: string }).acceptedAt)}.
        </Text>
      ) : (
        <Text style={{ color: tokens.colors.muted }}>Ainda não há eventos de timeline disponíveis para este caso.</Text>
      )}

      <Text style={{ fontWeight: '700' }}>Evidências autorizadas</Text>
      {detail!.evidences.length === 0 ? (
        <Text style={{ color: tokens.colors.muted }}>Nenhuma evidência listada.</Text>
      ) : (
        detail!.evidences.map((evidence: { id: string; fileName: string; status: string }) => (
          <Text key={evidence.id} style={{ color: tokens.colors.text }}>
            {evidence.fileName} ({formatCaseStatus(evidence.status)})
          </Text>
        ))
      )}

      <Text style={{ fontWeight: '700' }}>Negociação</Text>
      {detail!.proposals.length === 0 ? (
        <Text style={{ color: tokens.colors.muted }}>Nenhuma proposta registrada para este caso.</Text>
      ) : (
        detail!.proposals.map((proposal: { id: string; title: string; status: string }) => (
          <View key={proposal.id} style={{ padding: 8, backgroundColor: '#fff', borderRadius: 8 }}>
            <Text>{proposal.title}</Text>
            <Text style={{ fontSize: 12, color: tokens.colors.muted }}>Status: {formatCaseStatus(proposal.status)}</Text>
          </View>
        ))
      )}

      <Text style={{ fontWeight: '700' }}>Ações do consumidor</Text>
      <Text style={{ color: tokens.colors.muted }}>{getCasePrimaryActionLabel(currentCase.status)}</Text>
      <TouchableOpacity
        disabled={!canRejectNegotiation || state === 'loading'}
        onPress={rejectNegotiation}
        style={{
          padding: 12,
          borderRadius: 8,
          backgroundColor: canRejectNegotiation ? tokens.colors.danger : '#ccc',
        }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Recusar acordo</Text>
      </TouchableOpacity>
      {!canRejectNegotiation ? (
        <Text style={{ fontSize: 12, color: tokens.colors.muted }}>
          A recusa de acordo fica disponível apenas quando o caso está em negociação.
        </Text>
      ) : null}

      {state === 'loading' && detail ? <FeedbackState kind="loading" message="Atualizando caso..." /> : null}
      {state === 'error' && detail ? <FeedbackState kind="error" message={message} /> : null}
      {state === 'success' && message ? <FeedbackState kind="success" message={message} /> : null}
    </ScrollView>
  );
}
