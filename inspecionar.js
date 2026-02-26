const { remote } = require('webdriverio');

const wdOpts = {
    hostname: '127.0.0.1',
    port: 4723,
    logLevel: 'error',
    capabilities: {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'emulator-5554',
        'appium:appPackage': 'br.com.nextar.nexapp.dev',
        'appium:appActivity': 'br.com.nextar.nexapp.MainActivity',
        'appium:newCommandTimeout': 3600,
    }
};

async function inspecionar() {
    const driver = await remote(wdOpts);
    try {
        await driver.pause(5000);

        // Aceita notificação se aparecer
        try {
            const allow = await driver.$('android=new UiSelector().text("Allow")');
            if (await allow.isDisplayed()) await allow.click();
        } catch(e) {}

        // Clicar em Criar Conta
        const btn = await driver.$('//*[@resource-id="create_account_button"]');
        await btn.waitForDisplayed({ timeout: 15000 });
        await btn.click();

        // Preencher 1a tela
        const primeirocampo = await driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)');
        await primeirocampo.waitForDisplayed({ timeout: 15000 });
        const campos = await driver.$$('android=new UiSelector().className("android.widget.EditText")');
        await campos[0].setValue('Loja Teste');
        await campos[1].setValue('Teste');
        await campos[2].setValue(`andre+${Date.now()}@nextar.com.br`);
        await campos[3].setValue('12345678');
        await campos[4].setValue('12345678');
        if (await driver.isKeyboardShown()) await driver.hideKeyboard();
        await driver.$('//*[@resource-id="continue_button"]').then(e => e.click());

        // Aguarda 2a tela
        const primeiroCampo2 = await driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)');
        await primeiroCampo2.waitForDisplayed({ timeout: 15000 });

        // Preenche telefone
        await primeiroCampo2.setValue('48984155710');
        if (await driver.isKeyboardShown()) await driver.hideKeyboard();
        await driver.pause(1000);

        // Captura o page source XML
        console.log("\n===== PAGE SOURCE =====");
        const src = await driver.getPageSource();
        console.log(src);

    } catch(e) {
        console.error("Erro:", e.message);
        await driver.saveScreenshot('/tmp/inspecionar_erro.png');
    } finally {
        await driver.deleteSession();
    }
}

inspecionar();
