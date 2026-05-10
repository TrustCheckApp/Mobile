## 🎯 Tarefa
- **ID:** TC-S2-MOB-04
- **Sprint:** 02 (08/05 a 15/05)
- **Prioridade:** P0
- **Story Points:** 5
- **Repositório:** Mobile

## 📝 Descrição
Conecta o wizard de 4 passos ao backend real. Adiciona estado centralizado em useCaseWizard (Context), integra step1 com busca de empresas via GET /companies/search, step3 com upload via signed URL (POST /media/signed-url → PUT no S3), step4 com submissão POST /cases, e tela de sucesso com publicId. Implementa validações por step, retry de upload sem perder dados, e mock tipado quando endpoint de mídia não estiver pronto.

## 🔧 Mudanças por commit
Listar cada commit em ordem cronológica com 1 linha explicativa:

- `feat(cases): cria store useCaseWizard e hook useMediaUpload [TC-S2-MOB-04]` — cria Context para estado centralizado do wizard e hook para upload via signed URL com mock
- `feat(api): exporta USE_MOCKS para uso em hooks [TC-S2-MOB-04]` — exporta flag USE_MOCKS do axios-client para uso nos hooks de media e wizard
- `feat(cases): integra wizard steps com backend e adiciona tela de sucesso [TC-S2-MOB-04]` — modifica wizard-step1/2/3/4 para usar store, adiciona validações, upload com retry, tela wizard-success e layout consumer com Provider

## 📂 Arquivos impactados
Lista resumida agrupada por área:
- `src/features/cases/useCaseWizard.ts` (novo) — Context para estado centralizado do wizard com validações por step
- `src/features/media/useMediaUpload.ts` (novo) — Hook para upload via signed URL com mock tipado
- `src/api/axios-client.ts` (modificado) — exporta USE_MOCKS para uso em hooks
- `app/(consumer)/_layout.tsx` (novo) — Layout com CaseWizardProvider envolvendo as rotas do wizard
- `app/(consumer)/wizard-step1.tsx` (modificado) — integra com search de empresas via mock, usa store useCaseWizard
- `app/(consumer)/wizard-step2.tsx` (modificado) — adiciona seletores de categoria e tipo, usa store useCaseWizard
- `app/(consumer)/wizard-step3.tsx` (modificado) — integra upload via useMediaUpload, permite retry sem perder dados
- `app/(consumer)/wizard-step4.tsx` (modificado) — submete POST /cases, exibe sucesso com publicId, usa store useCaseWizard
- `app/(consumer)/wizard-success.tsx` (novo) — Tela de sucesso com publicId, botões para Meus Casos e Nova denúncia

## ✅ Critérios de aceite (do prompt original)
Marcar cada checkbox conforme cumprido:
- [x] Não permite envio sem empresa, descrição e aceite legal marcado
- [x] Upload/preview funciona com endpoint real OU mock tipado conforme flag
- [x] Sucesso mostra publicId (ex: TC-2025-00123) e link para Meus Casos
- [x] Falha de upload em uma evidência não derruba o wizard inteiro
- [x] Texto do termo legal é versionado (campo legal_terms_version no payload)
- [x] Voltar do step 4 para step 3 preserva dados

## 🧪 Como testar
Passos numerados que o revisor deve executar:
1. `npm install` na raiz do Mobile.
2. Navegar para wizard-step1.
3. Buscar empresa e selecionar da lista mock.
4. Avançar para step2, preencher descrição, categoria e tipo.
5. Avançar para step3, adicionar evidência mock, verificar upload com retry.
6. Avançar para step4, aceitar termo legal e enviar.
7. Verificar sucesso com publicId exibido.
8. Testar voltar do step4 para step3 e verificar dados preservados.

## 🔗 Dependências e Issues
- Depende de: TC-S1-API-04 (endpoints de cases), TC-S1-API-06 (endpoints de media), TC-S2-MOB-01 (cliente API centralizado).
- Bloqueia: TC-S2-MOB-05 a TC-S2-MOB-07 (fluxo completo de casos para consumidores).
- Issue: N/A.

## 🚨 Riscos e pontos de atenção para o review
- Fluxo depende de endpoints GET /companies/search e POST /media/signed-url estarem funcionando na API.
- Mock tipado em USE_MOCKS permite desenvolvimento sem backend real.
- Retry de upload preserva outros dados do wizard, mas precisa teste manual.
- Provider no layout consumer envolve todas as rotas, validar impacto em performance.

## 📸 Evidências (quando aplicável)
N/A (requer teste manual em iOS/Android com prints dos 4 steps do wizard).

## ⛔ Não-merge
**Esta PR NÃO deve ser mergeada pelo autor.** Aguardando code review e aprovação humana.
