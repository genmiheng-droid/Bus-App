import { getLiveBusArrival, generateRealtimeArrivals } from '../src/server/ltaService';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const busStopCode = (req.query.BusStopCode || req.query.busStopCode || '12029') as string;
  const serviceNo = (req.query.ServiceNo || req.query.serviceNo) as string | undefined;

  try {
    const result = await getLiveBusArrival(busStopCode, serviceNo);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('LTA Bus Arrival Vercel API handler error:', err);
    return res.status(200).json({
      BusStopCode: busStopCode,
      isLive: false,
      isFallback: true,
      error: err.message,
      timestamp: new Date().toISOString(),
      Services: generateRealtimeArrivals(busStopCode, serviceNo),
    });
  }
}
