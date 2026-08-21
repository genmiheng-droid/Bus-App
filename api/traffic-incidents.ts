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
      value: [],
    });
  }

  try {
    const r = await fetch('https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents', {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!r.ok) {
      return res.status(r.status).json({
        error: `LTA Traffic Incidents error: ${r.statusText}`,
        value: [],
      });
    }

    const data = await r.json();
    return res.status(200).json({
      isLive: true,
      timestamp: new Date().toISOString(),
      value: data.value || [],
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || 'Failed to fetch traffic incidents',
      isLive: false,
      value: [],
    });
  }
}
