# AppiumJS - E2E Cadastro (Nextar)

Automação E2E do fluxo de criar conta no app Android da Nextar com `WebdriverIO + Appium`.

## O que este projeto cobre

- Abertura do app e permissão inicial (quando aparece)
- Fluxo de cadastro (1ª e 2ª etapa)
- Aceite de termos
- Clique em registro com fallback multilíngue
- Preenchimento do PIN final

Idiomas suportados no fluxo atual: `PT-BR`, `EN` e `ES` (baseado no idioma do aparelho).

## Estrutura

- `tests/criarConta.e2e.test.js`: teste principal
- `pages/CadastroPage.js`: page object com os seletores e ações
- `config/appium.config.js`: configuração de sessão/capabilities
- `inspecionar.js`: utilitário para imprimir `page source` da tela de cadastro

## Pré-requisitos

- Node.js 18+
- Appium server ativo (porta padrão `4723`)
- Driver `uiautomator2` instalado no Appium
- Emulador/dispositivo Android com o app da Nextar instalado

## Instalação

```bash
npm install
```

## Como rodar

Teste principal:

```bash
npm run test:criar-conta
```

Comandos equivalentes:

```bash
npm test
npm run test:e2e
```

Inspeção de tela (debug de seletores):

```bash
npm run inspect:signup
```

## Variáveis de ambiente

### Appium / dispositivo

- `APPIUM_HOST` (default: `127.0.0.1`)
- `APPIUM_PORT` (default: `4723`)
- `APPIUM_LOG_LEVEL` (default: `info`)
- `APPIUM_DEVICE_NAME` (default: `emulator-5554`)
- `APPIUM_APP_PACKAGE` (default: `br.com.nextar.nexapp.dev`)
- `APPIUM_APP_ACTIVITY` (default: `br.com.nextar.nexapp.MainActivity`)
- `E2E_TIMEOUT_MS` (default: `15000`)

### Dados do teste

- `E2E_STORE_NAME` (default: `Loja Teste`)
- `E2E_OWNER_NAME` (default: `Teste`)
- `E2E_PASSWORD` (default: `12345678`)
- `E2E_PHONE` (default: `48984155710`)
- `E2E_ACTIVITY` (default: vazio; o teste escolhe fallback)
- `E2E_PIN` (default: `123456`)

Exemplo (PowerShell):

```powershell
$env:APPIUM_DEVICE_NAME="emulator-5554"
$env:E2E_PHONE="11999999999"
npm run test:criar-conta
```

## Artefatos de erro

Quando o teste falha, ele gera:

- `screenshot_ERRO.png`
- `source_ERRO.xml`

Arquivos de inspeção manual:

- `inspect_output.txt`
- `extracted_fields.txt`

## Troubleshooting rápido

- Verifique se o Appium está rodando na porta certa.
- Confirme `appPackage` e `appActivity` para o ambiente atual.
- Se um seletor quebrar, rode `npm run inspect:signup` e ajuste com base em `resource-id` primeiro.
