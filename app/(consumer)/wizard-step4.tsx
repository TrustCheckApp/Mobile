import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { mobileApi } from '@/api/mobile-api';
import { userFacingMessage } from '@/api/error-map';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import { useWizard } from '@/wizard/WizardProvider';

export default function WizardStep4() {
  const router = useRouter();
  const { companyId, description } = useLocalSearchParams<{ companyId: string; description: string }>();
  const { evidenceDrafts, clear } = useWizard();
  const [term, setTerm] = useState<{ id: string; version: string; contentHash: string; content: string } | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [kind, setKind] = useState<'loading' | 'error' | 'success' | 'idle'>('loading');
  const [message, setMessage] = useState('');
  const [publicId, setPublicId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    mobileApi
      .getActiveTerm()
      .then((data) => {
        if (!cancelled) {
          setTerm(data);
          setKind('idle');
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setKind('error');
          setMessage(userFacingMessage(e, 'Não foi possível carregar o termo legal.'));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function finish() {
    if (!accepted || !term) {
      setKind('error');
      setMessage('Aceite do termo legal é obrigatório.');
      return;
    }

    try {
      setKind('loading');
      const created = await mobileApi.openCase({
        companyId: String(companyId),
        experienceType: 'reclamacao',
        category: 'ecommerce',
        description: String(description),
        occurredAt: new Date().toISOString().slice(0, 10),
        legalAcceptance: { termId: term.id, contentHashEcho: term.contentHash },
      });
      setPublicId(created.publicId);

      for (const ev of evidenceDrafts) {
        try {
          await mobileApi.registerCaseEvidence(created.id, ev);
        } catch {
          /* evidência opcional — não bloquear sucesso do caso */
        }
      }
      clear();
      setKind('success');
      setMessage('Caso criado com sucesso.');
    } catch (e) {
      setKind('error');
      setMessage(userFacingMessage(e, 'Falha ao criar o caso.'));
    }
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Wizard • Etapa 4 (Termo + envio)</Text>
      {term ? <Text>{term.content}</Text> : <Text>A carregar termo…</Text>}
      <TouchableOpacity onPress={() => setAccepted((v: boolean) => !v)} style={{ backgroundColor: accepted ? '#1f7a45' : '#a0a6b2', padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>{accepted ? 'Termo aceite' : 'Aceitar termo'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={finish} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Submeter caso</Text>
      </TouchableOpacity>
      {publicId ? (
        <TouchableOpacity onPress={() => router.push('/(consumer)/meus-casos')} style={{ padding: 12, borderRadius: 8, borderWidth: 1, borderColor: tokens.colors.primary }}>
          <Text style={{ textAlign: 'center', fontWeight: '700' }}>ID público: {publicId} — ver Meus casos</Text>
        </TouchableOpacity>
      ) : null}
      {kind !== 'idle' ? <FeedbackState kind={kind === 'loading' ? 'loading' : kind === 'error' ? 'error' : 'success'} message={message} /> : null}
    </View>
  );
}
