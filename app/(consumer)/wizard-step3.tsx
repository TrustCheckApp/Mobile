import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View, FlatList } from 'react-native';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import { useCaseWizard } from '@/features/cases/useCaseWizard';
import { useMediaUpload } from '@/features/media/useMediaUpload';

export default function WizardStep3() {
  const router = useRouter();
  const { data, addEvidence, removeEvidence, updateEvidenceStatus, setStep } = useCaseWizard();
  const { uploadMedia, isUploading } = useMediaUpload();
  const [error, setError] = useState('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  async function handleAddEvidence() {
    setError('');
    // Mock file selection - in real app would use expo-document-picker
    const mockFile = {
      id: Date.now().toString(),
      uri: 'file://mock-evidence.jpg',
      name: `evidencia-${data.evidenceFiles.length + 1}.jpg`,
      type: 'image/jpeg',
      size: 1024,
      uploaded: false,
    };

    addEvidence(mockFile);
    setUploadingId(mockFile.id);

    try {
      const result = await uploadMedia(mockFile.uri, mockFile.name, mockFile.type, mockFile.size);
      updateEvidenceStatus(mockFile.id, true, result.url);
    } catch (err) {
      setError('Erro ao fazer upload. Tente novamente.');
      updateEvidenceStatus(mockFile.id, false);
    } finally {
      setUploadingId(null);
    }
  }

  async function handleRetryUpload(fileId: string) {
    const file = data.evidenceFiles.find(f => f.id === fileId);
    if (!file) return;

    setUploadingId(fileId);
    setError('');

    try {
      const result = await uploadMedia(file.uri, file.name, file.type, file.size);
      updateEvidenceStatus(fileId, true, result.url);
    } catch (err) {
      setError('Erro ao fazer upload. Tente novamente.');
    } finally {
      setUploadingId(null);
    }
  }

  function next() {
    setError('');
    setStep(4);
    router.push('/(consumer)/wizard-step4');
  }

  function back() {
    router.back();
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Wizard • Etapa 3</Text>
      <Text style={{ fontSize: 14, color: '#666' }}>Adicione evidências (opcional)</Text>
      
      <TouchableOpacity
        onPress={handleAddEvidence}
        disabled={isUploading}
        style={{
          backgroundColor: isUploading ? '#ccc' : tokens.colors.primary,
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          {isUploading ? 'Carregando...' : '+ Adicionar evidência'}
        </Text>
      </TouchableOpacity>
      
      {data.evidenceFiles.length > 0 && (
        <FlatList
          data={data.evidenceFiles}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: 200 }}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                <Text style={{ fontSize: 12, color: item.uploaded ? '#10b981' : '#f59e0b' }}>
                  {item.uploaded ? '✓ Upload concluído' : '⏳ Pendente'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {!item.uploaded && (
                  <TouchableOpacity
                    onPress={() => handleRetryUpload(item.id)}
                    disabled={uploadingId === item.id}
                    style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#f59e0b', borderRadius: 8 }}
                  >
                    <Text style={{ color: '#fff', fontSize: 12 }}>
                      {uploadingId === item.id ? '...' : 'Retry'}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => removeEvidence(item.id)}
                  style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#dc2626', borderRadius: 8 }}
                >
                  <Text style={{ color: '#fff', fontSize: 12 }}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity onPress={back} style={{ flex: 1, backgroundColor: '#ccc', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: '#000', textAlign: 'center' }}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={next} style={{ flex: 1, backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>Avançar</Text>
        </TouchableOpacity>
      </View>
      
      {error ? <FeedbackState kind="error" message={error} /> : null}
    </View>
  );
}
