const { remote } = require('webdriverio');

const wdOpts = {
    hostname: '127.0.0.1',
    port: 4723,
    logLevel: 'info',
    capabilities: {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'emulator-5554',
        'appium:appPackage': 'br.com.nextar.nexapp.dev', 
        'appium:appActivity': 'br.com.nextar.nexapp.MainActivity',
        
        'appium:ensureWebviewsHavePages': true,
        'appium:nativeWebScreenshot': true,
        'appium:newCommandTimeout': 3600,
        'appium:connectHardwareKeyboard': true
    }
};

async function rodarTesteCriarConta() {
    const driver = await remote(wdOpts);

    try {
        console.log("Iniciando teste: Criar Conta");

        // Espera o Splash Screen
        await driver.pause(5000);
        await driver.saveScreenshot('./screenshot_01_apos_splash.png');
        console.log(" Screenshot 01: após splash screen");

        // Aceita o dialog de permissão de notificação, se aparecer
        try {
            const allowBtn = await driver.$('android=new UiSelector().text("Allow")');
            await allowBtn.waitForDisplayed({ timeout: 5000 });
            await allowBtn.click();
            console.log("🔔 Permissão de notificação aceita");
            await driver.pause(500);
        } catch (e) {
            console.log("Nenhum dialog de notificação encontrado, continuando...");
        }

        // 1. Clicar em Criar Conta
        const btnCreateAccount = await driver.$('//*[@resource-id="create_account_button"]');
        await btnCreateAccount.waitForDisplayed({ timeout: 30000 });
        await driver.saveScreenshot('./screenshot_02_antes_criar_conta.png');
        console.log("Screenshot 02: antes de clicar em Criar Conta");
        await btnCreateAccount.click();

        // 2. Preencher dados (Loja, Proprietário, Email, Senhas)
        // Aguarda o primeiro campo aparecer
        const primeirocampo = await driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)');
        await primeirocampo.waitForDisplayed({ timeout: 15000 });
        await driver.saveScreenshot('./screenshot_03_tela_cadastro.png');
        console.log("Screenshot 03: tela de cadastro carregada");

        const campos = await driver.$$('android=new UiSelector().className("android.widget.EditText")');
        console.log(`🔍 Campos EditText encontrados: ${campos.length}`);

        // Store Name (índice 0)
        await campos[0].click();
        await driver.pause(300);
        await campos[0].setValue('Loja Teste');

        await driver.saveScreenshot('./screenshot_04_apos_store_name.png');
        console.log("Screenshot 04: após preencher store name");

        // Name (índice 1)
        await campos[1].click();
        await driver.pause(300);
        await campos[1].setValue('Teste');

        // Email (índice 2)
        const emailDinamico = `andre+${Date.now()}@nextar.com.br`;
        await campos[2].click();
        await driver.pause(300);
        await campos[2].setValue(emailDinamico);

        // Password (índice 3)
        await campos[3].click();
        await driver.pause(300);
        await campos[3].setValue('12345678');

        // Confirm Password (índice 4)
        await campos[4].click();
        await driver.pause(300);
        await campos[4].setValue('12345678');
        
        // Fecha o teclado para o botão "Continuar" aparecer
        if (await driver.isKeyboardShown()) {
            await driver.hideKeyboard();
        }

        await (await driver.$('//*[@resource-id="continue_button"]')).click();

        // 3. Segunda parte (Telefone, Atividade, Termos)
        // Espera o primeiro campo da segunda tela aparecer antes de buscar todos
        const primeiroCampoSegundaTela = await driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)');
        await primeiroCampoSegundaTela.waitForDisplayed({ timeout: 15000 });
        const camposSegundaTela = await driver.$$('android=new UiSelector().className("android.widget.EditText")');
        await driver.saveScreenshot('./screenshot_05_segunda_tela.png');
        console.log(`Screenshot 05: segunda tela — ${camposSegundaTela.length} campo(s) encontrado(s)`);

        // Telefone (índice 0) — campo com seletor de país
        await camposSegundaTela[0].click();
        await driver.pause(300);
        await camposSegundaTela[0].setValue('48984155710');

        // Fecha o teclado após preencher o telefone
        if (await driver.isKeyboardShown()) {
            await driver.hideKeyboard();
        }
        await driver.pause(500);

        // Activity — abre o dropdown, pesquisa e seleciona "Bakery"
        const activityField = await driver.$('//*[@resource-id="activity_field"]');
        await activityField.waitForDisplayed({ timeout: 5000 });
        await activityField.click();
        await driver.pause(1000);
        // Digita no campo de busca do dropdown
        const searchInput = await driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)');
        await searchInput.waitForDisplayed({ timeout: 5000 });
        await searchInput.click();
        await driver.pause(300);
        await driver.keys(['B', 'a', 'k', 'e', 'r', 'y']);
        await driver.pause(500);
        // Fecha o teclado para os resultados ficarem visíveis
        if (await driver.isKeyboardShown()) {
            await driver.hideKeyboard();
        }
        await driver.pause(500);
        // Seleciona "Bakery" da lista (primeiro resultado)
        const opcaoBakery = await driver.$('android=new UiSelector().text("Bakery").instance(0)');
        await opcaoBakery.waitForDisplayed({ timeout: 5000 });
        await opcaoBakery.click();
        // Aguarda o dropdown fechar e voltar ao formulário
        await driver.pause(1000);

        // Aceita os termos
        const termos = await driver.$('android=new UiSelector().textContains("Terms and Conditions")');
        await termos.waitForDisplayed({ timeout: 5000 });
        await termos.click();

        // Clica em REGISTER
        const registerBtn = await driver.$('android=new UiSelector().text("REGISTER")');
        await registerBtn.waitForDisplayed({ timeout: 5000 });
        await registerBtn.click();

        // 4. PIN Final
        const pin = await driver.$('//*[@resource-id="pin_code_input"]');
        await pin.waitForDisplayed({ timeout: 20000 });
        await pin.setValue('123456');

        console.log(`Teste finalizado com sucesso para: ${emailDinamico}`);

    } catch (error) {
        await driver.saveScreenshot('./screenshot_ERRO.png');
        console.error("O teste falhou (screenshot salvo em screenshot_ERRO.png):", error.message);
    } finally {
        await driver.deleteSession();
    }
}

rodarTesteCriarConta();