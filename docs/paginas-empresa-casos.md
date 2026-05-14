# Páginas de casos da empresa

Este documento descreve a primeira página operacional da empresa no app mobile do TrustCheck.

## Escopo

- Dashboard da empresa
- Fila de casos recebidos
- Filtros por status
- Contadores operacionais

## Rotas

| Tela | Rota Expo Router | Arquivo |
|---|---|---|
| Dashboard / Fila da Empresa | `/(company)/dashboard` | `app/(company)/dashboard.tsx` |

## Objetivo da tela

Permitir que a empresa acompanhe casos recebidos, priorize respostas e identifique negociações em andamento.

## Helpers testáveis

Arquivo: `src/company-cases/company-cases-ui.ts`

Responsabilidades:

- `formatCompanyCaseStatus`: converte status técnico em label amigável.
- `getCompanyCaseStatusFilters`: centraliza filtros da fila.
- `filterCompanyCasesByStatus`: aplica filtro selecionado.
- `countCompanyCasesByStatus`: calcula contadores operacionais.
- `getCompanyCasesEmptyMessage`: centraliza mensagens de vazio.
- `getCompanyCasesErrorMessage`: centraliza mensagem de erro.
- `getCompanyCasePrimaryActionLabel`: define CTA principal por status.
- `formatCompanyCaseUpdatedAt`: formata data de atualização com fallback seguro.

Testes: `src/company-cases/company-cases-ui.spec.ts`

## Estados de UI

- Loading enquanto carrega a fila.
- Erro quando a API falha.
- Vazio quando não há casos.
- Vazio filtrado quando o filtro selecionado não possui resultado.
- Sucesso com contadores, filtros e lista.

## Contadores exibidos

- Total de casos.
- Casos aguardando resposta da empresa.
- Casos em negociação.

## Status e CTAs

| Status técnico | Label | CTA atual |
|---|---|---|
| `AGUARDANDO_RESPOSTA_EMPRESA` | Aguardando resposta | Responder caso |
| `EM_NEGOCIACAO` | Em negociação | Ver negociação |
| `PUBLICADO` | Publicado | Ver detalhes |
| `RESOLVIDO` | Resolvido | Ver detalhes |
| `NAO_RESOLVIDO` | Não resolvido | Ver detalhes |

Os CTAs ficam visuais/desabilitados nesta tarefa porque a rota de detalhe da empresa ainda não faz parte do escopo.

## API consumida

| Método do client | Objetivo |
|---|---|
| `mobileApi.listCompanyCases()` | Lista casos visíveis para a empresa autenticada ou mocks, conforme configuração |

## Validação manual

1. Acesse `/(company)/dashboard`.
2. Aguarde carregamento da fila.
3. Confira os cards de contagem.
4. Alterne os filtros por status.
5. Confirme mensagens de vazio geral e por filtro.
6. Confirme labels amigáveis de status.
7. Confirme que o CTA textual muda conforme status.

## Comandos de validação

```bash
npm ci
npm test
npm run lint
npm run build
```

## Fora do escopo desta tarefa

- Detalhe do caso da empresa.
- Resposta da empresa.
- Negociação completa.
- Trust Score real.
- Novos endpoints.
- Alterações no backend.
