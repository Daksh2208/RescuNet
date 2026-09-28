"use client";

import { useState } from "react";
import {
  Radio,
  Send,
  AlertTriangle,
  Users,
  ShieldCheck,
  HeartHandshake,
  Truck,
  RefreshCw,
} from "lucide-react";

import Link from "next/link";
import api from "@/lib/api";

type Severity =
  | "CRITICAL"
  | "WARNING"
  | "INFO";

type Role =
  | "CITIZEN"
  | "VOLUNTEER"
  | "RESCUE";

export default function AdminBroadcastPage() {
  const [roles, setRoles] = useState<Role[]>([
    "CITIZEN",
    "VOLUNTEER",
    "RESCUE",
  ]);

  const [severity, setSeverity] =
    useState<Severity>("CRITICAL");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [recipientCount, setRecipientCount] =
    useState<number | null>(null);

  const toggleRole = (role: Role) => {
    setRoles((current) =>
      current.includes(role)
        ? current.filter(
            (item) => item !== role
          )
        : [...current, role]
    );
  };

  const handleBroadcast = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSuccessMessage("");
    setRecipientCount(null);

    if (roles.length === 0) {
      alert(
        "Please select at least one target audience."
      );
      return;
    }

    if (!message.trim()) {
      alert(
        "Please enter a broadcast message."
      );
      return;
    }

    if (message.length > 250) {
      alert(
        "Broadcast message cannot exceed 250 characters."
      );
      return;
    }

    const confirmed = window.confirm(
      `Send this ${severity} broadcast to ${roles.length} selected audience group${
        roles.length > 1 ? "s" : ""
      }?`
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await api.post(
        "/admin/broadcast",
        {
          message: message.trim(),
          severity,
          roles,
        }
      );

      const count =
        response.data.data?.recipientCount ?? 0;

      setRecipientCount(count);

      setSuccessMessage(
        `Broadcast sent successfully to ${count} active user${
          count !== 1 ? "s" : ""
        }.`
      );

      setMessage("");
    } catch (err: any) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to send broadcast."
      );
    } finally {
      setLoading(false);
    }
  };

  const getSeverityStyles = (
    value: Severity
  ) => {
    if (value === "CRITICAL") {
      return {
        wrapper:
          "border-red-300 bg-red-50 text-red-700",
        icon: "text-red-600",
      };
    }

    if (value === "WARNING") {
      return {
        wrapper:
          "border-amber-300 bg-amber-50 text-amber-700",
        icon: "text-amber-600",
      };
    }

    return {
      wrapper:
        "border-blue-300 bg-blue-50 text-blue-700",
      icon: "text-blue-600",
    };
  };

  const severityStyles =
    getSeverityStyles(severity);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Radio className="h-6 w-6 text-purple-600" />
            Emergency Broadcast System
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Send emergency notifications to selected
            Citizens, Volunteers and Rescue Teams
          </p>
        </div>

        <Link
          href="/admin"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0 flex items-center justify-center"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* =========================
          SUCCESS
      ========================= */}

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <ShieldCheck className="h-5 w-5" />
            {successMessage}
          </div>

          {recipientCount !== null && (
            <p className="text-xs text-emerald-600 mt-1 ml-7">
              Each recipient now has a notification
              in their ResQNet account.
            </p>
          )}
        </div>
      )}

      {/* =========================
          WARNING
      ========================= */}

      <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-red-100 bg-red-50 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />

          <div>
            <h2 className="font-bold text-red-900">
              EMERGENCY BROADCAST
            </h2>

            <p className="text-xs text-red-600 mt-0.5">
              This message will be delivered to all
              selected active users.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleBroadcast}
          className="p-6 md:p-8 space-y-7"
        >
          {/* =========================
              TARGET AUDIENCE
          ========================= */}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Target Audience
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* CITIZEN */}

              <button
                type="button"
                onClick={() =>
                  toggleRole("CITIZEN")
                }
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  roles.includes("CITIZEN")
                    ? "border-purple-500 bg-purple-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    roles.includes("CITIZEN")
                      ? "bg-purple-100 text-purple-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-bold text-sm text-slate-800">
                    Citizens
                  </p>

                  <p className="text-xs text-slate-400">
                    Public users
                  </p>
                </div>
              </button>

              {/* VOLUNTEER */}

              <button
                type="button"
                onClick={() =>
                  toggleRole("VOLUNTEER")
                }
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  roles.includes("VOLUNTEER")
                    ? "border-purple-500 bg-purple-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    roles.includes("VOLUNTEER")
                      ? "bg-purple-100 text-purple-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <HeartHandshake className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-bold text-sm text-slate-800">
                    Volunteers
                  </p>

                  <p className="text-xs text-slate-400">
                    Registered volunteers
                  </p>
                </div>
              </button>

              {/* RESCUE */}

              <button
                type="button"
                onClick={() =>
                  toggleRole("RESCUE")
                }
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  roles.includes("RESCUE")
                    ? "border-purple-500 bg-purple-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    roles.includes("RESCUE")
                      ? "bg-purple-100 text-purple-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Truck className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-bold text-sm text-slate-800">
                    Rescue Teams
                  </p>

                  <p className="text-xs text-slate-400">
                    Rescue personnel
                  </p>
                </div>
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Selected groups:{" "}
              <span className="font-bold">
                {roles.length}
              </span>
            </p>
          </div>

          {/* =========================
              GEOGRAPHY
          ========================= */}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Target Geography
            </label>

            <div className="flex items-center justify-between gap-4 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <p className="text-sm font-bold text-slate-700">
                  Global
                </p>

                <p className="text-xs text-slate-400 mt-0.5">
                  Broadcast to the selected audiences
                  regardless of location
                </p>
              </div>

              <span className="text-xs font-bold bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg">
                GLOBAL
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Location-based geofencing is not enabled
              yet because user location targeting is not
              currently stored in the notification system.
            </p>
          </div>

          {/* =========================
              SEVERITY
          ========================= */}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Severity Level
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(
                [
                  "CRITICAL",
                  "WARNING",
                  "INFO",
                ] as Severity[]
              ).map((level) => {
                const styles =
                  getSeverityStyles(level);

                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setSeverity(level)
                    }
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      severity === level
                        ? styles.wrapper
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        className={`h-4 w-4 ${
                          severity === level
                            ? styles.icon
                            : "text-slate-400"
                        }`}
                      />

                      <span className="text-sm font-bold">
                        {level}
                      </span>
                    </div>

                    <p className="text-xs mt-2 opacity-70">
                      {level === "CRITICAL"
                        ? "Immediate emergency alert"
                        : level === "WARNING"
                        ? "Important emergency warning"
                        : "General information"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* =========================
              MESSAGE
          ========================= */}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Broadcast Message
              </label>

              <span
                className={`text-xs font-bold ${
                  message.length >= 250
                    ? "text-red-600"
                    : "text-slate-400"
                }`}
              >
                {message.length} / 250
              </span>
            </div>

            <textarea
              rows={5}
              maxLength={250}
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="e.g. Heavy rainfall expected in low-lying areas. Citizens are advised to remain alert and follow official instructions."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none font-medium"
            />
          </div>

          {/* =========================
              PREVIEW
          ========================= */}

          {message.trim() && (
            <div
              className={`rounded-xl border p-4 ${severityStyles.wrapper}`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-70">
                Notification Preview
              </p>

              <p className="font-bold text-sm">
                {severity === "CRITICAL"
                  ? "🚨 Critical Emergency Alert"
                  : severity === "WARNING"
                  ? "⚠️ Emergency Warning"
                  : "Emergency Information"}
              </p>

              <p className="text-sm mt-1 leading-relaxed">
                {message}
              </p>
            </div>
          )}

          {/* =========================
              SEND
          ========================= */}

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={
                loading ||
                roles.length === 0 ||
                !message.trim()
              }
              className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-sm text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  SENDING BROADCAST...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  BROADCAST NOW
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
              <Users className="h-3.5 w-3.5" />

              This will create an emergency notification
              for every active user in the selected
              audience.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}