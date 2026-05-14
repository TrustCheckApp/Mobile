export type CaseStatus =
  | 'ENVIADO'
  | 'EM_MODERACAO'
  | 'PUBLICADO'
  | 'AGUARDANDO_RESPOSTA_EMPRESA'
  | 'EM_NEGOCIACAO'
  | 'RESOLVIDO'
  | 'NAO_RESOLVIDO'
  | string;

export type CaseStatusFilter = 'TODOS' | Exclude<CaseStatus, string> | string;

export const CASE_STATUS_FILTERS = [
  'TODOS',
  'ENVIADO',
  'EM_MODERACAO',
  'PUBLICADO',
  'AGUARDANDO_RESPOSTA_EMPRESA',
  'EM_NEGOCIACAO',
  'RESOLVIDO',
  'NAO_RESOLVIDO',
] as const;

const STATUS_LABELS: Record<string, string> = {
  ENVIADO: 'Enviado',
  EM_MODERACAO: 'Em moderação',
  PUBLICADO: 'Publicado',
  AGUARDANDO_RESPOSTA_EMPRESA: 'Aguardando resposta da empresa',
  EM_NEGOCIACAO: 'Em negociação',
  RESOLVIDO: 'Resolvido',
  NAO_RESOLVIDO: 'Não resolvido',
};

export function getCaseStatusFilters() {
  return CASE_STATUS_FILTERS.map((value) => ({
    value,
    label: value === 'TODOS' ? 'Todos' : formatCaseStatus(value),
  }));
}

export function formatCaseStatus(status?: CaseStatus | null): string {
  if (!status) return 'Status indisponível';
  return STATUS_LABELS[status] ?? status.replace(/_/g, ' ').toLowerCase();
}

export function canConsumerRejectNegotiation(status?: CaseStatus | null): boolean {
  return status === 'EM_NEGOCIACAO';
}

export function formatCaseUpdatedAt(value?: string | Date | null): string {
  if (!value) return 'Data indisponível';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Data indisponível';
  }

  return date.toLocaleString('pt-BR');
}

export function getCaseEmptyMessage(filter: string): string {
  if (filter === 'TODOS') {
    return 'Você ainda não possui casos. Crie uma nova denúncia para acompanhar o andamento por aqui.';
  }

  return `Nenhum caso encontrado com status ${formatCaseStatus(filter)}. Escolha outro filtro para ampliar a busca.`;
}

export function getCasePrimaryActionLabel(status?: CaseStatus | null): string {
  if (canConsumerRejectNegotiation(status)) {
    return 'Recusar acordo e encerrar como não resolvido';
  }

  return 'Nenhuma ação principal disponível neste status';
}
