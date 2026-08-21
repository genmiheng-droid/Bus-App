export type TabType = 'arrivals' | 'plan' | 'map' | 'alerts' | 'services';

export type OccupancyLevel = 'seats' | 'standing' | 'limited';

export interface BusArrival {
  serviceNo: string;
  destination: string;
  mins: number;
  nextMins: number;
  thirdMins?: number;
  secondsRemaining?: number; // precise countdown in seconds
  targetArrivalEpoch?: number; // epoch ms for accurate countdown
  occupancy: OccupancyLevel;
  occupancyPercent: number;
  isWheelchairAccessible?: boolean;
  busType?: 'Single' | 'Double Deck' | 'Bendy';
  operator?: string;
}

export interface BusStop {
  id: string; // 5-digit bus stop code, e.g. '09038', '83139'
  name: string;
  road: string;
  distanceMeters?: number;
  isFavorite?: boolean;
  coords: { x: number; y: number }; // percentage on interactive diagram
  lat: number; // real latitude in Singapore (e.g. 1.300)
  lng: number; // real longitude in Singapore (e.g. 103.838)
  services: BusArrival[];
}

export type SBSRouteType =
  | 'Trunk'
  | 'Feeder'
  | 'Townlink'
  | 'Express'
  | 'Fast Forward'
  | 'Nite Owl'
  | 'Premium'
  | 'Cross Border'
  | 'Changi Airport';

export interface SBSServiceInfo {
  serviceNo: string;
  routeType: SBSRouteType;
  origin: string;
  destination: string;
  isLoop?: boolean;
  loopPoint?: string;
  operatingHours: {
    weekdays: string;
    saturdays: string;
    sundays: string;
  };
  headway: {
    peak: string; // e.g. "4 - 8 mins"
    offPeak: string; // e.g. "9 - 14 mins"
  };
  interchange: string;
  keyStops: string[];
  stopsCount: number;
  operator: 'SBS Transit';
  description?: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  isGpsActive: boolean;
  isLoading: boolean;
  errorMessage?: string | null;
  detectedAddress?: string;
}

export interface RouteSegment {
  type: 'walk' | 'bus' | 'train';
  label?: string;
  durationMin: number;
  widthPercent: number;
  color?: string;
}

export interface SuggestedRoute {
  id: string;
  durationMin: number;
  leaveBy: string;
  cost: string;
  isFastest?: boolean;
  tag?: string;
  from: string;
  to: string;
  segments: RouteSegment[];
  steps?: {
    instruction: string;
    detail: string;
    icon: string;
    mode: 'walk' | 'bus' | 'train';
  }[];
}

export interface ServiceAlert {
  id: string;
  category: 'bus' | 'mrt' | 'general';
  type: 'DELAYED' | 'MAINTENANCE' | 'DIVERSION' | 'NORMAL';
  badgeText: string;
  serviceNo?: string;
  title: string;
  summary: string;
  fullDetails: string;
  timestamp: string;
  accentColor: string; // e.g. '#bb0013', '#003372', '#f59e0b'
}

