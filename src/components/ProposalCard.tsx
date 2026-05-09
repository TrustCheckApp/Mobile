import { useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, Modal } from 'react-native';
import { tokens } from '@/theme/tokens';
import type { Proposal } from '@/features/cases/useCaseDetail';

interface ProposalCardProps {
  proposal: Proposal;
  onAccept: () => void;
  onReject: (reason: string) => void;
  disabled?: boolean;
  disabledReason?: string;
}

export function ProposalCard({ proposal, onAccept, onReject, disabled, disabledReason }: ProposalCardProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  const getStatusColor = () => {
    switch (proposal.status) {
      case 'pending':
        return '#f59e0b';
      case 'accepted':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = () => {
    switch (proposal.status) {
      case 'pending':
        return 'Pendente';
      case 'accepted':
        return 'Aceita';
      case 'rejected':
        return 'Rejeitada';
      default:
        return proposal.status;
    }
  };

  const formatDeadline = (deadline: string): string => {
    const date = new Date(deadline);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Expirada';
    } else if (diffDays === 0) {
      return 'Expira hoje';
    } else if (diffDays === 1) {
      return 'Expira em 1 dia';
    } else {
      return `Expira em ${diffDays} dias`;
    }
  };

  return (
    <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', flex: 1 }}>Proposta da empresa</Text>
        <View style={{ backgroundColor: getStatusColor(), paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>{getStatusLabel()}</Text>
        </View>
      </View>

      <Text style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>{proposal.text}</Text>

      {proposal.value !== undefined && (
        <Text style={{ fontSize: 16, fontWeight: '700', color: tokens.colors.primary, marginBottom: 8 }}>
          R$ {proposal.value.toFixed(2)}
        </Text>
      )}

      <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
        {formatDeadline(proposal.deadline)}
      </Text>

      {proposal.status === 'pending' && (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={onAccept}
            disabled={disabled}
            style={{
              flex: 1,
              backgroundColor: disabled ? '#ccc' : '#10b981',
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Aceitar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowRejectModal(true)}
            disabled={disabled}
            style={{
              flex: 1,
              backgroundColor: disabled ? '#ccc' : '#ef4444',
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Recusar</Text>
          </TouchableOpacity>
        </View>
      )}

      {disabled && disabledReason && (
        <Text style={{ fontSize: 11, color: '#f59e0b', marginTop: 8 }}>{disabledReason}</Text>
      )}

      <Modal visible={showRejectModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 }}>
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Motivo da recusa</Text>
            <TextInput
              placeholder="Descreva o motivo..."
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
              numberOfLines={4}
              style={{ backgroundColor: '#f3f4f6', padding: 12, borderRadius: 8, marginBottom: 12, textAlignVertical: 'top' }}
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                style={{ flex: 1, backgroundColor: '#ccc', padding: 12, borderRadius: 8 }}
              >
                <Text style={{ color: '#000', textAlign: 'center' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleReject}
                disabled={!rejectReason.trim()}
                style={{
                  flex: 1,
                  backgroundColor: !rejectReason.trim() ? '#ccc' : '#ef4444',
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center' }}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
