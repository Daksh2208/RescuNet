"use client";

import { ScrollText, Search, Filter, ShieldCheck, Download } from "lucide-react";
import Link from "next/link";

export default function AdminAuditLogPage() {
  const auditLogs = [
    {
      id: "AL-99012",
      timestamp: "2026-09-23 14:32:05",
      admin: "SuperAdmin (USR-001)",
      ipAddress: "192.168.1.104",
      action: "EMERGENCY_BROADCAST_TRIGGERED",
      details: "Broadcasted 'CRITICAL' Tsunami Warning to polygon zone 'Coastal-South'.",
      hash: "8f4e...2b9a"
    },
    {
      id: "AL-99011",
      timestamp: "2026-09-23 13:15:22",
      admin: "Dispatcher (USR-042)",
      ipAddress: "10.0.0.5",
      action: "INCIDENT_VERIFIED",
      details: "Verified INC-5021 and dispatched Rescue Team Alpha.",
      hash: "3c2d...88f1"
    },
    {
      id: "AL-99010",
      timestamp: "2026-09-23 11:45:00",
      admin: "Logistics Chief (USR-019)",
      ipAddress: "192.168.1.109",
      action: "ASSET_REGISTERED",
      details: "Added Fleet Asset: Medical Boat (ID: FLT-88).",
      hash: "1a9c...7e44"
    },
    {
      id: "AL-99009",
      timestamp: "2026-09-23 10:10:15",
      admin: "Moderator (USR-088)",
      ipAddress: "172.16.0.4",
      action: "CITIZEN_BANNED",
      details: "Suspended Citizen USR-224 for repeated false SOS spam.",
      hash: "9b1a...44cc"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ScrollText className="h-6 w-6 text-purple-600" />
            Immutable System Audit Trail
          </h1>
          <p className="text-slate-500 text-sm mt-1">Cryptographically secure ledger of all state-mutating command decisions.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin"
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0 flex items-center justify-center"
          >
            Back to Dashboard
          </Link>
          <button className="bg-purple-600 text-white font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-purple-700 transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <span className="text-sm font-bold text-green-700">Ledger Integrity Verified</span>
          </div>
          <div className="flex gap-2 relative">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search logs by ID, Admin, or Action..." 
                className="w-full sm:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-bold">Event ID</th>
                <th className="px-6 py-3 font-bold">Timestamp (UTC)</th>
                <th className="px-6 py-3 font-bold">Administrator</th>
                <th className="px-6 py-3 font-bold">Action Type</th>
                <th className="px-6 py-3 font-bold">Details</th>
                <th className="px-6 py-3 font-bold">Crypto Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-900">{log.id}</td>
                  <td className="px-6 py-4 text-slate-600">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{log.admin.split(' ')[0]}</span>
                      <span className="text-xs text-slate-500">{log.admin.split(' ')[1]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-bold text-xs border border-purple-100">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 whitespace-normal min-w-[300px]">{log.details}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{log.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
