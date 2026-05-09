import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { mobileApi } from '@/api/mobile-api';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import { useRouter } from 'expo-router';

export default function ConsumerRegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  async function handleRegister() {
    try {
      setState('loading');
      const result = await mobileApi.auth.registerConsumer({ email, password, fullName, lgpdAccepted: true, lgpdVersion: '1.0.0' });
      setState('success');
      setMessage('Cadastro iniciado. Informe o OTP.');
      // Navigate to OTP verify screen
      router.push({
        pathname: '/(auth)/otp-verify',
        params: { email, registrationToken: result.data.registrationToken },
      });
    } catch (error) {
      setState('error');
      setMessage(String(error));
    }
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Cadastro Consumidor</Text>
      <TextInput placeholder="Nome" value={fullName} onChangeText={setFullName} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TouchableOpacity onPress={handleRegister} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}><Text style={{ color: '#fff', textAlign: 'center' }}>Cadastrar</Text></TouchableOpacity>

      {state !== 'idle' ? <FeedbackState kind={state === 'loading' ? 'loading' : state === 'error' ? 'error' : 'success'} message={message} /> : null}
    </View>
  );
}
