import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import { useRouter } from 'expo-router';

export default function CompanyLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFaCode, setTwoFaCode] = useState('');
  const [kind, setKind] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  function handleLogin() {
    if (!email || !password) {
      setKind('error');
      setMessage('Credenciais obrigatórias.');
      return;
    }
    setKind('loading');
    if (twoFaCode.length !== 6) {
      setKind('error');
      setMessage('Segundo fator obrigatório (6 dígitos).');
      return;
    }
    setKind('success');
    setMessage('Acesso empresarial liberado.');
    router.push('/(company)/dashboard');
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Login Empresa</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Código 2FA" value={twoFaCode} onChangeText={setTwoFaCode} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}><Text style={{ color: '#fff', textAlign: 'center' }}>Entrar</Text></TouchableOpacity>
      {kind !== 'idle' ? <FeedbackState kind={kind === 'loading' ? 'loading' : kind === 'error' ? 'error' : 'success'} message={message} /> : null}
    </View>
  );
}
