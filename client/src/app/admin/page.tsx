"use client";

import { 
  ShieldAlert, 
  MapPin, 
  ArrowRight,
  Activity,
  Users,
  PawPrint,
  Radio,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const systemStats = [
    { label: "Active Human Rescues", value: "24", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Animal Rescues", value: "18", icon: PawPrint, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Deployed Units", value: "12", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Verification", value: "5", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  ];

  const pendingIncidents = [
    {
      id: "INC-9921",
      type: "Mass Evacuation",
      target: "Human & Animal (Flood Zone C)",
      reporter: "Citizen App",
      time: "2 mins ago",
      priority: "CRITICAL"
    },
    {
      id: "INC-9922",
      type: "Structure Collapse",
      target: "Human Rescue",
      reporter: "Rescue Team Alpha",
      time: "15 mins ago",
      priority: "HIGH"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Global Status Banner */}
      <div className="bg-purple-900 border-l-4 border-purple-400 p-4 rounded-r-xl shadow-md text-white">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Radio className="h-6 w-6 text-purple-300 animate-pulse" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-100">
              System Command Status: Multi-Disaster Active
            </h3>
            <div className="mt-1 text-sm text-purple-200">
              <p>
                Currently managing 3 concurrent disaster zones (Flood, Earthquake, Wildfire). AI priority routing is active for both human extraction and animal shelter logistics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h4 className="text-2xl font-bold text-slate-900">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/admin/verify"
          className="group bg-purple-600 rounded-2xl p-6 text-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <CheckCircle2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">Verify Incidents</h2>
              <p className="text-purple-200 text-sm">Review AI-flagged reports before dispatch</p>
            </div>
          </div>
          <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link 
          href="/admin/broadcast"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Emergency Broadcast</h2>
              <p className="text-slate-500 text-sm">Push SMS & App alerts to affected zones</p>
            </div>
          </div>
          <ArrowRight className="h-6 w-6 text-red-600 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Pending Verification Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Pending Verification</h2>
          <Link href="/admin/verify" className="text-sm font-medium text-purple-600 hover:text-purple-700">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Incident ID</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Target</th>
                <th className="px-6 py-3 font-medium">Reporter</th>
                <th className="px-6 py-3 font-medium">Time</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{incident.id}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 font-medium text-xs border border-red-100">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {incident.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{incident.target}</td>
                  <td className="px-6 py-4 text-slate-600">{incident.reporter}</td>
                  <td className="px-6 py-4 text-slate-500">{incident.time}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-purple-600 hover:text-purple-800 font-medium bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors">
                      Review
                    </button>
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
