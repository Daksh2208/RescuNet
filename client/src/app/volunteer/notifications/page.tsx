"use client";

import { Bell, HeartHandshake, Package, AlertTriangle, CheckCircle2, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function VolunteerNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const notifications = [
    {
      id: 1,
      type: "task",
      title: "New Task Assigned",
      message: "You have been assigned to 'Medical Supply Transport' in Sector 4.",
      time: "10 mins ago",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      unread: true,
      action: "View Task"
    },
    {
      id: 2,
      type: "alert",
      title: "Shelter B Over Capacity",
      message: "Shelter B has reached 110% capacity. Volunteer logistics personnel requested immediately.",
      time: "45 mins ago",
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      unread: true,
      action: "Navigate"
    },
    {
      id: 3,
      type: "system",
      title: "Background Check Verified",
      message: "Your volunteer background check has been approved. You are now cleared for medical tasks.",
      time: "2 days ago",
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      unread: false
    }
  ];

  const displayNotifications = filter === "unread" ? notifications.filter(n => n.unread) : notifications;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-green-700" /> Notifications
          </h1>
          <p className="text-slate-500 text-sm mt-1">Updates on your tasks and volunteer operations</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <Link 
            href="/volunteer"
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
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {notifications.filter(n => n.unread).length}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {displayNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center">
            <CheckCircle2 className="h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-700">You're all caught up!</h3>
            <p className="text-sm text-slate-500 mt-1">There are no {filter === "unread" ? "unread " : ""}notifications right now.</p>
          </div>
        ) : (
          displayNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`bg-white rounded-2xl p-5 border shadow-sm transition-all flex flex-col md:flex-row gap-5 relative overflow-hidden ${
                notification.unread ? 'border-slate-300' : 'border-slate-100 opacity-75'
              }`}
            >
              {notification.unread && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
              )}
              
              <div className="flex items-start gap-4 flex-1">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border ${notification.border} ${notification.bg} ${notification.color}`}>
                  <notification.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-base font-bold ${notification.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs font-semibold text-slate-400 shrink-0 ml-4">
                      {notification.time}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${notification.unread ? 'text-slate-700' : 'text-slate-500'}`}>
                    {notification.message}
                  </p>
                  
                  {notification.action && (
                    <div className="mt-4">
                      <button className={`text-sm font-bold px-4 py-2 rounded-lg border transition-colors border-slate-200 text-slate-700 hover:bg-slate-50`}>
                        {notification.action}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
