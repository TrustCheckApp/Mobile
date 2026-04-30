import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { mobileApi } from '@/api/mobile-api';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';

export default function WizardStep4() {
  const { companyId, description } = useLocalSearchParams<{ companyId: string; description: string }>();
  const [term, setTerm] = useState<any>(null);
  const [accepted, setAccepted] = useState(false);
  const [kind, setKind] = useState<'loading' | 'error' | 'success'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    mobileApi
      .getActiveTerm()
      .then((data) => {
        setTerm(data);
        setKind('success');
      })
      .catch((error) => {
        setKind('error');
        setMessage(String(error));
      });
  }, []);

  async function finish() {
    if (!accepted || !term) {
      setKind('error');
      setMessage('Aceite do termo legal é obrigatório.');
      return;
    }

    try {
      setKind('loading');
      await mobileApi.openCase({
        companyId: String(companyId),
        experienceType: 'reclamacao',
        category: 'ecommerce',
        description: String(description),
        occurredAt: '2026-04-30',
        legalAcceptance: { termId: term.id, contentHashEcho: term.contentHash },
      });
      setKind('success');
      setMessage('Caso enviado com sucesso.');
    } catch (error) {
      setKind('error');
      setMessage(String(error));
    }
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Wizard • Etapa 4 (Termo Legal)</Text>
      {term ? <Text>{term.content}</Text> : <Text>Carregando termo...</Text>}
      <TouchableOpacity onPress={() => setAccepted((v) => !v)} style={{ backgroundColor: accepted ? '#1f7a45' : '#a0a6b2', padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>{accepted ? 'Termo aceito' : 'Aceitar termo'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={finish} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Fechar caso</Text>
      </TouchableOpacity>
      {kind !== 'success' || message ? <FeedbackState kind={kind === 'loading' ? 'loading' : kind === 'error' ? 'error' : 'success'} message={message || 'Pronto para envio'} /> : null}
    </View>
  );
}
