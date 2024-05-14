import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { QuoteTypes, fetchStockData } from '@utils';

const quote: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const pathParameters = event.pathParameters || {};
  const ticker = pathParameters.ticker as string;
  const type =
    (event.queryStringParameters?.type as QuoteTypes) ?? QuoteTypes.STOCK;
  try {
    const stockData = await fetchStockData(type, ticker);
    return formatJSONResponse({ ...stockData });
  } catch (error) {
    console.error('Error fetching page:', error);
    return formatJSONResponse(
      { error: `Failed to fetch data for ${ticker}` },
      500
    );
  }
};

export const main = middyfy(quote);
