## 🎯 Tarefa
- **ID:** TC-S2-MOB-05
- **Sprint:** 02 (08/05 a 15/05)
- **Prioridade:** P1
- **Story Points:** 3
- **Repositório:** Mobile

## 📝 Descrição
Implementa a tela Meus Casos com listagem de casos do consumidor via GET /cases?owner=me. Adiciona filtros por status (chips horizontais), busca por publicId ou empresa com debounce 300ms, pull-to-refresh, empty state com CTA para abrir denúncia, e loading skeleton durante fetch inicial. Tap no card navega para Detalhe do Caso (M13).

## 🔧 Mudanças por commit
Listar cada commit em ordem cronológica com 1 linha explicativa:

- `feat(cases): cria hook useMyCases com filtros e busca [TC-S2-MOB-05]` — cria hook para buscar casos, filtrar por status, buscar com debounce e formatar tempo relativo
- `feat(cases): cria componente CaseCard [TC-S2-MOB-05]` — cria componente de card para exibir caso com publicId, empresa, status e updatedAt
- `feat(cases): implementa tela Meus Casos com lista, filtros e busca [TC-S2-MOB-05]` — implementa tela com FlatList, pull-to-refresh, filtros por status, busca com debounce, empty state e loading skeleton

## 📂 Arquivos impactados
Lista resumida agrupada por área:
- `src/features/cases/useMyCases.ts` (novo) — Hook para buscar casos, filtrar por status, buscar com debounce e formatar tempo relativo
- `src/components/CaseCard.tsx` (novo) — Componente de card para exibir caso com publicId, empresa, status colorido e updatedAt formatado
- `app/(consumer)/meus-casos.tsx` (novo) — Tela com FlatList, pull-to-refresh, filtros por status (chips), busca com debounce 300ms, empty state com CTA, loading skeleton

## ✅ Critérios de aceite (do prompt original)
Marcar cada checkbox conforme cumprido:
- [x] Lista exibe publicId, empresa, status e última atualização
- [x] Empty state aparece corretamente quando API retorna []
- [x] Filtro por status não quebra com lista vazia (sem crash)
- [x] Pull-to-refresh chama API novamente
- [x] Tap em card abre Detalhe do Caso correspondente

## 🧪 Como testar
Passos numerados que o revisor deve executar:
1. `npm install` na raiz do Mobile.
2. Navegar para tela Meus Casos.
3. Verificar lista de casos mock exibida com publicId, empresa, status e updatedAt.
4. Testar filtros por status (chips horizontais).
5. Testar busca por publicId ou empresa com debounce 300ms.
6. Testar pull-to-refresh para recarregar lista.
7. Tap em card para navegar para Detalhe do Caso.
8. Testar empty state quando não há casos.

## 🔗 Dependências e Issues
- Depende de: TC-S1-API-05 (endpoints de cases), TC-S2-MOB-01 (cliente API centralizado).
- Bloqueia: TC-S2-MOB-06 (Detalhe do Caso), TC-S2-MOB-07 (fluxo completo de casos).
- Issue: N/A.

## 🚨 Riscos e pontos de atenção para o review
- Fluxo depende de endpoint GET /cases?owner=me estar funcionando na API.
- Mock tipado em USE_MOCKS permite desenvolvimento sem backend real.
- Debounce de 300ms para busca precisa teste manual para validar UX.
- Navegação para Detalhe do Caso (M13) ainda não implementada, precisa validar rota.

## 📸 Evidências (quando aplicável)
N/A (requer teste manual em iOS/Android com prints da tela Meus Casos com filtros e busca).

## ⛔ Não-merge
**Esta PR NÃO deve ser mergeada pelo autor.** Aguardando code review e aprovação humana.
