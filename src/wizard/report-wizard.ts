import type { OpenCaseInput } from '@/api/types';
import type { WizardEvidenceDraft } from '@/wizard/WizardProvider';

export type WizardParam = string | string[] | undefined;

export type WizardValidation = {
  valid: boolean;
  message?: string;
};

export type ActiveLegalTerm = {
  id: string;
  contentHash: string;
};

export type BuildOpenCasePayloadInput = {
  companyId: string;
  description: string;
  term: ActiveLegalTerm;
  occurredAt?: string;
  experienceType?: OpenCaseInput['experienceType'];
  category?: OpenCaseInput['category'];
};

const MAX_EVIDENCE_BYTES_BY_MIME_PREFIX: Array<{ prefix: string; maxBytes: number }> = [
  { prefix: 'image/', maxBytes: 10 * 1024 * 1024 },
  { prefix: 'video/', maxBytes: 50 * 1024 * 1024 },
  { prefix: 'application/pdf', maxBytes: 20 * 1024 * 1024 },
];

const DEFAULT_MAX_EVIDENCE_BYTES = 20 * 1024 * 1024;

export function normalizeWizardParam(value: WizardParam): string {
  if (Array.isArray(value)) return value[0]?.trim() ?? '';
  return value?.trim() ?? '';
}

export function validateCompanyStep(companyId: string): WizardValidation {
  if (!companyId.trim()) {
    return { valid: false, message: 'Selecione ou informe a empresa antes de avançar.' };
  }

  return { valid: true };
}

export function validateDescriptionStep(description: string): WizardValidation {
  const normalized = description.trim();

  if (normalized.length < 50) {
    return { valid: false, message: 'Descreva o ocorrido com pelo menos 50 caracteres.' };
  }

  return { valid: true };
}

export function getMaxEvidenceBytes(mimeType: string): number {
  const normalized = mimeType.trim().toLowerCase();
  return MAX_EVIDENCE_BYTES_BY_MIME_PREFIX.find((rule) => normalized.startsWith(rule.prefix))?.maxBytes ?? DEFAULT_MAX_EVIDENCE_BYTES;
}

export function validateEvidenceDraft(draft: {
  fileName: string;
  mimeType: string;
  sizeBytes: string | number;
}): WizardValidation {
  const fileName = draft.fileName.trim();
  const mimeType = draft.mimeType.trim().toLowerCase();
  const sizeBytes = typeof draft.sizeBytes === 'number' ? draft.sizeBytes : Number(draft.sizeBytes);

  if (!fileName) {
    return { valid: false, message: 'Informe o nome do arquivo da evidência.' };
  }

  if (!mimeType) {
    return { valid: false, message: 'Informe o tipo MIME da evidência.' };
  }

  if (!Number.isFinite(sizeBytes) || sizeBytes < 1) {
    return { valid: false, message: 'Informe um tamanho válido em bytes.' };
  }

  const maxBytes = getMaxEvidenceBytes(mimeType);
  if (sizeBytes > maxBytes) {
    return { valid: false, message: `Evidência excede o limite de ${formatBytes(maxBytes)} para este tipo de arquivo.` };
  }

  return { valid: true };
}

export function buildEvidenceDraft(input: {
  fileName: string;
  mimeType: string;
  sizeBytes: string | number;
  description?: string;
}): WizardEvidenceDraft {
  return {
    fileName: input.fileName.trim(),
    mimeType: input.mimeType.trim().toLowerCase(),
    sizeBytes: typeof input.sizeBytes === 'number' ? input.sizeBytes : Number(input.sizeBytes),
    description: input.description?.trim() || undefined,
  };
}

export function validateLegalAcceptance(accepted: boolean, term: ActiveLegalTerm | null | undefined): WizardValidation {
  if (!term?.id || !term.contentHash) {
    return { valid: false, message: 'Termo legal indisponível. Tente novamente em alguns instantes.' };
  }

  if (!accepted) {
    return { valid: false, message: 'Aceite o termo legal para enviar a denúncia.' };
  }

  return { valid: true };
}

export function buildOpenCasePayload(input: BuildOpenCasePayloadInput): OpenCaseInput {
  return {
    companyId: input.companyId.trim(),
    experienceType: input.experienceType ?? 'reclamacao',
    category: input.category ?? 'ecommerce',
    description: input.description.trim(),
    occurredAt: input.occurredAt ?? new Date().toISOString().slice(0, 10),
    legalAcceptance: {
      termId: input.term.id,
      contentHashEcho: input.term.contentHash,
    },
  };
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / 1024 / 1024)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} bytes`;
}
