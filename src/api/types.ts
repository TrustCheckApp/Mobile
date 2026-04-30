export type RoleChoice = 'consumer' | 'company';

export interface RegisterConsumerInput {
  email: string;
  password: string;
  fullName: string;
  lgpdAccepted: boolean;
  lgpdVersion: string;
}

export interface RegisterConfirmInput {
  registrationToken: string;
  otp: string;
}

export interface RegisterCompanyInput {
  email: string;
  password: string;
  cnpj: string;
  legalName: string;
  fullName: string;
  lgpdAccepted: boolean;
  lgpdVersion: string;
}

export interface ClaimCompanyInput {
  cnpj: string;
  legalName: string;
  email: string;
  password: string;
  fullName: string;
  documents: Array<{ url: string; fileName: string; mimeType: string; sizeBytes: number }>;
  lgpdAccepted: boolean;
  lgpdVersion: string;
}

export interface OpenCaseInput {
  companyId: string;
  experienceType: 'reclamacao' | 'denuncia' | 'elogio' | 'duvida_resolvida';
  category: 'imoveis' | 'servicos' | 'ecommerce' | 'financeiro' | 'saude' | 'educacao' | 'outro';
  description: string;
  occurredAt: string;
  legalAcceptance: { termId: string; contentHashEcho: string };
}
