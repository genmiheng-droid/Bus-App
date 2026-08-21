import { getLtaConfigStatus } from '../src/server/ltaService';

export default function handler(req: any, res: any) {
  const status = getLtaConfigStatus();
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    ltaConfigured: status.configured,
    environment: status.environment,
  });
}
