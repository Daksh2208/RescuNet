"use client";

import { useState } from "react";
import { 
  AlertTriangle, 
  MapPin, 
  PhoneCall, 
  ArrowRight,
  Clock,
  CheckCircle2,
  Info,
  Activity,
  ShieldCheck,
  Users,
  HeartHandshake,
  Radar,
  Wifi,
  Lock
} from "lucide-react";
import Link from "next/link";

export default function CitizenDashboard() {
  const [isSafe, setIsSafe] = useState(false);
  const recentReports: any[] = [];

  return (
    <div className="space-y-6">
      {/* Active Alert Banner */}
      <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-600 animate-pulse" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider">
              Active Warning: Flash Flood
            </h3>
            <div className="mt-1 text-sm text-red-700">
              <p>
                Severe flooding reported in your immediate vicinity. Evacuation orders are in effect for zones A and B. Please move to higher ground immediately.
              </p>
            </div>
            <div className="mt-2">
              <button className="text-sm font-medium text-red-800 hover:text-red-900 underline">
                View Safe Routes
              </button>
            </div>
          </div>
        </div>
        
        {/* I'm Safe Check-In */}
        <div className="shrink-0 bg-white p-3 rounded-xl border border-red-100 shadow-sm md:w-64">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Safety Status</p>
          <button 
            onClick={() => setIsSafe(!isSafe)}
            className={`w-full py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              isSafe 
                ? "bg-green-100 text-green-700 border border-green-200" 
                : "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isSafe ? (
              <>
                <CheckCircle2 className="h-5 w-5" /> Marked as Safe
              </>
            ) : (
              <>
                <ShieldCheck className="h-5 w-5" /> I'm Safe (Check-In)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Link 
          href="/citizen/report"
          className="group bg-red-600 rounded-2xl p-6 text-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden xl:col-span-1"
        >
          <div className="absolute -right-4 -top-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
            <PhoneCall className="w-32 h-32" />
          </div>
          <div>
            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-1 leading-tight">Report Human /<br/>Animal Emergency</h2>
          </div>
        </Link>

        <Link 
          href="/citizen/reunification"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-purple-600">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1 leading-tight">Missing Persons<br/>& Pets Board</h2>
            <p className="text-slate-500 text-sm mt-2">Find and reunite families</p>
          </div>
          <div className="flex items-center text-purple-600 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
            View Board <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link 
          href="/citizen/shelters"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600">
              <MapPin className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1 leading-tight">Find Shelters<br/>& Vets</h2>
            <p className="text-slate-500 text-sm mt-2">Locate nearby safe zones</p>
          </div>
          <div className="flex items-center text-blue-600 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
            View Map <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>
        
        <Link 
          href="/citizen/community"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="h-12 w-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 text-orange-600">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1 leading-tight">Community Aid<br/>& Resources</h2>
            <p className="text-slate-500 text-sm mt-2">Share supplies & tools</p>
          </div>
          <div className="flex items-center text-orange-600 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
            View Offers <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>
        
        <Link 
          href="/citizen/radar"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="h-12 w-12 bg-rose-50 rounded-xl flex items-center justify-center mb-4 text-rose-600">
              <Radar className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1 leading-tight">Live Hazard<br/>Radar</h2>
            <p className="text-slate-500 text-sm mt-2">Crowdsourced danger map</p>
          </div>
          <div className="flex items-center text-rose-600 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
            View Radar <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link 
          href="/citizen/guides"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="h-12 w-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 text-teal-600">
              <Info className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1 leading-tight">Multi-Disaster<br/>Safety Guides</h2>
            <p className="text-slate-500 text-sm mt-2">Protocols for Floods, Fires, etc.</p>
          </div>
          <div className="flex items-center text-teal-600 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
            Read Guides <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Map Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Local Area Map</h2>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Tracking
            </span>
          </div>
          <div className="flex-1 bg-slate-100 min-h-[300px] relative flex items-center justify-center">
            {/* Map Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate/[0.1] bg-[size:20px_20px]" />
            <div className="text-center z-10 p-6">
              <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-700">Map Interface Loading...</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                In production, this area will render a dynamic Mapbox or Google Maps interface showing real-time shelter capacity and disaster zones.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Your Reports</h2>
            <Link href="/citizen/reports" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-4">
            {recentReports.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <Info className="h-8 w-8 text-slate-400 mb-2" />
                <h3 className="text-sm font-semibold text-slate-700">No recent reports</h3>
                <p className="text-xs text-slate-500 mt-1">You haven't filed any emergency reports yet.</p>
              </div>
            ) : (
              recentReports.map((report) => (
                <div key={report.id} className={`p-4 rounded-xl border ${report.border} ${report.bg} flex items-start gap-4`}>
                  <div className={`mt-1 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm ${report.color}`}>
                    <report.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {report.type}
                      </p>
                      <span className="text-xs font-medium text-slate-500 shrink-0">
                        {report.time}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2 truncate">
                      {report.location}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Clock className={`h-3.5 w-3.5 ${report.color}`} />
                      <span className={`text-xs font-semibold ${report.color}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            <button className="w-full py-3 mt-auto rounded-xl border border-dashed border-slate-300 text-slate-500 font-medium hover:border-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              File New Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


