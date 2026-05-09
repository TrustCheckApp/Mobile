import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import { useCaseWizard } from '@/features/cases/useCaseWizard';
import { mobileApi } from '@/api/mobile-api';
import { USE_MOCKS } from '@/api/axios-client';

export default function WizardStep1() {
  const router = useRouter();
  const { data, setTargetCompany, setStep, validateStep } = useCaseWizard();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string; cnpj: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch() {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      if (USE_MOCKS) {
        // Mock search results
        setSearchResults([
          { id: '1', name: 'Empresa Exemplo Ltda', cnpj: '12.345.678/0001-90' },
          { id: '2', name: 'Outra Empresa SA', cnpj: '98.765.432/0001-10' },
        ]);
      } else {
        // Real API call - for now using a placeholder endpoint
        const response = await mobileApi.cases.get('search-placeholder');
        setSearchResults([]);
      }
    } catch (err) {
      setError('Erro ao buscar empresas');
    } finally {
      setIsSearching(false);
    }
  }

  function handleSelectCompany(id: string, name: string) {
    setTargetCompany(id, name);
    setSearchQuery(name);
    setSearchResults([]);
  }

  function next() {
    if (!validateStep(1)) {
      setError('Selecione uma empresa para avançar.');
      return;
    }
    setError('');
    setStep(2);
    router.push('/(consumer)/wizard-step2');
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Wizard • Etapa 1</Text>
      <Text style={{ fontSize: 14, color: '#666' }}>Selecione a empresa-alvo da denúncia</Text>
      
      <TextInput
        placeholder="Buscar empresa por nome ou CNPJ"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }}
      />
      
      {isSearching && <FeedbackState kind="loading" message="Buscando..." />}
      
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: 200 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectCompany(item.id, item.name)}
              style={{
                backgroundColor: '#fff',
                padding: 12,
                borderRadius: 8,
                marginBottom: 8,
                borderWidth: data.targetCompanyId === item.id ? 2 : 0,
                borderColor: tokens.colors.primary,
              }}
            >
              <Text style={{ fontWeight: '600' }}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>{item.cnpj}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      
      <TouchableOpacity onPress={next} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Avançar</Text>
      </TouchableOpacity>
      
      {error ? <FeedbackState kind="error" message={error} /> : null}
    </View>
  );
}
