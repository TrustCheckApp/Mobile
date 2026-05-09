import { useState, useCallback } from 'react';
import { mobileApi } from '@/api/mobile-api';
import { USE_MOCKS } from '@/api/axios-client';
import type { CaseStatus } from './useMyCases';

export interface TimelineEvent {
  id: string;
  type: 'created' | 'moderation_started' | 'published' | 'company_message' | 'proposal_sent' | 'proposal_accepted' | 'proposal_rejected' | 'resolved' | 'closed';
  actor: string;
  actorType: 'consumer' | 'company' | 'moderator' | 'system';
  timestamp: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface Proposal {
  id: string;
  caseId: string;
  text: string;
  value?: number;
  deadline: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Evidence {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  uploadedAt: string;
}

export interface CaseDetail {
  id: string;
  publicId: string;
  companyId: string;
  companyName: string;
  experienceType: string;
  category: string;
  description: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
  proposals: Proposal[];
  evidences: Evidence[];
}

export function useCaseDetail(caseId: string) {
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCaseDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (USE_MOCKS) {
        // Mock data for development
        const mockCase: CaseDetail = {
          id: caseId,
          publicId: 'TC-2025-00123',
          companyId: '1',
          companyName: 'Empresa Exemplo Ltda',
          experienceType: 'reclamacao',
          category: 'ecommerce',
          description: 'Produto não entregue no prazo prometido',
          status: 'negotiating',
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          timeline: [
            {
              id: '1',
              type: 'created',
              actor: 'Você',
              actorType: 'consumer',
              timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
              description: 'Caso criado',
            },
            {
              id: '2',
              type: 'moderation_started',
              actor: 'Sistema',
              actorType: 'system',
              timestamp: new Date(Date.now() - 3600000 * 47).toISOString(),
              description: 'Enviado para moderação',
            },
            {
              id: '3',
              type: 'published',
              actor: 'Moderador',
              actorType: 'moderator',
              timestamp: new Date(Date.now() - 3600000 * 46).toISOString(),
              description: 'Caso publicado',
            },
            {
              id: '4',
              type: 'company_message',
              actor: 'Empresa Exemplo Ltda',
              actorType: 'company',
              timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
              description: 'Pedimos desculpas pelo atraso. Gostaríamos de resolver.',
            },
            {
              id: '5',
              type: 'proposal_sent',
              actor: 'Empresa Exemplo Ltda',
              actorType: 'company',
              timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
              description: 'Proposta enviada: Reembolso total + cupom de desconto',
              metadata: { value: 100 },
            },
          ],
          proposals: [
            {
              id: 'p1',
              caseId: caseId,
              text: 'Reembolso total do valor pago + cupom de 20% para próxima compra',
              value: 100,
              deadline: new Date(Date.now() + 3600000 * 24 * 7).toISOString(),
              status: 'pending',
              createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
            },
          ],
          evidences: [
            {
              id: 'e1',
              url: 'https://mock-signed-url/evidence1.jpg',
              fileName: 'comprovante_compra.jpg',
              mimeType: 'image/jpeg',
              uploadedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
            },
          ],
        };
        setCaseDetail(mockCase);
      } else {
        // Real API call
        const response = await mobileApi.cases.get(caseId);
        setCaseDetail(response.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch case detail';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [caseId]);

  const acceptProposal = useCallback(async (proposalId: string) => {
    try {
      if (USE_MOCKS) {
        // Optimistic update
        setCaseDetail((prev: CaseDetail | null) => {
          if (!prev) return prev;
          return {
            ...prev,
            proposals: prev.proposals.map((p: Proposal) =>
              p.id === proposalId ? { ...p, status: 'accepted' as const } : p
            ),
            timeline: [
              ...prev.timeline,
              {
                id: Date.now().toString(),
                type: 'proposal_accepted',
                actor: 'Você',
                actorType: 'consumer',
                timestamp: new Date().toISOString(),
                description: 'Proposta aceita',
              },
            ],
          };
        });
      } else {
        await mobileApi.cases.resolve(caseId);
        await fetchCaseDetail();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept proposal';
      setError(errorMessage);
      throw err;
    }
  }, [caseId, fetchCaseDetail]);

  const rejectProposal = useCallback(async (proposalId: string, reason: string) => {
    try {
      if (USE_MOCKS) {
        // Optimistic update
        setCaseDetail((prev: CaseDetail | null) => {
          if (!prev) return prev;
          return {
            ...prev,
            proposals: prev.proposals.map((p: Proposal) =>
              p.id === proposalId ? { ...p, status: 'rejected' as const } : p
            ),
            timeline: [
              ...prev.timeline,
              {
                id: Date.now().toString(),
                type: 'proposal_rejected',
                actor: 'Você',
                actorType: 'consumer',
                timestamp: new Date().toISOString(),
                description: `Proposta rejeitada: ${reason}`,
              },
            ],
          };
        });
      } else {
        await mobileApi.cases.reject(caseId, { justification: reason });
        await fetchCaseDetail();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject proposal';
      setError(errorMessage);
      throw err;
    }
  }, [caseId, fetchCaseDetail]);

  const canPerformActions = useCallback(() => {
    if (!caseDetail) return false;
    return ['negotiating', 'published'].includes(caseDetail.status);
  }, [caseDetail]);

  const getActionDisabledReason = useCallback(() => {
    if (!caseDetail) return 'Carregando...';
    if (caseDetail.status === 'resolved') return 'Caso resolvido, ações indisponíveis';
    if (caseDetail.status === 'closed_unresolved') return 'Caso fechado, ações indisponíveis';
    if (caseDetail.status === 'draft') return 'Caso em rascunho, ações indisponíveis';
    if (caseDetail.status === 'pending_moderation') return 'Caso em moderação, ações indisponíveis';
    return null;
  }, [caseDetail]);

  return {
    caseDetail,
    isLoading,
    error,
    fetchCaseDetail,
    acceptProposal,
    rejectProposal,
    canPerformActions,
    getActionDisabledReason,
  };
}
