import * as cheerio from 'cheerio';

export enum ApiProviders {
  Finviz = 'finviz',
}

export interface Endpoint {
  route: string;
  query: string;
}

interface SelectorConfig {
  selector: string;
  extractor: (
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
