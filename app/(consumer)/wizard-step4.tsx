import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { mobileApi } from '@/api/mobile-api';
import { userFacingMessage } from '@/api/error-map';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import { useWizard } from '@/wizard/WizardProvider';
import {
  buildOpenCasePayload,
  normalizeWizardParam,
  validateCompanyStep,
  validateDescriptionStep,
  validateLegalAcceptance,
  type ActiveLegalTerm,
} from '@/wizard/report-wizard';

export default function WizardStep4() {
  const router = useRouter();
  const params = useLocalSearchParams<{ companyId: string; description: string }>();
  const companyId = normalizeWizardParam(params.companyId);
  const description = normalizeWizardParam(params.description);
  const { evidenceDrafts, clear } = useWizard();
  const [term, setTerm] = useState<(ActiveLegalTerm & { version?: string; content?: string }) | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [kind, setKind] = useState<'loading' | 'error' | 'success' | 'idle'>('loading');
  const [message, setMessage] = useState('');
  const [publicId, setPublicId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    mobileApi
      .getActiveTerm()
      .then((data) => {
        if (cancelled) return;
        setTerm(data);
        setKind('idle');
      })
      .catch((error) => {
        if (cancelled) return;
        setKind('error');
        setMessage(userFacingMessage(error, 'Não foi possível carregar o termo legal.'));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function finish() {
    const companyValidation = validateCompanyStep(companyId);
    if (!companyValidation.valid) {
      setKind('error');
      setMessage(companyValidation.message ?? 'Empresa inválida.');
      return;
    }

    const descriptionValidation = validateDescriptionStep(description);
    if (!descriptionValidation.valid) {
      setKind('error');
      setMessage(descriptionValidation.message ?? 'Descrição inválida.');
      return;
    }

    const legalValidation = validateLegalAcceptance(accepted, term);
    if (!legalValidation.valid) {
      setKind('error');
      setMessage(legalValidation.message ?? 'Aceite legal inválido.');
      return;
    }

    try {
      setKind('loading');
      const created = await mobileApi.openCase(
        buildOpenCasePayload({
          companyId,
          description,
          term: term!,
        }),
      );
      setPublicId(created.publicId ?? created.id);

      for (const evidence of evidenceDrafts) {
        try {
          await mobileApi.registerCaseEvidence(created.id, evidence);
        } catch {
          // Evidência é opcional no fluxo atual; falha individual não deve bloquear o caso criado.
        }
      }

      clear();
      setKind('success');
      setMessage('Denúncia enviada com sucesso. Acompanhe o andamento em Meus Casos.');
    } catch (error) {
      setKind('error');
      setMessage(userFacingMessage(error, 'Falha ao criar o caso.'));
    }
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Nova denúncia — etapa 4</Text>
      <Text style={{ color: tokens.colors.muted }}>Revise o termo legal e confirme o envio da denúncia.</Text>
      {term ? <Text>{term.content ?? `Termo legal ativo: ${term.id}`}</Text> : <Text>Carregando termo...</Text>}
      <Text style={{ color: tokens.colors.muted, fontSize: 12 }}>Evidências preparadas: {evidenceDrafts.length}</Text>
      <TouchableOpacity onPress={() => setAccepted((value: boolean) => !value)} style={{ backgroundColor: accepted ? '#1f7a45' : '#a0a6b2', padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>{accepted ? 'Termo aceito' : 'Aceitar termo'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={finish} disabled={kind === 'loading'} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Submeter denúncia</Text>
      </TouchableOpacity>
      {publicId ? (
        <TouchableOpacity onPress={() => router.push('/(consumer)/meus-casos')} style={{ padding: 12, borderRadius: 8, borderWidth: 1, borderColor: tokens.colors.primary }}>
          <Text style={{ textAlign: 'center', fontWeight: '700' }}>ID público: {publicId} — ver Meus Casos</Text>
        </TouchableOpacity>
      ) : null}
      {kind !== 'idle' ? <FeedbackState kind={kind === 'loading' ? 'loading' : kind === 'error' ? 'error' : 'success'} message={message || 'Carregando...'} /> : null}
    </View>
  );
}
