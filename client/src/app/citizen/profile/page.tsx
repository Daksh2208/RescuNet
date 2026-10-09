"use client";

import {
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Bell,
  Shield,
  LogOut,
  CheckCircle2,
  Loader2,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { setAccessToken } from "@/lib/token";

type UserData = {
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUserData(response.data.data);
      } catch (error) {
        console.error("Failed to load profile:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setAccessToken("");

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");
      }

      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading profile...
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const initials = userData.fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const joinedDate = new Date(userData.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            My Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your account and security information
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/citizen"
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

            {loggingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="h-24 w-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
              {initials}
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              {userData.fullName}
            </h2>

            <div className="flex items-center gap-1 mt-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {userData.isVerified ? "Account Verified" : "Verification Pending"}
            </div>

            <div className="w-full mt-6 space-y-4 text-left">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 gap-4">
                <span className="text-sm text-slate-500 flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" />
                  Role
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {userData.role}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 gap-4">
                <span className="text-sm text-slate-500 flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </span>
                <span className="text-xs font-semibold text-slate-700 break-all text-right">
                  {userData.email}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 gap-4">
                <span className="text-sm text-slate-500 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  Phone
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {userData.phone || "Not provided"}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 gap-4">
                <span className="text-sm text-slate-500 flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Joined
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {joinedDate}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 gap-4">
                <span className="text-sm text-slate-500">Status</span>
                <span
                  className={`text-sm font-bold flex items-center gap-1 ${
                    userData.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {userData.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-slate-400" />
                Emergency Notifications
              </h3>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Emergency alerts are enabled
                  </p>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    You will receive emergency notifications sent by the
                    ResQNet administration through your account.
                  </p>

                  <button
                    onClick={() => router.push("/citizen/notifications")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 mt-3"
                  >
                    View Notifications →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-slate-400" />
                Privacy & Security
              </h3>
            </div>

            <div className="p-6 space-y-3">
              <button
                disabled
                className="w-full text-left px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-400 bg-slate-50 cursor-not-allowed flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Change Password
                </span>

                <span className="text-xs">Coming Soon</span>
              </button>

              <div className="px-4 py-3 border border-slate-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />

                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Location Privacy
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Your location is used when you submit an incident
                      report. There is currently no continuous location
                      tracking setting in ResQNet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
