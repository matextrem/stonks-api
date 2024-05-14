import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    API_PROVIDER: '${env:API_PROVIDER}',
  },
  memorySize: 128,
  events: [
    {
      http: {
        method: 'get',
        path: 'quote/{ticker}',
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
