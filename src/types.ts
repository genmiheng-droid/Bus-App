export type TabType = 'arrivals' | 'plan' | 'map' | 'alerts';

export type OccupancyLevel = 'seats' | 'standing' | 'limited';

export interface BusArrival {
  serviceNo: string;
  destination: string;
  mins: number;
  nextMins: number;
  occupancy: OccupancyLevel;
  occupancyPercent: number;
  isWheelchairAccessible?: boolean;
  busType?: 'Single' | 'Double Deck' | 'Bendy';
}

export interface BusStop {
  id: string;
  name: string;
  road: string;
  distanceMeters?: number;
  isFavorite?: boolean;
  coords: { x: number; y: number }; // percentage on map
  services: BusArrival[];
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
