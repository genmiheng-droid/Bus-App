import { getLtaAccountKey } from '../src/server/ltaService';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const skip = req.query.$skip || req.query.skip || '0';
  const accountKey = getLtaAccountKey();

  if (!accountKey) {
    return res.status(200).json({
      isLive: false,
      requiresAccountKey: true,
      message: 'Set LTA_DATAMALL_ACCOUNT_KEY in Vercel environment variables to fetch direct LTA BusStops dataset.',
      value: [],
    });
  }

  try {
    const response = await fetch(`https://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${encodeURIComponent(skip)}`, {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText, value: [] });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message, value: [] });
  }
}
