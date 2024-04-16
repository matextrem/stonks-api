import chrome from '@sparticuz/chromium';
import puppeteer, { Browser } from 'puppeteer-core';

export const getBrowser = async (): Promise<Browser> => {
  const isProd = process.env.NODE_ENV === 'production';

  let browser;

  if (isProd) {
    browser = await puppeteer.launch({
      args: chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath(),
      headless: 'new',
      ignoreHTTPSErrors: true,
    });
  } else {
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath:
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    });
  }
  return browser;
};
