/**
 * Mocks tipados — usados quando `EXPO_PUBLIC_USE_MOCK_API=true`
 * ou quando não existe endpoint público equivalente (catálogo de empresas).
 */
import type {
  RegisterConsumerInput,
  RegisterConfirmInput,
  RegisterCompanyInput,
  ClaimCompanyInput,
  OpenCaseInput,
} from '@/api/types';

export async function registerConsumer(input: RegisterConsumerInput): Promise<{ userId: string; registrationToken: string }> {
  return { userId: '00000000-0000-4000-8000-000000000001', registrationToken: 'mock-registration-token' };
}

export async function confirmConsumer(input: RegisterConfirmInput): Promise<{ accessToken: string; refreshToken: string }> {
  return { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };
}

export async function loginConsumer(input: { email: string; password: string }): Promise<{ accessToken: string; refreshToken: string }> {
  return { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };
}

export async function registerCompany(input: RegisterCompanyInput): Promise<{ userId: string; registrationToken: string }> {
  return { userId: '00000000-0000-4000-8000-000000000002', registrationToken: 'mock-company-registration-token' };
}

export async function confirmCompanyRegistration(input: RegisterConfirmInput): Promise<{
  accessToken: string;
  totpSecret: string;
  qrCodeDataUrl: string;
  recoveryCodes: string[];
}> {
  return {
    accessToken: 'mock-totp-pending-token',
    totpSecret: 'MOCKSECRET',
    qrCodeDataUrl: 'data:image/png;base64,',
    recoveryCodes: ['0000000001', '0000000002'],
  };
}

export async function claimCompany(input: ClaimCompanyInput): Promise<{ claimId: string; registrationToken: string }> {
  return { claimId: '00000000-0000-4000-8000-000000000099', registrationToken: 'mock-claim-registration-token' };
}

export async function claimStatus(_claimId: string): Promise<{ claimId: string; status: string; submittedAt: string; reviewedAt: string | null; rejectionReason: string | null }> {
  return {
    claimId: '00000000-0000-4000-8000-000000000099',
    status: 'pending_review',
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    rejectionReason: null,
  };
}

export async function openCase(input: OpenCaseInput): Promise<{ id: string; publicId: string | null; status: string }> {
  return { id: '00000000-0000-4000-8000-000000000010', publicId: 'TC-2026-000123', status: 'ENVIADO' };
}

export type CompanyListItem = { id: string; legalName: string; trustScore: number | null; badge: string };

export async function listCompanies(): Promise<CompanyListItem[]> {
  return [
    { id: '00000000-0000-4000-8000-0000000000a1', legalName: 'Acme Tecnologia (mock)', trustScore: 7.8, badge: 'Verificada' },
    { id: '00000000-0000-4000-8000-0000000000a2', legalName: 'Serviços Rápidos (mock)', trustScore: null, badge: 'Pendente API Trust Score' },
  ];
}

export async function getCompany(id: string): Promise<CompanyListItem & { description: string }> {
  return {
    id,
    legalName: 'Empresa (mock)',
    trustScore: 6.5,
    badge: 'Demonstração',
    description: 'Dados de demonstração — endpoint público de detalhe não faz parte do bundle OpenAPI Sprint 1.',
  };
}

export async function getActiveTerm(): Promise<{
  id: string;
  version: string;
  contentHash: string;
  content: string;
}> {
  return {
    id: 'term-mock-1',
    version: '1.0.0',
    contentHash: 'a'.repeat(64),
    content: 'Termo legal de demonstração. Aceite obrigatório para avançar.',
  };
}

export async function registerCaseEvidence(
  _caseId: string,
  _payload: { fileName: string; mimeType: string; sizeBytes: number; checksumSha256?: string; description?: string },
): Promise<{ upload: { method: string } }> {
  return { upload: { method: 'SIGNED_UPLOAD_PENDING' } };
}

export type ConsumerCaseListItem = {
  id: string;
  publicId: string | null;
  status: string;
  companyName: string;
  updatedAt: string;
};

export async function listMyCases(): Promise<ConsumerCaseListItem[]> {
  return [
    {
      id: '00000000-0000-4000-8000-000000000020',
      publicId: 'TC-2026-000020',
      status: 'PUBLICADO',
      companyName: 'Acme (mock)',
      updatedAt: new Date().toISOString(),
    },
  ];
}

export type CaseDetailMock = {
  case: {
    id: string;
    publicId: string | null;
    status: string;
    description: string;
    company: { legalName: string };
  };
  timeline: Array<{ at: string; label: string }>;
  evidences: Array<{ id: string; fileName: string; status: string }>;
  proposals: Array<{ id: string; title: string; status: 'open' | 'accepted' | 'rejected' }>;
};

export async function getCaseDetail(id: string): Promise<CaseDetailMock> {
  return {
    case: {
      id,
      publicId: 'TC-2026-000020',
      status: 'EM_NEGOCIACAO',
      description: 'Descrição resumida do caso (mock).',
      company: { legalName: 'Acme (mock)' },
    },
    timeline: [
      { at: new Date().toISOString(), label: 'Caso criado' },
      { at: new Date().toISOString(), label: 'Publicado' },
    ],
    evidences: [{ id: '1', fileName: 'foto.jpg', status: 'uploaded' }],
    proposals: [{ id: 'p1', title: 'Proposta de acordo (mock)', status: 'open' }],
  };
}

export async function companyLogin(_: { email: string; password: string; twoFaCode: string }): Promise<{ accessToken: string; refreshToken: string }> {
  return { accessToken: 'mock-company-access', refreshToken: 'mock-company-refresh' };
}

export async function listCompanyCases(): Promise<ConsumerCaseListItem[]> {
  return [
    {
      id: '00000000-0000-4000-8000-000000000030',
      publicId: 'TC-2026-000030',
      status: 'AGUARDANDO_RESPOSTA_EMPRESA',
      companyName: 'Consumidor (mock)',
      updatedAt: new Date().toISOString(),
    },
  ];
}
