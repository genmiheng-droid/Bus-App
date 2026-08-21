import React, { useState } from 'react';
import { INITIAL_SUGGESTED_ROUTES } from '../data/transitData';
import { SuggestedRoute } from '../types';

interface PlanViewProps {
  onNavigateToArrivals?: (busNo: string) => void;
}

export const PlanView: React.FC<PlanViewProps> = () => {
  const [fromLocation, setFromLocation] = useState('Current Location (Somerset)');
  const [toLocation, setToLocation] = useState('Changi Airport');
  const [routes, setRoutes] = useState<SuggestedRoute[]>(INITIAL_SUGGESTED_ROUTES);
  const [selectedRoute, setSelectedRoute] = useState<SuggestedRoute | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const quickPills = [
    { label: 'Home', icon: 'home', destination: 'Boon Lay Way (Home)' },
    { label: 'Work', icon: 'work', destination: 'Raffles Place MRT (Work)' },
    { label: 'Orchard MRT', icon: 'history', destination: 'Orchard MRT' },
    { label: 'Changi Airport', icon: 'history', destination: 'Changi Airport' },
    { label: 'Marina Bay', icon: 'history', destination: 'Marina Bay Sands' },
  ];

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation || 'Current Location');
    setToLocation(temp);
    triggerRecalculate();
  };

  const handleSelectQuickDest = (dest: string) => {
    setToLocation(dest);
    triggerRecalculate();
  };

  const triggerRecalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setRoutes(INITIAL_SUGGESTED_ROUTES);
    }, 400);
  };

  return (
    <main className="flex-grow w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12 space-y-6 flex flex-col relative z-0">
      {/* Header section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Journey Planner
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Intelligent multi-modal routing across Singapore SBS Transit & MRT networks.
        </p>
      </div>

      {/* Input Section (Sleek Elevated Card) */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 relative overflow-hidden">
        <div className="relative flex items-center">
          {/* Location Dots and Connecting Line */}
          <div className="flex flex-col items-center mr-3 sm:mr-4">
            <span
              className="material-symbols-outlined text-indigo-600 text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              my_location
            </span>
            <div className="w-[2px] h-8 bg-slate-200 my-1" />
            <span
              className="material-symbols-outlined text-rose-500 text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              location_on
            </span>
          </div>

          {/* Input Fields */}
          <div className="flex-grow space-y-2.5">
            <div className="relative">
              <input
                type="text"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                placeholder="From location or current GPS"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 px-3.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                placeholder="Where to? (e.g. Marina Bay, Airport)"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 px-3.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwapLocations}
            title="Swap Origin and Destination"
            className="ml-3 p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 active:scale-95 transition-all shadow-xs cursor-pointer border border-slate-200/60"
          >
            <span className="material-symbols-outlined text-[20px]">swap_vert</span>
          </button>
        </div>

        {/* Quick Actions Bento Pills */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-hide">
          {quickPills.map((pill) => {
            const isSelected = toLocation === pill.destination || toLocation === pill.label;
            return (
              <button
                key={pill.label}
                onClick={() => handleSelectQuickDest(pill.destination)}
                className={`flex items-center rounded-full py-1.5 px-3.5 transition-all whitespace-nowrap text-xs font-semibold cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-100 border-slate-200/60 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[15px] mr-1.5 opacity-70">{pill.icon}</span>
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Suggested Routes Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Optimal Routes</h2>
          {isCalculating ? (
            <span className="text-xs text-indigo-600 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              Recalculating...
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Sorted by travel efficiency</span>
          )}
        </div>

        {/* Journey Options List */}
        <div className="space-y-3">
          {routes.map((route) => (
            <div
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 flex flex-col cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  <span
                    className={`text-2xl font-extrabold ${
                      route.isFastest ? 'text-indigo-600' : 'text-slate-900'
                    }`}
                  >
                    {route.durationMin} min
                  </span>
                  <span className="text-xs font-semibold text-slate-500 mt-0.5">
                    Leave by {route.leaveBy}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  {route.tag && (
                    <span
                      className={`text-[10px] font-bold tracking-wider px-3 py-1 rounded-full mb-1 uppercase ${
                        route.tag === 'Fastest'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          : route.tag === 'Direct Bus'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {route.tag}
                    </span>
                  )}
                  <span className="text-xs font-bold text-slate-600">
                    {route.fare} • {route.transfers} transfer{route.transfers === 1 ? '' : 's'}
                  </span>
                </div>
              </div>

              {/* Visual Multi-Modal Timeline Bar */}
              <div className="flex h-2 w-full rounded-full overflow-hidden mb-3 bg-slate-100">
                {route.segments.map((seg, idx) => (
                  <div
                    key={idx}
                    className="h-full first:rounded-l-full last:rounded-r-full transition-all"
                    style={{
                      width: `${seg.percentage}%`,
                      backgroundColor:
                        seg.type === 'walk'
                          ? '#cbd5e1'
                          : seg.type === 'bus'
                          ? '#4f46e5'
                          : '#10b981',
                    }}
                    title={`${seg.type.toUpperCase()} ${seg.label || ''} (${seg.durationMin}m)`}
                  />
                ))}
              </div>

              {/* Step Sequence Details */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 font-medium">
                {route.segments.map((seg, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <span className="material-symbols-outlined text-[14px] text-slate-400">
                        chevron_right
                      </span>
                    )}
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-lg">
                      <span
                        className="material-symbols-outlined text-[15px]"
                        style={{
                          color:
                            seg.type === 'walk'
                              ? '#64748b'
                              : seg.type === 'bus'
                              ? '#4f46e5'
                              : '#10b981',
                        }}
                      >
                        {seg.type === 'walk'
                          ? 'directions_walk'
                          : seg.type === 'bus'
                          ? 'directions_bus'
                          : 'train'}
                      </span>
                      {seg.label && <span className="font-bold text-slate-800">{seg.label}</span>}
                      <span className="text-[11px] text-slate-400">({seg.durationMin}m)</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Route Detail Sheet */}
      {selectedRoute && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-2xl p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedRoute.durationMin} min Journey
                  </h3>
                  {selectedRoute.tag && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {selectedRoute.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Est. Fare: {selectedRoute.fare} • Leave by {selectedRoute.leaveBy}
                </p>
              </div>
              <button
                onClick={() => setSelectedRoute(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Turn-by-Turn Navigation
              </div>

              <div className="space-y-4 border-l-2 border-slate-200 ml-2 pl-4 py-1">
                {selectedRoute.segments.map((seg, idx) => (
                  <div key={idx} className="relative">
                    <div
                      className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          seg.type === 'walk'
                            ? '#64748b'
                            : seg.type === 'bus'
                            ? '#4f46e5'
                            : '#10b981',
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {seg.type === 'walk' ? 'Walk' : seg.type === 'bus' ? `Take Bus ${seg.label}` : `Board MRT ${seg.label}`}
                      </span>
                      <span className="text-xs text-slate-400">({seg.durationMin} min)</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {seg.type === 'walk'
                        ? 'Head towards nearest transit boarding stop'
                        : seg.type === 'bus'
                        ? 'Double Deck • Fully air-conditioned • Normal loading'
                        : 'North-South Line or East-West Line'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedRoute(null)}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all cursor-pointer text-sm"
            >
              Start Live Commute Guidance
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
