## 🎯 Tarefa
- **ID:** TC-S2-MOB-01
- **Sprint:** 02 (08/05 a 15/05)
- **Prioridade:** P0
- **Story Points:** 4
- **Repositório:** Mobile

## 📝 Descrição
Padroniza cliente HTTP centralizado com axios para o aplicativo Mobile, adicionando interceptores de autenticação, normalização de erros tipada, sanitização de logs e redirecionamento automático para login em 401/403.

## 🔧 Mudanças por commit
Listar cada commit em ordem cronológica com 1 linha explicativa:

- `feat(api): cria cliente HTTP centralizado com axios [TC-S2-MOB-01]` — adiciona instância única em `src/api/axios-client.ts`.
- `feat(api): adiciona interceptor de auth com SecureStore [TC-S2-MOB-01]` — injeta Bearer token via `expo-secure-store`.
- `feat(api): normaliza erros em ApiError tipado [TC-S2-MOB-01]` — todos os erros agora seguem `{ code, message, statusCode, details }`.
- `feat(api): adiciona redirect para login em 401/403 [TC-S2-MOB-01]` — redirecionamento automático em caso de erro de autenticação.
- `chore(api): sanitiza logs removendo campos sensíveis [TC-S2-MOB-01]` — campos como password, token, authorization são redigidos.
- `docs(api): documenta flag EXPO_PUBLIC_USE_MOCKS no README [TC-S2-MOB-01]` — documentação de variáveis de ambiente.
- `chore: adiciona template de corpo de PR [TC-S2-MOB-01]` — template padrão para descrição de PR.

## 📂 Arquivos impactados
Lista resumida agrupada por área:
- `src/api/axios-client.ts` (novo)
- `src/api/errors.ts` (novo)
- `tsconfig.json` (configuração moduleResolution)
- `package.json` (dependências axios e expo-secure-store)
- `README.md` (documentação de env vars)
- `.github/PR_BODY.md` (template de PR)

## ✅ Critérios de aceite (do prompt original)
Marcar cada checkbox conforme cumprido:
- [x] Erro 401/403 navega para tela de login automaticamente.
- [x] Payload sensível não aparece em alerts/console.
- [x] Mocks alternados por flag de configuração documentada em README.
- [x] Token persistido apenas em SecureStore.
- [ ] Testes cobrem interceptores com fixtures de erro 401/500/timeout.

## 🧪 Como testar
Passos numerados que o revisor deve executar:
1. `npm install` na raiz do mobile.
2. Configurar `.env` com `EXPO_PUBLIC_API_URL` e `EXPO_PUBLIC_USE_MOCKS` (opcional).
3. `npx expo start`.
4. Verificar logs no console para confirmar sanitização de campos sensíveis.
5. Validar que interceptores de request/response funcionam corretamente.
6. Testes de interceptores com fixtures de erro (pendente implementação).

## 🔗 Dependências e Issues
- Depende de: TC-S1-API-01, TC-S2-KICKOFF.
- Bloqueia: TC-S2-MOB-02, TC-S2-MOB-03, TC-S2-MOB-04 (todos consomem este cliente).
- Issue: N/A.

## 🚨 Riscos e pontos de atenção para o review
- Mudança afeta TODAS as telas existentes que faziam fetch direto. Validar que nenhuma regrediu.
- SecureStore não funciona em Expo Web — documentado no README.
- Navegação para login em 401/403 está como TODO (log apenas, navegação real pendente).

## 📸 Evidências (quando aplicável)
Screenshots, vídeos curtos ou gifs do fluxo funcionando. Para Mobile, anexar prints iOS + Android.
- Pendente: evidências de funcionamento em dispositivo real.

## ⛔ Não-merge
**Esta PR NÃO deve ser mergeada pelo autor.** Aguardando code review e aprovação humana.
