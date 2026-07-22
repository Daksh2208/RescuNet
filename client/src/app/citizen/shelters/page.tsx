"use client";

import { useState } from "react";
import { MapPin, Search, Home, PawPrint, Navigation, Phone } from "lucide-react";
import Link from "next/link";

export default function SheltersPage() {
  const [filter, setFilter] = useState<"all" | "human" | "animal">("all");

  const shelters = [
    {
      id: 1,
      name: "Downtown Community Center",
      type: "human",
      distance: "0.8 miles",
      capacity: "Available (70% full)",
      address: "123 Main St",
      phone: "555-0192",
      icon: Home,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      id: 2,
      name: "SafePaws Foster Network",
      type: "animal",
      distance: "1.2 miles",
      capacity: "High Capacity (Accepting Dogs/Cats)",
      address: "456 Oak Avenue",
      phone: "555-0811",
      icon: PawPrint,
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    {
      id: 3,
      name: "Westside High School Gymnasium",
      type: "human",
      distance: "2.5 miles",
      capacity: "Available (30% full)",
      address: "789 School Road",
      phone: "555-0222",
      icon: Home,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      id: 4,
      name: "City Veterinary Hospital",
      type: "animal",
      distance: "3.0 miles",
      capacity: "Critical Cases Only",
      address: "321 Pet Lane",
      phone: "555-0999",
      icon: PawPrint,
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ];

  const filteredShelters = shelters.filter(s => filter === "all" || s.type === filter);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Find Shelters & Vets</h1>
          <p className="text-slate-500 text-sm mt-1">Locate nearby safe zones for humans and animals</p>
        </div>
        <Link 
          href="/citizen"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search by zip code or city..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === "all" ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("human")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${filter === "human" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
          >
            <Home className="h-4 w-4" /> Human
          </button>
          <button 
            onClick={() => setFilter("animal")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${filter === "animal" ? "bg-orange-600 text-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
          >
            <PawPrint className="h-4 w-4" /> Animal
          </button>
        </div>
      </div>

      {/* Interactive Map Placeholder */}
      <div className="bg-slate-200 w-full h-64 rounded-2xl border border-slate-300 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-xl shadow-sm text-center z-10 border border-slate-200">
          <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900">Live Map View</h3>
          <p className="text-sm text-slate-500">Mapbox / Google Maps integration goes here</p>
        </div>
      </div>

      {/* Shelter List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredShelters.map((shelter) => (
          <div key={shelter.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${shelter.bg} ${shelter.color}`}>
                  <shelter.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                  {shelter.distance}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{shelter.name}</h3>
              <p className={`text-sm font-medium ${shelter.type === "human" ? "text-blue-600" : "text-orange-600"} mb-3`}>
                {shelter.capacity}
              </p>
              
              <div className="space-y-2 text-sm text-slate-600 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" /> {shelter.address}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" /> {shelter.phone}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" /> Call
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                <Navigation className="h-4 w-4" /> Directions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
