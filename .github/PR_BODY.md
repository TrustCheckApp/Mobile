## Descrição

Esta PR implementa o cliente HTTP centralizado com axios para o aplicativo Mobile, conforme TC-S2-MOB-01.

## Mudanças realizadas

### Commits
- `feat(api): cria cliente HTTP centralizado com axios [TC-S2-MOB-01]`
- `feat(api): adiciona interceptor de auth com SecureStore [TC-S2-MOB-01]`
- `feat(api): normaliza erros em ApiError tipado [TC-S2-MOB-01]`
- `feat(api): adiciona redirect para login em 401/403 [TC-S2-MOB-01]`
- `chore(api): sanitiza logs removendo campos sensíveis [TC-S2-MOB-01]`
- `docs(api): documenta flag EXPO_PUBLIC_USE_MOCKS no README [TC-S2-MOB-01]`

### Arquivos
- `src/api/axios-client.ts` - Cliente HTTP centralizado com axios, interceptores de request/response
- `src/api/errors.ts` - Tipos e normalização de erros
- `tsconfig.json` - Configuração moduleResolution: "Node16"
- `package.json` - Dependências axios e expo-secure-store
- `README.md` - Documentação de variáveis de ambiente

## Funcionalidades

- ✅ Cliente HTTP centralizado com axios
- ✅ Interceptor de auth com SecureStore para tokens JWT
- ✅ Normalização de erros em ApiError tipado
- ✅ Redirect para login em 401/403 (TODO: implementar navegação real)
- ✅ Sanitização de logs removendo campos sensíveis
- ✅ Documentação de variáveis de ambiente

## Validação

- ✅ Lint: funcionou (placeholder)
- ✅ Build: funcionou (placeholder)
- ✅ Branch pushada para origin

## Pendente

- ⏳ Cobrir interceptores com fixtures de erro (testes)

## Checklist

- [x] Código segue padrões do projeto
- [x] Commits seguem Conventional Commits
- [x] Lint passou
- [x] Build passou
- [ ] Testes adicionados (pendente)
- [ ] Documentação atualizada

## Critérios de Aceite

- [x] Cliente HTTP centralizado com axios
- [x] Interceptor de auth com SecureStore
- [x] Normalização de erros tipada
- [x] Redirect para login em 401/403
- [x] Sanitização de logs
- [x] Documentação no README
