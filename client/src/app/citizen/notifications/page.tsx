"use client";

import { Bell, AlertTriangle, ShieldCheck, MapPin, Users, HeartHandshake, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const notifications = [
    {
      id: 1,
      type: "alert",
      title: "Flash Flood Warning",
      message: "Water levels rising rapidly in Sector 4. Evacuate immediately using Route C.",
      time: "2 mins ago",
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      unread: true,
      action: "View Route"
    },
    {
      id: 2,
      type: "reunification",
      title: "Potential Match Found!",
      message: "Shelter B staff marked Arthur Pendelton (Missing Person) as Found Safe.",
      time: "1 hour ago",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      unread: true,
      action: "View Details"
    },
    {
      id: 3,
      type: "system",
      title: "Safety Status Updated",
      message: "You and your family have been successfully marked as SAFE in the global registry.",
      time: "3 hours ago",
      icon: ShieldCheck,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      unread: false
    },
    {
      id: 4,
      type: "volunteer",
      title: "Animal Foster Needed",
      message: "SafePaws Network near you is requesting emergency foster homes for 4 rescued dogs.",
      time: "1 day ago",
      icon: HeartHandshake,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      unread: false,
      action: "Offer Help"
    }
  ];

  const displayNotifications = filter === "unread" ? notifications.filter(n => n.unread) : notifications;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-slate-700" /> Notifications
          </h1>
          <p className="text-slate-500 text-sm mt-1">Stay updated on disaster alerts and community requests</p>
        </div>
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
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
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
                      <button className={`text-sm font-bold px-4 py-2 rounded-lg border transition-colors ${
                        notification.type === 'alert' 
                          ? 'border-red-200 text-red-700 hover:bg-red-50' 
                          : notification.type === 'reunification'
                          ? 'border-purple-200 text-purple-700 hover:bg-purple-50'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}>
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
