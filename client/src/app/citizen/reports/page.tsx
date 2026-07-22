"use client";

import { AlertTriangle, Clock, MapPin, CheckCircle2, Search, Filter, PhoneCall, Radio, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ReportsHistoryPage() {
  const reports = [
    {
      id: "REP-9281",
      type: "Medical Emergency",
      desc: "Severe allergic reaction, requires epinephrine.",
      location: "420 West Avenue, Apt 3B",
      time: "Oct 14, 2025 - 14:30",
      status: "Resolved",
      statusColor: "text-green-600 bg-green-50 border-green-200",
      icon: PhoneCall,
      iconColor: "text-red-600 bg-red-100",
    },
    {
      id: "REP-9104",
      type: "Flooded Infrastructure",
      desc: "Main bridge on Route 9 is submerged and impassable.",
      location: "Route 9 Bridge over River St.",
      time: "Oct 12, 2025 - 09:15",
      status: "Active",
      statusColor: "text-rose-600 bg-rose-50 border-rose-200",
      icon: AlertTriangle,
      iconColor: "text-blue-600 bg-blue-100",
    },
    {
      id: "REP-8832",
      type: "Trapped Animal",
      desc: "Dog trapped under fallen debris near the old mill.",
      location: "Old Mill Historic Site",
      time: "Sep 28, 2025 - 16:45",
      status: "Dispatched",
      statusColor: "text-orange-600 bg-orange-50 border-orange-200",
      icon: Radio,
      iconColor: "text-orange-600 bg-orange-100",
    },
    {
      id: "REP-8109",
      type: "Fire Hazard",
      desc: "Downed power line sparking near dry brush.",
      location: "Oakwood Park",
      time: "Aug 15, 2025 - 11:20",
      status: "Resolved",
      statusColor: "text-green-600 bg-green-50 border-green-200",
      icon: AlertTriangle,
      iconColor: "text-yellow-600 bg-yellow-100",
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-red-600" /> My Emergency Reports
          </h1>
          <p className="text-slate-500 text-sm mt-1">History and live status of all SOS and hazard reports you have filed.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/citizen"
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center"
          >
            Back
          </Link>
          <Link 
            href="/citizen/report"
            className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <PhoneCall className="h-4 w-4" /> File New Report
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search reports by ID or location..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all text-sm"
          />
        </div>
        <button className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors whitespace-nowrap">
          <Filter className="h-4 w-4" /> Filter Status
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {reports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex flex-col md:flex-row gap-4 md:items-start">
                
                <div className={`shrink-0 h-12 w-12 rounded-xl flex items-center justify-center ${report.iconColor}`}>
                  <report.icon className="h-6 w-6" />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-slate-900">{report.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-bold text-slate-700">{report.type}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${report.statusColor}`}>
                      {report.status === 'Resolved' && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {report.status === 'Active' && <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />}
                      {report.status === 'Dispatched' && <Clock className="h-3.5 w-3.5" />}
                      {report.status}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {report.desc}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <MapPin className="h-4 w-4" /> {report.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Clock className="h-4 w-4" /> {report.time}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-end self-center md:self-stretch">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
