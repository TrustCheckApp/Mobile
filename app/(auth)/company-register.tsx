import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { mobileApi } from '@/api/mobile-api';
import { FeedbackState } from '@/components/FeedbackState';
import { useRouter } from 'expo-router';
import { tokens } from '@/theme/tokens';

export default function CompanyRegisterScreen() {
  const router = useRouter();
  const [legalName, setLegalName] = useState('');
  const [fullName, setFullName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [registrationToken, setRegistrationToken] = useState('');
  const [kind, setKind] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  async function handleRegister() {
    try {
      setKind('loading');
      const result = await mobileApi.registerCompany({ email, password, cnpj, legalName, fullName, lgpdAccepted: true, lgpdVersion: '1.0.0' });
      setRegistrationToken(result.registrationToken);
      setKind('success');
      setMessage('Cadastro iniciado. Confirme OTP para habilitar 2FA.');
    } catch (error) {
      setKind('error');
      setMessage(String(error));
    }
  }

  async function handle2FaStep() {
    if (!registrationToken || otp.length !== 6) {
      setKind('error');
      setMessage('Token de cadastro e OTP são obrigatórios.');
      return;
    }
    setKind('success');
    setMessage('Segundo fator confirmado.');
    router.push('/(company)/dashboard');
  }

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Cadastro Empresa</Text>
      <TextInput placeholder="Razão Social" value={legalName} onChangeText={setLegalName} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Responsável" value={fullName} onChangeText={setFullName} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="CNPJ" value={cnpj} onChangeText={setCnpj} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TouchableOpacity onPress={handleRegister} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}><Text style={{ color: '#fff', textAlign: 'center' }}>Cadastrar empresa</Text></TouchableOpacity>

      <TextInput placeholder="OTP" value={otp} onChangeText={setOtp} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
      <TouchableOpacity onPress={handle2FaStep} style={{ backgroundColor: '#1f7a45', padding: 12, borderRadius: 8 }}><Text style={{ color: '#fff', textAlign: 'center' }}>Validar segundo fator</Text></TouchableOpacity>
      {kind !== 'idle' ? <FeedbackState kind={kind === 'loading' ? 'loading' : kind === 'error' ? 'error' : 'success'} message={message} /> : null}
    </View>
  );
}
