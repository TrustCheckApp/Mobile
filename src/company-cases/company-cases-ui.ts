export type CompanyCaseStatus =
  | 'PUBLICADO'
  | 'AGUARDANDO_RESPOSTA_EMPRESA'
  | 'EM_NEGOCIACAO'
  | 'RESOLVIDO'
  | 'NAO_RESOLVIDO'
  | string;

export type CompanyCaseFilter = 'TODOS' | CompanyCaseStatus;

export type CompanyCaseListRow = {
  id: string;
  publicId?: string | null;
  status: string;
  consumer?: string;
  companyName?: string;
  updatedAt?: string;
};

export type CompanyCaseCounters = {
  total: number;
  aguardandoResposta: number;
  emNegociacao: number;
  resolvidos: number;
  naoResolvidos: number;
};

const STATUS_LABELS: Record<string, string> = {
  PUBLICADO: 'Publicado',
  AGUARDANDO_RESPOSTA_EMPRESA: 'Aguardando resposta',
  EM_NEGOCIACAO: 'Em negociação',
  RESOLVIDO: 'Resolvido',
  NAO_RESOLVIDO: 'Não resolvido',
};

export const COMPANY_CASE_STATUS_FILTERS = [
  'TODOS',
  'PUBLICADO',
  'AGUARDANDO_RESPOSTA_EMPRESA',
  'EM_NEGOCIACAO',
  'RESOLVIDO',
  'NAO_RESOLVIDO',
] as const;

export function formatCompanyCaseStatus(status?: string | null): string {
  if (!status) return 'Status indisponível';
  return STATUS_LABELS[status] ?? status.replace(/_/g, ' ').toLowerCase();
}

export function getCompanyCaseStatusFilters() {
  return COMPANY_CASE_STATUS_FILTERS.map((value) => ({
    value,
    label: value === 'TODOS' ? 'Todos' : formatCompanyCaseStatus(value),
  }));
}

export function filterCompanyCasesByStatus<T extends { status: string }>(cases: T[], filter: string): T[] {
  if (filter === 'TODOS') return cases;
  return cases.filter((item) => item.status === filter);
}

export function countCompanyCasesByStatus(cases: Array<{ status: string }>): CompanyCaseCounters {
  return cases.reduce<CompanyCaseCounters>(
    (acc, item) => {
      acc.total += 1;
      if (item.status === 'AGUARDANDO_RESPOSTA_EMPRESA') acc.aguardandoResposta += 1;
      if (item.status === 'EM_NEGOCIACAO') acc.emNegociacao += 1;
      if (item.status === 'RESOLVIDO') acc.resolvidos += 1;
      if (item.status === 'NAO_RESOLVIDO') acc.naoResolvidos += 1;
      return acc;
    },
    { total: 0, aguardandoResposta: 0, emNegociacao: 0, resolvidos: 0, naoResolvidos: 0 },
  );
}

export function getCompanyCasesEmptyMessage(filter: string): string {
  if (filter === 'TODOS') {
    return 'Sua empresa ainda não possui casos na fila.';
  }

  return `Nenhum caso encontrado com status ${formatCompanyCaseStatus(filter)}.`;
}

export function getCompanyCasesErrorMessage(): string {
  return 'Não foi possível carregar a fila de casos da empresa.';
}

export function getCompanyCasePrimaryActionLabel(status?: string | null): string {
  if (status === 'AGUARDANDO_RESPOSTA_EMPRESA') return 'Responder caso';
  if (status === 'EM_NEGOCIACAO') return 'Ver negociação';
  return 'Ver detalhes';
}

export function formatCompanyCaseUpdatedAt(value?: string | Date | null): string {
  if (!value) return 'Data indisponível';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data indisponível';
  return date.toLocaleString('pt-BR');
}
