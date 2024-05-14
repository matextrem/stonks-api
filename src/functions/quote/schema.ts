export default {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['stock', 'forex', 'crypto', 'future', 'commodity'],
    },
  },
} as const;
