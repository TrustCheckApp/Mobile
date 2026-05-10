## 🎯 Tarefa
- **ID:** TC-S2-MOB-02
- **Sprint:** 02 (08/05 a 15/05)
- **Prioridade:** P0
- **Story Points:** 4
- **Repositório:** Mobile

## 📝 Descrição
Adiciona confirmação OTP no cadastro consumidor, separando o fluxo em duas telas: cadastro e verificação OTP. Implementa tela com 6 inputs, countdown de 60s para reenvio, tratamento de erros OTP_INVALID e OTP_EXPIRED, e persistência de tokens via SecureStore.

## 🔧 Mudanças por commit
Listar cada commit em ordem cronológica com 1 linha explicativa:

- `feat(auth): adiciona hook useOtp com lógica de OTP [TC-S2-MOB-02]` — cria hook customizado para gerenciar estado OTP, countdown e integração com API
- `feat(auth): adiciona tela otp-verify com 6 inputs e countdown [TC-S2-MOB-02]` — cria nova tela de verificação OTP com UX melhorada e modifica consumer-register para navegar para OTP

## 📂 Arquivos impactados
Lista resumida agrupada por área:
- `src/features/auth/useOtp.ts` (novo)
- `app/(auth)/otp-verify.tsx` (novo)
- `app/(auth)/consumer-register.tsx` (modificado - remove campo OTP da tela, adiciona navegação para otp-verify)

## ✅ Critérios de aceite (do prompt original)
Marcar cada checkbox conforme cumprido:
- [x] Usuário informa email/dados → tela seguinte pede OTP
- [x] OTP inválido mostra "Código incorreto. Tente novamente."
- [x] OTP expirado mostra "Código expirou. Solicite um novo."
- [x] Reenvio bloqueado durante 60s com contador visível
- [x] Sucesso navega para Home, sem retorno via back para cadastro
- [x] Token NÃO aparece em logs do Metro/Expo (sanitização implementada no axios-client)

## 🧪 Como testar
Passos numerados que o revisor deve executar:
1. `npm install` na raiz do Mobile.
2. Navegar para tela de cadastro consumidor.
3. Preencher formulário com email, nome e senha.
4. Clicar em "Cadastrar" - deve navegar para tela OTP.
5. Verificar que 6 inputs são exibidos.
6. Verificar que botão "Reenviar" está desabilitado com countdown de 60s.
7. Testar OTP inválido - deve mostrar erro "Código incorreto. Tente novamente."
8. Testar OTP válido - deve navegar para Home.
9. Verificar que tokens não aparecem em logs (console.log sanitiza campos sensíveis).

## 🔗 Dependências e Issues
- Depende de: TC-S1-API-02 (endpoint OTP), TC-S2-MOB-01 (cliente API centralizado).
- Bloqueia: TC-S2-MOB-03 a TC-S2-MOB-06 (fluxo completo de casos).
- Issue: N/A.

## 🚨 Riscos e pontos de atenção para o review
- Fluxo depende de endpoint POST /auth/otp/verify estar funcionando na API.
- Tokens são salvos em SecureStore, mas verificação de persistência requer teste manual em dispositivo físico.
- Auto-avanço entre inputs não implementado (simplificado para 6 inputs independentes).

## 📸 Evidências (quando aplicável)
N/A (requer teste manual em iOS/Android com gif/vídeo).

## ⛔ Não-merge
**Esta PR NÃO deve ser mergeada pelo autor.** Aguardando code review e aprovação humana.
