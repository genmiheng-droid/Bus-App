import { BusStop, ServiceAlert, SuggestedRoute } from '../types';
import { SINGAPORE_BUS_STOPS_CATALOG } from './singaporeBusStops';

export const SBS_LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB6wZW0mVth6bmeXfZ-3Ob5Jchv2itoq5z7YiWF9FpVZyv4_InMCEbuin2WWUykXEh7UVRgjBx4G29MUjIm_xnq3vn3CWu9VCUYdPJMNAsesEDv19SDRiyxbXEv_Bh-jwZSoydpNuyqvxke14o6wu6lVC9t9BPY27G42-M3RIFT8NuxgUPKF-gJgtzmPR8BYIo7qoaTPZBiYEjwsXwIuRIr5ANvF92Tvl0WdO37U82z5A9FKhQaMT3S';

export const INITIAL_BUS_STOPS: BusStop[] = SINGAPORE_BUS_STOPS_CATALOG;

export const INITIAL_SUGGESTED_ROUTES: SuggestedRoute[] = [
  {
    id: 'route-1',
    durationMin: 32,
    leaveBy: '10:15 AM',
    cost: '~$1.85',
    isFastest: true,
    tag: 'FASTEST',
    from: 'Current Location',
    to: 'Changi Airport',
    segments: [
      { type: 'walk', durationMin: 4, widthPercent: 15 },
      { type: 'bus', label: '174', durationMin: 22, widthPercent: 60, color: '#560d78' },
      { type: 'walk', durationMin: 6, widthPercent: 25 },
    ],
    steps: [
      {
        instruction: 'Walk 180m to Opp Somerset Stn (09038)',
        detail: 'Estimated 4 mins',
        icon: 'directions_walk',
        mode: 'walk',
      },
      {
        instruction: 'Board Bus 174 towards New Bridge Rd Ter',
        detail: '14 stops (approx. 22 mins) • Seats Available',
        icon: 'directions_bus',
        mode: 'bus',
      },
      {
        instruction: 'Alight at Destination & walk 250m',
        detail: 'Estimated 6 mins to terminal entrance',
        icon: 'directions_walk',
        mode: 'walk',
      },
    ],
  },
  {
    id: 'route-2',
    durationMin: 45,
    leaveBy: '10:05 AM',
    cost: '~$2.10',
    isFastest: false,
    tag: 'RECOMMENDED',
    from: 'Current Location',
    to: 'Changi Airport',
    segments: [
      { type: 'walk', durationMin: 3, widthPercent: 10 },
      { type: 'train', label: 'NSL', durationMin: 18, widthPercent: 40, color: '#bb0013' },
      { type: 'bus', label: '65', durationMin: 18, widthPercent: 40, color: '#560d78' },
      { type: 'walk', durationMin: 6, widthPercent: 10 },
    ],
    steps: [
      {
        instruction: 'Walk 120m to Somerset MRT (NS23)',
        detail: 'Estimated 3 mins',
        icon: 'directions_walk',
        mode: 'walk',
      },
      {
        instruction: 'Take North South Line (Red) towards Jurong East',
        detail: '6 stops (approx. 18 mins)',
        icon: 'train',
        mode: 'train',
      },
      {
        instruction: 'Transfer at Dhoby Ghaut to Bus 65',
        detail: '8 stops (approx. 18 mins)',
        icon: 'directions_bus',
        mode: 'bus',
      },
      {
        instruction: 'Walk 150m to destination',
        detail: 'Estimated 3 mins',
        icon: 'directions_walk',
        mode: 'walk',
      },
    ],
  },
  {
    id: 'route-3',
    durationMin: 52,
    leaveBy: '10:00 AM',
    cost: '~$1.95',
    isFastest: false,
    tag: 'FEWEST TRANSFERS',
    from: 'Current Location',
    to: 'Changi Airport',
    segments: [
      { type: 'walk', durationMin: 5, widthPercent: 15 },
      { type: 'bus', label: '36', durationMin: 35, widthPercent: 75, color: '#560d78' },
      { type: 'walk', durationMin: 2, widthPercent: 10 },
    ],
    steps: [
      {
        instruction: 'Walk 220m to Dhoby Ghaut Stn Bus Stop',
        detail: 'Estimated 5 mins',
        icon: 'directions_walk',
        mode: 'walk',
      },
      {
        instruction: 'Board Bus 36 Express towards Airport',
        detail: 'Direct express bus (approx. 30 mins)',
        icon: 'directions_bus',
        mode: 'bus',
      },
      {
        instruction: 'Alight at Airport Passenger Terminal 2',
        detail: 'Direct lobby access',
        icon: 'directions_walk',
        mode: 'walk',
      },
    ],
  },
];

export const INITIAL_ALERTS: ServiceAlert[] = [
  {
    id: 'alert-1',
    category: 'bus',
    type: 'DELAYED',
    badgeText: 'Bus 174 Delayed',
    serviceNo: '174',
    title: 'Traffic Congestion along Bukit Timah Rd',
    summary: 'Heavy vehicle buildup near Sixth Avenue. Expected +8 to 12 mins additional travel time.',
    fullDetails:
      'Due to ongoing subterranean pipe renewal works near Sixth Avenue junction, buses along Service 174 towards New Bridge Road Terminal are experiencing moderate delays. Dispatch operations are adjusting headway spacing.',
    timestamp: '10 mins ago',
    accentColor: '#bb0013',
  },
  {
    id: 'alert-2',
    category: 'bus',
    type: 'DIVERSION',
    badgeText: 'Bus 65 Route Diversion',
    serviceNo: '65',
    title: 'Temporary Road Closure on Bencoolen St',
    summary: 'Skip stops 08057 & 04119 between 23:00 and 05:00 tonight for road resurfacing.',
    fullDetails:
      'LTA road resurfacing notice: Service 65 will be diverted via Bras Basah Road and Victoria Street tonight. Please proceed to Dhoby Ghaut Station or Bugis Station stops during this maintenance window.',
    timestamp: '45 mins ago',
    accentColor: '#f59e0b',
  },
  {
    id: 'alert-3',
    category: 'mrt',
    type: 'NORMAL',
    badgeText: 'Downtown Line (DTL)',
    title: 'Full Fleet Normal Operations',
    summary: 'All trains operating at regular 2 to 3 minute peak headways with zero disruptions reported.',
    fullDetails:
      'Downtown Line telemetry confirms regular signal transmission across all 34 stations from Bukit Panjang to Expo.',
    timestamp: '1 hour ago',
    accentColor: '#003372',
  },
  {
    id: 'alert-4',
    category: 'general',
    type: 'MAINTENANCE',
    badgeText: 'System Notice',
    title: 'LTA DataMall Telemetry Update',
    summary: 'New dynamic headway calculation algorithm v3 enabled across all SBS Transit dispatch centers.',
    fullDetails:
      'Commuters will now enjoy sub-minute precision on next bus arrivals and double-decker passenger capacity tracking.',
    timestamp: '2 hours ago',
    accentColor: '#4f46e5',
  },
];
