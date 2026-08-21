import { useState, useEffect, useCallback, useRef } from 'react';
import { BusStop, UserLocation } from '../types';
import { calculateDistanceMeters, DEFAULT_SINGAPORE_COORDS, sortStopsByDistance } from '../utils/geo';

export function useUserLocation(
  initialStops: BusStop[],
  onAutoSelectNearestStop?: (stopId: string) => void
) {
  const [stops, setStops] = useState<BusStop[]>(() =>
    sortStopsByDistance(DEFAULT_SINGAPORE_COORDS.lat, DEFAULT_SINGAPORE_COORDS.lng, initialStops)
  );

  const [location, setLocation] = useState<UserLocation>({
    lat: DEFAULT_SINGAPORE_COORDS.lat,
    lng: DEFAULT_SINGAPORE_COORDS.lng,
    isGpsActive: false,
    isLoading: true,
    errorMessage: null,
  });

  const hasAutoSelectedRef = useRef(false);

  const updateCoordinates = useCallback(
    (lat: number, lng: number, accuracy?: number, isGps = true) => {
      setLocation({
        lat,
        lng,
        accuracy,
        isGpsActive: isGps,
        isLoading: false,
        errorMessage: null,
      });

      setStops((prevStops) => {
        const sorted = sortStopsByDistance(lat, lng, prevStops);
        if (!hasAutoSelectedRef.current && sorted.length > 0 && onAutoSelectNearestStop) {
          hasAutoSelectedRef.current = true;
          onAutoSelectNearestStop(sorted[0].id);
        }
        return sorted;
      });
    },
    [onAutoSelectNearestStop]
  );

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        isLoading: false,
        isGpsActive: false,
        errorMessage: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    setLocation((prev) => ({ ...prev, isLoading: true, errorMessage: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateCoordinates(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy, true);
      },
      (err) => {
        console.warn('Geolocation prompt deferred or denied:', err.message);
        // Fallback to Singapore central default
        updateCoordinates(
          DEFAULT_SINGAPORE_COORDS.lat,
          DEFAULT_SINGAPORE_COORDS.lng,
          undefined,
          false
        );
        setLocation((prev) => ({
          ...prev,
          isLoading: false,
          isGpsActive: false,
          errorMessage: 'Location access unavailable. Using Singapore Central default.',
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 15000,
      }
    );
  }, [updateCoordinates]);

  // Request location automatically on mount
  useEffect(() => {
    requestLocation();

    let watchId: number | null = null;
    if (navigator.geolocation) {
      try {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            updateCoordinates(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy, true);
          },
          (err) => {
            console.debug('Watch position error:', err.message);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 30000 }
        );
      } catch (e) {
        console.debug('Failed to watch position', e);
      }
    }

    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [requestLocation, updateCoordinates]);

  return {
    stops,
    setStops,
    location,
    requestLocation,
    updateCoordinates,
  };
}
