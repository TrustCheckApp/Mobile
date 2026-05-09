import { View, Text, ScrollView } from 'react-native';
import type { TimelineEvent } from '@/features/cases/useCaseDetail';

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const getEventIcon = (type: TimelineEvent['type']): string => {
    switch (type) {
      case 'created':
        return '📝';
      case 'moderation_started':
        return '⏳';
      case 'published':
        return '✅';
      case 'company_message':
        return '💬';
      case 'proposal_sent':
        return '📋';
      case 'proposal_accepted':
        return '🤝';
      case 'proposal_rejected':
        return '❌';
      case 'resolved':
        return '🎉';
      case 'closed':
        return '🔒';
      default:
        return '📌';
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `há ${diffDays}d`;
    } else if (diffHours > 0) {
      return `há ${diffHours}h`;
    } else {
      return 'agora';
    }
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>Timeline</Text>
      {sortedEvents.map((event, index) => (
        <View key={event.id} style={{ flexDirection: 'row', marginBottom: 16 }}>
          <View style={{ width: 40, alignItems: 'center' }}>
            <View style={{ fontSize: 20 }}>{getEventIcon(event.type)}</View>
            {index < sortedEvents.length - 1 && (
              <View style={{ width: 2, flex: 1, backgroundColor: '#e5e7eb', marginTop: 4 }} />
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: '600' }}>{event.description}</Text>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>{event.actor}</Text>
            <Text style={{ fontSize: 11, color: '#9ca3af' }}>{formatTimestamp(event.timestamp)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
