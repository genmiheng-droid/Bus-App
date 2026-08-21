import { useState, useCallback } from 'react';
import { AlertsView } from './components/AlertsView';
import { ArrivalsView } from './components/ArrivalsView';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { LiveMapView } from './components/LiveMapView';
import { PlanView } from './components/PlanView';
import { SearchModal } from './components/SearchModal';
import { SideMenuDrawer } from './components/SideMenuDrawer';
import { SBSServicesView } from './components/SBSServicesView';
import { BackendStatusModal } from './components/BackendStatusModal';
import { INITIAL_BUS_STOPS } from './data/transitData';
import { TabType } from './types';
import { useUserLocation } from './hooks/useUserLocation';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('arrivals');
  const [selectedStopId, setSelectedStopId] = useState<string>(INITIAL_BUS_STOPS[0].id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBackendStatusOpen, setIsBackendStatusOpen] = useState(false);

  // Auto-select nearest stop callback
  const handleAutoSelectNearest = useCallback((nearestStopId: string) => {
    setSelectedStopId(nearestStopId);
  }, []);

  // GPS User Location & Proximity Engine
  const { stops, setStops, location, requestLocation } = useUserLocation(
    INITIAL_BUS_STOPS,
    handleAutoSelectNearest
  );

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
    // Find stop that has this service, prioritizing closest stop
    const matchingStop = stops.find((s) =>
      s.services.some((svc) => svc.serviceNo.toLowerCase() === serviceNo.toLowerCase())
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
        onOpenBackendStatus={() => setIsBackendStatusOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 mt-20 w-full">
        {currentTab === 'arrivals' && (
          <ArrivalsView
            stops={stops}
            selectedStopId={selectedStopId}
            userLocation={location}
            onRequestLocation={requestLocation}
            onSelectStop={setSelectedStopId}
            onToggleFavorite={handleToggleFavorite}
            onSelectBusRoute={(serviceNo) => {
              handleOpenArrivalsForBus(serviceNo);
            }}
            onOpenMapToStop={handleOpenMapToStop}
            onOpenAllServices={() => setCurrentTab('services')}
          />
        )}

        {currentTab === 'services' && (
          <SBSServicesView
            onSelectService={handleOpenArrivalsForBus}
            onOpenArrivalsForStop={handleSelectStop}
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
        onOpenBackendStatus={() => setIsBackendStatusOpen(true)}
      />

      {/* Backend & Vercel Diagnostics Modal */}
      <BackendStatusModal
        isOpen={isBackendStatusOpen}
        onClose={() => setIsBackendStatusOpen(false)}
      />
    </div>
  );
}
