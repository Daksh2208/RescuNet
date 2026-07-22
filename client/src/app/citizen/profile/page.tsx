"use client";

import { User, Phone, Mail, MapPin, Bell, Shield, LogOut, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account and preferences</p>
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
            <h2 className="text-xl font-bold text-slate-900">Citizen User</h2>
            <div className="flex items-center gap-1 mt-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" /> Account Verified
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">Contact Info</h3>
            
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Phone</p>
                <p className="text-sm font-medium text-slate-900">+1 (555) 019-2023</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Email</p>
                <p className="text-sm font-medium text-slate-900">citizen@example.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Default Location</p>
                <p className="text-sm font-medium text-slate-900">123 Safe Haven Rd, Sector 4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-slate-400" /> Notification Preferences
              </h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">SMS Emergency Alerts</p>
                  <p className="text-xs text-slate-500 mt-0.5">Receive text messages for multi-disaster warnings in your area.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Animal Foster Requests</p>
                  <p className="text-xs text-slate-500 mt-0.5">Notify me when animal shelters nearby need emergency foster homes.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Push Notifications</p>
                  <p className="text-xs text-slate-500 mt-0.5">Receive in-app alerts for evacuation routes and safety updates.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-slate-400" /> Privacy & Security
              </h3>
            </div>
            <div className="p-6">
              <button className="w-full text-left px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors mb-3">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Manage Location Sharing Settings
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
