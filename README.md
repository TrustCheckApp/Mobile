# TrustCheck Mobile

Aplicativo mobile (React Native + Expo) para os fluxos de consumidor e empresa no V1.

## Escopo V1 - Consumidor
- Onboarding, cadastro e login.
- Exploracao de empresas e perfil publico.
- Abertura de denuncia em 4 etapas.
- Upload de provas e acompanhamento de casos.
- Negociacao estruturada e configuracoes de perfil.

## Escopo V1 - Empresa
- Cadastro empresarial e reivindicacao de perfil.
- Login com 2FA.
- Dashboard, fila de casos e detalhe de caso.
- Negociacao por proposta/contraproposta.
- Metricas/reputacao e configuracoes de conta.

## Fora de escopo V1
- App web de consumidor.
- Pagamentos e planos premium.
- Videochamada para negociacao.

## Fronteiras
- Consome contratos e status providos pelo `Api`.
- Recebe notificacoes por canais definidos em `Integrations`.
- Segue governanca de moderacao definida por `Admin-Web` e `Docs`.

## Fonte de verdade funcional
- https://github.com/TrustCheckApp/Docs
- `Docs/docs/02-catalogo-telas.md`
- `Docs/docs/03-planejamento-sprints.md`
