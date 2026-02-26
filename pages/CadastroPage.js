class CadastroPage {
  constructor(driver, timeoutMs) {
    this.driver = driver;
    this.timeoutMs = timeoutMs;
  }

  async maybeAllowNotifications() {
    const permissionSelectors = [
      '//*[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]',
      '//*[@resource-id="com.android.permissioncontroller:id/permission_allow_foreground_only_button"]',
      '//*[@resource-id="com.android.permissioncontroller:id/permission_allow_one_time_button"]',
      '//*[@resource-id="com.android.packageinstaller:id/permission_allow_button"]',
      'android=new UiSelector().textMatches("(?i)(allow|permitir)")',
    ];

    for (const selector of permissionSelectors) {
      try {
        const allowBtn = await this.driver.$(selector);
        await allowBtn.waitForDisplayed({ timeout: 1500 });
        if (await allowBtn.isDisplayed()) {
          await allowBtn.click();
          await this.driver.pause(300);
          return;
        }
      } catch {
        // Continua tentando próximo seletor.
      }
    }
  }

  async openCreateAccount() {
    const createBtn = await this.driver.$('//*[@resource-id="create_account_button"]');
    await createBtn.waitForDisplayed({ timeout: this.timeoutMs * 2 });
    await createBtn.click();
  }

  async fillFirstStep({ storeName, ownerName, email, password }) {
    const firstInput = await this.driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)');
    await firstInput.waitForDisplayed({ timeout: this.timeoutMs });

    const fields = await this.driver.$$('android=new UiSelector().className("android.widget.EditText")');
    if (fields.length < 5) {
      throw new Error(`Esperava 5 campos na 1a tela, mas encontrei ${fields.length}`);
    }

    await fields[0].click();
    await this.driver.pause(250);
    await fields[0].setValue(storeName);
    await fields[1].click();
    await this.driver.pause(250);
    await fields[1].setValue(ownerName);
    await fields[2].click();
    await this.driver.pause(250);
    await fields[2].setValue(email);
    await fields[3].click();
    await this.driver.pause(250);
    await fields[3].setValue(password);
    await fields[4].click();
    await this.driver.pause(250);
    await fields[4].setValue(password);

    await this.hideKeyboardIfShown();
    await this.driver.pause(400);

    const continueBtn = await this.driver.$('//*[@resource-id="continue_button"]');
    await continueBtn.waitForDisplayed({ timeout: this.timeoutMs });
    await continueBtn.click();
    await this.driver.pause(600);
  }

  async fillSecondStep({ phone, activityName }) {
    const firstSecondInput = await this.waitSecondStepReady();
    await firstSecondInput.click();
    await this.driver.pause(250);
    await firstSecondInput.setValue(phone);

    await this.hideKeyboardIfShown();

    const activityField = await this.driver.$('//*[@resource-id="activity_field"]');
    await activityField.waitForDisplayed({ timeout: this.timeoutMs });
    await activityField.click();

    let optionSelected = false;

    const firstVisibleOption = await this.driver.$(
      '(//android.view.View[@scrollable="true"]//android.view.View[@clickable="true"])[1]'
    );
    await firstVisibleOption.waitForDisplayed({ timeout: this.timeoutMs });

    const candidateActivities = [
      activityName,
      'Bakery',
      'Padaria',
      'Panaderia',
      'Panadería',
    ].filter(Boolean);

    for (const candidate of candidateActivities) {
      const byDescription = await this.driver.$(`android=new UiSelector().descriptionContains("${candidate}")`);
      if (await byDescription.isExisting()) {
        await byDescription.click();
        optionSelected = true;
        break;
      }
    }

    if (!optionSelected) {
      await firstVisibleOption.click();
      optionSelected = true;
    }

    if (!optionSelected) {
      throw new Error('Nao foi possivel selecionar uma atividade na lista');
    }

    const activityFieldClosed = await this.driver.$('//*[@resource-id="activity_field"]');
    await activityFieldClosed.waitForDisplayed({ timeout: this.timeoutMs });

    await this.clickTerms();
    await this.clickRegister();
  }

  async fillPin(pinCode) {
    const pinInput = await this.driver.$('//*[@resource-id="pin_code_input"]');
    await pinInput.waitForDisplayed({ timeout: this.timeoutMs * 2 });
    await pinInput.setValue(pinCode);
    return pinInput;
  }

  async waitSecondStepReady() {
    const activityField = await this.driver.$('//*[@resource-id="activity_field"]');
    await activityField.waitForDisplayed({ timeout: this.timeoutMs * 2 });

    const phoneEditInputById = await this.driver.$('//*[@resource-id="phone_input_field"]//android.widget.EditText');
    if (await phoneEditInputById.isExisting()) {
      await phoneEditInputById.waitForDisplayed({ timeout: this.timeoutMs });
      return phoneEditInputById;
    }

    const fallbackPhoneInput = await this.driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)');
    await fallbackPhoneInput.waitForDisplayed({ timeout: this.timeoutMs });
    return fallbackPhoneInput;
  }

  async hideKeyboardIfShown() {
    if (await this.driver.isKeyboardShown()) {
      await this.driver.hideKeyboard();
    }
  }

  async clickTerms() {
    const selectors = [
      '//*[@resource-id="terms_checkbox"]',
      'android=new UiSelector().textContains("Terms and Conditions")',
      'android=new UiSelector().textContains("Termos e Cond")',
      'android=new UiSelector().textContains("Términos y Cond")',
      'android=new UiSelector().textContains("Terminos y Cond")',
      "//*[contains(@content-desc,'Aceitar termos de uso')]",
      "//*[contains(@content-desc,'Read our Terms and Conditions')]",
      "//*[contains(@content-desc,'Términos y Condiciones')]",
      "//*[contains(@content-desc,'Terminos y Condiciones')]",
      "//*[contains(@content-desc,'Terms and Conditions')]",
      "//*[contains(@content-desc,'Termos e Cond')]",
    ];

    for (const selector of selectors) {
      const el = await this.driver.$(selector);
      if (await el.isExisting()) {
        await el.click();
        await this.acceptTermsIfNeeded();
        return;
      }
    }

    try {
      const scrollTerms = await this.driver.$(
        'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().textContains("Terms"))'
      );
      if (await scrollTerms.isExisting()) {
        await scrollTerms.click();
        await this.acceptTermsIfNeeded();
        return;
      }
    } catch {
      // Ignora e deixa falhar com erro claro abaixo.
    }

    try {
      const scrollTermsEs = await this.driver.$(
        'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().textContains("Terminos"))'
      );
      if (await scrollTermsEs.isExisting()) {
        await scrollTermsEs.click();
        await this.acceptTermsIfNeeded();
        return;
      }
    } catch {
      // Ignora e deixa falhar com erro claro abaixo.
    }

    throw new Error('Nao foi possivel encontrar o aceite de termos na segunda etapa');
  }

  async acceptTermsIfNeeded() {
    const selectors = [
      "//*[@content-desc='I HAVE READ AND AGREE']",
      "//*[contains(@content-desc,'HE LEÍDO Y ACEPTO')]",
      "//*[contains(@content-desc,'HE LEIDO Y ACEPTO')]",
      "//*[contains(@content-desc,'LI E CONCORDO')]",
      "//*[contains(@content-desc,'I HAVE READ')]",
      "//*[contains(@text,'I HAVE READ')]",
      "//*[contains(@text,'HE LEÍDO')]",
      "//*[contains(@text,'HE LEIDO')]",
      "//*[contains(@text,'ACEPTO')]",
      "//*[contains(@text,'CONCORDO')]",
      "//*[contains(@text,'AGREE')]",
      '//android.widget.Button[@clickable="true" and @enabled="true"]',
    ];

    for (const selector of selectors) {
      const el = await this.driver.$(selector);
      if (await el.isExisting()) {
        await el.click();
        break;
      }
    }

    const activityField = await this.driver.$('//*[@resource-id="activity_field"]');
    if (await activityField.isExisting()) {
      await activityField.waitForDisplayed({ timeout: this.timeoutMs });
    }
  }

  async clickRegister() {
    if (await this.isPinStepVisible()) {
      return;
    }

    await this.hideKeyboardIfShown();

    const selectors = [
      '//*[@resource-id="register_button" and @content-desc="Registrar conta"]',
      '//*[@resource-id="register_button" and @content-desc="Registrar cuenta"]',
      '//*[@resource-id="register_button"]',
      'android=new UiSelector().text("REGISTER")',
      'android=new UiSelector().text("REGISTRAR")',
      'android=new UiSelector().text("CADASTRAR")',
      "//*[contains(@content-desc,'Registrar conta')]",
      "//*[contains(@content-desc,'Registrar cuenta')]",
      "//*[contains(@content-desc,'REGISTER')]",
      "//*[contains(@content-desc,'REGISTRAR')]",
      "//*[contains(@content-desc,'CADASTRAR')]",
    ];

    for (const selector of selectors) {
      try {
        const el = await this.driver.$(selector);
        await el.waitForDisplayed({ timeout: 2000 });
        if (await el.isDisplayed() && await el.isEnabled()) {
          await el.click();
          if (await this.isPinStepVisible(4000)) {
            return;
          }
        }
      } catch {
        // Continua tentando próximo seletor.
      }
    }

    if (await this.isPinStepVisible(2000)) {
      return;
    }

    throw new Error('Nao foi possivel encontrar o botao de registro na segunda etapa');
  }

  async isPinStepVisible(timeoutMs = 1200) {
    try {
      const pinContainer = await this.driver.$('//*[@resource-id="pin_code_input"]');
      await pinContainer.waitForDisplayed({ timeout: timeoutMs });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = {
  CadastroPage,
};
