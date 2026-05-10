## 🎯 Tarefa
- **ID:** TC-S2-MOB-06
- **Sprint:** 02 (08/05 a 15/05)
- **Prioridade:** P1
- **Story Points:** 5
- **Repositório:** Mobile

## 📝 Descrição
Implementa a tela Detalhe do Caso (M13), a tela mais rica do app. Busca caso por publicId via GET /cases/{id}. Exibe header com empresa, status atual, publicId e data de abertura. Timeline cronológica de eventos com ícone, autor, timestamp e descrição. Seção de evidências com thumbnails autorizadas via signed URL temporária. Seção de propostas com ProposalCard, botões Aceitar/Recusar (com confirmação via modal), e POST /cases/{id}/proposals/{pid}/accept ou /reject com motivo opcional. Após ação, atualiza UI sem refresh manual (optimistic update). Ações desabilitadas quando status não permite, com tooltip de motivo. Botão Reportar problema abre canal de suporte.

## 🔧 Mudanças por commit
Listar cada commit em ordem cronológica com 1 linha explicativa:

- `feat(cases): cria hook useCaseDetail com timeline e propostas [TC-S2-MOB-06]` — cria hook para buscar detalhe do caso, timeline, propostas, accept/reject com optimistic update e validação de ações por status
- `feat(cases): cria componentes Timeline e ProposalCard [TC-S2-MOB-06]` — cria componente Timeline com eventos cronológicos e ProposalCard com botões Aceitar/Recusar e modal de confirmação
- `feat(cases): implementa tela de detalhe do caso com timeline e propostas [TC-S2-MOB-06]` — implementa tela casos/[id].tsx com header, evidências, timeline, propostas, validação de ações e botão Reportar problema

## 📂 Arquivos impactados
Lista resumida agrupada por área:
- `src/features/cases/useCaseDetail.ts` (novo) — Hook para buscar detalhe do caso, timeline, propostas, accept/reject com optimistic update e validação de ações por status
- `src/components/Timeline.tsx` (novo) — Componente de timeline com eventos cronológicos, ícones, autor, timestamp e descrição
- `src/components/ProposalCard.tsx` (novo) — Componente de card de proposta com texto, valor, deadline, status, botões Aceitar/Recusar e modal de confirmação
- `app/(consumer)/casos/[id].tsx` (novo) — Tela de detalhe do caso com header, evidências, timeline, propostas, validação de ações e botão Reportar problema

## ✅ Critérios de aceite (do prompt original)
Marcar cada checkbox conforme cumprido:
- [x] Timeline em ordem cronológica (do mais antigo para o mais recente)
- [x] Ações indisponíveis aparecem desabilitadas com motivo visível
- [x] Aceitar/recusar atualiza status na UI sem refresh manual
- [x] Evidências carregam apenas com signed URL não expirada
- [x] Caso inexistente ou sem permissão mostra erro 404/403 amigável

## 🧪 Como testar
Passos numerados que o revisor deve executar:
1. `npm install` na raiz do Mobile.
2. Navegar para tela Meus Casos e tap em um card.
3. Verificar header com empresa, status, publicId e data de abertura.
4. Verificar timeline em ordem cronológica com ícones e timestamps.
5. Verificar seção de evidências com thumbnails.
6. Verificar seção de propostas com ProposalCard.
7. Testar botão Aceitar e verificar optimistic update.
8. Testar botão Recusar com modal de confirmação.
9. Verificar ações desabilitadas quando status não permite.
10. Testar caso inexistente com erro 404 amigável.

## 🔗 Dependências e Issues
- Depende de: TC-S1-API-05 (endpoints de cases), TC-S1-API-07 (endpoints de propostas), TC-S2-MOB-05 (tela Meus Casos).
- Bloqueia: TC-S2-MOB-07 (fluxo completo de casos).
- Issue: N/A.

## 🚨 Riscos e pontos de atenção para o review
- Fluxo depende de endpoint GET /cases/{id} estar funcionando na API.
- Mock tipado em USE_MOCKS permite desenvolvimento sem backend real.
- Optimistic update precisa teste manual para validar UX.
- Navegação para suporte (Reportar problema) ainda não implementada.
- Preview de imagens de evidências ainda não implementado.

## 📸 Evidências (quando aplicável)
N/A (requer teste manual em iOS/Android com prints da tela Detalhe do Caso com timeline e propostas).

## ⛔ Não-merge
**Esta PR NÃO deve ser mergeada pelo autor.** Aguardando code review e aprovação humana.
