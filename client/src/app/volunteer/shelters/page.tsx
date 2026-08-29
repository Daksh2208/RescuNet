"use client";

import { Home, MapPin, Navigation2, Users, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function VolunteerSheltersPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const shelters = [
    {
      id: "SH-01",
      name: "Central High School Gym",
      type: "Human",
      capacity: 500,
      occupied: 420,
      needs: ["Water", "Blankets", "First Aid"],
      distance: "2.1 miles away",
      status: "AT CAPACITY",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200"
    },
    {
      id: "SH-02",
      name: "Community Center South",
      type: "Human & Pet",
      capacity: 300,
      occupied: 150,
      needs: ["Dog Food", "Volunteers (Logistics)"],
      distance: "4.5 miles away",
      status: "OPEN",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200"
    },
    {
      id: "SH-03",
      name: "Sector 3 Animal Rescue",
      type: "Animal Only",
      capacity: 100,
      occupied: 95,
      needs: ["Crates", "Veterinary Techs"],
      distance: "5.0 miles away",
      status: "NEAR CAPACITY",
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Home className="h-6 w-6 text-green-600" />
            Shelter Needs
          </h1>
          <p className="text-slate-500 text-sm mt-1">Locate nearby shelters and view their current supply/volunteer needs</p>
        </div>
        <Link 
          href="/volunteer"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Col: Map Placeholder */}
        <div className="lg:w-2/3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 relative">
            <h2 className="text-sm font-bold text-slate-900">Live Shelter Map</h2>
            <div className="flex gap-2">
              <button className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                <Navigation2 className="h-4 w-4 text-blue-600" />
              </button>
            </div>
          </div>
          <div className="flex-1 bg-slate-100 relative flex items-center justify-center">
             <div className="absolute inset-0 bg-grid-slate/[0.1] bg-[size:20px_20px]" />
             <div className="text-center z-10 p-6">
               <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-3" />
               <h3 className="text-lg font-semibold text-slate-700">Map Interface Loading...</h3>
               <p className="text-sm text-slate-500 mt-1 max-w-sm">
                 In production, this renders interactive map markers showing shelter capacity and needs.
               </p>
             </div>
          </div>
        </div>

        {/* Right Col: Shelter List */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <div className="flex gap-2 pb-2 overflow-x-auto">
            {["all", "human", "pet"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-slate-800 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {filter === "all" ? "All Shelters" : filter === "human" ? "Human" : "Animal"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {shelters.map((shelter) => (
              <div key={shelter.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${shelter.bg.replace('bg-', 'bg-').replace('50', '500')}`} />
                
                <div className="flex items-start justify-between mb-3 pl-2">
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight pr-2">{shelter.name}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{shelter.type} • {shelter.distance}</p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-md border ${shelter.border} ${shelter.bg} ${shelter.color} text-center`}>
                    {shelter.status}
                  </span>
                </div>

                <div className="pl-2 mb-4">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Capacity</span>
                    <span>{shelter.occupied} / {shelter.capacity}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full ${
                        shelter.capacity > 0 
                          ? (shelter.occupied / shelter.capacity > 0.9 ? 'bg-red-500' : shelter.occupied / shelter.capacity > 0.7 ? 'bg-orange-500' : 'bg-green-500') 
                          : 'bg-slate-300'
                      }`}
                      style={{ width: `${shelter.capacity > 0 ? (shelter.occupied / shelter.capacity) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="pl-2 space-y-2">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Current Needs:</p>
                  <div className="flex flex-wrap gap-2">
                    {shelter.needs.map((need, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 rounded-md text-[10px] font-semibold">
                        {need}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pl-2 mt-4 pt-4 border-t border-slate-100">
                  <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 rounded-xl text-sm transition-colors border border-slate-200">
                    Navigate & Assist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
