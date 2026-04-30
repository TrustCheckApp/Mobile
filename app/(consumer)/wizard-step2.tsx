import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';

export default function WizardStep2() {
  const router = useRouter();
  const { companyId } = useLocalSearchParams<{ companyId: string }>();
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  function next() {
    if (description.trim().length < 50) {
      setError('Descrição deve ter no mínimo 50 caracteres.');
      return;
    }
    setError('');
    router.push({ pathname: '/(consumer)/wizard-step3', params: { companyId, description } });
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Wizard • Etapa 2</Text>
      <Text>ID empresa: {companyId}</Text>
      <TextInput multiline numberOfLines={6} placeholder="Descreva o caso" value={description} onChangeText={setDescription} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, textAlignVertical: 'top' }} />
      <TouchableOpacity onPress={next} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}><Text style={{ color: '#fff', textAlign: 'center' }}>Avançar</Text></TouchableOpacity>
      {error ? <FeedbackState kind="error" message={error} /> : null}
    </View>
  );
}
