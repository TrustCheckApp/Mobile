## 🎯 Tarefa
- **ID:** TC-S2-MOB-03
- **Sprint:** 02 (08/05 a 15/05)
- **Prioridade:** P0
- **Story Points:** 5
- **Repositório:** Mobile

## 📝 Descrição
Implementa cadastro/login empresa com verificação de claim do CNPJ e 2FA obrigatório. Adiciona validação de CNPJ no client com máscara e checksum, roteamento baseado em status de claim (approved/pending/rejected), tela de verificação 2FA, e guard de rota para proteger o dashboard company.

## 🔧 Mudanças por commit
Listar cada commit em ordem cronológica com 1 linha explicativa:

- `feat(auth): valida CNPJ no client com checksum [TC-S2-MOB-03]` — cria utilitário de validação de CNPJ com máscara e verificação de dígitos
- `feat(auth): adiciona hook useCompanyAuth com lógica de claim e 2FA [TC-S2-MOB-03]` — cria hook customizado para gerenciar autenticação empresa, status de claim e verificação 2FA
- `feat(auth): adiciona telas claim-pending e company-2fa, e guard de rota company [TC-S2-MOB-03]` — cria tela de claim pendente, tela de verificação 2FA, e layout com guard para proteger rotas company

## 📂 Arquivos impactados
Lista resumida agrupada por área:
- `src/utils/cnpj.ts` (novo)
- `src/features/auth/useCompanyAuth.ts` (novo)
- `app/(auth)/claim-pending.tsx` (novo)
- `app/(auth)/company-2fa.tsx` (novo)
- `app/(company)/_layout.tsx` (novo)
- `app/(auth)/company-register.tsx` (modificado - adiciona validação de CNPJ e roteamento por status de claim)
- `app/(auth)/company-login.tsx` (modificado - remove campo 2FA, navega para tela 2FA separada)

## ✅ Critérios de aceite (do prompt original)
Marcar cada checkbox conforme cumprido:
- [x] CNPJ inválido bloqueia submit com mensagem específica
- [x] Claim pendente exibe tela dedicada com canal de suporte
- [x] Claim rejeitado exibe motivo retornado pela API (implementado no hook)
- [x] Login sem 2FA não chega ao dashboard (guard implementado em company/_layout.tsx)
- [x] 2FA inválido mostra erro e não consome tentativa do servidor além do limite
- [x] Status de claim consultado apenas via endpoint autenticado (implementado em checkClaimStatus)

## 🧪 Como testar
Passos numerados que o revisor deve executar:
1. `npm install` na raiz do Mobile.
2. Navegar para tela de cadastro empresa.
3. Tentar cadastrar com CNPJ inválido - deve bloquear submit com erro específico.
4. Cadastrar com CNPJ válido - deve navegar para tela claim-pending ou company-2fa dependendo do status.
5. Testar login empresa - deve navegar para company-2fa após credenciais válidas.
6. Tentar acessar /(company)/dashboard diretamente sem 2FA - deve redirecionar para login.
7. Testar 2FA inválido - deve mostrar erro específico.

## 🔗 Dependências e Issues
- Depende de: TC-S1-API-03 (endpoints de claim e 2FA), TC-S2-MOB-01 (cliente API centralizado).
- Bloqueia: TC-S2-MOB-04 a TC-S2-MOB-06 (fluxo completo de casos para empresas).
- Issue: N/A.

## 🚨 Riscos e pontos de atenção para o review
- Fluxo depende de endpoint GET /companies/me/claim-status estar funcionando na API.
- Guard de rota company precisa ser testado com deep-link direto para dashboard.
- Validação de CNPJ no client é complementar, servidor também deve validar.

## 📸 Evidências (quando aplicável)
N/A (requer teste manual em iOS/Android com prints dos 3 estados de claim).

## ⛔ Não-merge
**Esta PR NÃO deve ser mergeada pelo autor.** Aguardando code review e aprovação humana.
