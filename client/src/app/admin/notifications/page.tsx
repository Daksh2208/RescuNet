"use client";

import { useState } from "react";
import { Bell, AlertTriangle, ShieldAlert, Radio, Clock, Info } from "lucide-react";
import Link from "next/link";

export default function AdminNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const notifications = [
    {
      id: "notif-1",
      title: "Critical SOS Detected",
      message: "AI flagged a high-confidence structural collapse in Sector 4. Awaiting verification before dispatch.",
      time: "Just now",
      unread: true,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-100"
    },
    {
      id: "notif-2",
      title: "Comms Lost",
      message: "Lost radio contact with Rescue Team Bravo near Riverdale. Last known location pinged 15 mins ago.",
      time: "2 mins ago",
      unread: true,
      icon: Radio,
      color: "text-orange-600",
      bg: "bg-orange-100"
    },
    {
      id: "notif-3",
      title: "System Update",
      message: "FEMA Inter-Agency Sync completed successfully. Shelter capacities updated globally.",
      time: "1 hour ago",
      unread: true,
      icon: ShieldAlert,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      id: "notif-4",
      title: "Resource Depletion Warning",
      message: "Downtown Community Center (Shelter) is projected to run out of First Aid supplies in under 12 hours.",
      time: "5 hours ago",
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
            <Bell className="h-6 w-6 text-purple-600" /> System Alerts
          </h1>
          <p className="text-slate-500 text-sm mt-1">Global command notifications and AI threat warnings.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <Link
            href="/admin"
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            Back to Dashboard
          </Link>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                filter === "all" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${
                filter === "unread" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Unread
              <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
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
                className={`p-6 hover:bg-slate-50 transition-colors flex gap-4 ${notif.unread ? "bg-purple-50/20" : ""}`}
              >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${notif.bg} ${notif.color}`}>
                  <notif.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-bold ${notif.unread ? "text-slate-900" : "text-slate-700"}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {notif.time}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${notif.unread ? "text-slate-700" : "text-slate-500"}`}>
                    {notif.message}
                  </p>
                </div>
                {notif.unread && (
                  <div className="flex items-center shrink-0 ml-4">
                    <div className="h-3 w-3 bg-purple-600 rounded-full shadow-[0_0_8px_rgba(147,51,234,0.5)]"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Bell className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">System Clear</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
              There are no active alerts or notifications for the command center at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
