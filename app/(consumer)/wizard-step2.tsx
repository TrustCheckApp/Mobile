import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import { normalizeWizardParam, validateCompanyStep, validateDescriptionStep } from '@/wizard/report-wizard';

export default function WizardStep2() {
  const router = useRouter();
  const params = useLocalSearchParams<{ companyId: string }>();
  const companyId = normalizeWizardParam(params.companyId);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  function next() {
    const companyValidation = validateCompanyStep(companyId);
    if (!companyValidation.valid) {
      setError(companyValidation.message ?? 'Empresa inválida.');
      return;
    }

    const descriptionValidation = validateDescriptionStep(description);
    if (!descriptionValidation.valid) {
      setError(descriptionValidation.message ?? 'Descrição inválida.');
      return;
    }

    setError('');
    router.push({
      pathname: '/(consumer)/wizard-step3',
      params: { companyId, description: description.trim() },
    });
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Nova denúncia — etapa 2</Text>
      <Text style={{ color: tokens.colors.muted }}>Empresa selecionada: {companyId || 'não informada'}</Text>
      <Text>Descreva o ocorrido com detalhes suficientes para análise e moderação.</Text>
      <TextInput
        multiline
        numberOfLines={6}
        placeholder="Descreva o caso"
        value={description}
        onChangeText={setDescription}
        style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, textAlignVertical: 'top' }}
      />
      <Text style={{ color: tokens.colors.muted, fontSize: 12 }}>{description.trim().length}/50 caracteres mínimos</Text>
      <TouchableOpacity onPress={next} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Avançar</Text>
      </TouchableOpacity>
      {error ? <FeedbackState kind="error" message={error} /> : null}
    </View>
  );
}
