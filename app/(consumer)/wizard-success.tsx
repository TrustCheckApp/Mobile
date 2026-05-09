import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { tokens } from '@/theme/tokens';

export default function WizardSuccess() {
  const router = useRouter();
  const { publicId } = useLocalSearchParams<{ publicId: string }>();

  return (
    <View style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.lg, backgroundColor: tokens.colors.bg, justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: '800', textAlign: 'center' }}>Sucesso!</Text>
      <Text style={{ fontSize: 14, textAlign: 'center', color: '#666' }}>
        Seu caso foi enviado com sucesso.
      </Text>
      <Text style={{ fontSize: 16, textAlign: 'center', fontWeight: '600' }}>
        ID: {publicId}
      </Text>
      
      <TouchableOpacity
        onPress={() => router.push('/(consumer)/my-cases')}
        style={{ backgroundColor: tokens.colors.primary, padding: 12, borderRadius: 8 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Ver meus casos</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => router.push('/(consumer)/wizard-step1')}
        style={{ padding: 12 }}
      >
        <Text style={{ color: tokens.colors.primary, textAlign: 'center', fontSize: 14 }}>
          Nova denúncia
        </Text>
      </TouchableOpacity>
    </View>
  );
}
