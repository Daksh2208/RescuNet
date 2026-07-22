"use client";

import { 
  HeartHandshake, 
  MapPin, 
  ArrowRight,
  PawPrint,
  CheckCircle2,
  Package,
  Home
} from "lucide-react";
import Link from "next/link";

export default function VolunteerDashboard() {
  const openTasks = [
    {
      id: "TSK-102",
      type: "Supply Delivery",
      desc: "Transport 50 Blankets to Flood Shelter B",
      priority: "HIGH",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200"
    },
    {
      id: "TSK-103",
      type: "Animal Foster Needed",
      desc: "Temporary housing for 3 rescue dogs (Earthquake victims)",
      priority: "CRITICAL",
      icon: PawPrint,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-xl shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <HeartHandshake className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-bold text-green-800 uppercase tracking-wider">
              Volunteer Hub Active
            </h3>
            <div className="mt-1 text-sm text-green-700">
              <p>
                Thank you for supporting Multi-Disaster relief efforts! Please browse the open tasks below to assist with both human shelter logistics and animal foster placement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group bg-green-600 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
            <HeartHandshake className="w-32 h-32" />
          </div>
          <div>
            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-1 leading-tight">My Active Tasks</h2>
            <p className="text-green-100 text-sm mt-2">You have 0 tasks in progress</p>
          </div>
        </div>

        <Link 
          href="/volunteer/shelters"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600">
              <Home className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1 leading-tight">Shelter Needs</h2>
            <p className="text-slate-500 text-sm mt-2">Assist at Human & Animal shelters</p>
          </div>
          <div className="flex items-center text-blue-600 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
            View Shelters <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link 
          href="/volunteer/foster"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="h-12 w-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 text-orange-600">
              <PawPrint className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1 leading-tight">Foster Animals</h2>
            <p className="text-slate-500 text-sm mt-2">Provide temporary homes for rescued pets</p>
          </div>
          <div className="flex items-center text-orange-600 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
            View Requests <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>
      </div>

      {/* Task Board */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Open Relief Tasks</h2>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
            {openTasks.length} Available
          </span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {openTasks.map((task) => (
              <div key={task.id} className={`p-5 rounded-xl border ${task.border} ${task.bg} flex flex-col gap-4`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm ${task.color}`}>
                      <task.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{task.type}</h3>
                      <p className="text-xs font-medium text-slate-500">{task.id}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 bg-white rounded-md border ${task.border} ${task.color}`}>
                    {task.priority}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-slate-700 font-medium">
                    {task.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/50 flex gap-3 mt-auto">
                  <button className="flex-1 bg-white border border-slate-200 text-slate-700 font-medium py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 bg-green-600 text-white font-medium py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                    Claim Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
