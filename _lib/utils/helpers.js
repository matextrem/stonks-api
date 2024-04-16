"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStockData = exports.acceptConsent = exports.fetchStockData = void 0;
var constants_1 = require("./constants");
var API_URL = constants_1.API_PROVIDERS[constants_1.PROVIDER].baseUrl;
var API_SELECTORS = constants_1.API_PROVIDERS[constants_1.PROVIDER].selectors;
function fetchStockData(page, service, ticker) {
    return __awaiter(this, void 0, void 0, function () {
        var route, endpoint;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!ticker) {
                        throw new Error('No ticker provided');
                    }
                    route = constants_1.API_PROVIDERS[constants_1.PROVIDER].endpoints[service];
                    endpoint = "".concat(API_URL).concat(route, "/").concat(ticker, "?p=").concat(ticker, "&.tsrc=fin-srch");
                    return [4 /*yield*/, page.goto(endpoint)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, acceptConsent(page)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, extractStockData(page)];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.fetchStockData = fetchStockData;
function acceptConsent(page) {
    return __awaiter(this, void 0, void 0, function () {
        var consentSelector;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    consentSelector = '.accept-all';
                    return [4 /*yield*/, page.waitForSelector(consentSelector, { visible: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.click(consentSelector)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.acceptConsent = acceptConsent;
function extractStockData(page) {
    return __awaiter(this, void 0, void 0, function () {
        var title, price, priceChange, percentageChange;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Wait for the page to be fully loaded by waiting for the title to be visible
                return [4 /*yield*/, page.waitForSelector(API_SELECTORS.title, { visible: true })];
                case 1:
                    // Wait for the page to be fully loaded by waiting for the title to be visible
                    _a.sent();
                    return [4 /*yield*/, page.$eval(API_SELECTORS.title, function (el) { return el.textContent; })];
                case 2:
                    title = _a.sent();
                    return [4 /*yield*/, page.$eval(API_SELECTORS.price, function (el) {
                            return el.getAttribute('data-value');
                        })];
                case 3:
                    price = _a.sent();
                    return [4 /*yield*/, page.$eval(API_SELECTORS.priceChange, function (el) { return el.getAttribute('data-value'); })];
                case 4:
                    priceChange = _a.sent();
                    return [4 /*yield*/, page.$eval(API_SELECTORS.percentageChange, function (el) { return el.getAttribute('data-value'); })];
                case 5:
                    percentageChange = _a.sent();
                    return [2 /*return*/, {
                            title: title,
                            price: parseFloat(price),
                            priceChange: parseFloat(priceChange),
                            percentageChange: parseFloat(percentageChange),
                        }];
            }
        });
    });
}
exports.extractStockData = extractStockData;
