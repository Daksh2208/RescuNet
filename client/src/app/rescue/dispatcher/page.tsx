"use client";

import { useState } from "react";
import { Users, Plus, Send, AlertCircle, Package, Truck } from "lucide-react";
import Link from "next/link";

export default function VolunteerDispatcherPage() {
  const [tasks, setTasks] = useState([
    {
      id: "VT-104",
      title: "Deliver 50 Blankets",
      location: "Shelter A, Sector 2",
      priority: "MEDIUM",
      status: "CLAIMED",
      claimedBy: "Vol-892"
    },
    {
      id: "VT-105",
      title: "Clear debris from South Road",
      location: "South Road, Sector 4",
      priority: "HIGH",
      status: "OPEN",
      claimedBy: null
    }
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Volunteer Task Dispatcher
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create and broadcast operational tasks to the civilian volunteer network</p>
        </div>
        <Link 
          href="/rescue"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create Task Form (Left) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-blue-50/50">
              <h2 className="font-bold text-blue-900 flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" /> Create New Task
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Task Title</label>
                <input type="text" placeholder="e.g. Transport Medical Kits" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Location</label>
                <input type="text" placeholder="e.g. Central High School" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category</label>
                  <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none">
                    <option>Logistics</option>
                    <option>Medical</option>
                    <option>Cleanup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Priority</label>
                  <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none">
                    <option>LOW</option>
                    <option>MEDIUM</option>
                    <option>HIGH</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description / Instructions</label>
                <textarea rows={3} placeholder="Detailed instructions for the volunteer..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"></textarea>
              </div>
              
              <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm">
                <Send className="h-4 w-4" /> Broadcast Task
              </button>
            </div>
          </div>
        </div>

        {/* Task Board (Right) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Broadcasted Tasks</h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                {tasks.length} Total
              </span>
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              
              {tasks.map((task) => (
                <div key={task.id} className="p-5 border border-slate-200 rounded-xl hover:shadow-sm transition-shadow flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                      {task.priority === 'HIGH' ? <AlertCircle className="h-5 w-5 text-orange-500" /> : <Package className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{task.title}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{task.location}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600">{task.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          task.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                        }`}>{task.priority}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start sm:items-end justify-center shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                    {task.status === "CLAIMED" ? (
                      <>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md mb-1">CLAIMED</span>
                        <span className="text-xs font-medium text-slate-500">by {task.claimedBy}</span>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">OPEN (BROADCASTING)</span>
                    )}
                    <button className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors mt-3">Cancel Task</button>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
