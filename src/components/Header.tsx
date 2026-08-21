import React from 'react';
import { SBS_LOGO_URL } from '../data/transitData';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onSelectTab: (tab: TabType) => void;
  onOpenBackendStatus?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMenu,
  onOpenSearch,
  onSelectTab,
  onOpenBackendStatus,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 md:px-10 transition-colors duration-200">
      <div className="flex items-center gap-3 md:gap-5">
        <button
          id="menuBtn"
          onClick={onOpenMenu}
          aria-label="Open Navigation Menu"
          className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 duration-100 p-2 rounded-xl transition-colors flex items-center justify-center h-10 w-10 cursor-pointer border border-transparent hover:border-slate-200"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* Brand logo & title */}
        <div
          onClick={() => onSelectTab('arrivals')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform overflow-hidden p-1.5">
            <img
              src={SBS_LOGO_URL}
              alt="SBS Transit Live Logo"
              className="w-full h-full object-contain filter brightness-0 invert"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight leading-none">
                SBS Transit
              </span>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-indigo-100">
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Singapore Bus & Rail Radar
            </p>
          </div>
        </div>
      </div>

      {/* Center Search Pill */}
      <div
        onClick={onOpenSearch}
        className="hidden lg:flex items-center bg-slate-100/90 hover:bg-slate-100 border border-slate-200/60 rounded-full px-4 py-2 w-72 xl:w-96 cursor-pointer transition-all shadow-xs hover:border-slate-300"
      >
        <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
        <span className="text-sm ml-3 text-slate-500 font-medium">Search bus stop, ID, or route...</span>
        <span className="ml-auto text-[10px] font-bold bg-white text-slate-500 px-2 py-0.5 rounded-md border border-slate-200">
          ⌘K
        </span>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
        <button
          onClick={() => onSelectTab('arrivals')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            currentTab === 'arrivals'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          Arrivals
        </button>
        <button
          onClick={() => onSelectTab('services')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            currentTab === 'services'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          SBS Fleet
        </button>
        <button
          onClick={() => onSelectTab('map')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            currentTab === 'map'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          Live Map
        </button>
        <button
          onClick={() => onSelectTab('plan')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            currentTab === 'plan'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          Journey Plan
        </button>
        <button
          onClick={() => onSelectTab('alerts')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
            currentTab === 'alerts'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          Alerts
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        </button>
      </nav>

      {/* Right Search & Live Radar Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile / Compact Search button */}
        <button
          id="searchTriggerBtn"
          onClick={onOpenSearch}
          aria-label="Search Bus Stops and Routes"
          className="lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 duration-100 p-2 rounded-xl transition-colors flex items-center justify-center h-10 w-10 cursor-pointer border border-transparent hover:border-slate-200"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>

        {/* Notifications Icon Button */}
        <button
          onClick={() => onSelectTab('alerts')}
          aria-label="View Network Alerts"
          className="relative text-slate-500 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Live GPS Telemetry / Backend Status Capsule */}
        <button
          onClick={onOpenBackendStatus}
          title="View LTA API & Vercel backend environment configuration"
          className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold hover:text-indigo-600">
            LTA Live API
          </span>
        </button>
      </div>
    </header>
  );
};

