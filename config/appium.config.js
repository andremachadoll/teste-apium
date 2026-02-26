const defaultTimeoutMs = Number(process.env.E2E_TIMEOUT_MS || 15000);

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': process.env.APPIUM_DEVICE_NAME || 'emulator-5554',
  'appium:appPackage': process.env.APPIUM_APP_PACKAGE || 'br.com.nextar.nexapp.dev',
  'appium:appActivity': process.env.APPIUM_APP_ACTIVITY || 'br.com.nextar.nexapp.MainActivity',
  'appium:ensureWebviewsHavePages': true,
  'appium:nativeWebScreenshot': true,
  'appium:newCommandTimeout': 3600,
  'appium:connectHardwareKeyboard': true,
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || '127.0.0.1',
  port: Number(process.env.APPIUM_PORT || 4723),
  logLevel: process.env.APPIUM_LOG_LEVEL || 'info',
  capabilities,
};

module.exports = {
  defaultTimeoutMs,
  wdOpts,
};
