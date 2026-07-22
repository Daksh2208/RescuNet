"use client";

import { useState } from "react";
import { Radar, MapPin, Navigation2, Zap, Flame, Droplet, Skull, Map, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function HazardRadarPage() {
  const hazards = [
    {
      id: "HZ-1",
      type: "Flooded Road",
      desc: "Water is over 3 feet deep. Do not attempt to cross in sedan.",
      location: "Main St & 4th Ave",
      time: "10 mins ago",
      icon: Droplet,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200"
    },
    {
      id: "HZ-2",
      type: "Live Power Line",
      desc: "Transformer blew, live wire sparking across the sidewalk.",
      location: "700 Block of Pine St",
      time: "25 mins ago",
      icon: Zap,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200"
    },
    {
      id: "HZ-3",
      type: "Aggressive Stray Dogs",
      desc: "Pack of 4 frightened dogs acting aggressively near the abandoned gas station.",
      location: "Route 9 Bypass",
      time: "1 hour ago",
      icon: Skull,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200"
    },
    {
      id: "HZ-4",
      type: "Fire Spread",
      desc: "Brush fire has jumped the highway. Avoid route entirely.",
      location: "I-95 Northbound Marker 14",
      time: "2 hours ago",
      icon: Flame,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Radar className="h-6 w-6 text-rose-500" /> Live Hazard Radar
          </h1>
          <p className="text-slate-500 text-sm mt-1">Crowdsourced danger map to help you navigate safely</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/citizen"
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center"
          >
            Back
          </Link>
          <Link 
            href="/citizen/radar/report"
            className="px-4 py-2 text-sm font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <AlertTriangle className="h-4 w-4" /> Report Hazard
          </Link>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Radar Map Placeholder */}
        <div className="flex-1 bg-slate-100 relative flex items-center justify-center min-h-[400px]">
          {/* Radar Scanner Animation Effect */}
          <div className="absolute inset-0 bg-grid-slate/[0.1] bg-[size:40px_40px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-rose-500/20 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-rose-500/30 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_1s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-rose-500/40 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_2s]" />
          
          {/* User Location Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
            <div className="h-6 w-6 bg-blue-500 rounded-full border-4 border-white shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse" />
            <span className="text-slate-900 text-xs font-bold mt-2 bg-white/80 px-2 py-1 rounded backdrop-blur-sm shadow-sm border border-slate-200">You</span>
          </div>

          {/* Fake Pins */}
          <div className="absolute top-1/4 left-1/3 text-rose-500 flex flex-col items-center animate-bounce">
            <MapPin className="h-8 w-8 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)] fill-rose-500 text-white" />
          </div>
          <div className="absolute bottom-1/3 right-1/4 text-rose-500 flex flex-col items-center">
            <MapPin className="h-8 w-8 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)] fill-rose-500 text-white" />
          </div>

          {/* Map UI Overlay Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button className="h-10 w-10 bg-white hover:bg-slate-50 shadow-sm rounded-lg flex items-center justify-center border border-slate-200 transition-colors">
              <Navigation2 className="h-5 w-5 text-slate-700" />
            </button>
            <button className="h-10 w-10 bg-white hover:bg-slate-50 shadow-sm rounded-lg flex items-center justify-center border border-slate-200 transition-colors">
              <Map className="h-5 w-5 text-slate-700" />
            </button>
          </div>
          
          <div className="absolute top-6 left-6 text-slate-600 text-sm font-medium bg-white/80 shadow-sm px-3 py-1.5 rounded-lg backdrop-blur-md border border-slate-200">
            Map Interface Loading...
          </div>
        </div>

        {/* Hazard List Sidebar */}
        <div className="w-full md:w-[400px] border-l border-slate-200 bg-slate-50 flex flex-col overflow-hidden shrink-0">
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <h2 className="font-bold text-slate-900">Nearby Hazards (4)</h2>
            <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              Live Feed
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {hazards.map((hazard) => (
              <div key={hazard.id} className={`p-4 rounded-xl border bg-white border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border ${hazard.border} ${hazard.bg} ${hazard.color}`}>
                    <hazard.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-slate-900 text-sm">{hazard.type}</h3>
                      <span className="text-[10px] font-bold text-slate-400">{hazard.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2 line-clamp-2">
                      {hazard.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                        <MapPin className="h-3 w-3" /> {hazard.location}
                      </div>
                      <button className="text-xs font-bold text-blue-600 hover:text-blue-700">
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
