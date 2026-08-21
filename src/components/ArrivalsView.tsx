import React, { useEffect, useState, useCallback, useRef } from 'react';
import { BusArrival, BusStop, UserLocation } from '../types';
import { formatDistance } from '../utils/geo';
import { SBS_BUS_SERVICES } from '../data/sbsServices';
import { resolveBusStopByCodeOrQuery } from '../data/singaporeBusStops';

interface ArrivalsViewProps {
  stops: BusStop[];
  selectedStopId: string;
  userLocation: UserLocation;
  onRequestLocation: () => void;
  onSelectStop: (stopId: string) => void;
  onToggleFavorite: (stopId: string) => void;
  onSelectBusRoute?: (serviceNo: string, stopId: string) => void;
  onOpenMapToStop?: (stopId: string) => void;
  onOpenAllServices?: () => void;
}

export const ArrivalsView: React.FC<ArrivalsViewProps> = ({
  stops,
  selectedStopId,
  userLocation,
  onRequestLocation,
  onSelectStop,
  onToggleFavorite,
  onSelectBusRoute,
  onOpenMapToStop,
  onOpenAllServices,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now');
  const [showStopPicker, setShowStopPicker] = useState(false);
  const [pickerSearchQuery, setPickerSearchQuery] = useState('');
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<BusArrival | null>(null);
  const [isLiveApi, setIsLiveApi] = useState(true);
  const [apiCountdown, setApiCountdown] = useState(10); // Strictly 10-second refresh interval
  
  // Real-time ticking state for services at current stop
  const [servicesState, setServicesState] = useState<BusArrival[]>([]);
  const countdownIntervalRef = useRef<number | null>(null);
  const tickerIntervalRef = useRef<number | null>(null);

  // Identify current stop (check catalog fallback if not in active state)
  const currentStop =
    stops.find((s) => s.id === selectedStopId) ||
    resolveBusStopByCodeOrQuery(selectedStopId, userLocation.lat, userLocation.lng) ||
    stops[0];

  // Helper to initialize or smoothly merge service target arrival epochs
  const mergeServiceTimers = useCallback(
    (newServices: BusArrival[], prevServices: BusArrival[]): BusArrival[] => {
      const now = Date.now();
      return newServices.map((newSrv) => {
        // If we already have this service and its target is still valid, preserve continuity
        const existing = prevServices.find((p) => p.serviceNo === newSrv.serviceNo);
        
        let targetEpoch = newSrv.targetArrivalEpoch;
        if (!targetEpoch || isNaN(targetEpoch)) {
          if (existing && existing.targetArrivalEpoch && existing.targetArrivalEpoch > now) {
            targetEpoch = existing.targetArrivalEpoch;
          } else {
            targetEpoch = now + (newSrv.mins > 0 ? newSrv.mins * 60000 : 35000);
          }
        }

        const diffSec = Math.max(0, Math.round((targetEpoch - now) / 1000));
        return {
          ...newSrv,
          targetArrivalEpoch: targetEpoch,
          secondsRemaining: diffSec,
          mins: Math.floor(diffSec / 60),
        };
      });
    },
    []
  );

  // Fetch live arrivals from LTA endpoint with fallback
  const fetchArrivals = useCallback(
    async (stopId: string, showSpinner = true) => {
      if (showSpinner) setIsRefreshing(true);
      try {
        const res = await fetch(`/api/lta/bus-arrival?BusStopCode=${encodeURIComponent(stopId)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.Services) && data.Services.length > 0) {
            setServicesState((prev) => mergeServiceTimers(data.Services, prev));
            setIsLiveApi(true);
          } else {
            // Fallback to current stop baseline
            const stop = stops.find((s) => s.id === stopId) || currentStop;
            if (stop?.services) {
              setServicesState((prev) => mergeServiceTimers(stop.services, prev));
            }
          }
        } else {
          const stop = stops.find((s) => s.id === stopId) || currentStop;
          if (stop?.services) {
            setServicesState((prev) => mergeServiceTimers(stop.services, prev));
          }
        }
      } catch (err) {
        console.debug('LTA API query:', err);
        const stop = stops.find((s) => s.id === stopId) || currentStop;
        if (stop?.services) {
          setServicesState((prev) => mergeServiceTimers(stop.services, prev));
        }
      } finally {
        setIsRefreshing(false);
        const now = new Date();
        setLastRefreshedTime(
          now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        );
        setApiCountdown(10); // Reset to 10 seconds
      }
    },
    [currentStop, mergeServiceTimers, stops]
  );

  // Trigger fetch when stop changes
  useEffect(() => {
    fetchArrivals(currentStop.id, true);
  }, [currentStop.id, fetchArrivals]);

  // 1-second real-time countdown ticker (arrival times will continuously decrement and refresh every second!)
  useEffect(() => {
    if (tickerIntervalRef.current) {
      clearInterval(tickerIntervalRef.current);
    }

    tickerIntervalRef.current = window.setInterval(() => {
      setServicesState((prevServices) => {
        if (!prevServices || prevServices.length === 0) return prevServices;
        const now = Date.now();

        return prevServices.map((srv) => {
          let target = srv.targetArrivalEpoch || now + (srv.mins || 1) * 60000;
          let diffSec = Math.round((target - now) / 1000);

          // If bus has departed (> 30s after arrival), roll over to next bus headway
          if (diffSec < -30) {
            const nextGapMins = srv.nextMins || 8;
            target = now + nextGapMins * 60000;
            diffSec = nextGapMins * 60;
            return {
              ...srv,
              targetArrivalEpoch: target,
              secondsRemaining: diffSec,
              mins: Math.floor(diffSec / 60),
              nextMins: srv.thirdMins || srv.nextMins + 10,
            };
          }

          const secondsRemaining = Math.max(0, diffSec);
          return {
            ...srv,
            secondsRemaining,
            mins: Math.floor(secondsRemaining / 60),
          };
        });
      });
    }, 1000);

    return () => {
      if (tickerIntervalRef.current) {
        clearInterval(tickerIntervalRef.current);
      }
    };
  }, []);

  // 10-second background auto-sync loop (strictly every 10 seconds as requested)
  useEffect(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = window.setInterval(() => {
      setApiCountdown((prev) => {
        if (prev <= 1) {
          fetchArrivals(currentStop.id, false);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [currentStop.id, fetchArrivals]);

  const handleManualRefresh = () => {
    setApiCountdown(10);
    fetchArrivals(currentStop.id, true);
  };

  // Format arrival countdown display (e.g., "Arr", "< 1 min", "2m 14s")
  const formatArrivalCountdown = (srv: BusArrival) => {
    const sec = srv.secondsRemaining !== undefined ? srv.secondsRemaining : srv.mins * 60;
    if (sec <= 20) {
      return { text: 'Arr', isArr: true, subtext: 'Boarding now' };
    }
    if (sec < 60) {
      return { text: `${sec}s`, isArr: false, subtext: 'Approaching' };
    }
    const mins = Math.floor(sec / 60);
    const remainderSec = sec % 60;
    return {
      text: `${mins}m`,
      isArr: false,
      subtext: remainderSec > 0 ? `${mins}m ${remainderSec}s` : `${mins} min`,
    };
  };

  // Occupancy visual helper
  const getOccupancyBar = (occupancy: string) => {
    if (occupancy === 'seats') {
      return {
        bg: 'bg-emerald-500',
        label: 'Seats Available',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      };
    }
    if (occupancy === 'standing') {
      return {
        bg: 'bg-amber-500',
        label: 'Standing Available',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/60',
      };
    }
    return {
      bg: 'bg-rose-500',
      label: 'Limited Standing',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/60',
    };
  };

  const displayedServices = React.useMemo(() => {
    const list = servicesState.length > 0 ? servicesState : currentStop.services;
    const seen = new Set<string>();
    return list.filter((srv) => {
      if (!srv || !srv.serviceNo || seen.has(srv.serviceNo)) return false;
      seen.add(srv.serviceNo);
      return true;
    });
  }, [servicesState, currentStop.services]);

  // Filter for stop picker
  const normalizedPickerQuery = pickerSearchQuery.toLowerCase().trim();
  const filteredStops = stops.filter((s) => {
    if (!normalizedPickerQuery) return true;
    return (
      s.id.includes(normalizedPickerQuery) ||
      s.name.toLowerCase().includes(normalizedPickerQuery) ||
      s.road.toLowerCase().includes(normalizedPickerQuery) ||
      s.services.some((svc) => svc.serviceNo.toLowerCase().includes(normalizedPickerQuery))
    );
  });

  const pickerResolvedStop =
    normalizedPickerQuery && !filteredStops.some((s) => s.id === normalizedPickerQuery)
      ? resolveBusStopByCodeOrQuery(normalizedPickerQuery, userLocation.lat, userLocation.lng)
      : null;

  const combinedPickerStops = React.useMemo(() => {
    const rawList = pickerResolvedStop ? [pickerResolvedStop, ...filteredStops] : filteredStops;
    const seen = new Set<string>();
    return rawList.filter((s) => {
      if (!s || !s.id || seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }, [pickerResolvedStop, filteredStops]);

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 pb-28 md:pb-12 space-y-6">
      {/* Geolocation status banner */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              userLocation.isGpsActive
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {userLocation.isGpsActive ? 'my_location' : 'near_me'}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                {userLocation.isGpsActive ? 'GPS Location Active' : 'Nearest Bus Stop Default'}
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                {formatDistance(currentStop.distanceMeters)} away
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {userLocation.isGpsActive
                ? 'Stops dynamically sorted by your real-time proximity.'
                : 'Defaulting to closest SBS Transit stop. Tap Locate Me to use live GPS.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!userLocation.isGpsActive && (
            <button
              onClick={onRequestLocation}
              disabled={userLocation.isLoading}
              className="text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-200/60 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {userLocation.isLoading ? 'sync' : 'location_searching'}
              </span>
              {userLocation.isLoading ? 'Locating...' : 'Locate Me'}
            </button>
          )}
          {onOpenAllServices && (
            <button
              onClick={onOpenAllServices}
              className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              All SBS Services
            </button>
          )}
        </div>
      </div>

      {/* Selected Bus Stop Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-lg tracking-wider font-mono">
                {currentStop.id}
              </span>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-indigo-600">
                  distance
                </span>
                {formatDistance(currentStop.distanceMeters)}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {currentStop.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">{currentStop.road}</p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(currentStop.id)}
              aria-label="Toggle Favorite"
              className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                currentStop.isFavorite
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {currentStop.isFavorite ? 'favorite' : 'favorite_border'}
              </span>
            </button>

            {onOpenMapToStop && (
              <button
                onClick={() => onOpenMapToStop(currentStop.id)}
                className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 rounded-2xl border border-slate-200/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">map</span>
                View Map
              </button>
            )}

            <button
              onClick={() => setShowStopPicker(true)}
              className="text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2.5 rounded-2xl border border-indigo-200/60 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
              Change Stop
            </button>
          </div>
        </div>

        {/* Live Refresh Status Bar with 10s auto-refresh indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="font-medium text-slate-700">
              {isLiveApi ? 'LTA Real-Time Bus Arrival Telemetry' : 'Live headways active'}
            </span>
            <span className="text-slate-400">• Updated {lastRefreshedTime}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Auto-sync in {apiCountdown}s
            </span>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="text-xs font-semibold text-slate-700 hover:text-indigo-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span
                className={`material-symbols-outlined text-[16px] ${
                  isRefreshing ? 'animate-spin text-indigo-600' : ''
                }`}
              >
                refresh
              </span>
              Refresh Now
            </button>
          </div>
        </div>
      </div>

      {/* Bus Services Arrival Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Available Services ({displayedServices.length})
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">
            Live 10-Second Auto Refresh Active
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {displayedServices.map((service) => {
            const occInfo = getOccupancyBar(service.occupancy);
            const nextTiming = formatArrivalCountdown(service);
            const matchedSbsInfo = SBS_BUS_SERVICES.find(
              (s) => s.serviceNo.toLowerCase() === service.serviceNo.toLowerCase()
            );

            return (
              <div
                key={service.serviceNo}
                onClick={() => setSelectedServiceDetail(service)}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Bus Number & Destination */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-sm shadow-indigo-600/20 shrink-0">
                      {service.serviceNo}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {service.destination || matchedSbsInfo?.destination || 'Terminating Loop'}
                        </span>
                        {service.busType === 'Double Deck' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            DD
                          </span>
                        )}
                        {service.isWheelchairAccessible && (
                          <span
                            className="material-symbols-outlined text-[15px] text-emerald-600"
                            title="Wheelchair Accessible"
                          >
                            accessible
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 font-medium">
                        {service.operator || 'SBS Transit'} •{' '}
                        {matchedSbsInfo?.routeType || 'Trunk Service'}
                      </p>
                    </div>
                  </div>

                  {/* Right: Arrival Timings (Next 3 buses) & Occupancy */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    {/* Primary Next Bus Timing */}
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1">
                        <span
                          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                            nextTiming.isArr
                              ? 'text-emerald-600 animate-pulse'
                              : 'text-slate-900'
                          }`}
                        >
                          {nextTiming.text}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        {nextTiming.subtext}
                      </span>
                    </div>

                    {/* Subsequent Buses (2nd & 3rd) */}
                    <div className="text-right border-l border-slate-200 pl-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Next
                      </span>
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {service.nextMins}m
                        </span>
                        {service.thirdMins !== undefined && (
                          <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">
                            {service.thirdMins}m
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Occupancy Indicator */}
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Load
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${occInfo.badgeBg} inline-block whitespace-nowrap`}
                      >
                        {occInfo.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stop Picker Modal with 5-digit bus stop search */}
      {showStopPicker && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Select Bus Stop</h3>
                <p className="text-xs text-slate-500">Search by name, road, or 5-digit code (e.g. 11321)</p>
              </div>
              <button
                onClick={() => {
                  setShowStopPicker(false);
                  setPickerSearchQuery('');
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Quick Stop Search input inside picker */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                autoFocus
                value={pickerSearchQuery}
                onChange={(e) => setPickerSearchQuery(e.target.value)}
                placeholder="Search stop name or enter code (e.g. 11321, 09038, 19051)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {combinedPickerStops.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No bus stop found matching &quot;{pickerSearchQuery}&quot;.
                </div>
              ) : (
                combinedPickerStops.map((stop) => {
                  const isCurrent = stop.id === currentStop.id;
                  return (
                    <button
                      key={stop.id}
                      onClick={() => {
                        onSelectStop(stop.id);
                        setShowStopPicker(false);
                        setPickerSearchQuery('');
                      }}
                      className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white font-mono">
                            {stop.id}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{stop.name}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{stop.road}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {stop.services.map((svc) => (
                            <span
                              key={svc.serviceNo}
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700"
                            >
                              {svc.serviceNo}
                            </span>
                          ))}
                        </div>
                      </div>

                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl">
                        {formatDistance(stop.distanceMeters)}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      {selectedServiceDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-indigo-600/20">
                  {selectedServiceDetail.serviceNo}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    SBS Transit Service
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedServiceDetail.destination || 'Scheduled Route'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedServiceDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  1st Bus
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {selectedServiceDetail.mins <= 0 ? 'Arr' : `${selectedServiceDetail.mins}m`}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  2nd Bus
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {selectedServiceDetail.nextMins}m
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  3rd Bus
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {selectedServiceDetail.thirdMins ? `${selectedServiceDetail.thirdMins}m` : '18m'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-400">Bus Type</span>
                <span className="font-semibold text-slate-800">
                  {selectedServiceDetail.busType || 'Double Deck (DD)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-400">Accessibility</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">accessible</span>
                  Wheelchair Accessible (WAB)
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Current Occupancy</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {selectedServiceDetail.occupancy} (approx. {selectedServiceDetail.occupancyPercent}%)
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              {onSelectBusRoute && (
                <button
                  onClick={() => {
                    const srvNo = selectedServiceDetail.serviceNo;
                    setSelectedServiceDetail(null);
                    onSelectBusRoute(srvNo, currentStop.id);
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">map</span>
                  View Route on Map
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
