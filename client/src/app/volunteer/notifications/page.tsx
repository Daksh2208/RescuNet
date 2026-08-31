"use client";

import { Bell, CheckCircle2, Package, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function VolunteerNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (err: any) {
      console.error("Failed to fetch notifications", err);
      toast.error(err.response?.data?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err: any) {
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (err: any) {
      toast.error("Failed to mark all as read");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayNotifications =
    filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-green-700" /> Notifications
          </h1>
          <p className="text-slate-500 text-sm mt-1">Updates on your tasks and volunteer operations</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs font-bold text-green-700 hover:text-green-800 transition-colors bg-green-50 px-3 py-2 rounded-xl border border-green-200"
            >
              Mark all as read
            </button>
          )}
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
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Loading notifications...</div>
        ) : displayNotifications.length === 0 ? (
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
                !notification.isRead ? 'border-slate-300' : 'border-slate-100 opacity-75'
              }`}
            >
              {!notification.isRead && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
              )}
              
              <div className="flex items-start gap-4 flex-1">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border border-green-200 bg-green-50 text-green-600`}>
                  <Bell className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-base font-bold ${!notification.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs font-semibold text-slate-400 shrink-0 ml-4">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${!notification.isRead ? 'text-slate-700' : 'text-slate-500'}`}>
                    {notification.message}
                  </p>
                  
                  {!notification.isRead && (
                    <div className="mt-4">
                      <button 
                        onClick={() => handleMarkAsRead(notification.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors border-slate-200 text-slate-700 hover:bg-slate-50`}
                      >
                        Mark as read
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
