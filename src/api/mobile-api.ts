import { useMockApi } from '@/config/env';
import { apiFetch } from '@/api/http-client';
import { saveTokens } from '@/auth/token-storage';
import * as mock from '@/mocks/handlers';
import type {
  RegisterConsumerInput,
  RegisterConfirmInput,
  RegisterCompanyInput,
  ClaimCompanyInput,
  OpenCaseInput,
} from '@/api/types';

/** Catálogo de empresas: não existe rota pública no OpenAPI Sprint 1 — sempre mock tipado. */
export async function listCompanies() {
  return mock.listCompanies();
}

export async function getCompany(id: string) {
  return mock.getCompany(id);
}

export async function registerConsumer(input: RegisterConsumerInput) {
  if (useMockApi) return mock.registerConsumer(input);
  return apiFetch<{ userId: string; registrationToken: string }>('/auth/consumer/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function confirmConsumer(input: RegisterConfirmInput) {
  if (useMockApi) {
    const t = await mock.confirmConsumer(input);
    await saveTokens(t.accessToken, t.refreshToken);
    return t;
  }
  const t = await apiFetch<{ accessToken: string; refreshToken: string }>('/auth/consumer/register/confirm', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  await saveTokens(t.accessToken, t.refreshToken);
  return t;
}

export async function loginConsumer(input: { email: string; password: string }) {
  if (useMockApi) {
    const t = await mock.loginConsumer(input);
    await saveTokens(t.accessToken, t.refreshToken);
    return t;
  }
  const t = await apiFetch<{ accessToken: string; refreshToken: string }>('/auth/consumer/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  await saveTokens(t.accessToken, t.refreshToken);
  return t;
}

export async function registerCompany(input: RegisterCompanyInput) {
  if (useMockApi) return mock.registerCompany(input);
  return apiFetch<{ userId: string; registrationToken: string }>('/auth/company/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function confirmCompanyRegistration(input: RegisterConfirmInput) {
  if (useMockApi) {
    const t = await mock.confirmCompanyRegistration(input);
    await saveTokens(t.accessToken, null);
    return t;
  }
  const t = await apiFetch<{
    accessToken: string;
    totpSecret: string;
    qrCodeDataUrl: string;
    recoveryCodes: string[];
  }>('/auth/company/register/confirm', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  await saveTokens(t.accessToken, null);
  return t;
}

export async function claimCompany(input: ClaimCompanyInput) {
  if (useMockApi) return mock.claimCompany(input);
  return apiFetch<{ claimId: string; registrationToken: string }>('/auth/company/claim', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getClaimStatus(claimId: string) {
  if (useMockApi) return mock.claimStatus(claimId);
  return apiFetch<ReturnType<typeof mock.claimStatus>>(`/auth/company/claim/${claimId}/status`, { method: 'GET' });
}

export async function getActiveTerm() {
  if (useMockApi) return mock.getActiveTerm();
  return apiFetch<ReturnType<typeof mock.getActiveTerm>>('/legal-terms/active?kind=termos_uso', { method: 'GET' });
}

export async function openCase(input: OpenCaseInput) {
  if (useMockApi) return mock.openCase(input);
  return apiFetch<{ id: string; publicId: string | null; status: string }>('/cases', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function registerCaseEvidence(
  caseId: string,
  payload: { fileName: string; mimeType: string; sizeBytes: number; checksumSha256?: string; description?: string },
) {
  if (useMockApi) return mock.registerCaseEvidence(caseId, payload);
  const upload = await apiFetch<{ uploadUrl: string; uploadToken: string; evidenceId: string }>(
    `/cases/${caseId}/evidences/upload-url`,
    {
      method: 'POST',
      body: JSON.stringify({
        fileName: payload.fileName,
        mimeType: payload.mimeType,
        sizeBytes: payload.sizeBytes,
      }),
    },
  );

  // MVP: o app ainda não envia binário local neste fluxo, mas já fecha o contrato
  // de confirmação de metadata usando uploadToken.
  return apiFetch<ReturnType<typeof mock.registerCaseEvidence>>(`/cases/${caseId}/evidences`, {
    method: 'POST',
    body: JSON.stringify({ ...payload, uploadToken: upload.uploadToken }),
  });
}

export async function listMyCases() {
  /* OpenAPI Sprint 1 não define listagem de casos do consumidor; dados demonstrativos. */
  return mock.listMyCases();
}

export async function getCase(id: string) {
  if (useMockApi) return mock.getCaseDetail(id);
  const base = await apiFetch<Record<string, unknown>>(`/cases/${encodeURIComponent(id)}`, { method: 'GET' });
  return {
    case: {
      id: String(base.id ?? id),
      publicId: (base.publicId as string | null) ?? null,
      status: String(base.status ?? ''),
      description: String(base.description ?? ''),
      company: { legalName: String((base.company as { legalName?: string } | undefined)?.legalName ?? '') },
    },
    timeline: [],
    evidences: [],
    proposals: [],
  } satisfies Awaited<ReturnType<typeof mock.getCaseDetail>>;
}

export async function getCaseAudit(id: string) {
  if (useMockApi) {
    const d = await mock.getCaseDetail(id);
    return { case: d.case, transitions: d.timeline.map((t) => ({ at: t.at, summary: t.label })), termAcceptance: null };
  }
  return apiFetch<{ case: { id: string; status: string }; termAcceptance: unknown }>(
    `/cases/${encodeURIComponent(id)}/audit`,
    { method: 'GET' },
  );
}

export async function companyLogin(input: { email: string; password: string; twoFaCode: string }) {
  const t = await mock.companyLogin(input);
  await saveTokens(t.accessToken, t.refreshToken);
  return t;
}

export async function closeCaseUnresolved(caseId: string, reason: string) {
  if (useMockApi) {
    return { ok: true };
  }
  return apiFetch<Record<string, unknown>>(`/cases/${encodeURIComponent(caseId)}/close-unresolved`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function listCompanyCases() {
  return mock.listCompanyCases();
}

export const mobileApi = {
  listCompanies,
  getCompany,
  registerConsumer,
  confirmConsumer,
  loginConsumer,
  registerCompany,
  confirmCompanyRegistration,
  claimCompany,
  getClaimStatus,
  getActiveTerm,
  openCase,
  registerCaseEvidence,
  listMyCases,
  listCompanyCases,
  getCase,
  getCaseAudit,
  companyLogin,
  closeCaseUnresolved,
};
