import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  ALLOWED_USER_AGENTS,
  QuoteTypes,
  fetchStockData,
} from '../../_lib/utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userAgent = req.headers['user-agent'] || '';

  // Check if the User-Agent is disallowed
  if (!ALLOWED_USER_AGENTS.some((ua) => userAgent.includes(ua))) {
    return res.status(403).json({ error: 'Forbidden request' });
  }

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=10');

  try {
    const type = (req.query.type as QuoteTypes) ?? QuoteTypes.STOCK;
    const ticker = req.query.ticker as string;
    const stockData = await fetchStockData(type, ticker);
    return res.json({ ...stockData });
  } catch (error) {
    console.error('Error fetching page:', error);
    return res
      .status(500)
      .json({ error: `Failed to fetch data for ${req.query.ticker}` });
  }
}
