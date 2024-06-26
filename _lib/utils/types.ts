import * as cheerio from 'cheerio';

export enum ApiProviders {
  Finviz = 'finviz',
  Investing = 'investing.com',
  CoinMarketCap = 'coinmarketcap',
}

export interface Endpoint {
  route: string;
  query?: string;
  fallback?: ApiProviders;
}

export enum QuoteTypes {
  STOCK = 'stock',
  COMMODITY = 'commodity',
  FOREX = 'forex',
  FUTURE = 'future',
  CRYPTO = 'crypto',
}

interface SelectorConfig {
  selector: string;
  fallbackSelector?: string;
  extractor: (
    element: cheerio.Cheerio<cheerio.Element>,
    $: cheerio.CheerioAPI
  ) => string;
  fallbackExtractor?: (
    element: cheerio.Cheerio<cheerio.Element>,
    $: cheerio.CheerioAPI
  ) => string;
}

interface ProviderConfig {
  baseUrl: string;
  endpoints: {
    [key: string]: Endpoint;
  };
  selectors: {
    [key: string]: SelectorConfig;
  };
}

export interface ApiProvidersConfig {
  [key: string]: ProviderConfig;
}
