"use client";

import { PawPrint, MapPin, Heart, ArrowRight, Dog, Cat, Info, PhoneCall } from "lucide-react";
import Link from "next/link";

export default function FosterCoordinationPage() {
  const fosterRequests = [
    {
      id: "FST-201",
      animal: "Dog",
      breed: "Golden Retriever Mix",
      name: "Bella",
      desc: "Friendly but anxious after the storm. Needs a quiet temporary home for 1-2 weeks.",
      location: "Sector 3 Animal Shelter",
      icon: Dog,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200"
    },
    {
      id: "FST-202",
      animal: "Cat",
      breed: "Domestic Shorthair",
      name: "Luna & Sol",
      desc: "Bonded pair of indoor cats. Owners evacuated to a non-pet-friendly shelter.",
      location: "Downtown Rescue Hub",
      icon: Cat,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200"
    },
    {
      id: "FST-205",
      animal: "Dog",
      breed: "German Shepherd",
      name: "Max",
      desc: "Large breed, needs a fenced yard. Current shelter is over capacity.",
      location: "Northside Vet Clinic",
      icon: Dog,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-green-600" />
            Foster Coordination
          </h1>
          <p className="text-slate-500 text-sm mt-1">Provide temporary safe havens for displaced pets</p>
        </div>
        <Link 
          href="/volunteer"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl flex items-start gap-3 shadow-sm">
        <Info className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
        <div className="text-sm text-orange-800">
          <strong>Emergency Foster Need:</strong> Local shelters are at 120% capacity due to recent evacuations. Fostering an animal for just 48 hours saves lives and frees up critical space.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fosterRequests.map((req) => (
          <div key={req.id} className={`bg-white rounded-2xl border ${req.border} shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow`}>
            <div className={`p-6 ${req.bg} border-b ${req.border} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm ${req.color}`}>
                  <req.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{req.name}</h3>
                  <p className="text-xs font-semibold text-slate-600">{req.breed}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-4">
              <p className="text-sm text-slate-700 font-medium leading-relaxed flex-1">
                {req.desc}
              </p>
              
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                <span>Currently at: <span className="text-slate-900">{req.location}</span></span>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-3">
                <button className="bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                  <PhoneCall className="h-4 w-4" /> Shelter
                </button>
                <button className="bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                  <Heart className="h-4 w-4" /> Foster
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
