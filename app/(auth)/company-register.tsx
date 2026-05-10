import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { mobileApi } from '@/api/mobile-api';
import { userFacingMessage } from '@/api/error-map';
import { FeedbackState } from '@/components/FeedbackState';
import { useRouter } from 'expo-router';
import { tokens } from '@/theme/tokens';
import { normalizeCnpjDigits, isCnpjLengthValid } from '@/utils/cnpj';

type Phase = 'dados' | 'otp_totp';

export default function CompanyRegisterScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('dados');
  const [legalName, setLegalName] = useState('');
  const [fullName, setFullName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [registrationToken, setRegistrationToken] = useState('');
  const [kind, setKind] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  const cnpjDigits = normalizeCnpjDigits(cnpj);
  const cnpjInvalid = cnpjDigits.length > 0 && !isCnpjLengthValid(cnpjDigits);

  async function handleRegister() {
    if (cnpjInvalid) {
      setKind('error');
      setMessage('CNPJ deve ter 14 dígitos (validação completa na API).');
      return;
    }
    try {
      setKind('loading');
      const result = await mobileApi.registerCompany({
        email,
        password,
        cnpj: cnpjDigits,
        legalName,
        fullName,
        lgpdAccepted: true,
        lgpdVersion: '1.0.0',
      });
      setRegistrationToken(result.registrationToken);
      setPhase('otp_totp');
      setKind('success');
      setMessage('OTP enviado. Após confirmar, conclua o 2FA (TOTP) com a app de autenticação.');
    } catch (error) {
      setKind('error');
      setMessage(userFacingMessage(error, 'Não foi possível iniciar o cadastro empresarial.'));
    }
  }

  async function handleConfirmTotp() {
    if (otp.length !== 6) {
      setKind('error');
      setMessage('OTP de 6 dígitos obrigatório.');
      return;
    }
    try {
      setKind('loading');
      await mobileApi.confirmCompanyRegistration({ registrationToken, otp });
      setKind('success');
      setMessage('Conta empresarial ativa. Complete o 2FA na app autenticadora antes de operar.');
      router.replace('/(company)/dashboard');
    } catch (error) {
      setKind('error');
      setMessage(userFacingMessage(error, 'OTP inválido ou token de registo expirado.'));
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: tokens.spacing.lg, gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>Cadastro empresa</Text>
      {phase === 'dados' ? (
        <>
          <TextInput placeholder="Razão social" value={legalName} onChangeText={setLegalName} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
          <TextInput placeholder="Responsável legal" value={fullName} onChangeText={setFullName} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
          <TextInput placeholder="CNPJ (apenas dígitos)" value={cnpj} onChangeText={setCnpj} keyboardType="numeric" style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
          {cnpjInvalid ? <FeedbackState kind="error" message="CNPJ incompleto (14 dígitos)." /> : null}
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
          <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
          <TouchableOpacity onPress={handleRegister} style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Continuar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={{ color: tokens.colors.muted }}>Confirme o OTP recebido por e-mail. Depois siga o enrolamento TOTP (QR devolvido pela API — não partilhe).</Text>
          <TextInput placeholder="OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} />
          <TouchableOpacity onPress={handleConfirmTotp} style={{ backgroundColor: '#1f7a45', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Confirmar OTP</Text>
          </TouchableOpacity>
        </>
      )}
      {kind !== 'idle' ? <FeedbackState kind={kind === 'loading' ? 'loading' : kind === 'error' ? 'error' : 'success'} message={message} /> : null}
    </ScrollView>
  );
}
