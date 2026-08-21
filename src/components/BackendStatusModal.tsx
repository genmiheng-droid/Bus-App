import React, { useEffect, useState } from 'react';

interface BackendStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LtaConfigData {
  configured: boolean;
  environment: string;
  keyPrefix: string | null;
  accountKeyEnvName: string;
  instructions: string;
  endpoints: {
    busArrivalV3: string;
    busStops: string;
    busRoutes: string;
    busServices: string;
    trafficIncidents: string;
    trainServiceAlerts: string;
  };
}

export const BackendStatusModal: React.FC<BackendStatusModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<LtaConfigData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/lta/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.warn('Status fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyEnvSnippet = () => {
    navigator.clipboard.writeText('LTA_DATAMALL_ACCOUNT_KEY=your_key_here');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <span className="material-symbols-outlined text-[22px]">cloud_sync</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Backend & Vercel Config</h2>
              <p className="text-xs text-slate-500">Singapore LTA DataMall 2.0 API & Environment Status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-sm text-slate-600">
          {/* Status Capsule */}
          <div className="p-4 rounded-2xl border bg-slate-50 border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                LTA DataMall Key Status
              </div>
              <div className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                {status?.configured ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live API Key Connected</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Awaiting Environment Key</span>
                  </>
                )}
              </div>
              {status?.keyPrefix && (
                <div className="text-xs text-slate-500 font-mono mt-1">Key: {status.keyPrefix}</div>
              )}
            </div>

            <button
              onClick={fetchStatus}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer"
              title="Refresh status"
            >
              <span className={`material-symbols-outlined text-[18px] ${isLoading ? 'animate-spin' : ''}`}>
                refresh
              </span>
            </button>
          </div>

          {/* Vercel Guide */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-indigo-600 text-[16px]">settings</span>
              Setting up on Vercel
            </h3>
            <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 space-y-2.5 text-xs font-mono">
              <div className="text-slate-400"># In Vercel Dashboard: Project &gt; Settings &gt; Environment Variables</div>
              <div className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-indigo-400 font-bold">LTA_DATAMALL_ACCOUNT_KEY</span>
                <button
                  onClick={copyEnvSnippet}
                  className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-sans transition-colors cursor-pointer"
                >
                  {copied ? 'Copied!' : 'Copy Key'}
                </button>
              </div>
              <div className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Add your LTA DataMall 2.0 Account Key. Supports production, preview, and development environments.
              </div>
            </div>
          </div>

          {/* Endpoints List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Active Backend Proxies & Endpoints
            </h3>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-slate-700">/api/lta/bus-arrival</span>
                <span className="text-indigo-600 font-sans font-semibold text-[11px]">BusArrival v3</span>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-slate-700">/api/lta/traffic-incidents</span>
                <span className="text-amber-600 font-sans font-semibold text-[11px]">TrafficIncidents</span>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-slate-700">/api/lta/train-alerts</span>
                <span className="text-rose-600 font-sans font-semibold text-[11px]">TrainServiceAlerts</span>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-slate-700">/api/lta/status</span>
                <span className="text-emerald-600 font-sans font-semibold text-[11px]">Health & Diagnostics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <a
            href="https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            Request Free LTA Key
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
