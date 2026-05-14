import {
  canConsumerRejectNegotiation,
  formatCaseStatus,
  formatCaseUpdatedAt,
  getCaseEmptyMessage,
  getCasePrimaryActionLabel,
  getCaseStatusFilters,
} from './case-ui';

describe('case-ui', () => {
  it('formata status tecnicos para labels amigaveis em pt-BR', () => {
    expect(formatCaseStatus('ENVIADO')).toBe('Enviado');
    expect(formatCaseStatus('EM_MODERACAO')).toBe('Em moderação');
    expect(formatCaseStatus('AGUARDANDO_RESPOSTA_EMPRESA')).toBe('Aguardando resposta da empresa');
    expect(formatCaseStatus('EM_NEGOCIACAO')).toBe('Em negociação');
    expect(formatCaseStatus('NAO_RESOLVIDO')).toBe('Não resolvido');
  });

  it('retorna filtros usados em Meus Casos com labels amigaveis', () => {
    expect(getCaseStatusFilters()).toEqual(
      expect.arrayContaining([
        { value: 'TODOS', label: 'Todos' },
        { value: 'ENVIADO', label: 'Enviado' },
        { value: 'RESOLVIDO', label: 'Resolvido' },
      ]),
    );
  });

  it('permite recusa de acordo apenas em negociacao', () => {
    expect(canConsumerRejectNegotiation('EM_NEGOCIACAO')).toBe(true);
    expect(canConsumerRejectNegotiation('PUBLICADO')).toBe(false);
    expect(canConsumerRejectNegotiation('RESOLVIDO')).toBe(false);
  });

  it('formata data de atualizacao sem quebrar valores invalidos', () => {
    expect(formatCaseUpdatedAt()).toBe('Data indisponível');
    expect(formatCaseUpdatedAt('valor-invalido')).toBe('Data indisponível');
    expect(formatCaseUpdatedAt('2026-05-14T12:30:00.000Z')).toContain('2026');
  });

  it('diferencia mensagens de vazio por filtro', () => {
    expect(getCaseEmptyMessage('TODOS')).toContain('Você ainda não possui casos');
    expect(getCaseEmptyMessage('RESOLVIDO')).toContain('Nenhum caso encontrado com status Resolvido');
  });

  it('retorna acao principal conforme status do caso', () => {
    expect(getCasePrimaryActionLabel('EM_NEGOCIACAO')).toBe('Recusar acordo e encerrar como não resolvido');
    expect(getCasePrimaryActionLabel('PUBLICADO')).toBe('Nenhuma ação principal disponível neste status');
  });
});
