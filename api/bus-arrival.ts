function mapLoad(load?: string): { occupancy: 'seats' | 'standing' | 'limited'; percent: number } {
  switch (load) {
    case 'SEA':
      return { occupancy: 'seats', percent: 35 };
    case 'SDA':
      return { occupancy: 'standing', percent: 68 };
    case 'LSD':
      return { occupancy: 'limited', percent: 92 };
    default:
      return { occupancy: 'seats', percent: 30 };
  }
}

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

function calculateMinutes(estimatedArrivalIso?: string): number {
  if (!estimatedArrivalIso) return -1;
  const arrivalTime = new Date(estimatedArrivalIso).getTime();
  if (isNaN(arrivalTime)) return -1;
  const now = Date.now();
  const diffMs = arrivalTime - now;
  const diffMinutes = Math.round(diffMs / 60000);
  return diffMinutes < 0 ? 0 : diffMinutes;
}

export default async function handler(req: any, res: any) {
  const busStopCode = (req.query?.BusStopCode || req.query?.busStopCode || '83139').toString().trim();
  const serviceNo = (req.query?.ServiceNo || req.query?.serviceNo || '').toString().trim();
  const isRaw = req.query?.raw === 'true';

  const accountKey = (
    process.env.LTA_ACCOUNT_KEY ||
    process.env.LTA_DATAMALL_ACCOUNT_KEY ||
    ''
  ).trim();

  if (!accountKey) {
    return res.status(200).json({
      BusStopCode: busStopCode,
      isLive: false,
      requiresAccountKey: true,
      message: 'LTA_ACCOUNT_KEY environment variable is not configured on Vercel.',
      Services: [],
    });
  }

  try {
    let ltaUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
    if (serviceNo) {
      ltaUrl += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
    }

    const r = await fetch(ltaUrl, {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!r.ok) {
      const errText = await r.text();
      return res.status(r.status).json({
        error: `LTA DataMall error ${r.status}: ${errText || r.statusText}`,
        isLive: false,
        BusStopCode: busStopCode,
        Services: [],
      });
    }

    const data = await r.json();

    if (isRaw) {
      return res.status(r.status).json(data);
    }

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
        nextMins: mins2 >= 0 ? mins2 : mins1 >= 0 ? mins1 + 10 : 12,
        thirdMins: mins3 >= 0 ? mins3 : undefined,
        occupancy: loadInfo.occupancy,
        occupancyPercent: loadInfo.percent,
        isWheelchairAccessible: nextBus.Feature === 'WAB',
        busType: mapType(nextBus.Type),
        destinationCode: nextBus.DestinationCode,
        originCode: nextBus.OriginCode,
      };
    });

    return res.status(200).json({
      BusStopCode: data.BusStopCode || busStopCode,
      isLive: true,
      timestamp: new Date().toISOString(),
      Services: transformedServices,
      raw: data,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || 'Failed to fetch bus arrivals from LTA DataMall',
      isLive: false,
      BusStopCode: busStopCode,
      Services: [],
    });
  }
}
