"use client";

import { useState } from "react";
import { Zap, Droplet, Flame, Skull, Camera, MapPin, Send, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ReportHazardPage() {
  const [hazardType, setHazardType] = useState<"flood" | "fire" | "electrical" | "biological" | "">("");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-rose-500" /> Report Hazard
          </h1>
          <p className="text-slate-500 text-sm mt-1">Drop a pin on the crowdsourced danger map</p>
        </div>
        <Link 
          href="/citizen/radar"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3 shadow-sm">
        <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0" />
        <div className="text-sm text-rose-800 leading-relaxed">
          <strong>Stay Safe:</strong> Do not approach the hazard to take a photo. Report from a safe distance. False reporting will result in a ban from the network.
        </div>
      </div>

      <form className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        
        {/* Hazard Type */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">Hazard Category</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => setHazardType("flood")}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                hazardType === "flood" 
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm" 
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <Droplet className="h-6 w-6" />
              <span className="text-xs font-bold">Flood/Water</span>
            </button>
            <button
              type="button"
              onClick={() => setHazardType("electrical")}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                hazardType === "electrical" 
                  ? "border-yellow-500 bg-yellow-50 text-yellow-700 shadow-sm" 
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <Zap className="h-6 w-6" />
              <span className="text-xs font-bold">Electrical/Wire</span>
            </button>
            <button
              type="button"
              onClick={() => setHazardType("fire")}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                hazardType === "fire" 
                  ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm" 
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <Flame className="h-6 w-6" />
              <span className="text-xs font-bold">Fire/Smoke</span>
            </button>
            <button
              type="button"
              onClick={() => setHazardType("biological")}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                hazardType === "biological" 
                  ? "border-red-500 bg-red-50 text-red-700 shadow-sm" 
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <Skull className="h-6 w-6" />
              <span className="text-xs font-bold">Chemical/Animal</span>
            </button>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center justify-between">
            <span>Location</span>
            <button type="button" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Use Current GPS
            </button>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="e.g., Intersection of 4th and Main" 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Description</label>
          <textarea 
            rows={3}
            placeholder="Describe the danger (e.g., Water is moving fast and over 3 feet deep)..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50 resize-none"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Photo Evidence</label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
            <Camera className="h-6 w-6 text-slate-400 mb-2" />
            <p className="text-sm font-medium text-slate-700">Upload Photo of Hazard</p>
            <p className="text-xs text-slate-500 mt-1">Helps other citizens verify the threat level.</p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100">
          <button 
            type="button"
            className={`w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm ${
              hazardType !== "" ? "bg-rose-600 hover:bg-rose-700" : "bg-slate-300 cursor-not-allowed"
            }`}
            disabled={hazardType === ""}
          >
            <Send className="h-5 w-5" />
            Broadcast Hazard to Radar
          </button>
        </div>
      </form>
    </div>
  );
}
