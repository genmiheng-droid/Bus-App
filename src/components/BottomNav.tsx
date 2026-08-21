import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unreadAlertsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  unreadAlertsCount = 1,
}) => {
  const navItems: {
    key: TabType;
    label: string;
    icon: string;
    badge?: number;
  }[] = [
    { key: 'arrivals', label: 'Arrivals', icon: 'directions_bus' },
    { key: 'services', label: 'SBS Fleet', icon: 'grid_view' },
    { key: 'map', label: 'Map', icon: 'map' },
    { key: 'plan', label: 'Plan', icon: 'route' },
    { key: 'alerts', label: 'Alerts', icon: 'notifications', badge: unreadAlertsCount },
  ];

  return (
    <nav
      id="bottomNavBar"
      aria-label="Main Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg flex justify-around items-center h-18 px-2 pb-safe"
    >
      {navItems.map((item) => {
        const isActive = currentTab === item.key;
        return (
          <button
            key={item.key}
            id={`nav-tab-${item.key}`}
            onClick={() => onSelectTab(item.key)}
            className={`flex flex-col items-center justify-center transition-all duration-150 active:scale-95 px-3 py-1.5 rounded-xl cursor-pointer relative ${
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="relative">
              <span
                className="material-symbols-outlined transition-transform text-[22px]"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              {!isActive && item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </div>
            <span
              className={`text-[11px] leading-tight font-medium mt-0.5 tracking-tight ${
                isActive ? 'text-white font-bold' : 'text-slate-500'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
