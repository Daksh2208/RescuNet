"use client";

import { useState } from "react";
import { CheckSquare, Search, AlertTriangle, ShieldCheck, XCircle, MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AdminVerifyIncidentsPage() {
  const [activeTab, setActiveTab] = useState<"unverified" | "verified">("unverified");

  const incidents = [
    {
      id: "INC-5021",
      title: "Trapped under collapsed roof",
      description: "My neighbor is stuck under their porch roof. Needs immediate extraction.",
      severity: "CRITICAL",
      type: "EARTHQUAKE",
      location: "Sector 4, Elm Street",
      reporter: "Citizen (USR-821)",
      aiConfidence: 94
    },
    {
      id: "INC-5022",
      title: "Need food supplies",
      description: "We are out of water and food for 3 days.",
      severity: "LOW",
      type: "FLOOD",
      location: "Riverdale High School",
      reporter: "Citizen (USR-334)",
      aiConfidence: 45
    }
  ];

  const verifiedIncidents = [
    {
      id: "INC-5010",
      title: "Major road blockage",
      description: "Fallen trees completely blocking I-95 south bound.",
      severity: "HIGH",
      type: "WILDFIRE",
      location: "I-95 South, Mile 42",
      reporter: "Rescue Team Delta",
      dispatchedAt: "10:45 AM"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-purple-600" />
            Global Incident Moderation
          </h1>
          <p className="text-slate-500 text-sm mt-1">Review and verify Citizen SOS reports before dispatching Rescue Teams</p>
        </div>
        <Link 
          href="/admin"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0 flex items-center justify-center"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50">
          <div className="flex gap-2 p-1 rounded-xl w-fit">
            <button 
              onClick={() => setActiveTab("unverified")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'unverified' ? 'bg-white text-purple-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Unverified Queue ({incidents.length})
            </button>
            <button 
              onClick={() => setActiveTab("verified")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'verified' ? 'bg-white text-purple-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Verified (Dispatched)
            </button>
          </div>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search incidents..." 
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {activeTab === "unverified" && incidents.map((incident) => (
            <div key={incident.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                    {incident.id}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                    incident.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {incident.severity}
                  </span>
                  <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-md uppercase tracking-wider">
                    {incident.type}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{incident.title}</h3>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">{incident.description}</p>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" /> {incident.location}
                  </span>
                  <span>Reported by: {incident.reporter}</span>
                </div>
              </div>

              <div className="w-full md:w-64 shrink-0 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center mb-1">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">AI Spam Confidence</div>
                  <div className={`text-lg font-black ${incident.aiConfidence > 80 ? 'text-green-600' : 'text-orange-600'}`}>
                    {incident.aiConfidence}% Legitimate
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm">
                  <ShieldCheck className="h-4 w-4" /> Verify & Dispatch
                </button>
                <button className="w-full px-4 py-2 bg-white text-red-600 hover:bg-red-50 transition-colors rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-red-200 shadow-sm">
                  <XCircle className="h-4 w-4" /> Reject (Spam)
                </button>
              </div>
            </div>
          ))}

          {activeTab === "verified" && verifiedIncidents.map((incident) => (
            <div key={incident.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row items-center justify-between gap-6 opacity-75">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                    {incident.id}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider bg-orange-100 text-orange-700`}>
                    {incident.severity}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{incident.title}</h3>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">{incident.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-green-600 mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-bold">Dispatched</span>
                  </div>
                  <p className="text-xs text-slate-500">at {incident.dispatchedAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
