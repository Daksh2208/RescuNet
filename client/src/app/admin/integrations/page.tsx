"use client";

import { Network, Search, Plus, Activity, RefreshCw, Power } from "lucide-react";
import Link from "next/link";

export default function AdminIntegrationsPage() {
  const integrations = [
    {
      id: "API-01",
      name: "FEMA Disaster Data Sync",
      type: "Webhook / REST",
      status: "ACTIVE",
      lastSync: "2 mins ago",
      health: 100,
      description: "Bi-directional sync of mass evacuation protocols and national resource allocation."
    },
    {
      id: "API-02",
      name: "Local PD Incident Gateway",
      type: "Webhook",
      status: "ACTIVE",
      lastSync: "5 mins ago",
      health: 98,
      description: "Pushes verified critical incidents directly to local law enforcement dispatch."
    },
    {
      id: "API-03",
      name: "National Weather Service",
      type: "REST API Polling",
      status: "WARNING",
      lastSync: "15 mins ago",
      health: 75,
      description: "Fetches live meteorological telemetry for predictive Hazard Radar mapping."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Network className="h-6 w-6 text-purple-600" />
            Inter-Agency API Gateway
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage secure webhook and API bridges with external government and emergency services.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin"
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0 flex items-center justify-center"
          >
            Back to Dashboard
          </Link>
          <button className="bg-purple-600 text-white font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-purple-700 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Webhook
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {integrations.map((api) => (
          <div key={api.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${api.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  <Network className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{api.name}</h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{api.type}</p>
                </div>
              </div>
              <button className={`p-2 rounded-full border ${api.status === 'ACTIVE' ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                <Power className="h-4 w-4" />
              </button>
            </div>
            
            <p className="text-sm text-slate-600 mb-6 line-clamp-2">{api.description}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <RefreshCw className="h-3.5 w-3.5" />
                Sync: {api.lastSync}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Activity className={`h-3.5 w-3.5 ${api.health > 90 ? 'text-green-500' : 'text-orange-500'}`} />
                <span className={api.health > 90 ? 'text-green-700' : 'text-orange-700'}>{api.health}% Uptime</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
