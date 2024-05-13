import * as cheerio from 'cheerio';

import { ApiProviders, ApiProvidersConfig, QuoteTypes } from './types';

export const PROVIDER: ApiProviders =
  (process.env.API_PROVIDER as ApiProviders) || ApiProviders.Finviz;

export const API_PROVIDERS: ApiProvidersConfig = {
  [ApiProviders.Finviz]: {
    baseUrl: 'https://finviz.com',
    endpoints: {
      stock: {
        route: 'quote.ashx',
        query: 't',
      },
      forex: {
        route: 'currencies',
        fallback: ApiProviders.Investing,
      },
      commodity: {
        route: 'commodities',
        fallback: ApiProviders.Investing,
      },
      future: {
        route: 'indices',
        fallback: ApiProviders.Investing,
      },
      crypto: {
        route: 'crypto',
        fallback: ApiProviders.CoinMarketCap,
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
      crypto: {
        route: 'crypto',
        fallback: ApiProviders.CoinMarketCap,
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
  [ApiProviders.CoinMarketCap]: {
    baseUrl: 'https://www.coinmarketcap.com',
    endpoints: {
      stock: {
        route: 'quote.ashx',
        query: 't',
        fallback: ApiProviders.Finviz,
      },
      forex: {
        route: 'currencies',
        fallback: ApiProviders.Investing,
      },
      commodity: {
        route: 'commodities',
        fallback: ApiProviders.Investing,
      },
      future: {
        route: 'indices',
        fallback: ApiProviders.Investing,
      },
      crypto: {
        route: 'currencies',
      },
    },
    selectors: {
      name: {
        selector: '[data-role="coin-name"]',
        extractor: (element: cheerio.Cheerio<cheerio.Element>) =>
          element.attr('title')?.trim() || element.text().trim(),
      },
      ticker: {
        selector: '[data-role="coin-symbol"]',
        extractor: (element: cheerio.Cheerio<cheerio.Element>) =>
          element.text().trim(),
      },
      price: {
        selector: '.sc-f70bb44c-0.jxpCgO',
        extractor: (element: cheerio.Cheerio<cheerio.Element>) =>
          element.text().trim().replace(/[$,]/g, ''),
      },
      change: {
        selector: '.sc-f70bb44c-0.flfGQp',
        extractor: (element: cheerio.Cheerio<cheerio.Element>) => {
          const calculatePriceChange = (
            percentageChange: string,
            originalPrice: string
          ) => {
            const percentage =
              parseFloat(percentageChange.replace('%', '')) / 100;
            return parseFloat(originalPrice) * percentage;
          };

          const price = element
            .find('.sc-f70bb44c-0.jxpCgO')
            ?.text()
            .trim()
            .replace(/[$,]/g, '');
          const color = element.find('p').attr('color');
          const isPositiveChange = color === 'green';
          const textContent = element.text().trim();
          const match = textContent.match(/([\d.]+%)/);
          if (match) {
            const change = isPositiveChange ? match[1] : `-${match[1]}`;
            const priceChange = calculatePriceChange(change, price);
            return priceChange.toFixed(2);
          }
          return 'N/A';
        },
      },
      percentageChange: {
        selector: '.sc-4984dd93-0',
        extractor: (element: cheerio.Cheerio<cheerio.Element>) => {
          const color = element.attr('color');
          const isPositiveChange = color === 'green';
          const textContent = element.text().trim();
          const match = textContent.match(/([\d.]+%)/);
          if (match) {
            return isPositiveChange ? match[1] : `-${match[1]}`;
          }
          return 'N/A';
        },
      },
    },
  },
};

export const QUOTE_REPLACEMENTS: Record<
  ApiProviders,
  {
    forex?: Record<
      string,
      {
        value: string;
        route?: string;
        symbol?: string;
        provider?: ApiProviders;
      }
    >;
    commodity?: Record<
      string,
      {
        value: string;
        route?: string;
        symbol?: string;
        provider?: ApiProviders;
      }
    >;
    future?: Record<
      string,
      {
        value: string;
        route?: string;
        symbol?: string;
        provider?: ApiProviders;
      }
    >;
    stock?: Record<
      string,
      {
        value: string;
        route?: string;
        symbol?: string;
        provider?: ApiProviders;
      }
    >;
    crypto?: Record<
      string,
      {
        value: string;
        route?: string;
        symbol?: string;
        provider?: ApiProviders;
      }
    >;
  }
> = {
  [ApiProviders.Finviz]: {
    [QuoteTypes.STOCK]: {
      SPX: {
        value: 'us-spx-500',
        route: 'indices',
        symbol: 'SPX',
        provider: ApiProviders.Investing,
      },
      DJI: {
        value: 'us-30',
        route: 'indices',
        symbol: 'DJI',
        provider: ApiProviders.Investing,
      },
      IXIC: {
        value: 'nasdaq-composite',
        route: 'indices',
        symbol: 'IXIC',
        provider: ApiProviders.Investing,
      },
      RUT: {
        value: 'smallcap-2000',
        route: 'indices',
        symbol: 'RUT',
        provider: ApiProviders.Investing,
      },
      FTSE: {
        value: 'uk-100',
        route: 'indices',
        symbol: 'FTSE',
        provider: ApiProviders.Investing,
      },
      DAX: {
        value: 'germany-30',
        route: 'indices',
        symbol: 'DAX',
        provider: ApiProviders.Investing,
      },
      FCHI: {
        value: 'france-40',
        route: 'indices',
        symbol: 'FCHI',
        provider: ApiProviders.Investing,
      },
      VIX: {
        value: 'volatility-s-p-500',
        route: 'indices',
        symbol: 'VIX',
        provider: ApiProviders.Investing,
      },
    },
  },
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
      BTCUSD: {
        value: 'bitcoin',
        route: 'currencies',
        symbol: 'BTC/USD',
        provider: ApiProviders.CoinMarketCap,
      },
    },
    [QuoteTypes.COMMODITY]: {
      SI: { value: 'silver', symbol: 'SI' },
      GC: { value: 'gold', symbol: 'GC' },
      PL: { value: 'platinum' },
      HG: { value: 'copper' },
      PA: { value: 'palladium' },
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
  [ApiProviders.CoinMarketCap]: {
    [QuoteTypes.CRYPTO]: {
      BTC: { value: 'bitcoin' },
      ETH: { value: 'ethereum' },
      XRP: { value: 'xrp' },
      LTC: { value: 'litecoin' },
      ADA: { value: 'cardano' },
      BNB: { value: 'bnb' },
      DOT: { value: 'polkadot-new' },
      XLM: { value: 'stellar' },
      USDT: { value: 'tether' },
      DOGE: { value: 'dogecoin' },
      LINK: { value: 'chainlink' },
      XMR: { value: 'monero' },
      TRX: { value: 'tron' },
      EOS: { value: 'eos' },
      VET: { value: 'vechain' },
      XTZ: { value: 'tezos' },
      FIL: { value: 'filecoin' },
      XEM: { value: 'nem' },
      AAVE: { value: 'aave' },
    },
  },
};
