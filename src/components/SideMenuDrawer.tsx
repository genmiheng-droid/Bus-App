import React from 'react';
import { SBS_LOGO_URL } from '../data/transitData';
import { TabType } from '../types';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenBackendStatus?: () => void;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  onOpenBackendStatus,
}) => {
  if (!isOpen) return null;

  const menuItems: { key: TabType; label: string; icon: string; desc: string }[] = [
    { key: 'arrivals', label: 'Arrivals Dashboard', icon: 'directions_bus', desc: 'Real-time telemetry & occupancy' },
    { key: 'services', label: 'SBS Fleet Directory', icon: 'grid_view', desc: 'All SBS Transit bus routes & timetables' },
    { key: 'map', label: 'Live Transit Radar', icon: 'map', desc: 'Interactive GPS radar map' },
    { key: 'plan', label: 'Journey Planner', icon: 'route', desc: 'Optimal multi-modal routing' },
    { key: 'alerts', label: 'Network Operations', icon: 'notifications', desc: 'Live alerts & advisories' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex animate-in fade-in duration-150">
      {/* Drawer */}
      <aside className="w-72 max-w-[85vw] bg-slate-900 text-slate-300 h-full shadow-2xl flex flex-col justify-between border-r border-slate-800 animate-in slide-in-from-left duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <img
                  src={SBS_LOGO_URL}
                  alt="SBS Transit Logo"
                  className="w-5 h-5 object-contain filter brightness-0 invert"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">SBS Radar</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = currentTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    onSelectTab(item.key);
                    onClose();
                  }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm font-semibold'
                      : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-indigo-400' : 'opacity-70'
                    }`}
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <div className="text-sm">{item.label}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Telemetry usage card */}
        <div className="p-6 space-y-4 border-t border-slate-800/60">
          <div
            onClick={() => {
              if (onOpenBackendStatus) {
                onOpenBackendStatus();
                onClose();
              }
            }}
            className="bg-slate-800/40 hover:bg-slate-800/80 transition-colors rounded-2xl p-4 border border-slate-700/80 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Live Telemetry Feed
              </p>
              <span className="text-[10px] text-indigo-400 font-semibold group-hover:underline">
                Config
              </span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mb-2 overflow-hidden">
              <div className="bg-indigo-500 w-[95%] h-full rounded-full shadow-glow-indigo" />
            </div>
            <p className="text-[11px] text-slate-300 flex items-center justify-between">
              <span>LTA DataMall 2.0 (Vercel)</span>
              <span className="text-emerald-400 font-bold">Live Proxy</span>
            </p>
          </div>

          <div className="text-[11px] text-slate-500 flex justify-between items-center pt-1">
            <span>SBS Hotline: 1800 287 2727</span>
            <span>v2.4 Pro</span>
          </div>
        </div>
      </aside>

      {/* Backdrop click area */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
