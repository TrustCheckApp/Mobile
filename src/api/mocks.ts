// Simple mock data for development when USE_MOCKS=true
// This provides a lightweight alternative to MSW for React Native

export const mockResponses = {
  'POST /auth/consumer/register': {
    registrationToken: 'mock-registration-token-123',
  },
  'POST /auth/consumer/register/confirm': {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  },
  'POST /auth/company/register': {
    registrationToken: 'mock-company-registration-token-123',
  },
  'POST /auth/company/register/confirm': {
    accessToken: 'mock-company-access-token',
    totpSecret: 'mock-totp-secret',
    qrCodeDataUrl: 'data:image/png;base64,mock-qr-code',
    recoveryCodes: ['code1', 'code2', 'code3'],
  },
  'POST /auth/company/claim': {
    claimId: 'mock-claim-id-123',
  },
  'GET /auth/company/claim/{claimId}/status': {
    claimId: 'mock-claim-id-123',
    status: 'pending',
  },
  'POST /auth/sso/google': {
    accessToken: 'mock-google-sso-token',
    refreshToken: 'mock-google-sso-refresh-token',
  },
  'POST /auth/sso/apple': {
    accessToken: 'mock-apple-sso-token',
    refreshToken: 'mock-apple-sso-refresh-token',
  },
  'POST /cases': {
    id: 'mock-case-id-123',
    status: 'draft',
    createdAt: new Date().toISOString(),
  },
  'GET /cases/{id}': {
    id: 'mock-case-id-123',
    status: 'draft',
    createdAt: new Date().toISOString(),
  },
  'GET /cases/{id}/audit': [
    {
      id: 'mock-audit-event-1',
      action: 'created',
      actor: 'user-123',
      timestamp: new Date().toISOString(),
    },
  ],
  'POST /cases/{id}/moderation/start': {
    id: 'mock-case-id-123',
    status: 'pending_moderation',
    createdAt: new Date().toISOString(),
  },
  'POST /cases/{id}/moderation/approve': {
    id: 'mock-case-id-123',
    status: 'published',
    createdAt: new Date().toISOString(),
  },
  'POST /cases/{id}/moderation/reject': {
    id: 'mock-case-id-123',
    status: 'draft',
    createdAt: new Date().toISOString(),
  },
  'POST /cases/{id}/notify-company': {
    id: 'mock-case-id-123',
    status: 'notified',
    createdAt: new Date().toISOString(),
  },
  'POST /cases/{id}/company/respond': {
    id: 'mock-case-id-123',
    status: 'responded',
    createdAt: new Date().toISOString(),
  },
  'POST /cases/{id}/resolve': {
    id: 'mock-case-id-123',
    status: 'resolved',
    createdAt: new Date().toISOString(),
  },
  'POST /cases/{id}/close-unresolved': {
    id: 'mock-case-id-123',
    status: 'closed_unresolved',
    createdAt: new Date().toISOString(),
  },
};

export function getMockResponse(method: string, url: string): unknown {
  const key = `${method} ${url}`;
  return mockResponses[key as keyof typeof mockResponses];
}
