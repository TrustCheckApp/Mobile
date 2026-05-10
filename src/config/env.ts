/**
 * Configuração de ambiente do app (Expo).
 *
 * `EXPO_PUBLIC_USE_MOCK_API=true` — não chama a rede; usa apenas mocks tipados (útil offline / CI).
 * `EXPO_PUBLIC_USE_MOCK_API=false` — chama a API real; catálogo público de empresas continua em mock
 *   até existir endpoint no contrato Sprint 1 (ver mensagem na UI).
 */
export function parseUseMockApi(raw: string | undefined): boolean {
  return raw === '1' || raw === 'true';
}

export const useMockApi = parseUseMockApi(process.env.EXPO_PUBLIC_USE_MOCK_API);

export const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
