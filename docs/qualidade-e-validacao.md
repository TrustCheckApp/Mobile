# Qualidade e Validação — Mobile

Este documento registra o baseline mínimo de qualidade para desenvolvimento diário no repositório `TrustCheckApp/Mobile`.

## Objetivo

Garantir que alterações no app mobile sejam feitas com validações reproduzíveis, sem dependências locais versionadas e com scripts reais para testes, type-check e build/export.

## Comandos obrigatórios antes de PR

```bash
npm ci
npm test
npm run lint
npm run build
```

## Estratégia TDD

1. Criar ou atualizar teste automatizado que represente a regra esperada.
2. Confirmar falha inicial quando a regra ainda não estiver atendida.
3. Implementar a menor alteração segura para passar.
4. Refatorar mantendo os testes verdes.
5. Atualizar README e documentação quando comandos, fluxos ou contratos mudarem.

## Baseline protegido por teste

O teste `src/config/project-scripts.spec.ts` valida que:

- `package.json` possui scripts `test`, `lint` e `build`.
- `lint` e `build` não são placeholders.
- `.gitignore` impede versionamento de `node_modules/`.

## Higiene de dependências

`node_modules/` não deve ser commitado. O ambiente local deve ser reconstruído com:

```bash
npm ci
```

## Observações de segurança e LGPD

- Não versionar `.env` ou arquivos locais de configuração.
- Não logar tokens, OTPs, secrets ou dados pessoais sensíveis.
- Não incluir evidências reais, arquivos privados ou payloads sensíveis em mocks, snapshots ou logs de teste.
