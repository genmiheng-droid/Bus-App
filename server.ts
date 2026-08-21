import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  getLtaAccountKey,
  getLtaConfigStatus,
  getLiveBusArrival,
  generateRealtimeArrivals,
} from './src/server/ltaService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. Health & Config status endpoint (References Vercel & runtime environment variables)
export function healthHandler(req: any, res: any) {
  const status = getLtaConfigStatus();
  res.status(200).json({
    status: 'ok',
    ltaConfigured: status.configured,
    environment: status.environment,
    accountKeyEnvName: status.accountKeyEnvName,
    instructions: status.instructions,
    timestamp: new Date().toISOString(),
  });
}

app.get('/api/health', healthHandler);
app.get('/api', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 2. LTA DataMall Configuration & Diagnostics endpoint
app.get(['/api/lta/status', '/api/lta-status'], (req, res) => {
  const status = getLtaConfigStatus();
  res.json(status);
});

// 3. Real-Time Bus Arrivals v3 Proxy
export async function busArrivalHandler(req: any, res: any) {
  const busStopCode = (req.query?.BusStopCode || req.query?.busStopCode || req.params?.BusStopCode || '12029').toString().trim();
  const serviceNo = (req.query?.ServiceNo || req.query?.serviceNo || req.params?.ServiceNo || '').toString().trim();
  const isRaw = req.query?.raw === 'true' || req.path?.includes('raw');

  try {
    const result = await getLiveBusArrival(busStopCode, serviceNo || undefined);
    if (isRaw && result.raw) {
      return res.status(200).json(result.raw);
    }
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Error fetching LTA Bus Arrival:', err);
    return res.status(200).json({
      BusStopCode: busStopCode,
      isLive: false,
      isFallback: true,
      error: err.message || 'Error connecting to LTA DataMall',
      timestamp: new Date().toISOString(),
      Services: generateRealtimeArrivals(busStopCode, serviceNo || undefined),
    });
  }
}

app.get('/api/lta/bus-arrival', busArrivalHandler);
app.get('/api/bus-arrival', busArrivalHandler);
app.get('/api/v3/BusArrival', busArrivalHandler);

// 4. Traffic Incidents Proxy
app.get(['/api/lta/traffic-incidents', '/api/traffic-incidents'], async (req, res) => {
  const accountKey = getLtaAccountKey();

  if (!accountKey) {
    return res.json({
      isLive: false,
      requiresAccountKey: true,
      message: 'Configure LTA_DATAMALL_ACCOUNT_KEY in Vercel Environment Variables or .env',
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

// 5. Train Service Alerts Proxy (MRT/LRT Status)
app.get(['/api/lta/train-alerts', '/api/train-alerts'], async (req, res) => {
  const accountKey = getLtaAccountKey();

  if (!accountKey) {
    return res.json({
      isLive: false,
      requiresAccountKey: true,
      message: 'Configure LTA_DATAMALL_ACCOUNT_KEY in Vercel Environment Variables or .env',
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

// 6. Direct LTA Bus Stops Dataset Proxy
app.get(['/api/lta/bus-stops', '/api/bus-stops'], async (req, res) => {
  const skip = (req.query.$skip || req.query.skip || '0').toString();
  const accountKey = getLtaAccountKey();

  if (!accountKey) {
    return res.json({
      isLive: false,
      requiresAccountKey: true,
      message: 'Configure LTA_DATAMALL_ACCOUNT_KEY in Vercel Environment Variables or .env to query LTA BusStops dataset.',
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
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message, value: [] });
  }
});

// 7. Direct LTA Bus Routes Dataset Proxy
app.get(['/api/lta/bus-routes', '/api/bus-routes'], async (req, res) => {
  const skip = (req.query.$skip || req.query.skip || '0').toString();
  const accountKey = getLtaAccountKey();

  if (!accountKey) {
    return res.json({
      isLive: false,
      requiresAccountKey: true,
      message: 'Configure LTA_DATAMALL_ACCOUNT_KEY in Vercel Environment Variables or .env to query LTA BusRoutes dataset.',
      value: [],
    });
  }

  try {
    const response = await fetch(`https://datamall2.mytransport.sg/ltaodataservice/BusRoutes?$skip=${encodeURIComponent(skip)}`, {
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
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message, value: [] });
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
    const status = getLtaConfigStatus();
    console.log(`Singapore Bus & Transit Server listening on port ${PORT}`);
    console.log(`[LTA DataMall] Configured: ${status.configured} (${status.accountKeyEnvName})`);
    if (!status.configured) {
      console.log(`[Vercel Setup Note] Add LTA_DATAMALL_ACCOUNT_KEY in your Vercel Project Settings > Environment Variables for direct live LTA feed.`);
    }
  });
}

startServer();
