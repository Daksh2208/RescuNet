"use client";

import { HeartHandshake, Package, Truck, AlertTriangle, ArrowRight, CheckCircle2, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function VolunteerTasksPage() {
  const [activeTab, setActiveTab] = useState<"available" | "my-tasks">("available");

  const availableTasks = [
    {
      id: "TSK-102",
      type: "Supply Delivery",
      desc: "Transport 50 Blankets to Flood Shelter B. Vehicle required.",
      priority: "HIGH",
      location: "Central Warehouse -> Shelter B",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      time: "2 hrs ago"
    },
    {
      id: "TSK-105",
      type: "Debris Clearing",
      desc: "Assist clearing fallen trees on Main St. Tools provided.",
      priority: "MEDIUM",
      location: "Main St. & 5th Ave",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      time: "4 hrs ago"
    },
    {
      id: "TSK-108",
      type: "Medical Transport",
      desc: "Drive non-critical patients from Sector 4 to General Hospital.",
      priority: "CRITICAL",
      location: "Sector 4 Clinic",
      icon: Truck,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      time: "30 mins ago"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-green-600" />
            Relief Tasks
          </h1>
          <p className="text-slate-500 text-sm mt-1">Claim and manage your volunteer assignments</p>
        </div>
        <Link 
          href="/volunteer"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 flex overflow-x-auto">
          <button 
            onClick={() => setActiveTab("available")}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === "available" 
                ? "border-green-600 text-green-700" 
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Available Tasks ({availableTasks.length})
          </button>
          <button 
            onClick={() => setActiveTab("my-tasks")}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === "my-tasks" 
                ? "border-green-600 text-green-700" 
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            My Claimed Tasks (0)
          </button>
        </div>

        <div className="p-6">
          {activeTab === "available" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableTasks.map((task) => (
                <div key={task.id} className={`p-5 rounded-2xl border ${task.border} ${task.bg} flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm ${task.color}`}>
                        <task.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 leading-tight">{task.type}</h3>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">{task.id}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <span className={`inline-flex text-[10px] font-bold px-2 py-1 bg-white rounded-md border ${task.border} ${task.color} uppercase tracking-wider`}>
                      {task.priority} PRIORITY
                    </span>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      {task.desc}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white/50 p-2 rounded-lg">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">{task.location}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/50 flex gap-3 mt-auto items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {task.time}
                    </span>
                    <button className="bg-green-600 text-white font-bold py-2 px-4 rounded-xl text-sm hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2">
                      Claim <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {/* Ready for backend: When myTasks.length === 0, show this empty state. Otherwise map over myTasks. */}
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">No active tasks</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  You haven't claimed any tasks yet. Browse the available tasks to start helping the community.
                </p>
                <button 
                  onClick={() => setActiveTab("available")}
                  className="mt-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-xl text-sm transition-colors"
                >
                  View Available Tasks
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
