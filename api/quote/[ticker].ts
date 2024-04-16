import type { VercelRequest, VercelResponse } from '@vercel/node';

import { fetchStockData, parseValue, getBrowser } from '../../_lib/utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const browser = await getBrowser();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });

    const stockData = await fetchStockData(
      page,
      'quote',
      req.query.ticker as string
    );
    await browser.close();

    return res.json({
      name: parseValue(stockData.title),
      ticker: parseValue(stockData.title, 'ticker'),
      ...stockData,
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    await browser.close();
    return res
      .status(500)
      .json({ error: `Failed to fetch data for ${req.query.ticker}` });
  }
}
