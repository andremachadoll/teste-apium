const { remote } = require('webdriverio');
const { wdOpts, defaultTimeoutMs } = require('./config/appium.config');
const { CadastroPage } = require('./pages/CadastroPage');

async function inspecionar() {
  const driver = await remote({
    ...wdOpts,
    logLevel: process.env.APPIUM_LOG_LEVEL || 'error',
  });
  const page = new CadastroPage(driver, defaultTimeoutMs);

  try {
    await driver.pause(3000);
    await page.maybeAllowNotifications();
    await page.openCreateAccount();

    await page.fillFirstStep({
      storeName: process.env.E2E_STORE_NAME || 'Loja Teste',
      ownerName: process.env.E2E_OWNER_NAME || 'Teste',
      email: `andre+${Date.now()}@nextar.com.br`,
      password: process.env.E2E_PASSWORD || '12345678',
    });

    const phoneInput = await page.waitSecondStepReady();
    await phoneInput.setValue(process.env.E2E_PHONE || '48984155710');
    await page.hideKeyboardIfShown();
    await driver.pause(800);

    console.log('\n===== PAGE SOURCE =====');
    const src = await driver.getPageSource();
    console.log(src);
  } catch (error) {
    console.error('Erro:', error.message);
    try {
      await driver.saveScreenshot('./screenshot_inspecionar_erro.png');
    } catch {
      // Ignora quando a sessao nao esta mais saudavel.
    }
  } finally {
    await driver.deleteSession();
  }
}

inspecionar().catch((error) => {
  console.error('Falha fatal:', error.message);
  process.exitCode = 1;
});
