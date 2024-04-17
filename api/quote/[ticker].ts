import type { VercelRequest, VercelResponse } from '@vercel/node';

import { fetchStockData } from '../../_lib/utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const stockData = await fetchStockData('quote', req.query.ticker as string);
    return res.json({ ...stockData });
  } catch (error) {
    console.error('Error fetching page:', error);
    return res
      .status(500)
      .json({ error: `Failed to fetch data for ${req.query.ticker}` });
  }
}
