import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCompanyAuth } from '@/features/auth/useCompanyAuth';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';

export default function CompanyLoginScreen() {
  const { loginCompany } = useCompanyAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [kind, setKind] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  async function handleLogin() {
    if (!email || !password) {
      setKind('error');
      setMessage('Credenciais obrigatórias.');
      return;
    }

    try {
      setKind('loading');
      await loginCompany(email, password);
      setKind('success');
      setMessage('Login realizado. Verifique 2FA se necessário.');
    } catch (error) {
      setKind('error');
      setMessage(String(error));
    }
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Login Empresa</Text>
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
        onPress={handleLogin} 
        disabled={kind === 'loading'}
        style={{ 
          backgroundColor: kind === 'loading' ? '#ccc' : tokens.colors.primary, 
          padding: 12, 
          borderRadius: 8 
        }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Entrar</Text>
      </TouchableOpacity>
      {kind !== 'idle' ? <FeedbackState kind={kind === 'loading' ? 'loading' : kind === 'error' ? 'error' : 'success'} message={message} /> : null}
    </View>
  );
}
