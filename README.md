# TrustCheck Mobile

Aplicativo mobile (React Native + Expo) para os fluxos de consumidor e empresa no V1.

## Estado real atual
- Base Expo Router inicializada com modulos, tema e cliente HTTP.
- TC2 concluida para MVP: AUTH, TRUST e CASOS com feedback padrao.
- TC2-ADM-09 concluida: UX foundation com tokens e guideline de feedback.

## Variáveis de Ambiente
- `EXPO_PUBLIC_API_URL`: URL base da API (padrão: `http://localhost:3000`)
- `EXPO_PUBLIC_USE_MOCKS`: Flag para habilitar mocks locais durante desenvolvimento (padrão: `false`)
  - `true`: Usa mocks MSW para desenvolvimento offline
  - `false`: Usa API real

## Execucao local
- `npm install`
- `npm run start`

## QA rapido
- `npm run test:e2e:auth`

## Fonte de verdade funcional
- https://github.com/TrustCheckApp/Docs
- `Docs/docs/02-catalogo-telas.md`
- `Docs/docs/03-planejamento-sprints.md`

