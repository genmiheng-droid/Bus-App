import React, { useState, useMemo } from 'react';
import { SBS_BUS_SERVICES } from '../data/sbsServices';
import { SBSServiceInfo, SBSRouteType } from '../types';

interface SBSServicesViewProps {
  onSelectService?: (serviceNo: string) => void;
  onOpenArrivalsForStop?: (stopId: string) => void;
}

const ROUTE_TYPES: ('ALL' | SBSRouteType)[] = [
  'ALL',
  'Trunk',
  'Feeder',
  'Townlink',
  'Express',
  'Cross Border',
  'Changi Airport',
];

export const SBSServicesView: React.FC<SBSServicesViewProps> = ({
  onSelectService,
  onOpenArrivalsForStop,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | SBSRouteType>('ALL');
  const [activeService, setActiveService] = useState<SBSServiceInfo | null>(null);

  const filteredServices = useMemo(() => {
    return SBS_BUS_SERVICES.filter((srv) => {
      const matchesType = selectedType === 'ALL' || srv.routeType === selectedType;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        srv.serviceNo.toLowerCase().includes(q) ||
        srv.origin.toLowerCase().includes(q) ||
        srv.destination.toLowerCase().includes(q) ||
        srv.keyStops.some((k) => k.toLowerCase().includes(q));
      return matchesType && matchesQuery;
    });
  }, [searchQuery, selectedType]);

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 pb-28 md:pb-12 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Official Network Directory
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SBS Transit Fleet Live
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            SBS Transit Bus Services
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
            Explore all public trunk, feeder, townlink, express, and cross-border bus services operated across Singapore by SBS Transit with live headways and operating schedules.
          </p>

          {/* Search bar */}
          <div className="pt-2 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by Bus No (e.g. 7, 14, 65, 174, 506)..."
                className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-slate-400 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="text-xs text-slate-300 font-medium px-2 py-1 bg-white/10 rounded-lg hidden sm:block">
              {filteredServices.length} Services
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ROUTE_TYPES.map((type) => {
          const isActive = selectedType === type;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {type === 'ALL' ? 'All Services' : type}
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((srv) => {
          const isSelected = activeService?.serviceNo === srv.serviceNo;
          return (
            <div
              key={srv.serviceNo}
              onClick={() => setActiveService(isSelected ? null : srv)}
              className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer hover:shadow-md ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl tracking-tight shadow-xs">
                    {srv.serviceNo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {srv.routeType}
                      </span>
                      {srv.isLoop && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                          Loop
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">
                      {srv.stopsCount} En-route Stops
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100/80">
                    {srv.headway.peak}
                  </span>
                </div>
              </div>

              {/* Terminus Route Info */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                  <span className="truncate">{srv.origin}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span className="truncate">{srv.destination}</span>
                </div>
              </div>

              {/* Key Stops Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {srv.keyStops.slice(0, 3).map((stop, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60"
                  >
                    {stop}
                  </span>
                ))}
                {srv.keyStops.length > 3 && (
                  <span className="text-[11px] text-slate-400 font-medium self-center">
                    +{srv.keyStops.length - 3} more
                  </span>
                )}
              </div>

              {/* Expanded Detail Panel */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-3 bg-slate-50/70 -mx-5 -mb-5 p-5 rounded-b-2xl animate-fadeIn">
                  {srv.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {srv.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        First / Last Bus
                      </span>
                      <span className="font-semibold text-slate-800">
                        {srv.operatingHours.weekdays}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Off-Peak Headway
                      </span>
                      <span className="font-semibold text-slate-800">
                        {srv.headway.offPeak}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    {onSelectService && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectService(srv.serviceNo);
                        }}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">departure_board</span>
                        Track Arrivals
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
