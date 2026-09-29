"use client";

import {
  User,
  ShieldAlert,
  LogOut,
  CheckCircle2,
  Mail,
  Phone,
  CalendarDays,
  Loader2,
  AlertTriangle,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

import api from "@/lib/api";
import { setAccessToken } from "@/lib/token";

type AdminProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
};

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<AdminProfile | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [loggingOut, setLoggingOut] =
    useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/auth/me"
        );

        setProfile(response.data.data);
      } catch (error) {
        console.error(
          "Failed to fetch profile:",
          error
        );

        setError(
          "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await api.post("/auth/logout");
    } catch (error) {
      console.error(
        "Logout request failed:",
        error
      );
    } finally {
      setAccessToken("");

      window.location.href = "/login";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center">

          <Loader2 className="h-8 w-8 text-purple-600 animate-spin mb-3" />

          <p className="text-sm text-slate-500">
            Loading profile...
          </p>

        </div>

      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto">

        <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center">

          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />

          <h3 className="font-bold text-slate-800">
            Unable to load profile
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {error}
          </p>

        </div>

      </div>
    );
  }

  const initials = profile.fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Admin Profile
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Manage your command center account.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">

          <Link
            href="/admin"
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center"
          >
            Back to Dashboard
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-red-600 hover:bg-red-50 disabled:opacity-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}

            {loggingOut
              ? "Signing Out..."
              : "Sign Out"}
          </button>

        </div>
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Profile Card */}
        <div className="md:col-span-1">

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">

            <div className="h-24 w-24 bg-purple-100 text-purple-700 font-bold text-3xl rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
              {initials}
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              {profile.fullName}
            </h2>

            <div className="flex items-center gap-1 mt-2 text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <ShieldAlert className="h-3.5 w-3.5" />

              {profile.role}
            </div>

            <div className="w-full mt-6 space-y-4">

              {/* ID */}
              <div className="flex justify-between items-center py-2 border-b border-slate-100 gap-4">

                <span className="text-sm text-slate-500">
                  ID
                </span>

                <span className="text-xs font-bold text-slate-900 font-mono truncate max-w-[180px]">
                  {profile.id}
                </span>

              </div>

              {/* Email */}
              <div className="flex justify-between items-center py-2 border-b border-slate-100 gap-4">

                <span className="text-sm text-slate-500 flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </span>

                <span className="text-xs font-semibold text-slate-700 truncate max-w-[180px]">
                  {profile.email}
                </span>

              </div>

              {/* Phone */}
              <div className="flex justify-between items-center py-2 border-b border-slate-100 gap-4">

                <span className="text-sm text-slate-500 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  Phone
                </span>

                <span className="text-sm font-semibold text-slate-700">
                  {profile.phone}
                </span>

              </div>

              {/* Joined */}
              <div className="flex justify-between items-center py-2 border-b border-slate-100 gap-4">

                <span className="text-sm text-slate-500 flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Joined
                </span>

                <span className="text-xs font-semibold text-slate-700">
                  {formatDate(
                    profile.createdAt
                  )}
                </span>

              </div>

              {/* Status */}
              <div className="flex justify-between items-center py-2">

                <span className="text-sm text-slate-500">
                  Status
                </span>

                <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  {profile.isActive
                    ? "Active"
                    : "Inactive"}
                </span>

              </div>

            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="md:col-span-2 space-y-6">

          {/* Account Security */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">

              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-purple-600" />
                Account Security
              </h3>

            </div>

            <div className="p-6 space-y-6">

              {/* Verification */}
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Account Verification
                  </p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Verification status of your administrator account.
                  </p>
                </div>

                <div
                  className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                    profile.isVerified
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-yellow-100 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {profile.isVerified
                    ? "Verified"
                    : "Not Verified"}
                </div>

              </div>

              {/* Password */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-6">

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Password
                  </p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Your account password is securely hashed.
                  </p>
                </div>

                <button
                  disabled
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-400 cursor-not-allowed"
                >
                  Change Password
                </button>

              </div>

            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">

              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Account Information
              </h3>

            </div>

            <div className="p-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div className="bg-slate-50 rounded-xl p-4">

                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Account Role
                  </p>

                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {profile.role}
                  </p>

                </div>

                <div className="bg-slate-50 rounded-xl p-4">

                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Account Status
                  </p>

                  <p className="text-sm font-bold text-green-600 mt-1">
                    {profile.isActive
                      ? "Active"
                      : "Inactive"}
                  </p>

                </div>

                <div className="bg-slate-50 rounded-xl p-4 sm:col-span-2">

                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Account ID
                  </p>

                  <p className="text-sm font-mono font-bold text-slate-900 mt-1 break-all">
                    {profile.id}
                  </p>

                </div>

              </div>

            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">

            <div className="flex items-start gap-3">

              <ShieldAlert className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />

              <div>

                <p className="text-sm font-bold text-purple-900">
                  Administrator Account
                </p>

                <p className="text-xs text-purple-700 mt-1 leading-relaxed">
                  This account has administrative access to
                  ResQNet. Administrative actions such as
                  incident verification, user management,
                  resource management and emergency broadcasts
                  are recorded in the system audit log.
                </p>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}