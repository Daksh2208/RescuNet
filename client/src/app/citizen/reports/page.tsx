"use client";

import { getMyReports } from "@/lib/incident";
import { AlertTriangle, Clock, MapPin, CheckCircle2, Search, Filter, PhoneCall, Radio, FileText, ChevronRight, CloudLightning, Mountain, Flame, Waves } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Incident {

  id: string;

  title: string;

  description: string;

  disasterType: string;

  severity: string;

  status: string;

  address: string;

  createdAt: string;

}

export default function ReportsHistoryPage() {

  const [reports, setReports] = useState<Incident[]>([]);

  const [loading, setLoading] = useState(true);
  const getStatusColor = (status: string) => {

    switch (status) {

      case "PENDING":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";

      case "VERIFIED":
        return "text-blue-600 bg-blue-50 border-blue-200";

      case "IN_PROGRESS":
        return "text-orange-600 bg-orange-50 border-orange-200";

      case "RESOLVED":
        return "text-green-600 bg-green-50 border-green-200";

      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }

  };

  const getIncidentIcon = (type: string) => {

    switch (type) {

      case "FLOOD":
        return Waves;

      case "FIRE":
        return Flame;

      case "LANDSLIDE":
        return Mountain;

      case "CYCLONE":
        return CloudLightning;

      default:
        return AlertTriangle;
    }

  };

  const getIconColor = (type: string) => {

    switch (type) {

      case "FLOOD":
        return "bg-blue-100 text-blue-600";

      case "FIRE":
        return "bg-red-100 text-red-600";

      case "EARTHQUAKE":
        return "bg-yellow-100 text-yellow-700";

      case "LANDSLIDE":
        return "bg-orange-100 text-orange-600";

      case "CYCLONE":
        return "bg-purple-100 text-purple-600";

      default:
        return "bg-gray-100 text-gray-600";
    }

  };

  useEffect(() => {

    const fetchReports = async () => {

      try {

        const data = await getMyReports();

        setReports(data.data.data);

      }
      finally {

        setLoading(false);

      }

    };

    fetchReports();

  }, []);

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
          {reports.map((report) => {

            const Icon = getIncidentIcon(report.disasterType);
            const iconColor = getIconColor(report.disasterType);

            return (
              <div key={report.id.slice(0, 8)} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group">

                <div className="flex flex-col md:flex-row gap-4 md:items-start">

                  <div className={`shrink-0 h-12 w-12 rounded-xl flex items-center justify-center ${iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold text-slate-900">{report.id}</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-bold text-slate-700">{report.disasterType}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.status)}`}>
                        {report.status === 'Resolved' && <CheckCircle2 className="h-3.5 w-3.5" />}
                        {report.status === 'Active' && <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />}
                        {report.status === 'Dispatched' && <Clock className="h-3.5 w-3.5" />}
                        {report.status}
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {report.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <MapPin className="h-4 w-4" /> {report.address}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <Clock className="h-4 w-4" /> {
                          new Date(report.createdAt)

                            .toLocaleString()
                        }
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
            );
          })}
        </div>
      </div>

    </div>
  );
}
