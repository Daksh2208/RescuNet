"use client";

import { useState } from "react";
import { AlertTriangle, MapPin, Camera, Send, PawPrint, Users } from "lucide-react";
import Link from "next/link";

export default function ReportEmergencyPage() {
  const [target, setTarget] = useState<"human" | "animal" | "both">("human");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Report Emergency</h1>
          <p className="text-slate-500 text-sm mt-1">Submit an immediate SOS for rescue teams</p>
        </div>
        <Link 
          href="/citizen"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
        <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" />
        <div className="text-sm text-red-800">
          <strong>Warning:</strong> False reporting during a disaster is a punishable offense. Only use this form if human or animal lives are in immediate danger.
        </div>
      </div>

      <form className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        
        {/* Target Selection */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">Who needs rescue?</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTarget("human")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                target === "human" 
                  ? "border-blue-600 bg-blue-50 text-blue-700" 
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm font-medium">Human</span>
            </button>
            <button
              type="button"
              onClick={() => setTarget("animal")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                target === "animal" 
                  ? "border-orange-600 bg-orange-50 text-orange-700" 
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <PawPrint className="h-6 w-6" />
              <span className="text-sm font-medium">Animal</span>
            </button>
            <button
              type="button"
              onClick={() => setTarget("both")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                target === "both" 
                  ? "border-purple-600 bg-purple-50 text-purple-700" 
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <div className="flex gap-1">
                <Users className="h-6 w-6" />
                <PawPrint className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Both</span>
            </button>
          </div>
        </div>

        {/* Disaster Type */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Disaster Type</label>
          <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-slate-50">
            <option value="">Select Disaster Type...</option>
            <option value="flood">Flood / Water Logging</option>
            <option value="earthquake">Earthquake / Structural Collapse</option>
            <option value="fire">Fire / Smoke</option>
            <option value="landslide">Landslide / Mudslide</option>
            <option value="cyclone">Cyclone / Severe Storm</option>
            <option value="other">Other Medical Emergency</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Exact Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Searching for GPS signal..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-slate-50"
            />
            <button type="button" className="absolute inset-y-0 right-2 flex items-center px-3 text-sm font-medium text-blue-600 hover:text-blue-700">
              Use GPS
            </button>
          </div>
        </div>

        {/* Additional Details */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Situation Description</label>
          <textarea 
            rows={4}
            placeholder="Describe the number of people/animals, injuries, and specific hazards..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-slate-50 resize-none"
          ></textarea>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Upload Photo (Optional)</label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
            <Camera className="h-8 w-8 text-slate-400 mb-3" />
            <p className="text-sm font-medium text-slate-700">Tap to upload a photo</p>
            <p className="text-xs text-slate-500 mt-1">Helps rescue teams assess the situation</p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100">
          <button 
            type="button"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Send className="h-5 w-5" />
            Send SOS Request
          </button>
        </div>
      </form>
    </div>
  );
}
