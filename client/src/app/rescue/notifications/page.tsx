"use client";

import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

import api from "@/lib/api";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function RescueNotificationsPage() {
  const [filter, setFilter] = useState<
    "all" | "unread"
  >("all");

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/notifications"
        );

        setNotifications(
          response.data.data
        );
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

  const handleMarkAsRead = async (
    id: string
  ) => {
    try {
      await api.patch(
        `/notifications/${id}/read`
      );

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
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

  const getNotificationStyle = (
    title: string
  ) => {
    if (
      title.includes("Critical") ||
      title.includes("Hazard")
    ) {
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

    if (
      title.includes("Information") ||
      title.includes("Update")
    ) {
      return {
        icon: Info,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
      };
    }

    return {
      icon: Bell,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    };
  };

  const formatTime = (createdAt: string) => {
    const date = new Date(createdAt);

    const now = new Date();

    const diffMs =
      now.getTime() - date.getTime();

    const diffMinutes = Math.floor(
      diffMs / (1000 * 60)
    );

    if (diffMinutes < 1) {
      return "Just now";
    }

    if (diffMinutes < 60) {
      return `${diffMinutes} min${
        diffMinutes === 1 ? "" : "s"
      } ago`;
    }

    const diffHours = Math.floor(
      diffMinutes / 60
    );

    if (diffHours < 24) {
      return `${diffHours} hour${
        diffHours === 1 ? "" : "s"
      } ago`;
    }

    const diffDays = Math.floor(
      diffHours / 24
    );

    if (diffDays < 7) {
      return `${diffDays} day${
        diffDays === 1 ? "" : "s"
      } ago`;
    }

    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const displayNotifications =
    filter === "unread"
      ? notifications.filter(
          (notification) => !notification.isRead
        )
      : notifications;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            Notifications
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Operational updates and emergency alerts for your unit
          </p>
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
              onClick={() =>
                setFilter("all")
              }
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                filter === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              All
            </button>

            <button
              onClick={() =>
                setFilter("unread")
              }
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${
                filter === "unread"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Unread

              {unreadCount > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center">

          <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-3" />

          <p className="text-sm text-slate-500">
            Loading notifications...
          </p>

        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">

          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />

          <h3 className="font-bold text-slate-800">
            Failed to load notifications
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {error}
          </p>

        </div>
      )}

      {/* Notifications */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {displayNotifications.length > 0 ? (

            <div className="divide-y divide-slate-100">

              {displayNotifications.map(
                (notification) => {
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
                        handleMarkAsRead(
                          notification.id
                        )
                      }
                      className={`p-5 transition-colors flex gap-4 relative ${
                        !notification.isRead
                          ? "bg-blue-50/30 cursor-pointer hover:bg-blue-50/60"
                          : "hover:bg-slate-50"
                      }`}
                    >

                      {!notification.isRead && (
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
                      )}

                      <div
                        className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 border ${style.bg} ${style.color} ${style.border}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="flex-1">

                        <div className="flex items-start justify-between gap-2">

                          <h3
                            className={`font-bold ${
                              !notification.isRead
                                ? "text-slate-900"
                                : "text-slate-700"
                            }`}
                          >
                            {notification.title}
                          </h3>

                          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                            {formatTime(
                              notification.createdAt
                            )}
                          </span>

                        </div>

                        <p
                          className={`mt-1 text-sm ${
                            !notification.isRead
                              ? "text-slate-700"
                              : "text-slate-500"
                          }`}
                        >
                          {notification.message}
                        </p>

                        {!notification.isRead && (
                          <p className="text-xs font-semibold text-blue-600 mt-3">
                            Click to mark as read
                          </p>
                        )}

                      </div>

                      {!notification.isRead && (
                        <div className="flex items-center shrink-0">
                          <div className="h-2.5 w-2.5 bg-blue-600 rounded-full" />
                        </div>
                      )}

                    </div>
                  );
                }
              )}

            </div>

          ) : (

            <div className="p-12 text-center">

              <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />

              <h3 className="text-lg font-bold text-slate-900">
                You're all caught up!
              </h3>

              <p className="text-slate-500 text-sm mt-1">
                There are no{" "}
                {filter === "unread"
                  ? "unread "
                  : ""}
                notifications right now.
              </p>

            </div>
          )}

        </div>
      )}

    </div>
  );
}