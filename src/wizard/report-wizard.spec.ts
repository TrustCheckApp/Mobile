import {
  buildEvidenceDraft,
  buildOpenCasePayload,
  formatBytes,
  getMaxEvidenceBytes,
  normalizeWizardParam,
  validateCompanyStep,
  validateDescriptionStep,
  validateEvidenceDraft,
  validateLegalAcceptance,
} from './report-wizard';

describe('report-wizard', () => {
  it('normaliza parametros recebidos pelo Expo Router', () => {
    expect(normalizeWizardParam(' empresa-1 ')).toBe('empresa-1');
    expect(normalizeWizardParam([' empresa-2 ', 'ignorado'])).toBe('empresa-2');
    expect(normalizeWizardParam(undefined)).toBe('');
  });

  it('valida empresa obrigatoria no primeiro passo', () => {
    expect(validateCompanyStep('')).toEqual({ valid: false, message: 'Selecione ou informe a empresa antes de avançar.' });
    expect(validateCompanyStep('company-1')).toEqual({ valid: true });
  });

  it('valida descricao minima do ocorrido', () => {
    expect(validateDescriptionStep('curta')).toEqual({ valid: false, message: 'Descreva o ocorrido com pelo menos 50 caracteres.' });
    expect(validateDescriptionStep('Descrição detalhada do ocorrido com contexto suficiente para abrir o caso.')).toEqual({ valid: true });
  });

  it('valida evidencia com nome, mime e tamanho positivo', () => {
    expect(validateEvidenceDraft({ fileName: '', mimeType: 'image/jpeg', sizeBytes: 100 })).toEqual({
      valid: false,
      message: 'Informe o nome do arquivo da evidência.',
    });
    expect(validateEvidenceDraft({ fileName: 'foto.jpg', mimeType: '', sizeBytes: 100 })).toEqual({
      valid: false,
      message: 'Informe o tipo MIME da evidência.',
    });
    expect(validateEvidenceDraft({ fileName: 'foto.jpg', mimeType: 'image/jpeg', sizeBytes: 0 })).toEqual({
      valid: false,
      message: 'Informe um tamanho válido em bytes.',
    });
    expect(validateEvidenceDraft({ fileName: 'foto.jpg', mimeType: 'image/jpeg', sizeBytes: 1024 })).toEqual({ valid: true });
  });

  it('aplica limite de tamanho por tipo de evidencia conhecido', () => {
    expect(getMaxEvidenceBytes('image/jpeg')).toBe(10 * 1024 * 1024);
    expect(getMaxEvidenceBytes('video/mp4')).toBe(50 * 1024 * 1024);
    expect(getMaxEvidenceBytes('application/pdf')).toBe(20 * 1024 * 1024);
    expect(formatBytes(10 * 1024 * 1024)).toBe('10 MB');
    expect(validateEvidenceDraft({ fileName: 'foto.jpg', mimeType: 'image/jpeg', sizeBytes: 11 * 1024 * 1024 })).toEqual({
      valid: false,
      message: 'Evidência excede o limite de 10 MB para este tipo de arquivo.',
    });
  });

  it('monta draft de evidencia normalizado', () => {
    expect(buildEvidenceDraft({ fileName: ' foto.JPG ', mimeType: ' IMAGE/JPEG ', sizeBytes: '2048', description: ' comprovante ' })).toEqual({
      fileName: 'foto.JPG',
      mimeType: 'image/jpeg',
      sizeBytes: 2048,
      description: 'comprovante',
    });
  });

  it('exige termo carregado e aceite legal', () => {
    expect(validateLegalAcceptance(false, null)).toEqual({
      valid: false,
      message: 'Termo legal indisponível. Tente novamente em alguns instantes.',
    });
    expect(validateLegalAcceptance(false, { id: 'term-1', contentHash: 'hash' })).toEqual({
      valid: false,
      message: 'Aceite o termo legal para enviar a denúncia.',
    });
    expect(validateLegalAcceptance(true, { id: 'term-1', contentHash: 'hash' })).toEqual({ valid: true });
  });

  it('monta payload de abertura do caso com valores padrao seguros', () => {
    expect(
      buildOpenCasePayload({
        companyId: ' company-1 ',
        description: ' Descrição detalhada do caso ',
        occurredAt: '2026-05-14',
        term: { id: 'term-1', contentHash: 'hash-1' },
      }),
    ).toEqual({
      companyId: 'company-1',
      experienceType: 'reclamacao',
      category: 'ecommerce',
      description: 'Descrição detalhada do caso',
      occurredAt: '2026-05-14',
      legalAcceptance: {
        termId: 'term-1',
        contentHashEcho: 'hash-1',
      },
    });
  });
});
