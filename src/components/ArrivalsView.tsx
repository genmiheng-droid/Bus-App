import React, { useEffect, useState, useCallback, useRef } from 'react';
import { BusArrival, BusStop } from '../types';

interface ArrivalsViewProps {
  stops: BusStop[];
  selectedStopId: string;
  onSelectStop: (stopId: string) => void;
  onToggleFavorite: (stopId: string) => void;
  onSelectBusRoute?: (serviceNo: string, stopId: string) => void;
  onOpenMapToStop?: (stopId: string) => void;
}

export const ArrivalsView: React.FC<ArrivalsViewProps> = ({
  stops,
  selectedStopId,
  onSelectStop,
  onToggleFavorite,
  onSelectBusRoute,
  onOpenMapToStop,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now');
  const [showStopPicker, setShowStopPicker] = useState(false);
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<BusArrival | null>(null);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [apiCountdown, setApiCountdown] = useState(20);
  const [liveServices, setLiveServices] = useState<BusArrival[] | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  // Filter nearby stops within 300 metres sorted by closest distance
  const nearbyStopsWithin300m = stops
    .filter((s) => (s.distanceMeters ?? 9999) <= 300)
    .sort((a, b) => (a.distanceMeters ?? 9999) - (b.distanceMeters ?? 9999));

  const currentStop =
    stops.find((s) => s.id === selectedStopId) ||
    nearbyStopsWithin300m[0] ||
    stops[0];

  const fetchArrivalsFromLTA = useCallback(
    async (stopId: string, showSpinner = true) => {
      if (showSpinner) setIsRefreshing(true);
      try {
        const res = await fetch(`/api/lta/bus-arrival?BusStopCode=${encodeURIComponent(stopId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.isLive && Array.isArray(data.Services) && data.Services.length > 0) {
            setLiveServices(data.Services);
            setIsLiveApi(true);
          } else {
            // Keep current services or fallback
            setLiveServices(null);
            setIsLiveApi(false);
          }
        }
      } catch (err) {
        console.warn('Could not query LTA DataMall proxy:', err);
      } finally {
        setIsRefreshing(false);
        const now = new Date();
        setLastRefreshedTime(
          now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        );
        setApiCountdown(20);
      }
    },
    []
  );

  // 20-second auto-refresh lifecycle
  useEffect(() => {
    fetchArrivalsFromLTA(currentStop.id, true);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = window.setInterval(() => {
      setApiCountdown((prev) => {
        if (prev <= 1) {
          fetchArrivalsFromLTA(currentStop.id, false);
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [currentStop.id, fetchArrivalsFromLTA]);

  const displayedServices = liveServices && liveServices.length > 0 ? liveServices : currentStop.services;

  const handleRefresh = () => {
    setApiCountdown(20);
    fetchArrivalsFromLTA(currentStop.id, true);
  };

  // Helper for color coding minutes
  const getMinsColor = (mins: number) => {
    if (mins <= 5) return 'text-emerald-600'; // Green for < 5 mins
    if (mins <= 10) return 'text-amber-500'; // Amber for 5-10 mins
    return 'text-slate-400'; // Grey for > 10 mins
  };

  // Occupancy visual helper
  const getOccupancyBar = (occupancy: string) => {
    if (occupancy === 'seats') {
      return {
        bg: 'bg-indigo-500',
        label: 'Seats Available',
        personCount: 1,
        colorClass: 'text-indigo-600',
        badgeBg: 'bg-indigo-50 text-indigo-700',
      };
    }
    if (occupancy === 'standing') {
      return {
        bg: 'bg-amber-500',
        label: 'Standing Available',
        personCount: 2,
        colorClass: 'text-amber-600',
        badgeBg: 'bg-amber-50 text-amber-700',
      };
    }
    return {
      bg: 'bg-rose-500',
      label: 'Limited Standing',
      personCount: 3,
      colorClass: 'text-rose-600',
      badgeBg: 'bg-rose-50 text-rose-700',
    };
  };

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 pb-28 md:pb-12 space-y-6">
      {/* Top Metric Overview Bar (Sleek 3-Card Grid) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 hover:border-slate-300 transition-all">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Active Routes
          </p>
          <h3 className="text-2xl font-bold text-slate-900">{displayedServices.length} Services</h3>
          <div className="mt-2 flex items-center text-emerald-600 text-xs font-bold">
            <span className="material-symbols-outlined text-[16px] mr-1">check_circle</span>
            {isLiveApi ? 'LTA DataMall v3 Stream' : '100% On-Time Dispatch'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 hover:border-slate-300 transition-all">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Earliest Arrival
          </p>
          <h3 className="text-2xl font-bold text-slate-900">
            {displayedServices.length === 0
              ? 'No Services'
              : Math.min(...displayedServices.map((s) => s.mins)) === 0
              ? 'Arriving Now'
              : `${Math.min(...displayedServices.map((s) => s.mins))} min`}
          </h3>
          <div className="mt-2 flex items-center text-indigo-600 text-xs font-bold">
            <span className="material-symbols-outlined text-[16px] mr-1">speed</span>
            Telemetry Synced (20s)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 hover:border-slate-300 transition-all">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Network Integrity
          </p>
          <h3 className="text-2xl font-bold text-slate-900">99.4%</h3>
          <div className="mt-2 flex items-center text-slate-500 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
            {isLiveApi ? 'DataMall Live Connected' : 'Normal Operations'}
          </div>
        </div>
      </section>

      {/* Stop Selector & Actions Banner */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowStopPicker(!showStopPicker)}
                className="group text-left flex items-center gap-2 focus:outline-none"
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {currentStop.name}
                </h1>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-indigo-600 text-[22px] transition-transform">
                  {showStopPicker ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              <button
                onClick={() => onToggleFavorite(currentStop.id)}
                title={currentStop.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{
                    fontVariationSettings: currentStop.isFavorite ? "'FILL' 1" : "'FILL' 0",
                    color: currentStop.isFavorite ? '#f43f5e' : undefined,
                  }}
                >
                  {currentStop.isFavorite ? 'favorite' : 'favorite_border'}
                </span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 mt-1.5">
              <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">near_me</span>
                {currentStop.distanceMeters !== undefined ? `${currentStop.distanceMeters}m away` : 'Nearby'}
              </span>
              <span>•</span>
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">
                {currentStop.id}
              </span>
              <span>•</span>
              <span>{currentStop.road}</span>
            </div>

            {/* Quick Stop Switcher Dropdown (Restricted to Stops within 300m) */}
            {showStopPicker && (
              <div className="absolute top-full left-0 mt-2 z-30 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-100 mb-1">
                  <div>
                    <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                      Nearest Bus Stops
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      Filtered to stops within 300 metres
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                    ≤ 300m
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1 py-1">
                  {nearbyStopsWithin300m.map((stop) => (
                    <button
                      key={stop.id}
                      onClick={() => {
                        onSelectStop(stop.id);
                        setShowStopPicker(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center justify-between cursor-pointer ${
                        stop.id === currentStop.id
                          ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-100'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm truncate">{stop.name}</span>
                          {stop.distanceMeters !== undefined && (
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded shrink-0">
                              {stop.distanceMeters}m
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                          ID: {stop.id} • {stop.road} • {stop.services.length} services
                        </div>
                      </div>
                      {stop.id === currentStop.id && (
                        <span className="material-symbols-outlined text-indigo-600 text-[18px] shrink-0">
                          check
                        </span>
                      )}
                    </button>
                  ))}

                  {nearbyStopsWithin300m.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No bus stops found within 300 metres.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Refresh, Live Badge & View on Map */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live 20-Second Refresh Badge */}
            <div className="flex items-center gap-1.5 bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1.5 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>LIVE</span>
              <span className="text-[11px] text-rose-400 font-medium ml-0.5">({apiCountdown}s)</span>
            </div>

            {onOpenMapToStop && (
              <button
                onClick={() => onOpenMapToStop(currentStop.id)}
                title="View on Map"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-xs font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">map</span>
                <span className="hidden sm:inline">Radar</span>
              </button>
            )}

            <button
              id="refreshBtn"
              onClick={handleRefresh}
              title="Refresh Arrival Timings (v3)"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95 transition-all text-xs font-bold cursor-pointer"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              >
                refresh
              </span>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bus Services Arrival List Table / Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Live Arrival Countdowns</h2>
            <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
              LTA v3
            </span>
          </div>
          <span className="text-xs font-medium text-slate-400">Updated {lastRefreshedTime}</span>
        </div>

        <div className="space-y-3">
          {displayedServices.map((bus) => {
            const occInfo = getOccupancyBar(bus.occupancy);

            return (
              <div
                key={bus.serviceNo}
                id={`bus-card-${bus.serviceNo}`}
                onClick={() => {
                  setSelectedServiceDetail(bus);
                  if (onSelectBusRoute) {
                    onSelectBusRoute(bus.serviceNo, currentStop.id);
                  }
                }}
                className="bg-white border border-slate-200/70 rounded-2xl p-4 sm:p-5 flex items-center shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer relative group"
              >
                {/* Bus Service Number */}
                <div className="w-20 sm:w-28 shrink-0 border-r border-slate-100 pr-3 sm:pr-4 text-center">
                  <span
                    className={`font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight ${
                      bus.serviceNo.length > 2
                        ? 'text-3xl sm:text-4xl leading-tight'
                        : 'text-4xl sm:text-5xl leading-none'
                    }`}
                  >
                    {bus.serviceNo}
                  </span>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    {bus.busType || 'Double Deck'}
                  </span>
                </div>

                {/* Service Details & Timings */}
                <div className="flex-1 pl-3 sm:pl-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="pr-2">
                      <span className="text-base sm:text-lg text-slate-900 font-bold block leading-tight truncate">
                        {bus.destination}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-semibold text-slate-400">
                          {bus.isWheelchairAccessible ? 'Wheelchair Accessible' : 'Standard'}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${occInfo.badgeBg}`}>
                          {occInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Arrival timing in minutes */}
                    <div className={`flex items-baseline shrink-0 ${getMinsColor(bus.mins)}`}>
                      <span className="text-2xl sm:text-3xl font-extrabold leading-none">
                        {bus.mins === 0 ? 'Arr' : bus.mins}
                      </span>
                      <span className="text-xs sm:text-sm font-bold ml-1">
                        {bus.mins === 0 ? '' : 'min'}
                      </span>
                    </div>
                  </div>

                  {/* Occupancy Progress Bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full ${occInfo.bg} rounded-full transition-all duration-500`}
                      style={{ width: `${bus.occupancyPercent}%` }}
                    />
                  </div>

                  {/* Footer metadata: Passengers glyphs & Next arrival */}
                  <div className="flex justify-between items-center mt-2 text-xs font-semibold text-slate-400">
                    <div className={`flex items-center gap-0.5 ${occInfo.colorClass}`}>
                      {Array.from({ length: occInfo.personCount }).map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          person
                        </span>
                      ))}
                      <span className="text-[11px] font-medium text-slate-500 ml-1 hidden sm:inline">
                        Load: {bus.occupancyPercent}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-600 font-bold">
                      <span className="text-[11px] text-slate-400 font-medium">Next Bus:</span>
                      <span className="text-slate-800">{bus.nextMins} min</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sleek Tips Banner */}
      <section className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/60 flex items-center justify-between text-xs text-slate-600 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">sensors</span>
          </div>
          <div>
            <p className="font-bold text-slate-900">SBS Telemetry Feed</p>
            <p className="text-slate-400">Live GPS tracking synced with LTA DataMall 2.0 gateway.</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="text-indigo-600 font-bold hover:text-indigo-800 ml-4 whitespace-nowrap cursor-pointer"
        >
          Check Now
        </button>
      </section>

      {/* Bus Route Modal / Bottom Sheet */}
      {selectedServiceDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-2xl p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-indigo-600/20">
                  {selectedServiceDetail.serviceNo}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Bus {selectedServiceDetail.serviceNo} to {selectedServiceDetail.destination}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Next arrivals: {selectedServiceDetail.mins}m, {selectedServiceDetail.nextMins}m
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedServiceDetail(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                <div className="text-xs font-semibold text-slate-600">
                  Current Capacity Status
                </div>
                <div className="text-xs font-bold text-indigo-700">
                  {getOccupancyBar(selectedServiceDetail.occupancy).label}
                </div>
              </div>

              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider pt-2">
                Route Trajectory
              </div>
              <div className="space-y-3 border-l-2 border-indigo-500 ml-2 pl-4 py-1">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-100" />
                  <p className="text-xs font-bold text-indigo-600">
                    {currentStop.name} (Stop {currentStop.id})
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    Arriving in {selectedServiceDetail.mins} min
                  </p>
                </div>
                <div className="relative pt-1">
                  <div className="absolute -left-[21px] top-2.5 w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <p className="text-xs font-medium text-slate-800">Orchard Stn / Tang Plaza</p>
                  <p className="text-[11px] text-slate-400">+3 min</p>
                </div>
                <div className="relative pt-1">
                  <div className="absolute -left-[21px] top-2.5 w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <p className="text-xs font-medium text-slate-800">Dhoby Ghaut Stn</p>
                  <p className="text-[11px] text-slate-400">+8 min</p>
                </div>
                <div className="relative pt-1">
                  <div className="absolute -left-[21px] top-2.5 w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <p className="text-xs font-bold text-slate-900">
                    {selectedServiceDetail.destination} (Terminus)
                  </p>
                  <p className="text-[11px] text-slate-400">+28 min</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedServiceDetail(null)}
                className="w-full py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Route
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
