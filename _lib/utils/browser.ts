import chrome from '@sparticuz/chromium';
import puppeteer, { Browser, Page } from 'puppeteer-core';

export const getBrowser = async (): Promise<Browser> => {
  let browser;
  const isProd = process.env.NODE_ENV === 'production';

  browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
    ],
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
