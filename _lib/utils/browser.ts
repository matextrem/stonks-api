import chrome from '@sparticuz/chromium';
import puppeteer, { Browser, Page } from 'puppeteer-core';

export const getBrowser = async (): Promise<Browser> => {
  let browser;
  const isProd = process.env.NODE_ENV === 'production';

  const minimal_args = [
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
  ];

  browser = await puppeteer.launch({
    args: minimal_args,
    executablePath: isProd
      ? await chrome.executablePath()
      : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',

    headless: true,
    defaultViewport: { width: 1280, height: 1024 },
    ignoreHTTPSErrors: true,
  });

  return browser;
};

export const abortUnnecessaryRequests = (page: Page) => {
  page.on('request', (request) => {
    if (
      ['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });
};
