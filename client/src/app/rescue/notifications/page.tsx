"use client";

import { useState } from "react";
import { Bell, AlertTriangle, Truck, MapPin, Navigation, Info } from "lucide-react";
import Link from "next/link";

export default function RescueNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Dummy data strictly typed for easy replacement with API state
  const notifications = [
    {
      id: "notif-1",
      title: "New Dispatch Assigned",
      message: "Unit Alpha-1 has been assigned to Flood Evacuation (MSN-8092).",
      time: "10 mins ago",
      unread: true,
      icon: Truck,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      id: "notif-2",
      title: "Hazard Warning: Route Blocked",
      message: "AI indicates a structural collapse on 5th Avenue. Rerouting is highly recommended.",
      time: "1 hour ago",
      unread: true,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      id: "notif-3",
      title: "Mission Completed",
      message: "Command has verified completion of MSN-7721. Awaiting next dispatch.",
      time: "3 hours ago",
      unread: false,
      icon: Navigation,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      id: "notif-4",
      title: "System Update",
      message: "Global Map layers have been refreshed with the latest satellite imagery.",
      time: "1 day ago",
      unread: false,
      icon: Info,
      color: "text-slate-600",
      bg: "bg-slate-100"
    }
  ];

  const displayNotifications = filter === "all" ? notifications : notifications.filter(n => n.unread);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" /> Notifications
          </h1>
          <p className="text-slate-500 text-sm mt-1">Operational updates and AI alerts for your unit</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <Link 
            href="/rescue"
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            Back to Dashboard
          </Link>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                filter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${
                filter === "unread" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Unread
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {notifications.filter(n => n.unread).length}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {displayNotifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {displayNotifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-5 hover:bg-slate-50 transition-colors flex gap-4 ${notif.unread ? "bg-blue-50/30" : ""}`}
              >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${notif.bg} ${notif.color}`}>
                  <notif.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-bold ${notif.unread ? "text-slate-900" : "text-slate-700"}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                      {notif.time}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${notif.unread ? "text-slate-700" : "text-slate-500"}`}>
                    {notif.message}
                  </p>
                </div>
                {notif.unread && (
                  <div className="flex items-center shrink-0">
                    <div className="h-2.5 w-2.5 bg-blue-600 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">You're all caught up!</h3>
            <p className="text-slate-500 text-sm mt-1">
              There are no new operational updates for your unit at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
