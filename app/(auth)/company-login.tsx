import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import { useRouter } from 'expo-router';
import { mobileApi } from '@/api/mobile-api';
import { userFacingMessage } from '@/api/error-map';

export default function CompanyLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFaCode, setTwoFaCode] = useState('');
  const [kind, setKind] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  async function handleLogin() {
    if (!email || !password) {
      setKind('error');
      setMessage('Credenciais obrigatórias.');
      return;
    }
    if (twoFaCode.length !== 6) {
      setKind('error');
      setMessage('Segundo fator obrigatório (6 dígitos).');
      return;
    }
    try {
      setKind('loading');
      await mobileApi.companyLogin({ email, password, twoFaCode });
      setKind('success');
      setMessage('Sessão empresarial iniciada (mock ou API futura).');
      router.replace('/(company)/dashboard');
    } catch (e) {
      setKind('error');
      setMessage(userFacingMessage(e, 'Falha no login empresarial.'));
    }
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Login empresa</Text>
      <FeedbackState
        kind="empty"
        message="Login empresa com API real: pendência — não há POST documentado no OpenAPI Sprint 1 alinhado a este fluxo; em modo real será necessário contrato (e-mail+senha+2FA)."
      />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Código 2FA" value={twoFaCode} onChangeText={setTwoFaCode} keyboardType="number-pad" maxLength={6} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Entrar</Text>
      </TouchableOpacity>
      {kind !== 'idle' ? <FeedbackState kind={kind === 'loading' ? 'loading' : kind === 'error' ? 'error' : 'success'} message={message} /> : null}
    </View>
  );
}
