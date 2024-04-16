export enum ApiProviders {
  YahooFinance = 'yahoo',
}

export const PROVIDER: ApiProviders =
  (process.env.API_PROVIDER as ApiProviders) || ApiProviders.YahooFinance;

export const API_PROVIDERS = {
  [ApiProviders.YahooFinance]: {
    baseUrl: 'https://finance.yahoo.com',
    endpoints: {
      quote: '/quote',
    },
    selectors: {
      title: '.svelte-ufs8hf',
      price: 'fin-streamer.livePrice',
      priceChange: 'fin-streamer.priceChange[data-field="regularMarketChange"]',
      percentageChange:
        'fin-streamer.priceChange[data-field="regularMarketChangePercent"]',
    },
  },
};
