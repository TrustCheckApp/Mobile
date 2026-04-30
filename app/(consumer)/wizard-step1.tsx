import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';

export default function WizardStep1() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState('');
  const [error, setError] = useState('');

  function next() {
    if (!companyId.trim()) {
      setError('Empresa é obrigatória para avançar.');
      return;
    }
    setError('');
    router.push({ pathname: '/(consumer)/wizard-step2', params: { companyId } });
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Wizard • Etapa 1</Text>
      <TextInput placeholder="ID da empresa" value={companyId} onChangeText={setCompanyId} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TouchableOpacity onPress={next} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}><Text style={{ color: '#fff', textAlign: 'center' }}>Avançar</Text></TouchableOpacity>
      {error ? <FeedbackState kind="error" message={error} /> : null}
    </View>
  );
}
