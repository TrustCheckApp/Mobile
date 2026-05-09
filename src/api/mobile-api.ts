import { axiosClient } from './axios-client';
import type {
  RegisterConsumerInput,
  RegisterConfirmInput,
  RegisterCompanyInput,
  ClaimCompanyInput,
  OpenCaseInput,
} from './types';

export const mobileApi = {
  auth: {
    registerConsumer: (input: RegisterConsumerInput) =>
      axiosClient.post('/auth/consumer/register', input),

    confirmConsumer: (input: RegisterConfirmInput) =>
      axiosClient.post('/auth/consumer/register/confirm', input),

    registerCompany: (input: RegisterCompanyInput) =>
      axiosClient.post('/auth/company/register', input),

    confirmCompany: (input: RegisterConfirmInput) =>
      axiosClient.post('/auth/company/register/confirm', input),

    claimCompany: (input: ClaimCompanyInput) =>
      axiosClient.post('/auth/company/claim', input),

    getCompanyClaimStatus: (claimId: string) =>
      axiosClient.get(`/auth/company/claim/${claimId}/status`),

    googleSsoLogin: (input: { idToken: string }) =>
      axiosClient.post('/auth/sso/google', input),

    appleSsoLogin: (input: { idToken: string }) =>
      axiosClient.post('/auth/sso/apple', input),
  },

  cases: {
    create: (input: OpenCaseInput) =>
      axiosClient.post('/cases', input),

    get: (id: string) =>
      axiosClient.get(`/cases/${id}`),

    getAudit: (id: string) =>
      axiosClient.get(`/cases/${id}/audit`),

    startModeration: (id: string) =>
      axiosClient.post(`/cases/${id}/moderation/start`),

    approve: (id: string, input: { justification: string }) =>
      axiosClient.post(`/cases/${id}/moderation/approve`, input),

    reject: (id: string, input: { justification: string }) =>
      axiosClient.post(`/cases/${id}/moderation/reject`, input),

    notifyCompany: (id: string) =>
      axiosClient.post(`/cases/${id}/notify-company`),

    companyRespond: (id: string, input: { response: string }) =>
      axiosClient.post(`/cases/${id}/company/respond`, input),

    resolve: (id: string) =>
      axiosClient.post(`/cases/${id}/resolve`),

    closeUnresolved: (id: string) =>
      axiosClient.post(`/cases/${id}/close-unresolved`),
  },
};
