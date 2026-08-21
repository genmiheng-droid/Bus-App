import React, { useState } from 'react';
import { BusStop } from '../types';
import { SBS_BUS_SERVICES } from '../data/sbsServices';
import { formatDistance } from '../utils/geo';
import { resolveBusStopByCodeOrQuery } from '../data/singaporeBusStops';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stops: BusStop[];
  onSelectStop: (stopId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stops,
  onSelectStop,
}) => {
  const [query, setQuery] = useState('');

  const normalizedQuery = query.toLowerCase().trim();

  // Filter bus stops
  const matchingStops = React.useMemo(() => {
    return stops.filter((stop) => {
      if (!normalizedQuery) return true;
      const nameMatch = stop.name.toLowerCase().includes(normalizedQuery);
      const idMatch = stop.id.includes(normalizedQuery);
      const roadMatch = stop.road.toLowerCase().includes(normalizedQuery);
      const serviceMatch = stop.services.some((s) =>
        s.serviceNo.toLowerCase().includes(normalizedQuery)
      );
      return nameMatch || idMatch || roadMatch || serviceMatch;
    });
  }, [stops, normalizedQuery]);

  // If query is not empty and no exact match exists, attempt Singapore catalog resolver
  const resolvedStop = React.useMemo(() => {
    return normalizedQuery && !matchingStops.some((s) => s.id === normalizedQuery)
      ? resolveBusStopByCodeOrQuery(normalizedQuery)
      : null;
  }, [normalizedQuery, matchingStops]);

  const combinedMatchingStops = React.useMemo(() => {
    const rawList = resolvedStop ? [resolvedStop, ...matchingStops] : matchingStops;
    const seen = new Set<string>();
    return rawList.filter((s) => {
      if (!s || !s.id || seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }, [resolvedStop, matchingStops]);

  // Filter SBS Services
  const matchingServices = React.useMemo(() => {
    const rawList = SBS_BUS_SERVICES.filter((s) => {
      if (!normalizedQuery) return false;
      return (
        s.serviceNo.toLowerCase().includes(normalizedQuery) ||
        s.origin.toLowerCase().includes(normalizedQuery) ||
        s.destination.toLowerCase().includes(normalizedQuery) ||
        s.keyStops.some((k) => k.toLowerCase().includes(normalizedQuery))
      );
    });
    const seen = new Set<string>();
    return rawList.filter((s) => {
      if (!s || !s.serviceNo || seen.has(s.serviceNo)) return false;
      seen.add(s.serviceNo);
      return true;
    });
  }, [normalizedQuery]);

  if (!isOpen) return null;

  const handleSelectService = (serviceNo: string) => {
    // Find closest stop serving this service or default
    const servingStop = stops.find((st) =>
      st.services.some((svc) => svc.serviceNo.toLowerCase() === serviceNo.toLowerCase())
    );
    if (servingStop) {
      onSelectStop(servingStop.id);
    } else if (stops.length > 0) {
      onSelectStop(stops[0].id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center p-4 pt-16 md:pt-24 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/70">
          <span className="material-symbols-outlined text-indigo-600 text-[22px]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stop name, 5-digit ID (09038), or bus # (15, 65, 174)..."
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 focus:outline-none placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-700"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Quick Service Suggestions */}
        <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Quick Route:
          </span>
          {['7', '14', '15', '24', '36', '65', '87', '143', '174', '506'].map((svc) => (
            <button
              key={svc}
              onClick={() => setQuery(svc)}
              className="px-2.5 py-0.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
            >
              {svc}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-3 flex-1">
          {/* SBS Services Match section */}
          {matchingServices.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                SBS Transit Services ({matchingServices.length})
              </div>
              {matchingServices.slice(0, 4).map((s) => (
                <div
                  key={s.serviceNo}
                  onClick={() => handleSelectService(s.serviceNo)}
                  className="p-2.5 rounded-xl hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center">
                      {s.serviceNo}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                        {s.origin} ➔ {s.destination}
                      </div>
                      <p className="text-[11px] text-slate-500">{s.routeType} • {s.headway.peak} peak</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                    View Arrivals
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Bus Stops Match section */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Bus Stops ({combinedMatchingStops.length})
            </div>
            {combinedMatchingStops.length === 0 && matchingServices.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-400">
                No bus stops or services found matching &quot;{query}&quot;.
              </div>
            ) : (
              combinedMatchingStops.map((stop) => (
                <div
                  key={stop.id}
                  onClick={() => {
                    onSelectStop(stop.id);
                    onClose();
                  }}
                  className="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {stop.name}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono">
                        {stop.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {formatDistance(stop.distanceMeters)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{stop.road}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {stop.services.map((s) => (
                        <span
                          key={s.serviceNo}
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700"
                        >
                          {s.serviceNo}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-indigo-600 text-[20px] transition-colors">
                    chevron_right
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
