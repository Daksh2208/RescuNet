"use client";

import {
  Bell,
  AlertTriangle,
  ShieldCheck,
  Users,
  HeartHandshake,
  CheckCircle2,
  Info,
  Loader2,
} from "lucide-react";

import { useEffect, useState } from "react";

import api from "@/lib/api";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/notifications");

        setNotifications(response.data.data);
      } catch (error) {
        console.error(
          "Failed to fetch notifications:",
          error
        );

        setError(
          "Unable to load notifications. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationStyle = (title: string) => {
    if (title.includes("Critical")) {
      return {
        icon: AlertTriangle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
      };
    }

    if (title.includes("Warning")) {
      return {
        icon: AlertTriangle,
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
      };
    }

    if (title.includes("Information")) {
      return {
        icon: Info,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
      };
    }

    if (title.includes("Reunification")) {
      return {
        icon: Users,
        color: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-200",
      };
    }

    if (title.includes("Volunteer")) {
      return {
        icon: HeartHandshake,
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
      };
    }

    return {
      icon: ShieldCheck,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    };
  };

  const formatTime = (createdAt: string) => {
    const date = new Date(createdAt);

    const now = new Date();

    const diffMs = now.getTime() - date.getTime();

    const diffMinutes = Math.floor(
      diffMs / (1000 * 60)
    );

    if (diffMinutes < 1) {
      return "Just now";
    }

    if (diffMinutes < 60) {
      return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"
        } ago`;
    }

    const diffHours = Math.floor(
      diffMinutes / 60
    );

    if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? "" : "s"
        } ago`;
    }

    const diffDays = Math.floor(
      diffHours / 24
    );

    if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? "" : "s"
        } ago`;
    }

    return date.toLocaleDateString();
  };

  const displayNotifications =
    filter === "unread"
      ? notifications.filter(
        (notification) => !notification.isRead
      )
      : notifications;

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-slate-700" />
            Notifications
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Stay updated on disaster alerts and community requests
          </p>
        </div>

        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">

          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === "all"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
              }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${filter === "unread"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
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

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center">

          <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-3" />

          <p className="text-sm text-slate-500">
            Loading notifications...
          </p>

        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">

          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />

          <p className="text-sm font-semibold text-red-700">
            {error}
          </p>

        </div>
      )}

      {/* Notifications */}
      {!loading && !error && (
        <div className="space-y-4">

          {displayNotifications.length === 0 ? (

            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center">

              <CheckCircle2 className="h-12 w-12 text-slate-300 mb-3" />

              <h3 className="text-lg font-bold text-slate-700">
                You're all caught up!
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                There are no{" "}
                {filter === "unread" ? "unread " : ""}
                notifications right now.
              </p>

            </div>

          ) : (

            displayNotifications.map((notification) => {

              const handleMarkAsRead = async (
                notificationId: string
              ) => {
                try {
                  await api.patch(
                    `/notifications/${notificationId}/read`
                  );

                  setNotifications((current) =>
                    current.map((notification) =>
                      notification.id === notificationId
                        ? {
                          ...notification,
                          isRead: true,
                        }
                        : notification
                    )
                  );
                } catch (error) {
                  console.error(
                    "Failed to mark notification as read:",
                    error
                  );
                }
              };

              const style =
                getNotificationStyle(
                  notification.title
                );

              const Icon = style.icon;

              return (
                <div
                  key={notification.id}
                  onClick={() =>
                    !notification.isRead &&
                    handleMarkAsRead(notification.id)
                  }
                  className={`bg-white rounded-2xl p-5 border shadow-sm transition-all flex flex-col md:flex-row gap-5 relative overflow-hidden ${!notification.isRead
                      ? "border-slate-300 cursor-pointer hover:shadow-md"
                      : "border-slate-100 opacity-75"
                    }`}
                >

                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                  )}

                  <div className="flex items-start gap-4 flex-1">

                    {/* Icon */}
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border ${style.border} ${style.bg} ${style.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="flex-1">

                      {/* Title + Time */}
                      <div className="flex items-center justify-between mb-1">

                        <h3
                          className={`text-base font-bold ${!notification.isRead
                            ? "text-slate-900"
                            : "text-slate-700"
                            }`}
                        >
                          {notification.title}
                        </h3>

                        <span className="text-xs font-semibold text-slate-400 shrink-0 ml-4">
                          {formatTime(
                            notification.createdAt
                          )}
                        </span>

                      </div>

                      {/* Message */}
                      <p
                        className={`text-sm leading-relaxed ${!notification.isRead
                          ? "text-slate-700"
                          : "text-slate-500"
                          }`}
                      >
                        {notification.message}
                      </p>

                    </div>
                  </div>
                </div>
              );
            })
          )}

        </div>
      )}

    </div>
  );
}