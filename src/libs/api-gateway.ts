import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export const formatJSONResponse = (
  response: Record<string, unknown>,
  statusCode = 200,
  headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cache-Control': 's-maxage=30, stale-while-revalidate=10',
  }
) => {
  return {
    statusCode,
    headers,
    body: JSON.stringify(response),
  };
};
