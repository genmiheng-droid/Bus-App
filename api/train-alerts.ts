import { getLtaAccountKey } from '../src/server/ltaService';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const accountKey = getLtaAccountKey();
  if (!accountKey) {
    return res.status(200).json({
      isLive: false,
      requiresAccountKey: true,
      message: 'Configure LTA_DATAMALL_ACCOUNT_KEY on Vercel or .env',
      value: { Status: 1, Message: [] },
    });
  }

  try {
    const response = await fetch('https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts', {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `LTA Train Alerts: ${response.statusText}`,
        value: { Status: 1, Message: [] },
      });
    }

    const data = await response.json();
    return res.status(200).json({
      isLive: true,
      timestamp: new Date().toISOString(),
      value: data.value || { Status: 1, Message: [] },
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message,
      value: { Status: 1, Message: [] },
    });
  }
}
