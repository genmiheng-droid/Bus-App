import { getLtaConfigStatus } from '../src/server/ltaService';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  const status = getLtaConfigStatus();
  return res.status(200).json(status);
}
