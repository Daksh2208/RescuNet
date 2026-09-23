"use client";

import { useState } from "react";
import { Settings, Plus, Home, Truck, ShieldAlert, X } from "lucide-react";
import Link from "next/link";

export default function AdminResourcesPage() {
  const [activeTab, setActiveTab] = useState<"shelters" | "fleet">("shelters");
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [assetType, setAssetType] = useState("Helicopter");

  return (
    <div className="space-y-6">
      {/* Add New Asset Modal */}
      {isAddingAsset && (
        <div className="fixed top-0 left-0 w-screen h-screen z-[100] flex items-center justify-center p-4 bg-slate-900/60">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Plus className="h-5 w-5 text-purple-600" />
                Add New {activeTab === "shelters" ? "Shelter" : "Fleet Asset"}
              </h2>
              <button 
                onClick={() => setIsAddingAsset(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Name / Identifier</label>
                <input type="text" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder={`e.g., ${activeTab === 'shelters' ? 'Downtown Community Center' : 'Helicopter Alpha-1'}`} />
              </div>
              
              {activeTab === "shelters" ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Max Capacity</label>
                  <input type="number" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="e.g., 500" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Asset Type</label>
                    <select 
                      value={assetType}
                      onChange={(e) => setAssetType(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    >
                      <option value="Helicopter">Helicopter</option>
                      <option value="Medical Boat">Medical Boat</option>
                      <option value="Heavy Extraction Vehicle">Heavy Extraction Vehicle</option>
                      <option value="Drone">Drone</option>
                      <option value="Other">Other (Specify Custom Type)</option>
                    </select>
                  </div>
                  {assetType === "Other" && (
                    <div>
                      <input 
                        type="text" 
                        autoFocus
                        placeholder="Enter custom asset type..." 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                      />
                    </div>
                  )}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Location Coordinates</label>
                <input type="text" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" placeholder="Lat, Lng" />
              </div>

              <button 
                onClick={() => setIsAddingAsset(false)}
                className="w-full mt-4 bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
              >
                Save & Register Asset
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="h-6 w-6 text-purple-600" />
            Master Infrastructure Registry
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage the global database of Shelters and Rescue Fleet equipment</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            href="/admin"
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0 flex items-center justify-center"
          >
            Back to Dashboard
          </Link>
          <button 
            onClick={() => setIsAddingAsset(true)}
            className="bg-purple-600 text-white font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="h-4 w-4" /> Add New Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tab 1: Shelters */}
        <div 
          onClick={() => setActiveTab("shelters")}
          className={`cursor-pointer rounded-2xl p-6 border transition-all ${
            activeTab === "shelters" ? "bg-white border-purple-300 shadow-md ring-2 ring-purple-500/20" : "bg-slate-50 border-slate-200 hover:bg-white"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${activeTab === 'shelters' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-500'}`}>
              <Home className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Shelter Database</h2>
              <p className="text-sm text-slate-500">Manage base capacities and offline status</p>
            </div>
          </div>
        </div>

        {/* Tab 2: Fleet */}
        <div 
          onClick={() => setActiveTab("fleet")}
          className={`cursor-pointer rounded-2xl p-6 border transition-all ${
            activeTab === "fleet" ? "bg-white border-purple-300 shadow-md ring-2 ring-purple-500/20" : "bg-slate-50 border-slate-200 hover:bg-white"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${activeTab === 'fleet' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-500'}`}>
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Rescue Fleet</h2>
              <p className="text-sm text-slate-500">Register new heavy equipment and vehicles</p>
            </div>
          </div>
        </div>

      </div>

      {activeTab === 'shelters' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Active Shelters & Analytics</h3>
          </div>
          <div className="p-6 flex flex-col gap-6">
            {/* Shelter 1 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <Home className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Central High School</h3>
                  <p className="text-xs text-slate-500">450 / 500 Capacity • Human & Animal</p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase tracking-wider">Water</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase tracking-wider">Blankets</span>
                  </div>
                </div>
              </div>
              
              {/* Predictive Analytics Block */}
              <div className="flex-1 md:max-w-xs bg-red-50 border border-red-100 rounded-xl p-3 shrink-0">
                <div className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> AI Depletion Warning
                </div>
                <p className="text-xs text-red-600 font-medium leading-relaxed">
                  At current consumption rates, <span className="font-bold">Water</span> supplies will be completely depleted in <span className="font-bold underline">4 hours</span>. Resupply recommended immediately.
                </p>
              </div>
              
              <button className="text-purple-600 font-bold text-sm bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors shrink-0 h-fit">
                Manage Base
              </button>
            </div>

            {/* Shelter 2 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <Home className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Downtown Community Center</h3>
                  <p className="text-xs text-slate-500">120 / 300 Capacity • Human Only</p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase tracking-wider">First Aid</span>
                  </div>
                </div>
              </div>
              
              {/* Predictive Analytics Block */}
              <div className="flex-1 md:max-w-xs bg-green-50 border border-green-100 rounded-xl p-3 shrink-0">
                <div className="text-xs font-bold text-green-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> Supply Forecast
                </div>
                <p className="text-xs text-green-600 font-medium leading-relaxed">
                  Current supplies are sufficient for the next <span className="font-bold">48+ hours</span> based on current occupancy.
                </p>
              </div>

              <button className="text-purple-600 font-bold text-sm bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors shrink-0 h-fit">
                Manage Base
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fleet' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Active Rescue Fleet</h3>
          </div>
          <div className="p-6 flex flex-col gap-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">FLT-88 Medical Boat</h3>
                  <p className="text-xs text-slate-500">Status: Deployed • Sector 4 Riverdale</p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase tracking-wider">Water Rescue</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 md:max-w-xs bg-emerald-50 border border-emerald-100 rounded-xl p-3 shrink-0">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> Operational Status
                </div>
                <p className="text-xs text-emerald-600 font-medium">
                  Fully operational. Fuel capacity at 75%.
                </p>
              </div>
              <button className="text-purple-600 font-bold text-sm bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors shrink-0 h-fit">
                Manage Asset
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">FLT-92 Heavy Lift Heli</h3>
                  <p className="text-xs text-slate-500">Status: Standby • Base Command</p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase tracking-wider">Air Evac</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 md:max-w-xs bg-slate-50 border border-slate-200 rounded-xl p-3 shrink-0">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> Operational Status
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Awaiting dispatch orders. Maintenance complete.
                </p>
              </div>
              <button className="text-purple-600 font-bold text-sm bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors shrink-0 h-fit">
                Manage Asset
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
