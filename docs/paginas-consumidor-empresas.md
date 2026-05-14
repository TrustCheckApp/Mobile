# Páginas de descoberta de empresas do consumidor

Este documento descreve a jornada de descoberta de empresas no app mobile do TrustCheck.

## Escopo

- Home / Explorar
- Perfil público da empresa
- Abertura de denúncia com empresa pré-selecionada

## Rotas

| Tela | Rota Expo Router | Arquivo |
|---|---|---|
| Home / Explorar | `/(consumer)/home` | `app/(consumer)/home.tsx` |
| Perfil da Empresa | `/(consumer)/empresa/[id]` | `app/(consumer)/empresa/[id].tsx` |
| Nova Denúncia com empresa | `/(consumer)/wizard-step1?companyId=...` | `app/(consumer)/wizard-step1.tsx` |

## Objetivo da jornada

Permitir que o consumidor encontre empresas, consulte dados básicos de reputação e inicie uma denúncia com a empresa já selecionada.

## Helpers testáveis

Arquivo: `src/companies/company-ui.ts`

Responsabilidades:

- `normalizeCompanyIdParam`: normaliza IDs vindos do Expo Router.
- `formatTrustScore`: exibe score em formato amigável, com fallback seguro.
- `formatCompanyBadge`: exibe selo com fallback seguro.
- `getCompanyEmptyMessage`: centraliza mensagem de lista vazia.
- `getCompanyErrorMessage`: centraliza fallback de erro.
- `buildCompanyReportRoute`: monta rota para nova denúncia com `companyId`.
- `getCompanyProfileDescription`: evita descrição vazia no perfil.

Testes: `src/companies/company-ui.spec.ts`

## Home / Explorar

A Home lista empresas disponíveis via `mobileApi.listCompanies()`.

Estados de UI:

- Loading enquanto carrega empresas.
- Erro quando a chamada falha.
- Vazio quando não há empresas.
- Sucesso com cards de empresas.

Cada card exibe:

- Razão social.
- Trust Score formatado.
- Selo formatado.
- Link para perfil público.

## Perfil da Empresa

O perfil carrega dados via `mobileApi.getCompany(id)`.

Exibe:

- Razão social.
- Descrição pública.
- Trust Score.
- Selo.
- CTA para abrir denúncia contra a empresa.

## Nova denúncia com empresa pré-selecionada

O CTA do perfil usa `buildCompanyReportRoute(companyId)` para abrir:

```text
/(consumer)/wizard-step1?companyId=<id-da-empresa>
```

O `wizard-step1` lê `companyId`, preenche o campo inicial e mantém edição manual pelo consumidor.

## Validação manual

1. Acesse `/(consumer)/home`.
2. Aguarde a lista de empresas.
3. Toque em uma empresa.
4. Confirme dados no perfil.
5. Toque em `Abrir denúncia contra esta empresa`.
6. Confirme que `wizard-step1` abre com o ID preenchido.
7. Avance para a etapa 2.

## Comandos de validação

```bash
npm ci
npm test
npm run lint
npm run build
```

## Fora do escopo desta tarefa

- Busca avançada.
- Ranking real.
- Trust Score calculado pelo backend.
- Avaliações públicas.
- Favoritos.
- Alterações de contrato da API.
- Alterações no backend.
