# Páginas de criação de denúncia do consumidor

Este documento descreve o fluxo mobile M08–M11 para criação de uma nova denúncia pelo consumidor.

## Escopo

- M08 — Nova Denúncia: empresa alvo
- M09 — Nova Denúncia: descrição do ocorrido
- M10 — Nova Denúncia: evidências
- M11 — Nova Denúncia: termo legal e envio

## Rotas

| Etapa | Rota Expo Router | Arquivo |
|---|---|---|
| Empresa alvo | `/(consumer)/wizard-step1` | `app/(consumer)/wizard-step1.tsx` |
| Descrição | `/(consumer)/wizard-step2` | `app/(consumer)/wizard-step2.tsx` |
| Evidências | `/(consumer)/wizard-step3` | `app/(consumer)/wizard-step3.tsx` |
| Termo e envio | `/(consumer)/wizard-step4` | `app/(consumer)/wizard-step4.tsx` |

## Objetivo do fluxo

Permitir que o consumidor abra um caso estruturado, informe a empresa envolvida, descreva o ocorrido, prepare metadados de evidências e aceite o termo legal antes do envio.

## Helpers testáveis

Arquivo: `src/wizard/report-wizard.ts`

Responsabilidades:

- `normalizeWizardParam`: normaliza parâmetros vindos do Expo Router.
- `validateCompanyStep`: valida empresa obrigatória.
- `validateDescriptionStep`: valida descrição mínima.
- `validateEvidenceDraft`: valida metadados de evidência.
- `buildEvidenceDraft`: normaliza o draft de evidência salvo no contexto do wizard.
- `validateLegalAcceptance`: exige termo ativo e aceite.
- `buildOpenCasePayload`: centraliza a montagem do payload de abertura de caso.
- `formatBytes`: formata limites de tamanho para mensagens de UI.

Testes: `src/wizard/report-wizard.spec.ts`

## Validações por etapa

### Etapa 1 — Empresa alvo

- `companyId` é obrigatório.
- Valor é normalizado com `trim()` antes de avançar.

### Etapa 2 — Descrição

- Descrição é obrigatória.
- Descrição deve conter pelo menos 50 caracteres.

### Etapa 3 — Evidências

Nesta etapa o app ainda coleta metadados de evidência. O upload binário real segue fora do escopo atual.

Campos validados:

- Nome do arquivo obrigatório.
- MIME obrigatório.
- Tamanho em bytes deve ser numérico e positivo.
- Limites por tipo:
  - Imagens: até 10 MB.
  - PDF: até 20 MB.
  - Vídeos: até 50 MB.
  - Outros tipos: até 20 MB.

### Etapa 4 — Termo legal e envio

- Termo legal ativo deve estar carregado.
- Consumidor deve aceitar o termo.
- Payload de abertura é montado por helper testável.
- Evidências são registradas após criação do caso.
- Falha individual de evidência não bloqueia o caso criado no fluxo atual.

## APIs consumidas

| Etapa | Método do client | Objetivo |
|---|---|---|
| Etapa 4 | `mobileApi.getActiveTerm()` | Carrega termo legal ativo |
| Etapa 4 | `mobileApi.openCase(payload)` | Cria o caso |
| Etapa 4 | `mobileApi.registerCaseEvidence(caseId, evidence)` | Registra metadados de evidência após criação |

## Payload de abertura de caso

O helper `buildOpenCasePayload` mantém os campos esperados pelo contrato atual:

```ts
{
  companyId,
  experienceType: 'reclamacao',
  category: 'ecommerce',
  description,
  occurredAt,
  legalAcceptance: {
    termId,
    contentHashEcho,
  },
}
```

## Validação manual

1. Acesse `/(consumer)/wizard-step1`.
2. Tente avançar sem empresa e confirme mensagem de erro.
3. Informe empresa e avance.
4. Tente descrição curta e confirme mensagem de erro.
5. Informe descrição com pelo menos 50 caracteres e avance.
6. Informe evidência inválida e confirme mensagem de erro.
7. Informe evidência válida e avance.
8. Tente enviar sem aceitar o termo e confirme mensagem de erro.
9. Aceite o termo e envie.
10. Confirme mensagem de sucesso e acesso a Meus Casos.

## Comandos de validação

```bash
npm ci
npm test
npm run lint
npm run build
```

## Fora do escopo desta tarefa

- Upload binário real.
- Picker nativo de arquivo/imagem.
- Novos endpoints.
- Alterações na API.
- Alterações no backend.
- Telas empresa/admin.
