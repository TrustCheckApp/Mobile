import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { mobileApi } from '@/api/mobile-api';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';

export default function WizardStep3() {
  const router = useRouter();
  const { companyId, description } = useLocalSearchParams<{ companyId: string; description: string }>();
  const [fileName, setFileName] = useState('evidencia.jpg');
  const [kind, setKind] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  async function next() {
    try {
      setKind('loading');
      await mobileApi.getSignedUpload({
        caseId: 'draft-case',
        evidenceType: 'image',
        fileName,
        contentType: 'image/jpeg',
        contentLength: 1024,
      });
      setKind('success');
      setMessage('Upload validado.');
      router.push({ pathname: '/(consumer)/wizard-step4', params: { companyId, description } });
    } catch (error) {
      setKind('error');
      setMessage(String(error));
    }
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Wizard • Etapa 3 (Provas)</Text>
      <TextInput placeholder="Nome do arquivo" value={fileName} onChangeText={setFileName} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TouchableOpacity onPress={next} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}><Text style={{ color: '#fff', textAlign: 'center' }}>Validar upload</Text></TouchableOpacity>
      {kind !== 'idle' ? <FeedbackState kind={kind === 'loading' ? 'loading' : kind === 'error' ? 'error' : 'success'} message={message} /> : null}
    </View>
  );
}
