# Stonks API

Stonks API is a serverless API developed to fetch stock data from multiple providers using Puppeteer, with the initial implementation focusing on Yahoo Finance. Hosted on Vercel, this API aims to extend support to various financial data providers, making it a versatile tool for accessing stock market data.

## Features

- Fetch stock data including price, price changes, and percentage changes.
- Currently supports Yahoo Finance.
- Designed to easily extend support to additional providers.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

```bash
npm install -g vercel
```

### Installing

A step by step series of examples that tell you how to get a development env running:

1. Clone the repository:

   ```bash
   git clone https://github.com/matextrem/stonks-api.git
   cd stonks-api
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```
   API_PROVIDER=yahoo
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

### Usage

To fetch stock data from the supported providers, navigate to:

```
http://localhost:3000/api/quote/AAPL
```

Replace `AAPL` with your desired stock ticker.

## API Providers Configuration

The API is designed to be extendable with multiple providers. Currently, it is configured as follows:

```typescript
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
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details.
