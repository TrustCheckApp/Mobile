import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import { useWizard } from '@/wizard/WizardProvider';
import {
  buildEvidenceDraft,
  formatBytes,
  normalizeWizardParam,
  validateCompanyStep,
  validateDescriptionStep,
  validateEvidenceDraft,
} from '@/wizard/report-wizard';

export default function WizardStep3() {
  const router = useRouter();
  const params = useLocalSearchParams<{ companyId: string; description: string }>();
  const companyId = normalizeWizardParam(params.companyId);
  const description = normalizeWizardParam(params.description);
  const { setEvidenceDrafts } = useWizard();
  const [fileName, setFileName] = useState('evidencia.jpg');
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [sizeBytes, setSizeBytes] = useState('2048');
  const [note, setNote] = useState('');
  const [kind, setKind] = useState<'idle' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  function next() {
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

    const evidenceValidation = validateEvidenceDraft({ fileName, mimeType, sizeBytes });
    if (!evidenceValidation.valid) {
      setKind('error');
      setMessage(evidenceValidation.message ?? 'Evidência inválida.');
      return;
    }

    setEvidenceDrafts([buildEvidenceDraft({ fileName, mimeType, sizeBytes, description: note })]);
    setKind('success');
    setMessage('Metadados da evidência salvos para registro após a criação do caso.');
    router.push({ pathname: '/(consumer)/wizard-step4', params: { companyId, description } });
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Nova denúncia — etapa 3</Text>
      <Text style={{ color: tokens.colors.muted }}>
        Anexe metadados de uma evidência. O envio binário real será tratado pelo fluxo de URL assinada.
      </Text>
      <Text style={{ color: tokens.colors.muted, fontSize: 12 }}>
        Limites atuais: imagens até {formatBytes(10 * 1024 * 1024)}, PDFs até {formatBytes(20 * 1024 * 1024)} e vídeos até {formatBytes(50 * 1024 * 1024)}.
      </Text>
      <TextInput placeholder="Nome do arquivo" value={fileName} onChangeText={setFileName} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="MIME (ex: image/jpeg)" value={mimeType} onChangeText={setMimeType} autoCapitalize="none" style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Tamanho (bytes)" value={sizeBytes} onChangeText={setSizeBytes} keyboardType="numeric" style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Nota opcional" value={note} onChangeText={setNote} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TouchableOpacity onPress={next} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Guardar e avançar</Text>
      </TouchableOpacity>
      {kind !== 'idle' ? <FeedbackState kind={kind} message={message} /> : null}
    </View>
  );
}
