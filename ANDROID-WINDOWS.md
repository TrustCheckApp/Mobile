# Android no Windows — SDK, `adb` e Expo

Se aparecer:

- `Failed to resolve the Android SDK path`
- `'adb' não é reconhecido como um comando`

é porque o **Android SDK** (que vem com o **Android Studio**) não está instalado ou as variáveis de ambiente não estão definidas.

---

## 1. Instalar Android Studio

**Opção A — winget (PowerShell como administrador ou aceitar o UAC quando pedir):**

```powershell
winget install -e --id Google.AndroidStudio --accept-package-agreements --accept-source-agreements
```

**Opção B:** descarregar em [developer.android.com/studio](https://developer.android.com/studio) e instalar manualmente.

Depois de instalar:

1. Abre o **Android Studio** uma vez.
2. Completa o assistente e aceita instalar o **Android SDK**.
3. Menu **More Actions → SDK Manager** (ou **Settings → Languages & Frameworks → Android SDK**).
4. Confirma que existe uma pasta SDK (por omissão):  
   `C:\Users\<teu_user>\AppData\Local\Android\Sdk`
5. No separador **SDK Tools**, marca **Android SDK Platform-Tools** (inclui `adb`) e aplica.

---

## 2. Variáveis de ambiente (ANDROID_HOME e PATH)

Substitui `Alexandre` pelo teu utilizador Windows se for diferente.

**PowerShell (só para a sessão atual — útil para testar):**

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path = "$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:Path"
adb version
```

Se `adb version` funcionar, no mesmo terminal:

```powershell
cd C:\projetos\TrustCheckApp\Mobile
npm run android
```

**Permanente (recomendado):**

1. **Win + R** → `sysdm.cpl` → **Avançadas** → **Variáveis de ambiente**.
2. Em **Variáveis do utilizador** → **Novo**:
   - Nome: `ANDROID_HOME`
   - Valor: `C:\Users\Alexandre\AppData\Local\Android\Sdk` (ou o caminho que o SDK Manager mostrar).
3. Edita **Path** do utilizador → **Novo** → adiciona:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\emulator` (opcional, mas útil)
4. Fecha e abre de novo o terminal / Cursor.

---

## 3. Emulador

No Android Studio: **Device Manager** → cria um **Virtual Device** (ex. Pixel + imagem de sistema) → inicia o emulador **antes** de `npm run android`.

Ou liga um telemóvel com **Depuração USB** ativa.

---

## 4. TypeScript e Expo

O projeto usa **TypeScript `~5.3.3`**, alinhado ao aviso do Expo SDK 51 (“expected version: ~5.3.3”). Depois de `git pull`, corre:

```powershell
cd C:\projetos\TrustCheckApp\Mobile
npm install
```

---

## 5. Alternativa sem Android Studio (só para ver o app)

```powershell
npm run web
```

Ou **Expo Go** no telemóvel: `npm start` e lê o QR code (não precisa de `adb` no PC).
