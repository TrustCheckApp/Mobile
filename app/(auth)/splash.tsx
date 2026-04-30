import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { tokens } from '@/theme/tokens';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.bg, justifyContent: 'center', alignItems: 'center', gap: tokens.spacing.md, padding: tokens.spacing.lg }}>
      <Text style={{ fontSize: 32, fontWeight: '800', color: tokens.colors.text }}>TrustCheck</Text>
      <Text style={{ color: tokens.colors.muted }}>Confianca e resolucao de conflitos.</Text>
      <TouchableOpacity onPress={() => router.push('/(auth)/perfil')} style={{ backgroundColor: tokens.colors.primary, padding: tokens.spacing.md, borderRadius: 10 }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}
