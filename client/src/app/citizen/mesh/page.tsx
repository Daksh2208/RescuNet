"use client";

import { useState } from "react";
import { Wifi, Radio, Smartphone, Activity, AlertTriangle, ShieldCheck, Power, Settings2 } from "lucide-react";
import Link from "next/link";

export default function MeshNetworkPage() {
  const [meshEnabled, setMeshEnabled] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Wifi className="h-6 w-6 text-slate-900" /> Offline Mesh Network
          </h1>
          <p className="text-slate-500 text-sm mt-1">Peer-to-peer emergency communication without cell service</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/citizen"
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Control Panel */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative text-slate-900">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between z-10">
            <div>
              <h2 className="text-lg font-bold">Mesh Transceiver</h2>
              <p className="text-slate-500 text-sm">Status: {meshEnabled ? <span className="text-green-600 font-semibold">Broadcasting</span> : <span className="text-slate-400">Offline</span>}</p>
            </div>
            <button 
              onClick={() => setMeshEnabled(!meshEnabled)}
              className={`h-14 w-24 rounded-full p-2 transition-all flex items-center relative ${
                meshEnabled ? "bg-green-500" : "bg-slate-200"
              }`}
            >
              <div className={`h-10 w-10 bg-white rounded-full shadow-sm flex items-center justify-center transition-all absolute ${
                meshEnabled ? "right-2" : "left-2"
              }`}>
                <Power className={`h-5 w-5 ${meshEnabled ? "text-green-500" : "text-slate-400"}`} />
              </div>
            </button>
          </div>

          <div className="flex-1 min-h-[300px] relative flex items-center justify-center overflow-hidden p-8 bg-slate-50">
            
            {!meshEnabled ? (
              <div className="text-center z-10 space-y-3">
                <Radio className="h-16 w-16 text-slate-400 mx-auto" />
                <h3 className="text-xl font-bold text-slate-700">Mesh Network Disabled</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Enable the transceiver to connect to nearby citizen devices via Bluetooth and Wi-Fi Direct.
                </p>
              </div>
            ) : (
              <>
                {/* Active Radar Nodes */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[400px] h-[400px] border border-green-500/20 rounded-full animate-ping absolute" />
                  <div className="w-[200px] h-[200px] border border-green-500/30 rounded-full animate-pulse absolute" />
                </div>
                
                {/* Center Node (You) */}
                <div className="z-10 flex flex-col items-center">
                  <div className="h-16 w-16 bg-white rounded-full border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)] flex items-center justify-center relative">
                    <Smartphone className="h-8 w-8 text-green-500" />
                    <span className="absolute -bottom-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">YOU</span>
                  </div>
                </div>

                {/* Nearby Nodes */}
                <div className="absolute top-1/4 left-1/4 flex flex-col items-center group cursor-pointer">
                  <div className="h-10 w-10 bg-white rounded-full border border-blue-500 shadow-sm flex items-center justify-center relative">
                    <Smartphone className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 mt-1">Node 14A</span>
                </div>

                <div className="absolute bottom-1/4 right-1/3 flex flex-col items-center group cursor-pointer">
                  <div className="h-10 w-10 bg-white rounded-full border border-blue-500 shadow-sm flex items-center justify-center relative">
                    <Smartphone className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 mt-1">Node 92B</span>
                </div>

                <div className="absolute top-1/3 right-1/4 flex flex-col items-center group cursor-pointer">
                  <div className="h-10 w-10 bg-white rounded-full border border-purple-500 shadow-sm flex items-center justify-center relative">
                    <Radio className="h-5 w-5 text-purple-500" />
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 mt-1">Rescue Relay</span>
                </div>

                {/* Network Lines */}
                <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-30" style={{ zIndex: 1 }}>
                  <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="50%" y1="50%" x2="66%" y2="75%" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="50%" y1="50%" x2="75%" y2="33%" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              </>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-blue-600" /> Network Stats
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500 font-medium">Nodes Connected</span>
                  <span className="font-bold text-slate-900">{meshEnabled ? "3" : "0"}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-1000 ${meshEnabled ? "w-[15%] bg-blue-500" : "w-0"}`}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500 font-medium">Messages Relayed</span>
                  <span className="font-bold text-slate-900">{meshEnabled ? "142" : "0"}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-1000 ${meshEnabled ? "w-[45%] bg-purple-500" : "w-0"}`}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Settings2 className="h-5 w-5 text-slate-600" /> Technologies
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${meshEnabled ? "bg-green-500" : "bg-slate-300"}`} />
                  <span className="text-sm font-bold text-slate-700">Bluetooth LE</span>
                </div>
                <span className="text-xs text-slate-500">Short range</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${meshEnabled ? "bg-green-500" : "bg-slate-300"}`} />
                  <span className="text-sm font-bold text-slate-700">Wi-Fi Direct</span>
                </div>
                <span className="text-xs text-slate-500">Long range</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>Secure & Anonymous:</strong> The mesh network encrypts all emergency SOS beacons. Your exact location is only shared with official rescue nodes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
