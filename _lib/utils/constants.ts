import * as cheerio from 'cheerio';

import { ApiProviders, ApiProvidersConfig } from './types';

export const PROVIDER: ApiProviders =
  (process.env.API_PROVIDER as ApiProviders) || ApiProviders.Finviz;

export const API_PROVIDERS: ApiProvidersConfig = {
  [ApiProviders.Finviz]: {
    baseUrl: 'https://finviz.com',
    fallback: ApiProviders.Investing,
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
  [ApiProviders.Investing]: {
    baseUrl: 'https://www.investing.com',
    endpoints: {
      quote: {
        route: 'equities',
      },
      forex: {
        route: 'currencies',
      },
      commodity: {
        route: 'commodities',
      },
      future: {
        route: 'indices',
      },
    },
    selectors: {
      name: {
        selector: 'h1.leading-7',
        extractor: (element: cheerio.Cheerio<cheerio.Element>) => {
          const regex = /^(.*?)\s*\((.*?)\)$/;
          const title = element.text().trim();
          const match = title.match(regex);
          return match ? match[1] : title.split('-')[0].trim();
        },
      },
      ticker: {
        selector: '[data-test="base_symbol"]',
        fallbackSelector: 'h1.leading-7',
        extractor: (element: cheerio.Cheerio<cheerio.Element>) =>
          element.text().trim(),
        fallbackExtractor: (element: cheerio.Cheerio<cheerio.Element>) => {
          const regex = /^(.*?)\s*\((.*?)\)$/;
          const match = element.text().match(regex);
          return match ? match[2] : element.text().split('-')[0].trim();
        },
      },
      price: {
        selector: '[data-test="instrument-price-last"]',
        extractor: (element: cheerio.Cheerio<cheerio.Element>) =>
          element.text().trim().replace(/,/g, ''),
      },
      change: {
        selector: '[data-test="instrument-price-change"]',
        extractor: (element: cheerio.Cheerio<cheerio.Element>) =>
          element.text().trim(),
      },
      percentageChange: {
        selector: '[data-test="instrument-price-change-percent"]',
        extractor: (element: cheerio.Cheerio<cheerio.Element>) => {
          const cleanedText = element.text().trim().replace(/[()]/g, ''); // Remove parentheses
          return cleanedText;
        },
      },
    },
  },
};

export const QUOTE_REPLACEMENTS = {
  forex: {
    EURUSD: 'eur-usd',
    GBPUSD: 'gbp-usd',
    USDJPY: 'usd-jpy',
    USDCAD: 'usd-cad',
    USDCHF: 'usd-chf',
    AUDUSD: 'aud-usd',
    NZDUSD: 'nzd-usd',
    EURGBP: 'eur-gbp',
    EURJPY: 'eur-jpy',
    XAUUSD: 'xau-usd',
  },
  commodity: {
    CRUDEOIL: 'crude-oil',
    BRENT: 'brent-oil',
    NATURALGAS: 'natural-gas',
    CC: 'us-cocoa',
    CT: 'us-cotton-no.2',
    JO: 'orange-juice',
    KC: 'us-coffee-c',
    LB: 'lumber',
    SB: 'us-sugar-no11',
    ZC: 'us-corn',
    ZL: 'us-soybean-oil',
    ZM: 'us-soybean-meal',
    ZS: 'us-soybeans',
    ZW: 'us-wheat',
    ZO: 'oats',
    ZR: 'rough-rice',
    RS: 'canola-futures',
  },
  future: {
    ES: 'us-spx-500-futures',
    NQ: 'nq-100-futures',
    YM: 'us-30-futures',
    ER2: 'smallcap-2000-futures',
    NKD: 'japan-225-futures',
    EX: 'eu-stocks-50-futures',
    DY: 'germany-30-futures',
    VX: 'us-spx-vix-futures',
  },
};
