import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCompanyAuth } from '@/features/auth/useCompanyAuth';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import { formatCNPJ, isValidCNPJ, getCNPJError } from '@/utils/cnpj';

export default function CompanyRegisterScreen() {
  const { registerCompany } = useCompanyAuth();
  const [legalName, setLegalName] = useState('');
  const [fullName, setFullName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [kind, setKind] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');
  const [cnpjError, setCnpjError] = useState<string | null>(null);

  function handleCnpjChange(value: string) {
    const formatted = formatCNPJ(value);
    setCnpj(formatted);
    
    const error = getCNPJError(formatted);
    setCnpjError(error);
  }

  async function handleRegister() {
    if (cnpjError) {
      setKind('error');
      setMessage(cnpjError);
      return;
    }

    if (!isValidCNPJ(cnpj)) {
      setKind('error');
      setMessage('CNPJ inválido');
      return;
    }

    try {
      setKind('loading');
      await registerCompany(email, password, cnpj, legalName, fullName, []);
      setKind('success');
      setMessage('Cadastro iniciado. Verifique o status do claim.');
    } catch (error) {
      setKind('error');
      setMessage(String(error));
    }
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Cadastro Empresa</Text>
      <TextInput 
        placeholder="Razão Social" 
        value={legalName} 
        onChangeText={setLegalName} 
        style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} 
      />
      <TextInput 
        placeholder="Responsável" 
        value={fullName} 
        onChangeText={setFullName} 
        style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} 
      />
      <TextInput 
        placeholder="CNPJ" 
        value={cnpj} 
        onChangeText={handleCnpjChange} 
        style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} 
        keyboardType="number-pad"
      />
      {cnpjError && <Text style={{ color: '#dc2626', fontSize: 12 }}>{cnpjError}</Text>}
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} 
      />
      <TextInput 
        placeholder="Senha" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} 
      />
      <TouchableOpacity 
        onPress={handleRegister} 
        disabled={!!cnpjError || kind === 'loading'}
        style={{ 
          backgroundColor: (cnpjError || kind === 'loading') ? '#ccc' : tokens.colors.primary, 
          padding: 12, 
          borderRadius: 8 
        }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Cadastrar empresa</Text>
      </TouchableOpacity>
      
      {kind !== 'idle' ? <FeedbackState kind={kind === 'loading' ? 'loading' : kind === 'error' ? 'error' : 'success'} message={message} /> : null}
    </View>
  );
}
