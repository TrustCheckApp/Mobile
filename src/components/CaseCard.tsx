import { TouchableOpacity, View, Text } from 'react-native';
import { tokens } from '@/theme/tokens';
import type { Case, CaseStatus } from '@/features/cases/useMyCases';

interface CaseCardProps {
  caseItem: Case;
  statusColor: string;
  statusLabel: string;
  relativeTime: string;
  onPress: () => void;
}

export function CaseCard({ caseItem, statusColor, statusLabel, relativeTime, onPress }: CaseCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', flex: 1 }}>{caseItem.publicId}</Text>
        <View
          style={{
            backgroundColor: statusColor,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>{statusLabel}</Text>
        </View>
      </View>
      
      <Text style={{ fontSize: 14, color: '#374151', marginBottom: 4 }}>{caseItem.companyName}</Text>
      <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }} numberOfLines={2}>
        {caseItem.description}
      </Text>
      
      <Text style={{ fontSize: 11, color: '#9ca3af' }}>Atualizado {relativeTime}</Text>
    </TouchableOpacity>
  );
}
