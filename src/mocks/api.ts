import type { ClaimCompanyInput, OpenCaseInput, RegisterCompanyInput, RegisterConfirmInput, RegisterConsumerInput } from '@/api/types';

export const mockApi = {
  async registerConsumer(_: RegisterConsumerInput) {
    return { userId: crypto.randomUUID(), registrationToken: 'mock-reg-token-consumer' };
  },
  async confirmConsumer(_: RegisterConfirmInput) {
    return { accessToken: 'mock-access', refreshToken: 'mock-refresh' };
  },
  async registerCompany(_: RegisterCompanyInput) {
    return { userId: crypto.randomUUID(), registrationToken: 'mock-reg-token-company' };
  },
  async claimCompany(_: ClaimCompanyInput) {
    return { claimId: crypto.randomUUID(), registrationToken: 'mock-claim-token' };
  },
  async openCase(_: OpenCaseInput) {
    return { id: crypto.randomUUID(), publicId: 'TC-2026-000123', status: 'ENVIADO' };
  },
  async listCompanies() {
    return [
      { id: 'cmp-1', legalName: 'Loja Exemplo SA', trustScore: 7.8, badge: 'Verificada' },
      { id: 'cmp-2', legalName: 'Servico Rapido Ltda', trustScore: 5.1, badge: 'Em analise' },
    ];
  },
  async getCompany(id: string) {
    return { id, legalName: 'Loja Exemplo SA', trustScore: 7.8, badge: 'Verificada', description: 'Atendimento ao consumidor.' };
  },
  async getActiveTerm() {
    return { id: 'term-1', version: '1.0.0', contentHash: 'abc123hash', content: 'Termo legal vigente.' };
  },
  async getSignedUpload(payload: { fileName: string }) {
    return { key: `cases/mock/${payload.fileName}`, uploadUrl: 'https://signed-upload.example/mock', expiresIn: 900 };
  },
};
