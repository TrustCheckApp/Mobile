import { useState, useCallback } from 'react';
import { mobileApi } from '@/api/mobile-api';
import { USE_MOCKS } from '@/api/axios-client';

export type CaseStatus = 'draft' | 'pending_moderation' | 'published' | 'negotiating' | 'resolved' | 'closed_unresolved';

export interface Case {
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
}

export function useMyCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCases = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (USE_MOCKS) {
        // Mock data for development
        const mockCases: Case[] = [
          {
            id: '1',
            publicId: 'TC-2025-00123',
            companyId: '1',
            companyName: 'Empresa Exemplo Ltda',
            experienceType: 'reclamacao',
            category: 'ecommerce',
            description: 'Produto não entregue no prazo',
            status: 'published',
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
          },
          {
            id: '2',
            publicId: 'TC-2025-00124',
            companyId: '2',
            companyName: 'Outra Empresa SA',
            experienceType: 'denuncia',
            category: 'servicos',
            description: 'Serviço de má qualidade',
            status: 'negotiating',
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          },
          {
            id: '3',
            publicId: 'TC-2025-00125',
            companyId: '3',
            companyName: 'Terceira Empresa ME',
            experienceType: 'elogio',
            category: 'imoveis',
            description: 'Atendimento excelente',
            status: 'resolved',
            createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
          },
        ];
        setCases(mockCases);
      } else {
        // Real API call
        const response = await mobileApi.cases.get('?owner=me');
        setCases(response.data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cases';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredCases = cases.filter((caseItem) => {
    const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      caseItem.publicId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: CaseStatus): string => {
    switch (status) {
      case 'draft':
        return '#6b7280';
      case 'pending_moderation':
        return '#f59e0b';
      case 'published':
        return '#3b82f6';
      case 'negotiating':
        return '#8b5cf6';
      case 'resolved':
        return '#10b981';
      case 'closed_unresolved':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: CaseStatus): string => {
    switch (status) {
      case 'draft':
        return 'Rascunho';
      case 'pending_moderation':
        return 'Em moderação';
      case 'published':
        return 'Publicado';
      case 'negotiating':
        return 'Em negociação';
      case 'resolved':
        return 'Resolvido';
      case 'closed_unresolved':
        return 'Fechado';
      default:
        return status;
    }
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
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

  return {
    cases: filteredCases,
    isLoading,
    error,
    statusFilter,
    searchQuery,
    setStatusFilter,
    setSearchQuery,
    fetchCases,
    getStatusColor,
    getStatusLabel,
    formatRelativeTime,
  };
}
