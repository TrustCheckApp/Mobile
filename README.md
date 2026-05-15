# TrustCheck Mobile (Expo)

Aplicativo mobile do TrustCheck para jornadas de consumidor e empresa, construido com Expo, Expo Router, React Native e TypeScript.

## Estado atual (atualizado em 2026-05-14)
- Navegacao principal implementada (auth, home, wizard, casos, dashboard empresa).
- Integracao com API real em parte dos fluxos.
- Parte do comportamento ainda usa mocks controlados.

## Situacao tecnica real
- Fluxos reais: cadastro/login consumidor, abertura de caso, parte de auditoria/evidencias.
- Fluxos parciais/mockados: catalogo publico de empresas, listagens de casos e login empresa.
- Tokens armazenados com `expo-secure-store`.

## Gaps para fechamento V1
1. Substituir mocks criticos por endpoints reais.
2. Finalizar upload binario de evidencias no app.
3. Ampliar cobertura de testes e validar build/lint com checks reais.

## Requisitos
- Node.js compativel com Expo SDK 51.
- npm.
- Android Studio/SDK para execucao Android, quando aplicavel.

## Instalacao e execucao
```bash
npm ci
npm start
```

## Atalhos
```bash
npm run android
npm run ios
npm run web
```

## Variaveis de ambiente
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_USE_MOCK_API=false
```

Somente mocks:
```bash
EXPO_PUBLIC_USE_MOCK_API=true
```

## Android no Windows
Se `adb`/SDK nao estiver configurado, seguir: `ANDROID-WINDOWS.md`.

## Testes
```bash
npm test
```

## Fonte de verdade funcional
- https://github.com/TrustCheckApp/Docs
- `Docs/docs/02-catalogo-telas.md`
