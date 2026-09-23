"use client";
import { useState } from "react";
import { Users, Search, ShieldCheck, Ban, Clock } from "lucide-react";
import Link from "next/link";

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "citizens">("pending");

  const pendingUsers = [
    { id: "USR-991", name: "David Chen", role: "RESCUE", date: "Sep 19, 2026", status: "PENDING VERIFICATION" },
    { id: "USR-992", name: "Sarah Jenkins", role: "VOLUNTEER", date: "Sep 19, 2026", status: "PENDING VERIFICATION" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            User Management & Verification
          </h1>
          <p className="text-slate-500 text-sm mt-1">Approve Rescue Teams and Volunteer roles, or moderate Citizen access</p>
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
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-purple-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Pending Verification ({pendingUsers.length})
            </button>
            <button 
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-white text-purple-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Active Personnel
            </button>
            <button 
              onClick={() => setActiveTab("citizens")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'citizens' ? 'bg-white text-purple-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Citizens (Moderation)
            </button>
          </div>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search user ID or name..." 
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {activeTab === "pending" && pendingUsers.map((user) => (
            <div key={user.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shrink-0">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-lg">{user.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      user.role === 'RESCUE' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      Requested: {user.role}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 font-medium">
                    <span>ID: {user.id}</span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {user.date}</span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-purple-600 underline cursor-pointer">
                    View Uploaded Credentials (ID/Cert)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors rounded-xl text-sm font-bold flex items-center gap-2 border border-slate-200">
                  <Ban className="h-4 w-4" /> Reject
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
                  <ShieldCheck className="h-4 w-4" /> Approve Role
                </button>
              </div>
            </div>
          ))}
          
          {activeTab === "active" && (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-4 py-3 font-bold">Personnel ID</th>
                      <th className="px-4 py-3 font-bold">Name</th>
                      <th className="px-4 py-3 font-bold">Role</th>
                      <th className="px-4 py-3 font-bold">Status</th>
                      <th className="px-4 py-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4 font-mono font-medium text-slate-900">RSC-Alpha1</td>
                      <td className="px-4 py-4 font-bold text-slate-700">Sarah Jenkins</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] uppercase tracking-wider border border-blue-200">
                          Rescue Team
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                          <div className="h-2 w-2 rounded-full bg-emerald-500"></div> Deployed
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors">Manage</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4 font-mono font-medium text-slate-900">VOL-7882</td>
                      <td className="px-4 py-4 font-bold text-slate-700">Michael Chen</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold text-[10px] uppercase tracking-wider border border-green-200">
                          Volunteer
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <div className="h-2 w-2 rounded-full bg-slate-300"></div> Offline
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors">Manage</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4 font-mono font-medium text-slate-900">RSC-Bravo2</td>
                      <td className="px-4 py-4 font-bold text-slate-700">David Miller</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] uppercase tracking-wider border border-blue-200">
                          Rescue Team
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                          <div className="h-2 w-2 rounded-full bg-amber-500"></div> Standby
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors">Manage</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === "citizens" && (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6">
                <h3 className="font-bold text-red-800 text-sm mb-1">Citizen Moderation</h3>
                <p className="text-red-600 text-xs">Ban or suspend citizen accounts that submit false SOS calls or spam Community Aid requests.</p>
              </div>
              <div className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-200 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200 shrink-0">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">John Doe (USR-224)</h3>
                    <p className="text-xs text-slate-500">Flagged for: 3 Fake Flood SOS Reports</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
                  <Ban className="h-4 w-4" /> Ban Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function User({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
