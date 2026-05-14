import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import { validateCompanyStep } from '@/wizard/report-wizard';

export default function WizardStep1() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState('');
  const [error, setError] = useState('');

  function next() {
    const validation = validateCompanyStep(companyId);
    if (!validation.valid) {
      setError(validation.message ?? 'Empresa inválida.');
      return;
    }

    setError('');
    router.push({ pathname: '/(consumer)/wizard-step2', params: { companyId: companyId.trim() } });
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Nova denúncia — etapa 1</Text>
      <Text style={{ color: tokens.colors.muted }}>Informe a empresa relacionada ao caso para iniciar o fluxo.</Text>
      <TextInput
        placeholder="ID da empresa"
        value={companyId}
        onChangeText={setCompanyId}
        autoCapitalize="none"
        style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }}
      />
      <TouchableOpacity onPress={next} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Avançar</Text>
      </TouchableOpacity>
      {error ? <FeedbackState kind="error" message={error} /> : null}
    </View>
  );
}
