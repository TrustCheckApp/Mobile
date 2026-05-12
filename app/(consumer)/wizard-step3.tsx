import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import { useWizard } from '@/wizard/WizardProvider';

export default function WizardStep3() {
  const router = useRouter();
  const { companyId, description } = useLocalSearchParams<{ companyId: string; description: string }>();
  const { setEvidenceDrafts } = useWizard();
  const [fileName, setFileName] = useState('evidencia.jpg');
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [sizeBytes, setSizeBytes] = useState('2048');
  const [note, setNote] = useState('');
  const [kind, setKind] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  function next() {
    setKind('loading');
    const n = Number(sizeBytes);
    if (!fileName.trim() || !Number.isFinite(n) || n < 1) {
      setKind('error');
      setMessage('Informe nome do arquivo e tamanho valido em bytes.');
      return;
    }
    setEvidenceDrafts([
      {
        fileName: fileName.trim(),
        mimeType: mimeType.trim() || 'application/octet-stream',
        sizeBytes: n,
        description: note.trim() || undefined,
      },
    ]);
    setKind('success');
    setMessage(
      'Metadados guardados. O envio usa POST /cases/:id/evidences/upload-url e confirmacao em POST /cases/:id/evidences.',
    );
    router.push({ pathname: '/(consumer)/wizard-step4', params: { companyId, description } });
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Wizard - Etapa 3 (Evidencias)</Text>
      <Text style={{ color: tokens.colors.muted }}>
        Apos criar o caso, a API solicita URL assinada em POST /cases/{'{caseId}'}/evidences/upload-url e confirma
        metadata em POST /cases/{'{caseId}'}/evidences.
      </Text>
      <TextInput placeholder="Nome do arquivo" value={fileName} onChangeText={setFileName} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="MIME (ex: image/jpeg)" value={mimeType} onChangeText={setMimeType} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Tamanho (bytes)" value={sizeBytes} onChangeText={setSizeBytes} keyboardType="numeric" style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Nota opcional" value={note} onChangeText={setNote} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TouchableOpacity onPress={next} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Guardar e avancar</Text>
      </TouchableOpacity>
      {kind !== 'idle' ? <FeedbackState kind={kind === 'loading' ? 'loading' : kind === 'error' ? 'error' : 'success'} message={message} /> : null}
    </View>
  );
}
