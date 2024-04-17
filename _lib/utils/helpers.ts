import * as cheerio from 'cheerio';
import { API_PROVIDERS, PROVIDER } from './constants';
import { parseURL } from './parser';

const API_URL = API_PROVIDERS[PROVIDER].baseUrl;
const API_SELECTORS = API_PROVIDERS[PROVIDER].selectors;

export async function fetchStockData(service: string, ticker?: string) {
  if (!ticker) {
    throw new Error('No ticker provided');
  }
  const endpoint =
    API_PROVIDERS[PROVIDER].endpoints[
      service as keyof (typeof API_PROVIDERS)[typeof PROVIDER]['endpoints']
    ];

  const uri = parseURL(API_URL, endpoint, ticker);
  const response = await fetch(uri);

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  const body = await response.text();
  const $ = cheerio.load(body);
  return await extractStockData($);
}

export async function extractStockData($: cheerio.CheerioAPI) {
  const data = {} as Record<string, string>;
  for (let key in API_SELECTORS) {
    const { selector, extractor } = API_SELECTORS[key] as any;
    const selectedElement = $(selector);
    data[key] = extractor(selectedElement, $);
  }

  return {
    name: data.name,
    ticker: data.ticker,
    price: parseFloat(data.price as string),
    change: parseFloat(data.change as string),
    percentageChange: parseFloat(data.percentageChange as string),
  };
}
