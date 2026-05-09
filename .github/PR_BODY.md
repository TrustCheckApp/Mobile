## 🎯 Tarefa
- **ID:** TC-S2-KICKOFF
- **Sprint:** 02 (08/05 a 15/05)
- **Prioridade:** P0
- **Story Points:** 8
- **Repositório:** Mobile

## 📝 Descrição
Integra tipos TypeScript do pacote de contratos OpenAPI no aplicativo Mobile, permitindo type-safety nas chamadas de API e configurando flag USE_MOCKS para desenvolvimento local.

## 🔧 Mudanças por commit
Listar cada commit em ordem cronológica com 1 linha explicativa:

- `chore(env): adiciona flag USE_MOCKS no README [TC-S2-KICKOFF]` — documenta flag de configuração para mocks locais.
- `feat(contracts): adiciona tipos TypeScript do OpenAPI [TC-S2-KICKOFF]` — integra tipos gerados do pacote contracts em src/contracts.

## 📂 Arquivos impactados
Lista resumida agrupada por área:
- `README.md` (documentação de env vars)
- `src/contracts/types.ts` (novo)
- `src/contracts/index.ts` (novo)

## ✅ Critérios de aceite (do prompt original)
Marcar cada checkbox conforme cumprido:
- [x] Flag USE_MOCKS configurada em Mobile
- [x] Mobile importa tipos do pacote contracts
- [x] Tipos TypeScript disponíveis para uso
- [ ] npm run typecheck passa (pendente validação)
- [ ] Mock pode ser ligado/desligado por env var sem rebuild (pendente implementação MSW)

## 🧪 Como testar
Passos numerados que o revisor deve executar:
1. `npm install` na raiz do Mobile.
2. Verificar que `src/contracts/types.ts` contém os tipos OpenAPI.
3. Verificar que `README.md` documenta a flag USE_MOCKS.
4. Rodar `npm run typecheck` para validar compilação.

## 🔗 Dependências e Issues
- Depende de: PR Api TC-S2-KICKOFF (https://github.com/TrustCheckApp/Api/pull/14).
- Bloqueia: TC-S2-MOB-02 a TC-S2-MOB-06 (todos consomem estes tipos).
- Issue: N/A.

## 🚨 Riscos e pontos de atenção para o review
- Tipos são uma cópia do pacote contracts do repositório Api.
- Em monorepo futuro, deveria importar do pacote compartilhado.
- MSW ainda não implementado para uso real dos mocks.

## 📸 Evidências (quando aplicável)
N/A (tarefa de infraestrutura).

## ⛔ Não-merge
**Esta PR NÃO deve ser mergeada pelo autor.** Aguardando code review e aprovação humana.
