import { Text, View } from 'react-native';
import { tokens } from '@/theme/tokens';

export function FeedbackState({ kind, message }: { kind: 'loading' | 'error' | 'success' | 'empty'; message: string }) {
  const color = kind === 'error' ? tokens.colors.danger : kind === 'success' ? tokens.colors.success : kind === 'empty' ? tokens.colors.muted : tokens.colors.primary;
  return (
    <View style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.surface, borderRadius: 10 }}>
      <Text style={{ color, fontWeight: '700' }}>{kind.toUpperCase()}</Text>
      <Text style={{ color: tokens.colors.text }}>{message}</Text>
    </View>
  );
}
