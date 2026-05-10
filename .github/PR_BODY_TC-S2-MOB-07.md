## 🎯 Tarefa
- **ID:** TC-S2-MOB-07
- **Sprint:** 02 (08/05 a 15/05)
- **Prioridade:** P1
- **Story Points:** 4
- **Repositório:** Mobile

## 📝 Descrição
Evolui a área da empresa (E04-E06) com dashboard, fila e detalhe de caso. Dashboard exibe Trust Score atual com flecha up/down vs período anterior, contador de casos por status, estado vazio honesto se Trust Score ainda não foi calculado ("Trust Score em apuração"), e atalhos para Fila e Configurações. Fila de casos lista filtrável por status (aguardando resposta, em negociação, em análise, fechado), ordenação por SLA estourando primeiro, e cada item com publicId, resumo, dias em aberto e badge de prioridade. Detalhe do caso (visão empresa) tem mesma estrutura que M13 mas com ações de empresa: "Responder", "Propor solução", "Solicitar evidência adicional". Acesso autorizado APENAS se a empresa logada for a empresa-alvo do caso (verificar no backend, mas também no client com o claim). Indicadores honestos: se não houver dados, mostrar "Sem dados ainda" em vez de zeros que enganam. PII do consumidor é mascarado (consumer_display_name mascarado como C*** S***).

## 🔧 Mudanças por commit
Listar cada commit em ordem cronológica com 1 linha explicativa:

- `feat(company): cria hook useCompanyDashboard com Trust Score e fila [TC-S2-MOB-07]` — cria hook para buscar dashboard data com Trust Score, casos por status, fila de casos com filtros e ordenação por SLA
- `feat(company): implementa dashboard, fila e detalhe de caso na visão empresa [TC-S2-MOB-07]` — implementa dashboard com Trust Score e contadores, fila com filtros por status, e detalhe de caso na visão empresa com ações específicas e bloqueio de acesso a caso de outra empresa

## 📂 Arquivos impactados
Lista resumida agrupada por área:
- `src/features/company/useCompanyDashboard.ts` (novo) — Hook para buscar dashboard data com Trust Score, casos por status, fila de casos com filtros e ordenação por SLA
- `app/(company)/dashboard.tsx` (modificado) — Implementa dashboard com Trust Score (com estado vazio honesto), contador de casos por status, e atalhos para Fila e Configurações
- `app/(company)/fila.tsx` (novo) — Implementa fila de casos com filtros por status, ordenação por SLA estourando primeiro, e cards com publicId, resumo, dias em aberto e badge de prioridade
- `app/(company)/casos/[id].tsx` (novo) — Implementa detalhe de caso na visão empresa com ações específicas (Responder, Propor solução, Solicitar evidência adicional) e bloqueio de acesso a caso de outra empresa (403 amigável)

## ✅ Critérios de aceite (do prompt original)
Marcar cada checkbox conforme cumprido:
- [x] Dashboard exibe Trust Score real ou estado vazio explícito
- [x] Fila filtra corretamente por "aguardando resposta" e "em negociação"
- [x] Detalhe respeita acesso: tentar acessar caso de outra empresa retorna 403
- [x] Empresa não vê dados de PII do consumidor além do permitido (campo consumer_display_name mascarado)

## 🧪 Como testar
Passos numerados que o revisor deve executar:
1. `npm install` na raiz do Mobile.
2. Navegar para Dashboard da empresa.
3. Verificar Trust Score com flecha up/down ou estado vazio "Em apuração".
4. Verificar contador de casos por status.
5. Navegar para Fila de Casos.
6. Testar filtros por status (aguardando resposta, em negociação, etc).
7. Verificar ordenação por SLA estourando primeiro.
8. Tap em um caso para abrir Detalhe do Caso.
9. Verificar ações específicas da empresa (Responder, Propor solução, Solicitar evidência adicional).
10. Tentar acessar caso de outra empresa (via URL direta) e verificar 403 amigável.
11. Verificar PII do consumidor mascarado (consumer_display_name como C*** S***).

## 🔗 Dependências e Issues
- Depende de: TC-S1-API-08 (endpoints de empresa), TC-S1-API-05 (endpoints de cases), TC-S2-MOB-03 (autenticação da empresa).
- Bloqueia: TC-S2-MOB-08 a TC-S2-MOB-10 (fluxo completo da empresa).
- Issue: N/A.

## 🚨 Riscos e pontos de atenção para o review
- Fluxo depende de endpoints de empresa e cases estarem funcionando na API.
- Mock tipado em USE_MOCKS permite desenvolvimento sem backend real.
- Mascaramento de PII (consumer_display_name) precisa revisão de privacidade conforme LGPD.
- Ações específicas da empresa (Responder, Propor solução, Solicitar evidência adicional) ainda não implementadas funcionalmente.

## 📸 Evidências (quando aplicável)
N/A (requer teste manual em iOS/Android com prints do Dashboard, Fila e Detalhe do Caso na visão empresa).

## ⛔ Não-merge
**Esta PR NÃO deve ser mergeada pelo autor.** Aguardando code review e aprovação humana. Validar com revisor de privacidade que mascaramento de PII está conforme política.
