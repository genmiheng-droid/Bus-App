import { BusStop } from '../types';

/**
 * Calculates great-circle distance between two points in meters using the Haversine formula
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Format distance in meters to a clean string
 */
export function formatDistance(meters?: number): string {
  if (meters === undefined || meters === null || isNaN(meters)) return '--';
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Sorts bus stops by calculated distance from user coordinates
 */
export function sortStopsByDistance(
  userLat: number,
  userLng: number,
  stops: BusStop[]
): BusStop[] {
  return stops
    .map((stop) => {
      const distance = calculateDistanceMeters(
        userLat,
        userLng,
        stop.lat,
        stop.lng
      );
      return {
        ...stop,
        distanceMeters: distance,
      };
    })
    .sort((a, b) => (a.distanceMeters ?? 999999) - (b.distanceMeters ?? 999999));
}

/**
 * Default fallback coordinates: Singapore Orchard / Somerset Central Coordinates
 */
export const DEFAULT_SINGAPORE_COORDS = {
  lat: 1.3004,
  lng: 103.8385,
};
