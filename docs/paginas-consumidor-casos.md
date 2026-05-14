# Páginas de casos do consumidor

Este documento descreve as páginas mobile de acompanhamento de casos do consumidor no app TrustCheck.

## Escopo

- M12 — Meus Casos
- M13 — Detalhe do Caso

## Rotas

| Tela | Rota Expo Router | Arquivo |
|---|---|---|
| Meus Casos | `/(consumer)/meus-casos` | `app/(consumer)/meus-casos.tsx` |
| Detalhe do Caso | `/(consumer)/casos/[id]` | `app/(consumer)/casos/[id].tsx` |

## Objetivo das páginas

### Meus Casos

Permitir que o consumidor acompanhe a carteira de casos enviados, filtre por status e acesse o detalhe de cada caso.

Estados de UI:

- Loading ao carregar casos.
- Erro quando a API falha.
- Vazio quando não há casos.
- Vazio filtrado quando o filtro selecionado não possui resultado.
- Sucesso com lista de casos.

### Detalhe do Caso

Permitir que o consumidor acompanhe o caso ponta a ponta, visualizando:

- Identificador público.
- Status amigável.
- Empresa vinculada.
- Descrição.
- Timeline.
- Evidências autorizadas.
- Propostas/negociação.
- Ações disponíveis conforme status.

## APIs consumidas

| Tela | Método do client | Objetivo |
|---|---|---|
| Meus Casos | `mobileApi.listMyCases()` | Lista casos do consumidor autenticado ou mocks, conforme configuração |
| Detalhe do Caso | `mobileApi.getCase(id)` | Carrega dados consolidados do caso |
| Detalhe do Caso | `mobileApi.getCaseAudit(id)` | Carrega aceite legal/auditoria quando disponível |
| Detalhe do Caso | `mobileApi.closeCaseUnresolved(id, reason)` | Encerra caso como não resolvido quando o consumidor recusa acordo em negociação |

## Helpers testáveis

Arquivo: `src/cases/case-ui.ts`

Responsabilidades:

- `formatCaseStatus`: converte status técnico em label em português.
- `getCaseStatusFilters`: centraliza filtros de Meus Casos.
- `canConsumerRejectNegotiation`: define quando o consumidor pode recusar acordo.
- `formatCaseUpdatedAt`: formata datas com fallback seguro.
- `getCaseEmptyMessage`: diferencia mensagens de vazio geral e por filtro.
- `getCasePrimaryActionLabel`: descreve ação principal disponível no detalhe.

Testes: `src/cases/case-ui.spec.ts`

## Regras de negócio refletidas na UI

- A recusa de acordo pelo consumidor só aparece como ação habilitada em `EM_NEGOCIACAO`.
- Status técnicos são exibidos com labels amigáveis.
- A tela de detalhe preserva histórico/timeline quando disponível.
- Evidências e propostas são exibidas somente com metadados necessários, sem expor conteúdo sensível.

## Validação manual

1. Execute o app com mocks ou API real.
2. Acesse `/(consumer)/meus-casos`.
3. Verifique os filtros de status.
4. Toque em um caso da lista.
5. Verifique status, empresa, descrição, timeline, evidências e negociação.
6. Em caso com status `EM_NEGOCIACAO`, valide que a ação de recusar acordo fica habilitada.
7. Em outros status, valide que a ação fica desabilitada.

## Comandos de validação

```bash
npm ci
npm test
npm run lint
npm run build
```

## Fora do escopo desta tarefa

- Implementar negociação completa.
- Criar endpoints novos.
- Implementar upload de evidências.
- Criar páginas empresa.
- Alterar contratos da API.
