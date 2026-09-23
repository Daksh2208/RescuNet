"use client";

import { User, ShieldAlert, Bell, LogOut, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage command center settings</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            href="/admin"
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0 flex items-center justify-center"
          >
            Back to Dashboard
          </Link>
          <button className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="h-24 w-24 bg-purple-100 text-purple-700 font-bold text-3xl rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
              AD
            </div>
            <h2 className="text-xl font-bold text-slate-900">System Admin</h2>
            <div className="flex items-center gap-1 mt-1 text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <ShieldAlert className="h-3.5 w-3.5" /> HQ Override Access
            </div>
            
            <div className="w-full mt-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">ID</span>
                <span className="text-sm font-bold text-slate-900 font-mono">ADM-9901</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Role Segment</span>
                <span className="text-sm font-bold text-purple-600">SuperAdmin</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-500">Status</span>
                <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-purple-600" /> Security & Authentication
              </h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Multi-Factor Authentication (MFA)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Mandatory for all Admin roles. Configured via TOTP app.</p>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold border border-green-200">
                  Enabled
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                <div>
                  <p className="text-sm font-bold text-slate-900">Session Timeout</p>
                  <p className="text-xs text-slate-500 mt-0.5">Automatically log out after inactivity to secure command terminal.</p>
                </div>
                <select className="bg-slate-50 border border-slate-200 text-sm font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                  <option>15 Minutes</option>
                  <option>30 Minutes</option>
                  <option>1 Hour</option>
                </select>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-600" /> System Alerts
              </h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Critical Incidents</p>
                  <p className="text-xs text-slate-500 mt-0.5">Force push notifications for high-priority unverified reports.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                <div>
                  <p className="text-sm font-bold text-slate-900">Predictive Depletion Warnings</p>
                  <p className="text-xs text-slate-500 mt-0.5">Alert when AI forecasts shelter supplies running out within 12 hours.</p>
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
