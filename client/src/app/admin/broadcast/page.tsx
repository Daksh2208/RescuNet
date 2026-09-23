"use client";

import { Radio, Send, AlertTriangle, Users } from "lucide-react";
import Link from "next/link";

export default function AdminBroadcastPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Radio className="h-6 w-6 text-purple-600" />
            Emergency Broadcast System
          </h1>
          <p className="text-slate-500 text-sm mt-1">Push mass notifications to all Citizens, Volunteers, and Rescue Teams</p>
        </div>
        <Link 
          href="/admin"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0 flex items-center justify-center"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-red-100 bg-red-50 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h2 className="font-bold text-red-900">WARNING: THIS IS A LIVE PRODUCTION SYSTEM</h2>
        </div>
        
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Target Audience</label>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" className="accent-purple-600" defaultChecked />
                <span className="text-sm font-bold text-slate-700">All Citizens</span>
              </label>
              <label className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" className="accent-purple-600" defaultChecked />
                <span className="text-sm font-bold text-slate-700">All Volunteers</span>
              </label>
              <label className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" className="accent-purple-600" defaultChecked />
                <span className="text-sm font-bold text-slate-700">Rescue Teams</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Target Geography (Geofencing)</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <select className="w-full sm:w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 appearance-none">
                <option value="GLOBAL">Global (All Regions)</option>
                <option value="CUSTOM_POLYGON">Custom Polygon (Draw on Map)</option>
                <option value="SECTOR_1">Sector 1 (North)</option>
                <option value="SECTOR_2">Sector 2 (South)</option>
              </select>
              <button className="w-full sm:w-1/2 bg-white border border-slate-200 text-purple-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm text-sm">
                Open Polygon Drawing Tool
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Severity Level</label>
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 appearance-none">
              <option value="CRITICAL">CRITICAL (Red Banner + Push Notification)</option>
              <option value="WARNING">WARNING (Yellow Banner)</option>
              <option value="INFO">INFORMATION (Standard Notification)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Broadcast Message</label>
            <textarea 
              rows={4} 
              placeholder="e.g., TSUNAMI WARNING: All sectors must evacuate to high ground immediately. Do not wait for further instructions." 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none font-medium"
            ></textarea>
            <p className="text-xs text-slate-500 mt-2 text-right">0 / 250 characters</p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-sm text-lg">
              <Send className="h-5 w-5" /> BROADCAST NOW
            </button>
            <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
              <Users className="h-3.5 w-3.5" /> This will instantly alert approximately 12,400 active users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
