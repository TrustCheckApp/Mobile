import { apiRequest } from './client';
import type {
  RegisterConsumerInput,
  RegisterConfirmInput,
  RegisterCompanyInput,
  ClaimCompanyInput,
  OpenCaseInput,
} from './types';
import { mockApi } from '@/mocks/api';

export const mobileApi = {
  registerConsumer: (input: RegisterConsumerInput) =>
    apiRequest('/auth/consumer/register', { method: 'POST', body: JSON.stringify(input) }, () => mockApi.registerConsumer(input)),

  confirmConsumer: (input: RegisterConfirmInput) =>
    apiRequest('/auth/consumer/register/confirm', { method: 'POST', body: JSON.stringify(input) }, () => mockApi.confirmConsumer(input)),

  registerCompany: (input: RegisterCompanyInput) =>
    apiRequest('/auth/company/register', { method: 'POST', body: JSON.stringify(input) }, () => mockApi.registerCompany(input)),

  claimCompany: (input: ClaimCompanyInput) =>
    apiRequest('/auth/company/claim', { method: 'POST', body: JSON.stringify(input) }, () => mockApi.claimCompany(input)),

  openCase: (input: OpenCaseInput) =>
    apiRequest('/cases', { method: 'POST', body: JSON.stringify(input) }, () => mockApi.openCase(input)),

  listCompanies: () =>
    apiRequest('/companies', { method: 'GET' }, () => mockApi.listCompanies()),

  getCompany: (id: string) =>
    apiRequest(`/companies/${id}`, { method: 'GET' }, () => mockApi.getCompany(id)),

  getActiveTerm: () =>
    apiRequest('/legal-terms/active?kind=termos_uso', { method: 'GET' }, () => mockApi.getActiveTerm()),

  getSignedUpload: (payload: { caseId: string; evidenceType: string; fileName: string; contentType: string; contentLength: number }) =>
    apiRequest('/integrations/media/signed-upload', { method: 'POST', body: JSON.stringify(payload) }, () => mockApi.getSignedUpload(payload)),
};
