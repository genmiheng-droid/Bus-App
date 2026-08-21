import React, { useState } from 'react';
import { BusStop } from '../types';

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

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Search by stop name, stop ID, road, or bus service number
  const matchingStops = stops.filter((stop) => {
    if (!normalizedQuery) return true;
    const nameMatch = stop.name.toLowerCase().includes(normalizedQuery);
    const idMatch = stop.id.includes(normalizedQuery);
    const roadMatch = stop.road.toLowerCase().includes(normalizedQuery);
    const serviceMatch = stop.services.some((s) =>
      s.serviceNo.toLowerCase().includes(normalizedQuery)
    );
    return nameMatch || idMatch || roadMatch || serviceMatch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center p-4 pt-16 md:pt-24 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/70">
          <span className="material-symbols-outlined text-indigo-600 text-[22px]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stop name, ID (e.g. 09038), or bus # (e.g. 174)..."
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
        <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Quick Route:
          </span>
          {['15', '83139', '7', '14', '16', '174', '175', '143', '65'].map((svc) => (
            <button
              key={svc}
              onClick={() => setQuery(svc)}
              className="px-2.5 py-0.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
            >
              {svc}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {matchingStops.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400">
              No bus stops or services found matching &quot;{query}&quot;.
            </div>
          ) : (
            matchingStops.map((stop) => (
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
  );
};
