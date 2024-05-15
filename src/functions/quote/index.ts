import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    API_PROVIDER: '${env:API_PROVIDER}',
  },
  memorySize: 512,
  events: [
    {
      http: {
        method: 'get',
        path: 'quote/{ticker}',
        caching: {
          enabled: true,
          cacheKeyParameters: [
            {
              name: 'request.path.ticker',
            },
          ],
        },
        cors: true,
        request: {
          parameters: {
            paths: {
              ticker: true,
            },
          },
        },
      },
    },
  ],
};
