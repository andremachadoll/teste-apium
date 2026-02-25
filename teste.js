const { remote } = require('webdriverio');

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'emulator-5554',
  'appium:appPackage': 'com.android.settings',
  'appium:appActivity': 'com.android.settings.Settings',
  // ADICIONE ESTA LINHA ABAIXO:
  'appium:androidHome': 'C:\\Users\\ave\\AppData\\Local\\Android\\Sdk' 
};

const wdOpts = {
  hostname: '127.0.0.1',
  port: 4723,
  logLevel: 'info',
  capabilities,
};

async function runTest() {
  const driver = await remote(wdOpts);
  console.log("SUCESSO: Conectado ao Android!");
  await new Promise(resolve => setTimeout(resolve, 5000));
  await driver.deleteSession();
}

runTest().catch(console.error);