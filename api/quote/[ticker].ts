import type { VercelRequest, VercelResponse } from '@vercel/node';

import { fetchStockData, getTickerReplaced } from '../../_lib/utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const type = (req.query.type as string) ?? 'quote';
    const ticker = req.query.ticker as string;
    const tickerReplaced = getTickerReplaced(type, ticker);
    const stockData = await fetchStockData(type, tickerReplaced);
    return res.json({ ...stockData });
  } catch (error) {
    console.error('Error fetching page:', error);
    return res
      .status(500)
      .json({ error: `Failed to fetch data for ${req.query.ticker}` });
  }
}
