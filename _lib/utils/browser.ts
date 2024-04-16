import chromium from '@sparticuz/chromium';
import puppeteer, { Browser, HTTPRequest, Page } from 'puppeteer-core';

chromium.setGraphicsMode = false;

const cache = new Map<
  string,
  {
    status: number;
    expires: number;
    body: Buffer;
    headers: Record<string, string>;
  }
>();

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
      ? await chromium.executablePath()
      : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',

    headless: true,
    defaultViewport: { width: 1280, height: 1024 },
    ignoreHTTPSErrors: true,
  });

  return browser;
};

const abortUnnecessaryRequests = (request: HTTPRequest) => {
  if (['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1) {
    request.abort();
    return true;
  }
  return false;
};

export const cacheRequests = (page: Page) => {
  page.on('request', async (request) => {
    const isRequestAborted = abortUnnecessaryRequests(request);
    if (isRequestAborted) return;
    const url = request.url();
    const selectedCache = cache.get(url);
    if (selectedCache && selectedCache.expires > Date.now()) {
      await request.respond(selectedCache);
      return;
    }
    request.continue();
  });

  page.on('response', async (response) => {
    const url = response.url();
    const selectedCache = cache.get(url);
    const headers = response.headers();
    const cacheControl = headers['cache-control'] || '';
    const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
    const maxAge =
      maxAgeMatch && maxAgeMatch.length > 1 ? parseInt(maxAgeMatch[1], 10) : 0;
    if (maxAge) {
      if (selectedCache && selectedCache.expires > Date.now()) return;

      let buffer;
      try {
        buffer = await response.buffer();
      } catch (error) {
        // some responses do not contain buffer and do not need to be catched
        return;
      }

      cache.set(url, {
        status: response.status(),
        headers: response.headers(),
        body: buffer,
        expires: Date.now() + maxAge * 1000,
      });
    }
  });
};

export const closeBrowser = async (browser: Browser) => {
  for (const page of await browser.pages()) {
    await page.close();
  }
  await browser.close();
};
