import { Text, View } from 'react-native';
import { tokens } from '@/theme/tokens';

export default function CompanyDashboardScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.bg, padding: tokens.spacing.lg, gap: tokens.spacing.sm }}>
      <Text style={{ fontSize: 24, fontWeight: '800' }}>Dashboard Empresa</Text>
      <Text>Fluxo empresarial autenticado com segundo fator.</Text>
    </View>
  );
}
