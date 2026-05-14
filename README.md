# TrustCheck — Mobile (Expo)

Aplicativo mobile do TrustCheck para jornadas de consumidor e empresa, construído com Expo, Expo Router, React Native e TypeScript.

## Requisitos

- Node.js compatível com Expo SDK 51.
- npm.
- Expo CLI via scripts do projeto.
- Android Studio/SDK para execução em Android, quando aplicável.

## Instalação

```powershell
cd C:\projetos\TrustCheckApp\Mobile
npm ci
```

> Use `npm ci` para instalação reprodutível a partir do `package-lock.json`.

## Execução local

```powershell
npm start
```

Equivalente:

```powershell
npx expo start
```

## Atalhos

```powershell
npm run android
npm run ios
npm run web
```

## Android no Windows (`adb`, SDK, `ANDROID_HOME`)

Se `npm run android` falhar com **SDK não encontrado** ou **`adb` não reconhecido**, siga o guia passo a passo:

**[`ANDROID-WINDOWS.md`](./ANDROID-WINDOWS.md)**

Resumo rápido depois de instalar o Android Studio e o SDK:

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path = "$env:ANDROID_HOME\platform-tools;$env:Path"
adb version
```

O TypeScript do projeto está em **`~5.3.3`**, compatível com Expo SDK 51.

## Variáveis de ambiente (API)

No mesmo terminal, antes de `npm start`:

```powershell
$env:EXPO_PUBLIC_API_URL = "http://localhost:3000"
$env:EXPO_PUBLIC_USE_MOCK_API = "false"
```

Apenas mocks, sem chamar a rede:

```powershell
$env:EXPO_PUBLIC_USE_MOCK_API = "true"
npm start
```

**Android (emulador):** o `localhost` do PC costuma ser `10.0.2.2` visto pelo emulador. Exemplo:

```powershell
$env:EXPO_PUBLIC_API_URL = "http://10.0.2.2:3000"
```

**Dispositivo físico na mesma rede:** use o IP da máquina na LAN, por exemplo `http://192.168.1.x:3000`.

## API em paralelo

Para usar a API real, o backend deve estar em execução, por exemplo em `http://localhost:3000`. Consulte a documentação do repositório `Api` para comandos de execução local.

## Páginas principais do consumidor

| Tela | Rota | Documentação |
|---|---|---|
| Home / Explorar | `/(consumer)/home` | [`docs/paginas-consumidor-empresas.md`](./docs/paginas-consumidor-empresas.md) |
| Perfil da Empresa | `/(consumer)/empresa/[id]` | [`docs/paginas-consumidor-empresas.md`](./docs/paginas-consumidor-empresas.md) |
| Meus Casos | `/(consumer)/meus-casos` | [`docs/paginas-consumidor-casos.md`](./docs/paginas-consumidor-casos.md) |
| Detalhe do Caso | `/(consumer)/casos/[id]` | [`docs/paginas-consumidor-casos.md`](./docs/paginas-consumidor-casos.md) |
| Nova Denúncia | `/(consumer)/wizard-step1` até `wizard-step4` | [`docs/paginas-consumidor-wizard-denuncia.md`](./docs/paginas-consumidor-wizard-denuncia.md) |

As páginas de descoberta usam helpers em `src/companies/company-ui.ts` para padronizar score, selo, mensagens e rota de denúncia com empresa pré-selecionada.

As páginas de casos usam helpers em `src/cases/case-ui.ts` para padronizar labels de status, filtros, datas, mensagens de vazio e ações disponíveis por status.

O wizard de nova denúncia usa helpers em `src/wizard/report-wizard.ts` para centralizar validações, normalização de parâmetros, metadados de evidência, aceite legal e montagem do payload de abertura de caso.

## Qualidade e validação

Execute antes de abrir PR:

```powershell
npm test
npm run lint
npm run build
```

### Testes

```powershell
npm test
```

### Lint/type-check

```powershell
npm run lint
```

O script executa `tsc --noEmit -p tsconfig.json` para validar TypeScript sem gerar artefatos.

### Build/export

```powershell
npm run build
```

O script executa `expo export --platform web --output-dir dist` para validar empacotamento web do app Expo.

## Higiene de repositório

- `node_modules/` não deve ser versionado.
- Dependências devem ser instaladas localmente com `npm ci`.
- Artefatos como `dist/`, `coverage/`, `.expo/` e arquivos `.env` locais devem permanecer fora do Git.
