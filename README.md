# TrustCheck — Mobile (Expo)

## Como rodar

### Primeira vez (dependências)

```powershell
cd C:\projetos\TrustCheckApp\Mobile
npm install
```

### Subir o bundler

```powershell
cd C:\projetos\TrustCheckApp\Mobile
npm start
```

Equivalente:

```powershell
npx expo start
```

### Atalhos

```powershell
npm run android
npm run ios
npm run web
```

### Android no Windows (`adb`, SDK, ANDROID_HOME)

Se `npm run android` falhar com **SDK não encontrado** ou **`adb` não reconhecido**, segue o guia passo a passo:

**[`ANDROID-WINDOWS.md`](./ANDROID-WINDOWS.md)**

Resumo rápido depois de instalar o Android Studio e o SDK:

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path = "$env:ANDROID_HOME\platform-tools;$env:Path"
adb version
```

O TypeScript do projeto está em **`~5.3.3`** (compatível com Expo SDK 51).

---

## Variáveis de ambiente (API)

No mesmo terminal **antes** de `npm start` (PowerShell):

```powershell
$env:EXPO_PUBLIC_API_URL = "http://localhost:3000"
$env:EXPO_PUBLIC_USE_MOCK_API = "false"
```

Apenas mocks (sem chamar a rede):

```powershell
$env:EXPO_PUBLIC_USE_MOCK_API = "true"
npm start
```

**Android (emulador):** o `localhost` do PC costuma ser `10.0.2.2` visto do emulador. Exemplo:

```powershell
$env:EXPO_PUBLIC_API_URL = "http://10.0.2.2:3000"
```

**Dispositivo físico na mesma rede:** use o IP da máquina na LAN (ex.: `http://192.168.1.x:3000`).

---

## API em paralelo

Para usar a API real, o backend deve estar a correr (por exemplo em `http://localhost:3000`). Ver **`COMANDOS-DEV.md`** na raiz do monorepo.

---

## Testes unitários

```powershell
cd C:\projetos\TrustCheckApp\Mobile
npm test
```
