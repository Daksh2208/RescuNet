"use client";

import { useState } from "react";
import { Wrench, Shield, Navigation, Settings, Search, CheckCircle2, MapPin } from "lucide-react";
import Link from "next/link";

export default function FleetManagementPage() {
  const [filter, setFilter] = useState<"all" | "deployed" | "maintenance">("all");

  const assets = [
    {
      id: "VEH-104",
      name: "Swift-water Rescue Boat (Zodiac)",
      type: "Aquatic",
      status: "deployed",
      location: "Sector 4 Riverfront",
      assignedTo: "Unit Alpha-1",
      lastService: "Oct 12, 2023",
      icon: Navigation,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200"
    },
    {
      id: "EQP-902",
      name: "Hydraulic Jaws of Life",
      type: "Heavy Tools",
      status: "available",
      location: "HQ Armory",
      assignedTo: "None",
      lastService: "Nov 01, 2023",
      icon: Wrench,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200"
    },
    {
      id: "AER-007",
      name: "Thermal Imaging Drone (DJI)",
      type: "Aerial",
      status: "maintenance",
      location: "Tech Lab",
      assignedTo: "Pending Repair (Propeller)",
      lastService: "N/A",
      icon: Shield,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200"
    }
  ];

  const displayAssets = filter === "all" ? assets : assets.filter(a => a.status === filter);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="h-6 w-6 text-blue-600" />
            Fleet & Equipment
          </h1>
          <p className="text-slate-500 text-sm mt-1">Track and manage specialized rescue assets</p>
        </div>
        <Link 
          href="/rescue"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2 bg-slate-50 p-1 rounded-xl w-fit">
            <button 
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === "all" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              All Assets
            </button>
            <button 
              onClick={() => setFilter("deployed")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === "deployed" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Deployed
            </button>
            <button 
              onClick={() => setFilter("maintenance")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === "maintenance" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Maintenance
            </button>
          </div>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assignment & Location</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center border shrink-0 ${asset.bg} ${asset.color} ${asset.border}`}>
                        <asset.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{asset.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{asset.id} • {asset.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                      asset.status === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      asset.status === 'deployed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Shield className="h-3.5 w-3.5 text-slate-400" /> {asset.assignedTo}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <MapPin className="h-3.5 w-3.5" /> {asset.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-blue-600 font-bold hover:text-blue-800 transition-colors px-2 py-1">Assign</button>
                    <button className="text-slate-500 font-bold hover:text-slate-700 transition-colors px-2 py-1"><Settings className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
