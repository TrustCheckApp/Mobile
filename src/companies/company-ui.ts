export type CompanyRouteParam = string | string[] | undefined;

export type CompanyReportRoute = {
  pathname: '/(consumer)/wizard-step1';
  params: { companyId: string };
};

const BADGE_LABELS: Record<string, string> = {
  Verificada: 'Empresa verificada',
  Demonstracao: 'Perfil demonstrativo',
  'Demonstração': 'Perfil demonstrativo',
  Pendente: 'Selo pendente',
  'Pendente API Trust Score': 'Selo pendente',
};

export function normalizeCompanyIdParam(value: CompanyRouteParam): string {
  if (Array.isArray(value)) return value[0]?.trim() ?? '';
  return value?.trim() ?? '';
}

export function formatTrustScore(score?: number | null): string {
  if (score === null || score === undefined || !Number.isFinite(score)) {
    return 'Score indisponível';
  }

  return `${Number(score).toFixed(1)}/10`;
}

export function formatCompanyBadge(badge?: string | null): string {
  const normalized = badge?.trim();
  if (!normalized) return 'Sem selo';
  return BADGE_LABELS[normalized] ?? normalized;
}

export function getCompanyEmptyMessage(): string {
  return 'Nenhuma empresa disponível no momento. Tente novamente mais tarde ou informe o ID da empresa ao abrir uma denúncia.';
}

export function getCompanyErrorMessage(fallback = 'Não foi possível carregar empresas.'): string {
  return fallback;
}

export function buildCompanyReportRoute(companyId: string): CompanyReportRoute {
  return {
    pathname: '/(consumer)/wizard-step1',
    params: { companyId: companyId.trim() },
  };
}

export function getCompanyProfileDescription(description?: string | null): string {
  return description?.trim() || 'Perfil público da empresa disponível para abertura e acompanhamento de denúncias.';
}
