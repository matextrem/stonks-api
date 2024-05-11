<a href="https://www.typescriptlang.org" target="_blank"><img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="Typescript" height="30"></a>
<a href="https://vercel.com" target="_blank"><img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" height="30"></a>
<a href="https://www.buymeacoffee.com/matextrem" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-yellow.png" alt="Buy Me A Coffee" height="30"></a>

# Stonks API

Stonks API is a serverless API developed to fetch stock data from multiple providers using Cheerio, with the initial implementation focusing on [Finvinz](https://finviz.com/). Hosted on Vercel, this API aims to extend support to various financial data providers, making it a versatile tool for accessing stock market data.

## Features

- Fetch stock data including price, price changes, and percentage changes.
- Currently supports Finvinz.
- Designed to easily extend support to additional providers.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

`Node version: 18.x`

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
   API_PROVIDER=finvinz
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

### Usage

To fetch stock data from the supported providers, navigate to:

```
http://localhost:3000/api/quote/AAPL // Default to type=stock
```
Replace `AAPL` with your desired stock ticker.

We also support the following types:

- FOREX 

```
http://localhost:3000/api/quote/EURUSD?type=forex
```
- COMMODITIES

```
http://localhost:3000/api/quote/GOLD?type=commodity
```
- FUTURES 

```
http://localhost:3000/api/quote/NQ?type=future
```

- CRYPTO 

```
http://localhost:3000/api/quote/ethereum?type=crypto
```

## API Providers Configuration

The API is designed to be extendable with multiple providers. It is configured as follows:

```typescript
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
};
```

## Supported providers

- [Finviz](https://finviz.com/)
- [Investing.com](https://www.investing.com/)

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
