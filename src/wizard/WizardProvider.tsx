import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type WizardEvidenceDraft = {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  description?: string;
};

type WizardCtx = {
  evidenceDrafts: WizardEvidenceDraft[];
  setEvidenceDrafts: (v: WizardEvidenceDraft[]) => void;
  clear: () => void;
};

const Ctx = createContext<WizardCtx | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [evidenceDrafts, setEvidenceDrafts] = useState<WizardEvidenceDraft[]>([]);
  const clear = useCallback(() => setEvidenceDrafts([]), []);
  const value = useMemo(
    () => ({ evidenceDrafts, setEvidenceDrafts, clear }),
    [evidenceDrafts, clear],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWizard(): WizardCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useWizard fora de WizardProvider');
  return v;
}
