"use client";

import { User, ShieldAlert, Bell, LogOut, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage command center settings</p>
        </div>
        <button className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="h-24 w-24 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <User className="h-12 w-12" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">System Admin</h2>
            <div className="flex items-center gap-1 mt-1 text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldAlert className="h-3.5 w-3.5" /> Full Access
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-slate-400" /> System Alerts
              </h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Critical Incidents</p>
                  <p className="text-xs text-slate-500 mt-0.5">Push notifications for high-priority unverified reports.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
