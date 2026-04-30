import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { tokens } from '@/theme/tokens';

export default function PerfilScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: tokens.spacing.lg, gap: tokens.spacing.md, backgroundColor: tokens.colors.bg }}>
      <Text style={{ fontSize: 24, fontWeight: '800', color: tokens.colors.text }}>Escolha seu perfil</Text>
      <TouchableOpacity style={{ backgroundColor: tokens.colors.surface, padding: tokens.spacing.md, borderRadius: 10 }} onPress={() => router.push('/(auth)/consumer-register')}>
        <Text style={{ fontWeight: '700' }}>Consumidor</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ backgroundColor: tokens.colors.surface, padding: tokens.spacing.md, borderRadius: 10 }} onPress={() => router.push('/(auth)/company-register')}>
        <Text style={{ fontWeight: '700' }}>Empresa</Text>
      </TouchableOpacity>
    </View>
  );
}
