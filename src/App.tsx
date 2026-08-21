import { useState } from 'react';
import { AlertsView } from './components/AlertsView';
import { ArrivalsView } from './components/ArrivalsView';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { LiveMapView } from './components/LiveMapView';
import { PlanView } from './components/PlanView';
import { SearchModal } from './components/SearchModal';
import { SideMenuDrawer } from './components/SideMenuDrawer';
import { INITIAL_BUS_STOPS } from './data/transitData';
import { BusStop, TabType } from './types';

// Helper to determine the nearest bus stop by distance
const getNearestStopId = (busStops: BusStop[]): string => {
  if (!busStops.length) return '';
  const sorted = [...busStops].sort(
    (a, b) => (a.distanceMeters ?? 9999) - (b.distanceMeters ?? 9999)
  );
  return sorted[0].id;
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('arrivals');
  const [stops, setStops] = useState<BusStop[]>(INITIAL_BUS_STOPS);
  const [selectedStopId, setSelectedStopId] = useState<string>(() =>
    getNearestStopId(INITIAL_BUS_STOPS)
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Toggle favorite stop status
  const handleToggleFavorite = (stopId: string) => {
    setStops((prevStops) =>
      prevStops.map((stop) =>
        stop.id === stopId ? { ...stop, isFavorite: !stop.isFavorite } : stop
      )
    );
  };

  const handleSelectStop = (stopId: string) => {
    setSelectedStopId(stopId);
    setCurrentTab('arrivals');
  };

  const handleOpenMapToStop = (stopId: string) => {
    setSelectedStopId(stopId);
    setCurrentTab('map');
  };

  const handleOpenArrivalsForBus = (serviceNo: string) => {
    // Find stop that has this service
    const matchingStop = stops.find((s) =>
      s.services.some((svc) => svc.serviceNo === serviceNo)
    );
    if (matchingStop) {
      setSelectedStopId(matchingStop.id);
    }
    setCurrentTab('arrivals');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* Top App Bar */}
      <Header
        currentTab={currentTab}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectTab={setCurrentTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 mt-20 w-full">
        {currentTab === 'arrivals' && (
          <ArrivalsView
            stops={stops}
            selectedStopId={selectedStopId}
            onSelectStop={setSelectedStopId}
            onToggleFavorite={handleToggleFavorite}
            onSelectBusRoute={(serviceNo) => {
              console.log(`Selected bus route: ${serviceNo}`);
            }}
            onOpenMapToStop={handleOpenMapToStop}
          />
        )}

        {currentTab === 'plan' && (
          <PlanView
            onNavigateToArrivals={(busNo) => handleOpenArrivalsForBus(busNo)}
          />
        )}

        {currentTab === 'map' && (
          <LiveMapView
            stops={stops}
            selectedStopId={selectedStopId}
            onSelectStop={setSelectedStopId}
            onToggleFavorite={handleToggleFavorite}
            onOpenArrivalsForStop={handleSelectStop}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsView
            onSelectBusService={handleOpenArrivalsForBus}
          />
        )}
      </div>

      {/* Bottom Navigation Bar for Mobile */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        unreadAlertsCount={1}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        stops={stops}
        onSelectStop={handleSelectStop}
      />

      {/* Slide-out Menu Drawer */}
      <SideMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />
    </div>
  );
}
