import React, { useEffect, useState, useCallback } from 'react';
import { INITIAL_ALERTS } from '../data/transitData';
import { ServiceAlert } from '../types';

interface AlertsViewProps {
  onSelectBusService?: (serviceNo: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = () => {
  const [alerts, setAlerts] = useState<ServiceAlert[]>(INITIAL_ALERTS);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'bus' | 'mrt' | 'general'>('all');
  const [expandedAlertIds, setExpandedAlertIds] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  const fetchLiveAlerts = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [incidentsRes, trainRes] = await Promise.all([
        fetch('/api/lta/traffic-incidents').catch(() => null),
        fetch('/api/lta/train-alerts').catch(() => null),
      ]);

      const newAlerts: ServiceAlert[] = [...INITIAL_ALERTS];

      if (incidentsRes && incidentsRes.ok) {
        const incidentsData = await incidentsRes.json();
        if (incidentsData.isLive && Array.isArray(incidentsData.value) && incidentsData.value.length > 0) {
          setIsLiveConnected(true);
          incidentsData.value.forEach((inc: any, idx: number) => {
            newAlerts.unshift({
              id: `lta-inc-${inc.Type || 'traffic'}-${idx}-${Date.now()}`,
              category: 'general',
              type: inc.Type?.toLowerCase().includes('accident')
                ? 'DELAYED'
                : inc.Type?.toLowerCase().includes('roadwork')
                ? 'DIVERSION'
                : 'MAINTENANCE',
              badgeText: inc.Type || 'Traffic Incident',
              title: inc.Message?.split('.')[0] || 'Expressway Incident Advisory',
              summary: inc.Message || 'Traffic slow down reported on road network.',
              fullDetails: `${inc.Message} (Latitude: ${inc.Latitude ?? 'N/A'}, Longitude: ${inc.Longitude ?? 'N/A'})`,
              timestamp: 'Live LTA Stream',
              accentColor: '#f59e0b',
            });
          });
        }
      }

      if (trainRes && trainRes.ok) {
        const trainData = await trainRes.json();
        if (trainData.isLive && trainData.value) {
          setIsLiveConnected(true);
          const status = trainData.value.Status;
          if (status === 2 && Array.isArray(trainData.value.Message)) {
            trainData.value.Message.forEach((msg: any, idx: number) => {
              newAlerts.unshift({
                id: `lta-train-${idx}-${Date.now()}`,
                category: 'mrt',
                type: 'DELAYED',
                badgeText: 'MRT Disruption',
                title: msg.Content || 'Train Service Disruption',
                summary: `Affected Line: ${msg.Line || 'Rail'}. Free shuttle buses activated.`,
                fullDetails: msg.Content || 'Please seek alternative transport.',
                timestamp: 'Live LTA Stream',
                accentColor: '#bb0013',
              });
            });
          }
        }
      }

      setAlerts(newAlerts);
    } catch (err) {
      console.warn('Could not load live alerts:', err);
    } finally {
      setIsRefreshing(false);
      const now = new Date();
      setLastRefreshed(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, []);

  useEffect(() => {
    fetchLiveAlerts();
  }, [fetchLiveAlerts]);

  const toggleExpand = (id: string) => {
    setExpandedAlertIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredAlerts = React.useMemo(() => {
    const list = alerts.filter((alert) => {
      if (selectedCategory === 'all') return true;
      return alert.category === selectedCategory;
    });
    const seen = new Set<string>();
    return list.filter((a) => {
      if (!a || !a.id || seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    });
  }, [alerts, selectedCategory]);

  const busCount = alerts.filter((a) => a.category === 'bus').length;
  const mrtCount = alerts.filter((a) => a.category === 'mrt' && a.type !== 'NORMAL').length;
  const generalCount = alerts.filter((a) => a.category === 'general').length;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 pb-28 md:pb-12 space-y-6">
      {/* Status Overview Hero */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Network Operations & Status
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Real-time advisory feed across Singapore bus fleets, MRT lines, and traffic expressways.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Updated {lastRefreshed}
            </span>
            <button
              onClick={fetchLiveAlerts}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-xs font-bold cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[16px] ${isRefreshing ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>{isRefreshing ? 'Refreshing' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-6 flex items-center shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl mr-4 shrink-0 flex items-center justify-center border border-emerald-100">
            <span
              className="material-symbols-outlined text-[26px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Singapore Transit Network Operating Smoothly
              </h2>
              {isLiveConnected && (
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">
                  LTA Live Feed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              98.7% of all bus schedules, train connections, and expressways are running within normal tolerances.
            </p>
          </div>
        </div>
      </section>

      {/* Filters / Category Pills */}
      <section className="flex space-x-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-100'
          }`}
        >
          All Advisories ({alerts.length})
        </button>

        <button
          onClick={() => setSelectedCategory('bus')}
          className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            selectedCategory === 'bus'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-100'
          }`}
        >
          Bus Services ({busCount})
        </button>

        <button
          onClick={() => setSelectedCategory('mrt')}
          className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            selectedCategory === 'mrt'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-100'
          }`}
        >
          MRT & Rail ({mrtCount})
        </button>

        <button
          onClick={() => setSelectedCategory('general')}
          className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            selectedCategory === 'general'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-100'
          }`}
        >
          Traffic & Incidents ({generalCount})
        </button>
      </section>

      {/* Alerts Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlerts.map((alert) => {
          const isExpanded = !!expandedAlertIds[alert.id];
          const isDelay = alert.type === 'DELAYED';
          const isDiversion = alert.type === 'DIVERSION';
          const isMaintenance = alert.type === 'MAINTENANCE';

          return (
            <div
              key={alert.id}
              className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all relative overflow-hidden flex flex-col group"
            >
              {/* Colored left bar */}
              <div
                className="absolute top-0 left-0 w-1.5 h-full"
                style={{
                  backgroundColor:
                    isDelay ? '#f43f5e' : isDiversion ? '#f59e0b' : isMaintenance ? '#0284c7' : '#10b981',
                }}
              />

              <div className="flex justify-between items-start mb-2 pl-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      alert.category === 'bus'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        : alert.category === 'general'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}
                  >
                    {alert.category.toUpperCase()}
                  </span>
                  {alert.serviceNo && (
                    <span className="text-xs font-bold text-slate-700">
                      {alert.serviceNo}
                    </span>
                  )}
                </div>

                <span
                  className={`text-xs font-bold tracking-wider flex items-center ${
                    isDelay
                      ? 'text-rose-600'
                      : isDiversion
                      ? 'text-amber-600'
                      : 'text-slate-500'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] mr-1">
                    {isDelay ? 'warning' : isDiversion ? 'alt_route' : isMaintenance ? 'info' : 'check'}
                  </span>
                  {alert.badgeText}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1.5 pl-2 leading-snug">
                {alert.title}
              </h3>

              <p
                className={`text-xs text-slate-500 mb-3 pl-2 transition-all duration-300 leading-relaxed ${
                  isExpanded ? '' : 'line-clamp-2'
                }`}
              >
                {alert.summary}
              </p>

              {isExpanded && (
                <div className="mt-2 pl-2 py-2.5 border-t border-slate-100 text-xs text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-3">
                  <p className="font-bold text-slate-900 mb-1">Official Advisory:</p>
                  <p>{alert.fullDetails}</p>
                  <p className="text-[10px] text-slate-400 mt-2">Posted: {alert.timestamp}</p>
                </div>
              )}

              <div className="text-right mt-auto pt-2 pl-2">
                <button
                  onClick={() => toggleExpand(alert.id)}
                  className="text-indigo-600 text-xs font-bold uppercase tracking-wider hover:underline focus:outline-none rounded px-2 py-1 cursor-pointer"
                >
                  {isExpanded ? 'Show Less' : 'Read More'}
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
};

