import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import { useCaseWizard } from '@/features/cases/useCaseWizard';
import type { OpenCaseInput } from '@/api/types';

export default function WizardStep2() {
  const router = useRouter();
  const { data, setDescription, setStep, validateStep } = useCaseWizard();
  const [description, setDescriptionLocal] = useState(data.description);
  const [category, setCategory] = useState<OpenCaseInput['category']>(data.category);
  const [experienceType, setExperienceType] = useState<OpenCaseInput['experienceType']>(data.experienceType);
  const [occurredAt, setOccurredAt] = useState(data.occurredAt.split('T')[0]);
  const [error, setError] = useState('');

  function next() {
    if (!validateStep(2)) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    
    setDescription(description, category, experienceType, new Date(occurredAt).toISOString());
    setError('');
    setStep(3);
    router.push('/(consumer)/wizard-step3');
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Wizard • Etapa 2</Text>
      <Text style={{ fontSize: 14, color: '#666' }}>Descreva o caso e selecione a categoria</Text>
      
      <Text style={{ fontWeight: '600' }}>Tipo de experiência</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {(['reclamacao', 'denuncia', 'elogio', 'duvida_resolvida'] as OpenCaseInput['experienceType'][]).map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setExperienceType(type)}
            style={{
              backgroundColor: experienceType === type ? tokens.colors.primary : '#fff',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#ddd',
            }}
          >
            <Text style={{ color: experienceType === type ? '#fff' : '#000' }}>
              {type === 'reclamacao' ? 'Reclamação' : type === 'denuncia' ? 'Denúncia' : type === 'elogio' ? 'Elogio' : 'Dúvida resolvida'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={{ fontWeight: '600' }}>Categoria</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {(['imoveis', 'servicos', 'ecommerce', 'financeiro', 'saude', 'educacao', 'outro'] as OpenCaseInput['category'][]).map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategory(cat)}
            style={{
              backgroundColor: category === cat ? tokens.colors.primary : '#fff',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#ddd',
            }}
          >
            <Text style={{ color: category === cat ? '#fff' : '#000' }}>
              {cat === 'imoveis' ? 'Imóveis' : cat === 'servicos' ? 'Serviços' : cat === 'ecommerce' ? 'E-commerce' : cat === 'financeiro' ? 'Financeiro' : cat === 'saude' ? 'Saúde' : cat === 'educacao' ? 'Educação' : 'Outro'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={{ fontWeight: '600' }}>Data do ocorrido</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        value={occurredAt}
        onChangeText={setOccurredAt}
        style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }}
      />
      
      <Text style={{ fontWeight: '600' }}>Descrição</Text>
      <TextInput
        multiline
        numberOfLines={6}
        placeholder="Descreva o caso (mínimo 50 caracteres)"
        value={description}
        onChangeText={setDescriptionLocal}
        style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, textAlignVertical: 'top' }}
      />
      
      <TouchableOpacity onPress={next} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Avançar</Text>
      </TouchableOpacity>
      
      {error ? <FeedbackState kind="error" message={error} /> : null}
    </View>
  );
}
