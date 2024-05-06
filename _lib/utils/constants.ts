import * as cheerio from 'cheerio';

import { ApiProviders, ApiProvidersConfig, QuoteTypes } from './types';

export const PROVIDER: ApiProviders =
  (process.env.API_PROVIDER as ApiProviders) || ApiProviders.Finviz;

export const API_PROVIDERS: ApiProvidersConfig = {
  [ApiProviders.Finviz]: {
    baseUrl: 'https://finviz.com',
    fallback: ApiProviders.Investing,
    endpoints: {
      stock: {
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
      stock: {
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

export const QUOTE_REPLACEMENTS: Record<
  ApiProviders,
  {
    forex?: Record<string, { value: string; route?: string }>;
    commodity?: Record<string, { value: string; route?: string }>;
    future?: Record<string, { value: string; route?: string }>;
    stock?: Record<string, { value: string; route?: string }>;
  }
> = {
  [ApiProviders.Finviz]: {},
  [ApiProviders.Investing]: {
    [QuoteTypes.FOREX]: {
      EURUSD: { value: 'eur-usd' },
      GBPUSD: { value: 'gbp-usd' },
      USDJPY: { value: 'usd-jpy' },
      USDCAD: { value: 'usd-cad' },
      USDCHF: { value: 'usd-chf' },
      AUDUSD: { value: 'aud-usd' },
      NZDUSD: { value: 'nzd-usd' },
      EURGBP: { value: 'eur-gbp' },
      EURJPY: { value: 'eur-jpy' },
      XAUUSD: { value: 'xau-usd' },
    },
    [QuoteTypes.COMMODITY]: {
      CRUDEOIL: { value: 'crude-oil' },
      BRENT: { value: 'brent-oil' },
      NATURALGAS: { value: 'natural-gas' },
      CC: { value: 'us-cocoa' },
      CT: { value: 'us-cotton-no.2' },
      JO: { value: 'orange-juice' },
      KC: { value: 'us-coffee-c' },
      LB: { value: 'lumber' },
      SB: { value: 'us-sugar-no11' },
      ZC: { value: 'us-corn' },
      ZL: { value: 'us-soybean-oil' },
      ZM: { value: 'us-soybean-meal' },
      ZS: { value: 'us-soybeans' },
      ZW: { value: 'us-wheat' },
      ZO: { value: 'oats' },
      ZR: { value: 'rough-rice' },
      RS: { value: 'canola-futures' },
    },
    [QuoteTypes.FUTURE]: {
      ES: { value: 'us-spx-500-futures' },
      NQ: { value: 'nq-100-futures' },
      YM: { value: 'us-30-futures' },
      ER2: { value: 'smallcap-2000-futures' },
      NKD: { value: 'japan-225-futures' },
      EX: { value: 'eu-stocks-50-futures' },
      DY: { value: 'germany-30-futures' },
      VX: { value: 'us-spx-vix-futures' },
    },
    [QuoteTypes.STOCK]: {},
  },
};
