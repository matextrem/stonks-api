import * as cheerio from 'cheerio';

import { ApiProviders, ApiProvidersConfig } from './types';

export const PROVIDER: ApiProviders =
  (process.env.API_PROVIDER as ApiProviders) || ApiProviders.Finviz;

export const API_PROVIDERS: ApiProvidersConfig = {
  [ApiProviders.Finviz]: {
    baseUrl: 'https://finviz.com',
    endpoints: {
      quote: {
        route: 'quote.ashx',
        query: 't',
      },
    },
    selectors: {
      name: {
        selector: '.quote-header_ticker-wrapper_company > a',
        extractor: (element: cheerio.Cheerio<cheerio.Element>) =>
          element.text().trim(),
      },
      ticker: {
        selector: '.quote-header_ticker-wrapper_ticker',
        extractor: (element: cheerio.Cheerio<cheerio.Element>) =>
          element.text().trim(),
      },
      price: {
        selector: '.quote-price_wrapper_price',
        extractor: (element: cheerio.Cheerio<cheerio.Element>) =>
          element.text().trim(),
      },
      change: {
        selector: '.quote-price_wrapper_change > tbody > tr',
        extractor: (
          element: cheerio.Cheerio<cheerio.Element>,
          $: cheerio.CheerioAPI
        ) => {
          let value = '';
          element.find('.sr-only').each((i: number, el: cheerio.Element) => {
            if ($(el).text().includes('Dollar')) {
              value = $(el).parent().text().replace($(el).text(), '').trim();
            }
          });
          return value;
        },
      },
      percentageChange: {
        selector: '.quote-price_wrapper_change > tbody > tr',
        extractor: (
          element: cheerio.Cheerio<cheerio.Element>,
          $: cheerio.CheerioAPI
        ) => {
          let value = '';
          element.find('.sr-only').each((i: number, el: cheerio.Element) => {
            if ($(el).text().includes('Percentage')) {
              value = $(el).parent().text().replace($(el).text(), '').trim();
            }
          });
          return value;
        },
      },
    },
  },
};
