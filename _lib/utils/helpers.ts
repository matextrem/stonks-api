import * as cheerio from 'cheerio';
import { API_PROVIDERS, PROVIDER, QUOTE_REPLACEMENTS } from './constants';
import { parseURL } from './parser';
import { ApiProviders } from './types';

const API_URL = API_PROVIDERS[PROVIDER].baseUrl;
const API_SELECTORS = API_PROVIDERS[PROVIDER].selectors;

export async function fetchStockData(service: string, ticker?: string) {
  if (!ticker) {
    throw new Error('No ticker provided');
  }
  let endpoint =
    API_PROVIDERS[PROVIDER].endpoints[
      service as keyof (typeof API_PROVIDERS)[typeof PROVIDER]['endpoints']
    ];

  let fallbackProvider: ApiProviders = PROVIDER as ApiProviders;
  let apiUrl: string = API_URL;
  if (!endpoint) {
    fallbackProvider = API_PROVIDERS[PROVIDER].fallback as ApiProviders;
    apiUrl = API_PROVIDERS[fallbackProvider].baseUrl;
    endpoint =
      API_PROVIDERS[fallbackProvider].endpoints[
        service as keyof (typeof API_PROVIDERS)[typeof PROVIDER]['endpoints']
      ];
  }

  const uri = parseURL(apiUrl, endpoint, ticker.toLowerCase());
  const response = await fetch(uri);

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  const body = await response.text();
  const $ = cheerio.load(body);
  return await extractStockData($, fallbackProvider);
}

export async function extractStockData(
  $: cheerio.CheerioAPI,
  fallbackProvider?: ApiProviders
) {
  const data = {} as Record<string, string>;
  const selectors = !!fallbackProvider
    ? API_PROVIDERS[fallbackProvider].selectors
    : API_SELECTORS;

  for (let key in selectors) {
    const { selector, extractor, fallbackSelector, fallbackExtractor } =
      selectors[key] as any;

    const selectedExtractor = $(selector).length
      ? extractor
      : fallbackExtractor;
    const selectedElement = $(selector).length
      ? $(selector)
      : $(fallbackSelector);
    data[key] = selectedExtractor(selectedElement, $);
  }

  return {
    name: data.name,
    ticker: data.ticker,
    price: parseFloat(data.price as string),
    change: parseFloat(data.change as string),
    percentageChange: parseFloat(data.percentageChange as string),
  };
}

export const getTickerReplaced = (type: string, ticker: string) => {
  if (type) {
    const replacement =
      QUOTE_REPLACEMENTS[type as keyof typeof QUOTE_REPLACEMENTS];
    if (replacement) {
      return (
        replacement[ticker.toUpperCase() as keyof typeof replacement] || ticker
      );
    }
  }
  return ticker;
};
