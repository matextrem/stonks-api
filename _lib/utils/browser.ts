import chrome from '@sparticuz/chromium';
import puppeteer, { Browser } from 'puppeteer-core';

export const getBrowser = async (): Promise<Browser> => {
  let browser;
  const isProd = process.env.NODE_ENV === 'production';

  browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security', // disabling CORS
      '--disable-site-isolation-trials',
      '--disable-notifications',
      '--no-zygote',
    ],
    defaultViewport: chrome.defaultViewport,
    executablePath: isProd
      ? await chrome.executablePath()
      : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',

    headless: true,
    devtools: false,
    slowMo: 0,
    ignoreHTTPSErrors: true,
  });

  return browser;
};
