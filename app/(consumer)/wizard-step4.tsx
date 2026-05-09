import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { mobileApi } from '@/api/mobile-api';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import { useCaseWizard } from '@/features/cases/useCaseWizard';
import { USE_MOCKS } from '@/api/axios-client';

export default function WizardStep4() {
  const router = useRouter();
  const { data, setImpactAnswers, setLegalTerms, resetWizard, validateStep } = useCaseWizard();
  const [term, setTerm] = useState<any>(null);
  const [accepted, setAccepted] = useState(false);
  const [kind, setKind] = useState<'loading' | 'error' | 'success'>('loading');
  const [message, setMessage] = useState('');
  const [publicId, setPublicId] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCKS) {
      setTerm({
        id: 'term-1',
        version: '1.0.0',
        content: 'Declaro que as informações fornecidas são verdadeiras e autorizo o processamento deste caso.',
        contentHash: 'mock-hash-123',
      });
      setKind('success');
    } else {
      mobileApi.cases.get('active-term-placeholder')
        .then((response) => {
          setTerm(response.data);
          setKind('success');
        })
        .catch((error) => {
          setKind('error');
          setMessage(String(error));
        });
    }
  }, []);

  async function finish() {
    if (!validateStep(4)) {
      setKind('error');
      setMessage('Aceite do termo legal é obrigatório.');
      return;
    }

    setLegalTerms(accepted, term?.version || '1.0.0', term?.id || '', term?.contentHash || '');
    
    try {
      setKind('loading');
      setMessage('Enviando caso...');
      
      const payload = {
        companyId: data.targetCompanyId,
        experienceType: data.experienceType,
        category: data.category,
        description: data.description,
        occurredAt: data.occurredAt,
        legalAcceptance: {
          termId: data.legalTermId,
          contentHashEcho: data.legalContentHash,
        },
      };

      if (USE_MOCKS) {
        setPublicId('TC-2025-00123');
        setMessage('Caso enviado com sucesso.');
        setKind('success');
      } else {
        const response = await mobileApi.cases.create(payload);
        setPublicId(response.data.id || 'TC-2025-00123');
        setMessage('Caso enviado com sucesso.');
        setKind('success');
      }
    } catch (error) {
      setKind('error');
      setMessage(String(error));
    }
  }

  function goToSuccess() {
    resetWizard();
    router.push({
      pathname: '/(consumer)/wizard-success',
      params: { publicId: publicId || 'TC-2025-00123' },
    });
  }

  function back() {
    router.back();
  }

  if (kind === 'success' && publicId) {
    return (
      <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.lg, backgroundColor: tokens.colors.bg, justifyContent: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '800', textAlign: 'center' }}>Sucesso!</Text>
        <Text style={{ fontSize: 14, textAlign: 'center', color: '#666' }}>
          Seu caso foi enviado com sucesso.
        </Text>
        <Text style={{ fontSize: 16, textAlign: 'center', fontWeight: '600' }}>
          ID: {publicId}
        </Text>
        
        <TouchableOpacity
          onPress={goToSuccess}
          style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>Ver meus casos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => {
            resetWizard();
            router.push('/(consumer)/wizard-step1');
          }}
          style={{ padding: 12 }}
        >
          <Text style={{ color: tokens.colors.primary, textAlign: 'center', fontSize: 14 }}>
            Nova denúncia
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Wizard • Etapa 4</Text>
      <Text style={{ fontSize: 14, color: '#666' }}>Revise e aceite o termo legal</Text>
      
      <ScrollView style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, maxHeight: 200 }}>
        <Text style={{ fontSize: 12 }}>
          {term ? term.content : 'Carregando termo...'}
        </Text>
      </ScrollView>
      
      <TouchableOpacity
        onPress={() => setAccepted(!accepted)}
        style={{
          backgroundColor: accepted ? '#1f7a45' : '#a0a6b2',
          padding: 12,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
          {accepted && <Text style={{ color: '#1f7a45', fontWeight: 'bold' }}>✓</Text>}
        </View>
        <Text style={{ color: '#fff' }}>Li e aceito o termo legal (versão {term?.version || '1.0.0'})</Text>
      </TouchableOpacity>
      
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity onPress={back} style={{ flex: 1, backgroundColor: '#ccc', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: '#000', textAlign: 'center' }}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={finish}
          disabled={!accepted || kind === 'loading'}
          style={{
            flex: 1,
            backgroundColor: (!accepted || kind === 'loading') ? '#ccc' : tokens.colors.primary,
            padding: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            {kind === 'loading' ? 'Enviando...' : 'Enviar caso'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {message && <FeedbackState kind={kind === 'loading' ? 'loading' : kind === 'error' ? 'error' : 'success'} message={message} />}
    </View>
  );
}
