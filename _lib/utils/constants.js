"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_PROVIDERS = exports.PROVIDER = exports.ApiProviders = void 0;
var ApiProviders;
(function (ApiProviders) {
    ApiProviders["YahooFinance"] = "yahoo";
})(ApiProviders || (exports.ApiProviders = ApiProviders = {}));
exports.PROVIDER = process.env.API_PROVIDER || ApiProviders.YahooFinance;
exports.API_PROVIDERS = (_a = {},
    _a[ApiProviders.YahooFinance] = {
        baseUrl: 'https://finance.yahoo.com',
        endpoints: {
            quote: '/quote',
        },
        selectors: {
            title: '.svelte-ufs8hf',
            price: 'fin-streamer.livePrice',
            priceChange: 'fin-streamer.priceChange[data-field="regularMarketChange"]',
            percentageChange: 'fin-streamer.priceChange[data-field="regularMarketChangePercent"]',
        },
    },
    _a);
