export default function handler(req: any, res: any) {
  const accountKey = (
    process.env.LTA_ACCOUNT_KEY ||
    process.env.LTA_DATAMALL_ACCOUNT_KEY ||
    ''
  ).trim();

  res.status(200).json({
    status: 'ok',
    ltaConfigured: Boolean(accountKey),
    timestamp: new Date().toISOString(),
  });
}
