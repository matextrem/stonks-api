import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  fetchStockData,
  parseValue,
  getBrowser,
  closeBrowser,
  cacheRequests,
} from '../../_lib/utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const browser = await getBrowser();
  try {
    const page = (await browser.pages())[0];
    await page.setRequestInterception(true);
    cacheRequests(page);
    const stockData = await fetchStockData(
      page,
      'quote',
      req.query.ticker as string
    );

    const { title, ...data } = stockData;

    return res.json({
      name: parseValue(title),
      ticker: parseValue(title, 'ticker'),
      ...data,
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    return res
      .status(500)
      .json({ error: `Failed to fetch data for ${req.query.ticker}` });
  } finally {
    await closeBrowser(browser);
  }
}
