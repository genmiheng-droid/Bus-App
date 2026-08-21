import React, { useEffect, useState } from 'react';
import { BusStop } from '../types';

interface LiveMapViewProps {
  stops: BusStop[];
  selectedStopId: string;
  onSelectStop: (stopId: string) => void;
  onToggleFavorite: (stopId: string) => void;
  onOpenArrivalsForStop: (stopId: string) => void;
}

export const LiveMapView: React.FC<LiveMapViewProps> = ({
  stops,
  selectedStopId,
  onToggleFavorite,
  onOpenArrivalsForStop,
}) => {
  const [drawerState, setDrawerState] = useState<'peek' | 'expanded' | 'collapsed'>('peek');
  const [activeStopId, setActiveStopId] = useState<string>(selectedStopId || '09047');
  const [busPosition, setBusPosition] = useState({ x: 55, y: 45 });
  const [mapLayer, setMapLayer] = useState<'transit' | 'traffic' | 'satellite'>('transit');
  const [zoomLevel, setZoomLevel] = useState(1);

  const activeStop = stops.find((s) => s.id === activeStopId) || stops[1];

  // Real-time animation of Bus 174 along route
  useEffect(() => {
    const interval = setInterval(() => {
      setBusPosition((prev) => {
        const nextX = prev.x > 80 ? 25 : prev.x + 0.4;
        const nextY = prev.y > 70 ? 35 : prev.y + 0.25;
        return { x: nextX, y: nextY };
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden flex flex-col bg-slate-50">
      {/* Interactive Map Canvas Container */}
      <div
        className="relative flex-1 w-full h-full map-pattern overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-out',
        }}
      >
        {/* Subtle Transit Grid Line Paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
          <line x1="20%" y1="70%" x2="48%" y2="52%" stroke="#4f46e5" strokeWidth="3" strokeDasharray="4 4" />
          <line x1="48%" y1="52%" x2="30%" y2="40%" stroke="#4f46e5" strokeWidth="4" />
          <line x1="30%" y1="40%" x2="65%" y2="60%" stroke="#f43f5e" strokeWidth="4" />
          <line x1="65%" y1="60%" x2="75%" y2="35%" stroke="#0284c7" strokeWidth="3" strokeDasharray="6 3" />
        </svg>

        {/* Center Watermark */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
          <span className="text-slate-400 text-3xl font-bold opacity-15 tracking-widest uppercase">
            SBS Radar Live • Singapore
          </span>
        </div>

        {/* User Location Pulse Marker */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          title="Your Current Location (Somerset / Orchard)"
        >
          <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-4 h-4 bg-indigo-600 rounded-full border-2 border-white shadow-md shadow-indigo-600/30" />
          </div>
        </div>

        {/* Dynamic Bus Stops Pins */}
        {stops.map((stop) => {
          const isActive = stop.id === activeStopId;
          return (
            <div
              key={stop.id}
              onClick={() => {
                setActiveStopId(stop.id);
                setDrawerState('peek');
              }}
              style={{ top: `${stop.coords.y}%`, left: `${stop.coords.x}%` }}
              className={`absolute transform -translate-x-1/2 -translate-y-full transition-transform cursor-pointer hover:scale-110 ${
                isActive ? 'z-30' : 'z-20'
              }`}
              title={`${stop.name} (${stop.id})`}
            >
              {isActive ? (
                // Active Stop Pin
                <div className="flex flex-col items-center">
                  <div className="bg-indigo-600 rounded-full p-2 shadow-lg shadow-indigo-600/30 border-2 border-white flex items-center justify-center w-11 h-11 animate-bounce">
                    <span
                      className="material-symbols-outlined text-white text-[22px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      directions_bus
                    </span>
                  </div>
                  <div className="w-0 h-0 border-l-[7px] border-r-[7px] border-t-[9px] border-l-transparent border-r-transparent border-t-indigo-600 -mt-px" />
                </div>
              ) : (
                // Normal Stop Pin
                <div className="flex flex-col items-center">
                  <div className="bg-white rounded-full p-1.5 shadow-sm border border-slate-300 flex items-center justify-center w-9 h-9 hover:border-indigo-500">
                    <span
                      className="material-symbols-outlined text-slate-700 text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      directions_bus
                    </span>
                  </div>
                  <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-white -mt-px filter drop-shadow-xs" />
                </div>
              )}
            </div>
          );
        })}

        {/* Real-time Moving Bus 174 Tag */}
        <div
          style={{ top: `${busPosition.y}%`, left: `${busPosition.x}%` }}
          className="absolute z-25 transition-all duration-500 ease-linear pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="bg-slate-900 rounded-xl px-2.5 py-1 shadow-lg border border-slate-700 flex items-center gap-1.5 text-white">
            <span
              className="material-symbols-outlined text-indigo-400 text-[14px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              directions_bus
            </span>
            <span className="text-xs font-extrabold tracking-tight">174</span>
          </div>
        </div>

        {/* Second Moving Bus 65 Tag */}
        <div
          style={{ top: `${busPosition.y - 12}%`, left: `${busPosition.x + 10}%` }}
          className="absolute z-25 transition-all duration-500 ease-linear pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="bg-indigo-600 rounded-xl px-2.5 py-1 shadow-lg shadow-indigo-600/30 border border-white flex items-center gap-1.5 text-white">
            <span
              className="material-symbols-outlined text-white text-[14px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              directions_bus
            </span>
            <span className="text-xs font-extrabold tracking-tight">65</span>
          </div>
        </div>
      </div>

      {/* Floating Controls Top Right */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        {/* Layer Selector Pill */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 p-1 flex gap-1">
          {(['transit', 'traffic', 'satellite'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setMapLayer(layer)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                mapLayer === layer
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 p-1 flex flex-col items-center">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Zoom in"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
          <div className="w-4 h-px bg-slate-200 my-0.5" />
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Zoom out"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
        </div>
      </div>

      {/* Nearby Bus Stops Bottom Drawer / Sheet */}
      <div
        className={`bg-white border-t border-slate-200 shadow-2xl z-30 transition-all duration-300 flex flex-col rounded-t-3xl max-w-3xl mx-auto w-full ${
          drawerState === 'expanded'
            ? 'h-[75vh]'
            : drawerState === 'peek'
            ? 'h-72 md:h-80'
            : 'h-16'
        }`}
      >
        {/* Drawer Handle & Header */}
        <div
          onClick={() =>
            setDrawerState(
              drawerState === 'peek' ? 'expanded' : drawerState === 'expanded' ? 'collapsed' : 'peek'
            )
          }
          className="p-3 border-b border-slate-100 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50 rounded-t-3xl"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
            <div className="mt-1 flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">Nearby Stops Radar</span>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                {stops.length} Found
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
            <span className="material-symbols-outlined text-[18px]">
              {drawerState === 'expanded' ? 'expand_more' : 'expand_less'}
            </span>
          </div>
        </div>

        {/* Active Stop Quick Banner */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900">{activeStop.name}</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                {activeStop.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{activeStop.road}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(activeStop.id)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 transition-colors shadow-xs"
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{
                  fontVariationSettings: activeStop.isFavorite ? "'FILL' 1" : "'FILL' 0",
                  color: activeStop.isFavorite ? '#f43f5e' : undefined,
                }}
              >
                {activeStop.isFavorite ? 'favorite' : 'favorite_border'}
              </span>
            </button>
            <button
              onClick={() => onOpenArrivalsForStop(activeStop.id)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm transition-colors"
            >
              Arrivals
            </button>
          </div>
        </div>

        {/* Live Services Grid for Active Stop */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Live Arrivals at {activeStop.name}
          </div>
          {activeStop.services.map((svc) => (
            <div
              key={svc.serviceNo}
              className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center justify-between shadow-xs hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-9 rounded-lg bg-slate-900 text-white font-extrabold text-lg flex items-center justify-center">
                  {svc.serviceNo}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{svc.destination}</p>
                  <p className="text-[10px] text-slate-400">Next: {svc.nextMins}m • {svc.occupancy}</p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-lg font-extrabold block leading-none ${
                    svc.mins <= 5 ? 'text-emerald-600' : svc.mins <= 10 ? 'text-amber-500' : 'text-slate-500'
                  }`}
                >
                  {svc.mins === 0 ? 'Arr' : `${svc.mins}m`}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Live GPS</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
