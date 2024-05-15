import type { AWS } from '@serverless/typescript';

import quote from '@functions/quote';

const serverlessConfiguration: AWS = {
  org: 'matextrem',
  app: 'stonks-serverless',
  service: 'stonks-serverless',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
    'serverless-api-gateway-caching',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    apiName: 'matextrem-stonks-api',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      description: 'Serverless API for assets data',
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { quote },
  package: { individually: true },
  custom: {
    apiGatewayCaching: {
      enabled: true,
      ttlInSeconds: 60,
      perKeyInvalidation: {
        requireAuthorization: false,
      },
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  useDotenv: true,
};

module.exports = serverlessConfiguration;
