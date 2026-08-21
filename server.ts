import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to get LTA DataMall Account Key
function getLtaAccountKey(): string {
  return (
    process.env.LTA_DATAMALL_ACCOUNT_KEY ||
    process.env.LTA_ACCOUNT_KEY ||
    process.env.DATAMALL_ACCOUNT_KEY ||
    ''
  ).trim();
}

// Health & Config status endpoint
export function healthHandler(req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    ltaConfigured: Boolean(getLtaAccountKey()),
    timestamp: new Date().toISOString(),
  });
}

app.get('/api/health', healthHandler);
app.get('/api', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/lta/status', (req, res) => {
  const accountKey = getLtaAccountKey();
  res.json({
    configured: Boolean(accountKey),
    keyPrefix: accountKey ? `${accountKey.slice(0, 4)}...` : null,
    endpoints: {
      busArrivalV3: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
      trafficIncidents: 'https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents',
      trainServiceAlerts: 'https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts',
    },
  });
});

// Helper to map LTA bus load code
function mapLoad(load?: string): { occupancy: 'seats' | 'standing' | 'limited'; percent: number } {
  switch (load) {
    case 'SEA': // Seats Available
      return { occupancy: 'seats', percent: 35 };
    case 'SDA': // Standing Available
      return { occupancy: 'standing', percent: 68 };
    case 'LSD': // Limited Standing
      return { occupancy: 'limited', percent: 92 };
    default:
      return { occupancy: 'seats', percent: 30 };
  }
}

// Helper to map LTA bus type code
function mapType(type?: string): 'Single' | 'Double Deck' | 'Bendy' {
  switch (type) {
    case 'DD':
      return 'Double Deck';
    case 'BD':
      return 'Bendy';
    case 'SD':
    default:
      return 'Single';
  }
}

// Helper to calculate minutes to arrival
function calculateMinutes(estimatedArrivalIso?: string): number {
  if (!estimatedArrivalIso) return -1;
  const arrivalTime = new Date(estimatedArrivalIso).getTime();
  if (isNaN(arrivalTime)) return -1;
  const now = Date.now();
  const diffMs = arrivalTime - now;
  const diffMinutes = Math.round(diffMs / 60000);
  return diffMinutes < 0 ? 0 : diffMinutes;
}

// 1. Bus Arrivals v3 Proxy (20-second live refresh)
// Usage: /api/lta/bus-arrival?BusStopCode=83139&ServiceNo=15 (or raw=true)
export async function busArrivalHandler(req: any, res: any) {
  const busStopCode = (req.query?.BusStopCode || req.params?.BusStopCode || '83139').toString().trim();
  const serviceNo = (req.query?.ServiceNo || req.params?.ServiceNo || '').toString().trim();
  const isRaw = req.query?.raw === 'true' || req.path?.includes('raw');

  const accountKey = getLtaAccountKey();

  if (!accountKey) {
    return res.status(200).json({
      BusStopCode: busStopCode,
      isLive: false,
      requiresAccountKey: true,
      message: 'LTA_ACCOUNT_KEY is not set in environment.',
      Services: [],
    });
  }

  try {
    let ltaUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
    if (serviceNo) {
      ltaUrl += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
    }

    const response = await fetch(ltaUrl, {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `LTA DataMall error ${response.status}: ${errorText || response.statusText}`,
        isLive: false,
        BusStopCode: busStopCode,
        Services: [],
      });
    }

    const data = await response.json();

    if (isRaw) {
      return res.status(response.status).json(data);
    }

    // Transform LTA v3 services to frontend-friendly structure
    const transformedServices = (data.Services || []).map((srv: any) => {
      const nextBus = srv.NextBus || {};
      const nextBus2 = srv.NextBus2 || {};
      const nextBus3 = srv.NextBus3 || {};

      const mins1 = calculateMinutes(nextBus.EstimatedArrival);
      const mins2 = calculateMinutes(nextBus2.EstimatedArrival);
      const mins3 = calculateMinutes(nextBus3.EstimatedArrival);

      const loadInfo = mapLoad(nextBus.Load);

      return {
        serviceNo: srv.ServiceNo,
        operator: srv.Operator,
        mins: mins1 >= 0 ? mins1 : 0,
        nextMins: mins2 >= 0 ? mins2 : (mins1 >= 0 ? mins1 + 10 : 12),
        thirdMins: mins3 >= 0 ? mins3 : undefined,
        occupancy: loadInfo.occupancy,
        occupancyPercent: loadInfo.percent,
        isWheelchairAccessible: nextBus.Feature === 'WAB',
        busType: mapType(nextBus.Type),
        destinationCode: nextBus.DestinationCode,
        originCode: nextBus.OriginCode,
        rawNextBus: {
          load: nextBus.Load,
          type: nextBus.Type,
          feature: nextBus.Feature,
          estimatedArrival: nextBus.EstimatedArrival,
          latitude: nextBus.Latitude,
          longitude: nextBus.Longitude,
        },
      };
    });

    return res.json({
      BusStopCode: data.BusStopCode || busStopCode,
      isLive: true,
      timestamp: new Date().toISOString(),
      Services: transformedServices,
      raw: data,
    });
  } catch (err: any) {
    console.error('Error fetching LTA Bus Arrival:', err);
    return res.status(500).json({
      error: err.message || 'Failed to fetch bus arrival from LTA DataMall',
      isLive: false,
      BusStopCode: busStopCode,
      Services: [],
    });
  }
}

app.get('/api/lta/bus-arrival', busArrivalHandler);
app.get('/api/bus-arrival', busArrivalHandler);
app.get('/api/v3/BusArrival', busArrivalHandler);

// 2. Traffic Incidents Proxy
// Usage: /api/lta/traffic-incidents
app.get('/api/lta/traffic-incidents', async (req, res) => {
  const accountKey = getLtaAccountKey();

  if (!accountKey) {
    return res.json({
      isLive: false,
      requiresAccountKey: true,
      value: [],
    });
  }

  try {
    const response = await fetch('https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents', {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `LTA Traffic Incidents error: ${response.statusText}`,
        value: [],
      });
    }

    const data = await response.json();
    return res.json({
      isLive: true,
      timestamp: new Date().toISOString(),
      value: data.value || [],
    });
  } catch (err: any) {
    console.error('Error fetching LTA Traffic Incidents:', err);
    return res.status(500).json({
      error: err.message || 'Failed to fetch traffic incidents',
      isLive: false,
      value: [],
    });
  }
});

// 3. Train Service Alerts Proxy (MRT/LRT Status)
// Usage: /api/lta/train-alerts
app.get('/api/lta/train-alerts', async (req, res) => {
  const accountKey = getLtaAccountKey();

  if (!accountKey) {
    return res.json({
      isLive: false,
      requiresAccountKey: true,
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
        error: `LTA Train Alerts error: ${response.statusText}`,
        value: { Status: 1, Message: [] },
      });
    }

    const data = await response.json();
    return res.json({
      isLive: true,
      timestamp: new Date().toISOString(),
      value: data.value || { Status: 1, Message: [] },
    });
  } catch (err: any) {
    console.error('Error fetching LTA Train Service Alerts:', err);
    return res.status(500).json({
      error: err.message || 'Failed to fetch train service alerts',
      isLive: false,
      value: { Status: 1, Message: [] },
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Singapore Bus & Transit Server listening on port ${PORT}`);
  });
}

startServer();
