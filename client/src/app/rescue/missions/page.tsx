"use client";

import { useState } from "react";
import { Truck, MapPin, Clock, CheckCircle2, Flame, Waves, Users, PawPrint, FileText } from "lucide-react";
import Link from "next/link";

export default function RescueMissionsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  const activeMissions = [
    {
      id: "MSN-8092",
      type: "Flood Evacuation",
      target: "Human Rescue (3 Families)",
      location: "Riverdale Suburbs, Zone 4",
      priority: "CRITICAL",
      time: "Dispatch: 08:30 AM",
      icon: Waves,
      targetIcon: Users,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200"
    },
    {
      id: "MSN-8093",
      type: "Earthquake Rubble",
      target: "Animal Rescue (Shelter Trapped)",
      location: "Downtown SPCA",
      priority: "HIGH",
      time: "Dispatch: 09:15 AM",
      icon: Flame,
      targetIcon: PawPrint,
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
            <Truck className="h-6 w-6 text-blue-600" />
            Active Missions
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track your unit's current dispatch assignments</p>
        </div>
        <Link 
          href="/rescue"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-2">
          <div className="flex gap-2 bg-slate-50 p-1 rounded-xl w-fit">
            <button 
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === "active" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Active Assignments
            </button>
            <button 
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === "completed" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 min-h-[400px]">
          {activeTab === "active" ? (
            <div className="space-y-4">
              {activeMissions.map((mission) => (
                <div key={mission.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                  
                  {/* Left Column: Icon & Priority */}
                  <div className="flex flex-col items-center justify-center gap-3 md:w-32 md:border-r border-slate-100 md:pr-6 shrink-0">
                    <div className={`h-14 w-14 rounded-full flex items-center justify-center ${mission.bg} ${mission.color}`}>
                      <mission.icon className="h-7 w-7" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border tracking-wider ${mission.border} ${mission.color} ${mission.bg}`}>
                      {mission.priority}
                    </span>
                  </div>

                  {/* Middle Column: Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">{mission.id}</span>
                        <h3 className="font-bold text-lg text-slate-900">{mission.type}</h3>
                      </div>
                      <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                        <mission.targetIcon className="h-4 w-4" /> {mission.target}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{mission.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>{mission.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-row md:flex-col gap-2 shrink-0 md:w-36 justify-center">
                    <button className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                      <FileText className="h-4 w-4 text-slate-400" /> Details
                    </button>
                    <button className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm">
                      Complete
                    </button>
                  </div>
                  
                </div>
              ))}
            </div>
          ) : (
            <div>
              {/* Ready for backend: Empty state for completed missions */}
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">No completed missions</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  Missions you complete will appear here for your logs.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
