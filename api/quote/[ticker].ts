import type { VercelRequest, VercelResponse } from '@vercel/node';

import { QuoteTypes, fetchStockData } from '../../_lib/utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=10');
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
