import { useState, useCallback } from 'react';
import { mobileApi } from '@/api/mobile-api';
import { USE_MOCKS } from '@/api/axios-client';
import type { CaseStatus } from '@/features/cases/useMyCases';

export type CaseQueueStatus = 'awaiting_response' | 'negotiating' | 'analyzing' | 'closed';

export interface TrustScore {
  score: number;
  previousScore?: number;
  calculatedAt?: string;
  isPending?: boolean;
}

export interface CaseQueueItem {
  id: string;
  publicId: string;
  consumerDisplayName: string;
  summary: string;
  status: CaseStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  daysOpen: number;
  slaExceeded: boolean;
  createdAt: string;
}

export interface CompanyDashboardData {
  trustScore: TrustScore;
  casesByStatus: Record<CaseStatus, number>;
  queue: CaseQueueItem[];
}

export function useCompanyDashboard() {
  const [dashboardData, setDashboardData] = useState<CompanyDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<CaseQueueStatus | 'all'>('all');

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (USE_MOCKS) {
        // Mock data for development
        const mockData: CompanyDashboardData = {
          trustScore: {
            score: 7.8,
            previousScore: 7.2,
            calculatedAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
            isPending: false,
          },
          casesByStatus: {
            draft: 0,
            pending_moderation: 2,
            published: 15,
            negotiating: 8,
            resolved: 42,
            closed_unresolved: 3,
          },
          queue: [
            {
              id: '1',
              publicId: 'TC-2025-00123',
              consumerDisplayName: 'C*** S***',
              summary: 'Produto não entregue no prazo prometido',
              status: 'negotiating',
              priority: 'high',
              daysOpen: 5,
              slaExceeded: false,
              createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
            },
            {
              id: '2',
              publicId: 'TC-2025-00124',
              consumerDisplayName: 'A*** M***',
              summary: 'Serviço de má qualidade',
              status: 'published',
              priority: 'urgent',
              daysOpen: 8,
              slaExceeded: true,
              createdAt: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
            },
            {
              id: '3',
              publicId: 'TC-2025-00125',
              consumerDisplayName: 'J*** R***',
              summary: 'Atendimento ruim',
              status: 'negotiating',
              priority: 'medium',
              daysOpen: 3,
              slaExceeded: false,
              createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
            },
          ],
        };
        setDashboardData(mockData);
      } else {
        // Real API call
        const response = await mobileApi.cases.get('company-dashboard');
        setDashboardData(response.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFilteredQueue = useCallback(() => {
    if (!dashboardData) return [];

    let filtered = dashboardData.queue;

    if (statusFilter === 'awaiting_response') {
      filtered = filtered.filter((item) => item.status === 'published');
    } else if (statusFilter === 'negotiating') {
      filtered = filtered.filter((item) => item.status === 'negotiating');
    } else if (statusFilter === 'analyzing') {
      filtered = filtered.filter((item) => item.status === 'pending_moderation');
    } else if (statusFilter === 'closed') {
      filtered = filtered.filter((item) => ['resolved', 'closed_unresolved'].includes(item.status));
    }

    // Sort by SLA exceeded first, then by days open
    return filtered.sort((a, b) => {
      if (a.slaExceeded !== b.slaExceeded) {
        return a.slaExceeded ? -1 : 1;
      }
      return b.daysOpen - a.daysOpen;
    });
  }, [dashboardData, statusFilter]);

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#3b82f6';
      case 'low':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'urgent':
        return 'Urgente';
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return priority;
    }
  };

  const formatTrustScoreChange = (current: number, previous?: number): { value: number; direction: 'up' | 'down' | 'neutral' } => {
    if (!previous) return { value: 0, direction: 'neutral' };
    const change = current - previous;
    const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
    return { value: Math.abs(change), direction };
  };

  return {
    dashboardData,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    fetchDashboardData,
    getFilteredQueue,
    getPriorityColor,
    getPriorityLabel,
    formatTrustScoreChange,
  };
}
