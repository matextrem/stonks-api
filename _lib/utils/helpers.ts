import { Page } from 'puppeteer';
import { API_PROVIDERS, PROVIDER } from './constants';

const API_URL = API_PROVIDERS[PROVIDER].baseUrl;
const API_SELECTORS = API_PROVIDERS[PROVIDER].selectors;

export async function fetchStockData(
  page: Page,
  service: string,
  ticker?: string
) {
  if (!ticker) {
    throw new Error('No ticker provided');
  }
  const route =
    API_PROVIDERS[PROVIDER].endpoints[
      service as keyof (typeof API_PROVIDERS)[typeof PROVIDER]['endpoints']
    ];
  const endpoint = `${API_URL}${route}/${ticker}?p=${ticker}&.tsrc=fin-srch`;
  await page.goto(endpoint);
  await acceptConsent(page);
  return await extractStockData(page);
}

export async function acceptConsent(page: Page) {
  const consentSelector = '.accept-all';
  await page.waitForSelector(consentSelector, { visible: true });
  await page.click(consentSelector);
}

export async function extractStockData(page: Page) {
  // Wait for the page to be fully loaded by waiting for the title to be visible
  await page.waitForSelector(API_SELECTORS.title, { visible: true });

  const title = await page.$eval(API_SELECTORS.title, (el) => el.textContent);
  const price = await page.$eval(API_SELECTORS.price, (el) =>
    el.getAttribute('data-value')
  );
  const priceChange = await page.$eval(API_SELECTORS.priceChange, (el) =>
    el.getAttribute('data-value')
  );
  const percentageChange = await page.$eval(
    API_SELECTORS.percentageChange,
    (el) => el.getAttribute('data-value')
  );

  return {
    title,
    price: parseFloat(price as string),
    priceChange: parseFloat(priceChange as string),
    percentageChange: parseFloat(percentageChange as string),
  };
}
