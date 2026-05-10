import { useState, useCallback } from 'react';
import { Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { mobileApi } from '@/api/mobile-api';
import { userFacingMessage } from '@/api/error-map';
import { FeedbackState } from '@/components/FeedbackState';
import { tokens } from '@/theme/tokens';
import { useRouter } from 'expo-router';

type Step = 'dados' | 'otp';

export default function ConsumerRegisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('dados');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [registrationToken, setRegistrationToken] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');
  const [resendIn, setResendIn] = useState(0);

  const tickResend = useCallback(() => {
    setResendIn(60);
    const t = setInterval(() => {
      setResendIn((s: number) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  async function handleRegister() {
    try {
      setState('loading');
      const result = await mobileApi.registerConsumer({
        email,
        password,
        fullName,
        lgpdAccepted: true,
        lgpdVersion: '1.0.0',
      });
      setRegistrationToken(result.registrationToken);
      setStep('otp');
      setState('success');
      setMessage('Código enviado. Consulte o e-mail (em dev o OTP aparece nos logs do servidor).');
      tickResend();
    } catch (error) {
      setState('error');
      setMessage(userFacingMessage(error, 'Não foi possível iniciar o cadastro.'));
    }
  }

  async function handleConfirm() {
    if (otp.length !== 6) {
      setState('error');
      setMessage('O OTP deve ter 6 dígitos.');
      return;
    }
    try {
      setState('loading');
      await mobileApi.confirmConsumer({ registrationToken, otp });
      setState('success');
      setMessage('Conta ativada.');
      router.replace('/(consumer)/home');
    } catch (error) {
      setState('error');
      setMessage(userFacingMessage(error, 'OTP inválido ou expirado.'));
    }
  }

  async function handleResend() {
    if (resendIn > 0 || !registrationToken) return;
    try {
      setState('loading');
      const result = await mobileApi.registerConsumer({
        email,
        password,
        fullName,
        lgpdAccepted: true,
        lgpdVersion: '1.0.0',
      });
      setRegistrationToken(result.registrationToken);
      setState('success');
      setMessage('Novo código solicitado.');
      tickResend();
    } catch (error) {
      setState('error');
      setMessage(userFacingMessage(error, 'Não foi possível reenviar o código.'));
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Cadastro consumidor</Text>
      {step === 'dados' ? (
        <>
          <Text style={{ color: tokens.colors.muted }}>Passo 1 de 2 — dados e aceite LGPD (versão 1.0.0).</Text>
          <TextInput placeholder="Nome completo" value={fullName} onChangeText={setFullName} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
          <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
          <TouchableOpacity onPress={handleRegister} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Continuar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={{ color: tokens.colors.muted }}>Passo 2 de 2 — confirme o OTP de 6 dígitos.</Text>
          <TextInput placeholder="OTP (6 dígitos)" value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
          <TouchableOpacity onPress={handleConfirm} style={{ backgroundColor: '#1f7a45', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Confirmar e entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={resendIn > 0} onPress={handleResend} style={{ backgroundColor: resendIn > 0 ? '#ccc' : tokens.colors.primary, padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>{resendIn > 0 ? `Reenviar em ${resendIn}s` : 'Reenviar código'}</Text>
          </TouchableOpacity>
        </>
      )}
      {state !== 'idle' ? <FeedbackState kind={state === 'loading' ? 'loading' : state === 'error' ? 'error' : 'success'} message={message} /> : null}
    </ScrollView>
  );
}
