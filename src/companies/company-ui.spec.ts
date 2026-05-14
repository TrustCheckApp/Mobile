import {
  buildCompanyReportRoute,
  formatCompanyBadge,
  formatTrustScore,
  getCompanyEmptyMessage,
  getCompanyErrorMessage,
  getCompanyProfileDescription,
  normalizeCompanyIdParam,
} from './company-ui';

describe('company-ui', () => {
  it('normaliza id da empresa vindo da rota', () => {
    expect(normalizeCompanyIdParam(' company-1 ')).toBe('company-1');
    expect(normalizeCompanyIdParam([' company-2 ', 'ignorado'])).toBe('company-2');
    expect(normalizeCompanyIdParam(undefined)).toBe('');
  });

  it('formata Trust Score com fallback seguro', () => {
    expect(formatTrustScore(null)).toBe('Score indisponível');
    expect(formatTrustScore(undefined)).toBe('Score indisponível');
    expect(formatTrustScore(Number.NaN)).toBe('Score indisponível');
    expect(formatTrustScore(8.5)).toBe('8.5/10');
    expect(formatTrustScore(7)).toBe('7.0/10');
  });

  it('formata selo da empresa com fallback seguro', () => {
    expect(formatCompanyBadge(null)).toBe('Sem selo');
    expect(formatCompanyBadge('')).toBe('Sem selo');
    expect(formatCompanyBadge('Verificada')).toBe('Empresa verificada');
    expect(formatCompanyBadge('Demonstração')).toBe('Perfil demonstrativo');
    expect(formatCompanyBadge('Selo customizado')).toBe('Selo customizado');
  });

  it('retorna mensagens de vazio e erro para descoberta', () => {
    expect(getCompanyEmptyMessage()).toContain('Nenhuma empresa disponível');
    expect(getCompanyErrorMessage()).toBe('Não foi possível carregar empresas.');
    expect(getCompanyErrorMessage('Falha customizada.')).toBe('Falha customizada.');
  });

  it('monta rota de denuncia com empresa pre-selecionada', () => {
    expect(buildCompanyReportRoute(' company-1 ')).toEqual({
      pathname: '/(consumer)/wizard-step1',
      params: { companyId: 'company-1' },
    });
  });

  it('retorna descricao de perfil com fallback', () => {
    expect(getCompanyProfileDescription(' Empresa confiável. ')).toBe('Empresa confiável.');
    expect(getCompanyProfileDescription('')).toContain('Perfil público da empresa');
  });
});
