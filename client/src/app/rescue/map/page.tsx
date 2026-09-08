"use client";

import { useState } from "react";
import { Map as MapIcon, Layers, Filter, Crosshair, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function RescueMapPage() {
  const [activeLayer, setActiveLayer] = useState("all");

  return (
    <div className="max-w-6xl mx-auto space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MapIcon className="h-6 w-6 text-blue-600" />
            Global Dispatch Map
          </h1>
          <p className="text-slate-500 text-sm mt-1">Live tactical view of incidents, units, and hazards</p>
        </div>
        <Link 
          href="/rescue"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Map Interface (Left) */}
        <div className="flex-1 bg-slate-100 relative min-h-[400px]">
          {/* Map Controls */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <button className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
              <Layers className="h-5 w-5" />
            </button>
            <button className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
              <Crosshair className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <MapIcon className="h-16 w-16 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Map Interface Loading...</p>
            <p className="text-xs text-slate-400 mt-2 max-w-xs text-center">
              (Ready to connect to react-leaflet or Google Maps API)
            </p>
          </div>
        </div>

        {/* Sidebar Filters (Right) */}
        <div className="w-full md:w-80 bg-white border-l border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <Filter className="h-5 w-5 text-slate-400" />
            <h3 className="font-bold text-slate-900">Map Filters</h3>
          </div>
          
          <div className="p-4 space-y-6 overflow-y-auto">
            {/* Layers */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Active Layers</h4>
              <div className="space-y-2">
                {['All Events', 'Critical SOS', 'Rescue Units', 'Hazards', 'Shelters'].map((layer, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      activeLayer === 'all' || activeLayer === layer.toLowerCase() 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-slate-300 bg-white group-hover:border-blue-400'
                    }`}>
                      {(activeLayer === 'all' || activeLayer === layer.toLowerCase()) && (
                        <div className="w-2.5 h-2.5 bg-white rounded-sm" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{layer}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">AI Threat Zones</h4>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-2 text-amber-800">
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
                  <p className="text-sm font-bold">Flood Risk Expansion</p>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  AI models predict water levels in Sector 4 will breach retaining walls in approx 2 hours. Evacuation routes may be cut off.
                </p>
                <button className="text-xs font-bold bg-white text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors w-full">
                  Show Predicted Area
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
