import {
  countCompanyCasesByStatus,
  filterCompanyCasesByStatus,
  formatCompanyCaseStatus,
  formatCompanyCaseUpdatedAt,
  getCompanyCasePrimaryActionLabel,
  getCompanyCaseStatusFilters,
  getCompanyCasesEmptyMessage,
  getCompanyCasesErrorMessage,
} from './company-cases-ui';

const cases = [
  { id: '1', status: 'AGUARDANDO_RESPOSTA_EMPRESA' },
  { id: '2', status: 'EM_NEGOCIACAO' },
  { id: '3', status: 'RESOLVIDO' },
  { id: '4', status: 'NAO_RESOLVIDO' },
];

describe('company-cases-ui', () => {
  it('formata status tecnicos para labels amigaveis', () => {
    expect(formatCompanyCaseStatus('AGUARDANDO_RESPOSTA_EMPRESA')).toBe('Aguardando resposta');
    expect(formatCompanyCaseStatus('EM_NEGOCIACAO')).toBe('Em negociação');
    expect(formatCompanyCaseStatus('PUBLICADO')).toBe('Publicado');
    expect(formatCompanyCaseStatus('STATUS_DESCONHECIDO')).toBe('status desconhecido');
    expect(formatCompanyCaseStatus(null)).toBe('Status indisponível');
  });

  it('retorna filtros relevantes para fila da empresa', () => {
    expect(getCompanyCaseStatusFilters()).toEqual(
      expect.arrayContaining([
        { value: 'TODOS', label: 'Todos' },
        { value: 'AGUARDANDO_RESPOSTA_EMPRESA', label: 'Aguardando resposta' },
        { value: 'EM_NEGOCIACAO', label: 'Em negociação' },
      ]),
    );
  });

  it('filtra casos por status mantendo todos quando filtro e TODOS', () => {
    expect(filterCompanyCasesByStatus(cases, 'TODOS')).toHaveLength(4);
    expect(filterCompanyCasesByStatus(cases, 'EM_NEGOCIACAO')).toEqual([{ id: '2', status: 'EM_NEGOCIACAO' }]);
  });

  it('conta casos por status operacional', () => {
    expect(countCompanyCasesByStatus(cases)).toEqual({
      total: 4,
      aguardandoResposta: 1,
      emNegociacao: 1,
      resolvidos: 1,
      naoResolvidos: 1,
    });
  });

  it('diferencia mensagens de vazio por filtro', () => {
    expect(getCompanyCasesEmptyMessage('TODOS')).toBe('Sua empresa ainda não possui casos na fila.');
    expect(getCompanyCasesEmptyMessage('EM_NEGOCIACAO')).toBe('Nenhum caso encontrado com status Em negociação.');
  });

  it('retorna mensagem de erro padrao', () => {
    expect(getCompanyCasesErrorMessage()).toBe('Não foi possível carregar a fila de casos da empresa.');
  });

  it('retorna CTA principal conforme status', () => {
    expect(getCompanyCasePrimaryActionLabel('AGUARDANDO_RESPOSTA_EMPRESA')).toBe('Responder caso');
    expect(getCompanyCasePrimaryActionLabel('EM_NEGOCIACAO')).toBe('Ver negociação');
    expect(getCompanyCasePrimaryActionLabel('PUBLICADO')).toBe('Ver detalhes');
  });

  it('formata data de atualizacao com fallback seguro', () => {
    expect(formatCompanyCaseUpdatedAt()).toBe('Data indisponível');
    expect(formatCompanyCaseUpdatedAt('valor-invalido')).toBe('Data indisponível');
    expect(formatCompanyCaseUpdatedAt('2026-05-14T12:30:00.000Z')).toContain('2026');
  });
});
