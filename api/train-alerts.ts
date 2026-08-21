export default async function handler(req: any, res: any) {
  const accountKey = (
    process.env.LTA_ACCOUNT_KEY ||
    process.env.LTA_DATAMALL_ACCOUNT_KEY ||
    ''
  ).trim();

  if (!accountKey) {
    return res.status(200).json({
      isLive: false,
      requiresAccountKey: true,
      value: { Status: 1, Message: [] },
    });
  }

  try {
    const r = await fetch('https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts', {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!r.ok) {
      return res.status(r.status).json({
        error: `LTA Train Alerts error: ${r.statusText}`,
        value: { Status: 1, Message: [] },
      });
    }

    const data = await r.json();
    return res.status(200).json({
      isLive: true,
      timestamp: new Date().toISOString(),
      value: data.value || { Status: 1, Message: [] },
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || 'Failed to fetch train service alerts',
      isLive: false,
      value: { Status: 1, Message: [] },
    });
  }
}
