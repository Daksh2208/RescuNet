"use client";

import { useState } from "react";
import { Search, MapPin, Users, PawPrint, Camera, MessageSquare, Filter, Plus } from "lucide-react";
import Link from "next/link";

export default function ReunificationBoard() {
  const [activeTab, setActiveTab] = useState<"humans" | "pets">("humans");

  const humanPostings = [
    {
      id: "H-492",
      name: "Sarah Jenkins",
      age: "8",
      lastSeen: "Downtown Community Center (Flood Zone)",
      time: "2 hours ago",
      status: "Missing",
      reporter: "Michael Jenkins",
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200"
    },
    {
      id: "H-493",
      name: "Arthur Pendelton",
      age: "72",
      lastSeen: "Evacuation Bus 4A",
      time: "5 hours ago",
      status: "Found Safe",
      reporter: "Shelter B Staff",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200"
    }
  ];

  const petPostings = [
    {
      id: "P-102",
      name: "Bella (Golden Retriever)",
      age: "Adult",
      lastSeen: "Oak Street / 4th Ave (Earthquake Zone)",
      time: "30 mins ago",
      status: "Missing",
      reporter: "Jessica R.",
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200"
    },
    {
      id: "P-103",
      name: "Unknown Calico Cat",
      age: "Kitten",
      lastSeen: "Rescued near flooded subway",
      time: "1 hour ago",
      status: "Found (At Shelter)",
      reporter: "Rescue Team Alpha",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200"
    }
  ];

  const postings = activeTab === "humans" ? humanPostings : petPostings;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Missing Persons & Pets Board</h1>
          <p className="text-slate-500 text-sm mt-1">Community ledger for family reunification</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/citizen"
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center"
          >
            Back
          </Link>
          <Link 
            href="/citizen/reunification/report"
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Report Missing
          </Link>
        </div>
      </div>

      <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-xl shadow-sm text-purple-900 text-sm">
        <strong>Important:</strong> If you spot someone from this board at a shelter, use the "I Found Them" button to instantly alert the original poster.
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("humans")}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "humans" 
                ? "bg-purple-50 text-purple-700 border-b-2 border-purple-600" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <Users className="h-5 w-5" /> Missing People
          </button>
          <button
            onClick={() => setActiveTab("pets")}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "pets" 
                ? "bg-orange-50 text-orange-700 border-b-2 border-orange-600" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <PawPrint className="h-5 w-5" /> Lost & Found Pets
          </button>
        </div>

        {/* Search & Filter */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder={`Search by name, physical description, or last known location...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm text-sm"
            />
          </div>
          <button className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm shrink-0">
            <Filter className="h-4 w-4" /> Filter By Zone
          </button>
        </div>

        {/* Feed */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {postings.map((post) => (
              <div key={post.id} className={`p-5 rounded-xl border ${post.border} ${post.bg} flex flex-col gap-4 relative overflow-hidden`}>
                
                {post.status.includes("Found") && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
                    {post.status}
                  </div>
                )}

                <div className="flex gap-4">
                  <div className="h-20 w-20 bg-slate-200 rounded-lg flex items-center justify-center shrink-0 border border-white shadow-sm overflow-hidden">
                    <Camera className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{post.name}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Age/Desc: {post.age}</p>
                    <p className="text-xs font-semibold text-slate-400 mt-2 flex items-center gap-1">
                      Posted by {post.reporter} • {post.time}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 mt-2">
                  <div className="flex items-start gap-2 text-sm text-slate-700 bg-white p-2.5 rounded-lg border border-white/50 shadow-sm">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong>Last Seen:</strong> {post.lastSeen}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/50 flex gap-3 mt-auto">
                  <button className="flex-1 bg-white border border-slate-200 text-slate-700 font-medium py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Message
                  </button>
                  {!post.status.includes("Found") && (
                    <button className={`flex-1 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm ${activeTab === 'humans' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
                      I Found Them
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
