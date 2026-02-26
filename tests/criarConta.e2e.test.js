const { remote } = require('webdriverio');
const fs = require('node:fs');

const { wdOpts, defaultTimeoutMs } = require('../config/appium.config');
const { CadastroPage } = require('../pages/CadastroPage');

async function run() {
  const driver = await remote(wdOpts);
  const page = new CadastroPage(driver, defaultTimeoutMs);

  const email = `andre+${Date.now()}@nextar.com.br`;

  try {
    await driver.pause(3000);
    await page.maybeAllowNotifications();
    await page.openCreateAccount();

    await page.fillFirstStep({
      storeName: process.env.E2E_STORE_NAME || 'Loja Teste',
      ownerName: process.env.E2E_OWNER_NAME || 'Teste',
      email,
      password: process.env.E2E_PASSWORD || '12345678',
    });

    await page.fillSecondStep({
      phone: process.env.E2E_PHONE || '48984155710',
      activityName: process.env.E2E_ACTIVITY || '',
    });

    await page.fillPin(process.env.E2E_PIN || '123456');

    console.log(`Cadastro finalizado com sucesso para ${email}`);
  } catch (error) {
    try {
      const source = await driver.getPageSource();
      fs.writeFileSync('./source_ERRO.xml', source, 'utf8');
    } catch {
      // A sessao pode cair antes de extrair o page source.
    }
    try {
      await driver.saveScreenshot('./screenshot_ERRO.png');
    } catch {
      // A sessao pode cair se o UiAutomator2 travar.
    }
    throw error;
  } finally {
    await driver.deleteSession();
  }
}

run().catch((error) => {
  console.error('Teste de criar conta falhou:', error.message);
  process.exitCode = 1;
});
