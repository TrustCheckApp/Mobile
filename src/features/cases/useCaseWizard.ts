import { createContext, useContext, useState, ReactNode } from 'react';
import type { OpenCaseInput } from '@/api/types';

export type CaseStep = 1 | 2 | 3 | 4;

export interface CaseWizardData {
  step: CaseStep;
  targetCompanyId: string;
  targetCompanyName: string;
  experienceType: OpenCaseInput['experienceType'];
  category: OpenCaseInput['category'];
  description: string;
  occurredAt: string;
  evidenceFiles: Array<{
    id: string;
    uri: string;
    name: string;
    type: string;
    size: number;
    uploaded: boolean;
    url?: string;
  }>;
  impactAnswers: Record<string, string>;
  legalTermsAccepted: boolean;
  legalTermsVersion: string;
  legalTermId: string;
  legalContentHash: string;
}

interface CaseWizardContextType {
  data: CaseWizardData;
  setStep: (step: CaseStep) => void;
  setTargetCompany: (id: string, name: string) => void;
  setDescription: (description: string, category: OpenCaseInput['category'], experienceType: OpenCaseInput['experienceType'], occurredAt: string) => void;
  addEvidence: (file: CaseWizardData['evidenceFiles'][0]) => void;
  removeEvidence: (id: string) => void;
  updateEvidenceStatus: (id: string, uploaded: boolean, url?: string) => void;
  setImpactAnswers: (answers: Record<string, string>) => void;
  setLegalTerms: (accepted: boolean, version: string, termId: string, contentHash: string) => void;
  resetWizard: () => void;
  validateStep: (step: CaseStep) => boolean;
}

const CaseWizardContext = createContext<CaseWizardContextType | undefined>(undefined);

const initialData: CaseWizardData = {
  step: 1,
  targetCompanyId: '',
  targetCompanyName: '',
  experienceType: 'reclamacao',
  category: 'outro',
  description: '',
  occurredAt: new Date().toISOString(),
  evidenceFiles: [],
  impactAnswers: {},
  legalTermsAccepted: false,
  legalTermsVersion: '1.0.0',
  legalTermId: '',
  legalContentHash: '',
};

export function CaseWizardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CaseWizardData>(initialData);

  const setStep = (step: CaseStep) => {
    setData((prev: CaseWizardData) => ({ ...prev, step }));
  };

  const setTargetCompany = (id: string, name: string) => {
    setData((prev: CaseWizardData) => ({ ...prev, targetCompanyId: id, targetCompanyName: name }));
  };

  const setDescription = (
    description: string,
    category: OpenCaseInput['category'],
    experienceType: OpenCaseInput['experienceType'],
    occurredAt: string
  ) => {
    setData((prev: CaseWizardData) => ({ ...prev, description, category, experienceType, occurredAt }));
  };

  const addEvidence = (file: CaseWizardData['evidenceFiles'][0]) => {
    setData((prev: CaseWizardData) => ({
      ...prev,
      evidenceFiles: [...prev.evidenceFiles, file],
    }));
  };

  const removeEvidence = (id: string) => {
    setData((prev: CaseWizardData) => ({
      ...prev,
      evidenceFiles: prev.evidenceFiles.filter((f: CaseWizardData['evidenceFiles'][0]) => f.id !== id),
    }));
  };

  const updateEvidenceStatus = (id: string, uploaded: boolean, url?: string) => {
    setData((prev: CaseWizardData) => ({
      ...prev,
      evidenceFiles: prev.evidenceFiles.map((f: CaseWizardData['evidenceFiles'][0]) =>
        f.id === id ? { ...f, uploaded, url } : f
      ),
    }));
  };

  const setImpactAnswers = (answers: Record<string, string>) => {
    setData((prev: CaseWizardData) => ({ ...prev, impactAnswers: answers }));
  };

  const setLegalTerms = (accepted: boolean, version: string, termId: string, contentHash: string) => {
    setData((prev: CaseWizardData) => ({
      ...prev,
      legalTermsAccepted: accepted,
      legalTermsVersion: version,
      legalTermId: termId,
      legalContentHash: contentHash,
    }));
  };

  const resetWizard = () => {
    setData(initialData);
  };

  const validateStep = (step: CaseStep): boolean => {
    switch (step) {
      case 1:
        return !!data.targetCompanyId && !!data.targetCompanyName;
      case 2:
        return !!data.description && !!data.occurredAt;
      case 3:
        return true;
      case 4:
        return data.legalTermsAccepted && !!data.legalTermId;
      default:
        return false;
    }
  };

  const value: CaseWizardContextType = {
    data,
    setStep,
    setTargetCompany,
    setDescription,
    addEvidence,
    removeEvidence,
    updateEvidenceStatus,
    setImpactAnswers,
    setLegalTerms,
    resetWizard,
    validateStep,
  };

  return (
    <CaseWizardContext.Provider value={value}>
      {children}
    </CaseWizardContext.Provider>
  );
}

export function useCaseWizard() {
  const context = useContext(CaseWizardContext);
  if (!context) {
    throw new Error('useCaseWizard must be used within CaseWizardProvider');
  }
  return context;
}
