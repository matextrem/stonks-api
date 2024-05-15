import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { ALLOWED_USER_AGENTS, QuoteTypes, fetchStockData } from '@utils';

const quote: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const userAgent =
    event.headers['User-Agent'] || event.headers['user-agent'] || '';

  // Check if the User-Agent is disallowed
  if (!ALLOWED_USER_AGENTS.some((ua) => userAgent.includes(ua))) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: 'Forbidden: Your request is not allowed.',
      }),
    };
  }
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
