"use client";

import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Loader2,
  LogOut,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

type VolunteerProfile = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
};

export default function ProfilePage() {
  const [userData, setUserData] = useState<VolunteerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUserData(res.data.data);
      } catch (err) {
        console.error("Failed to load profile", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    setLoggingOut(true);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading profile...</div>;
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account and preferences</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/volunteer"
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
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="h-24 w-24 bg-green-100 text-green-700 font-bold text-3xl rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
              {initials || <User className="h-12 w-12" />}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{userData.fullName}</h2>
            <div className="flex items-center gap-1 mt-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Shield className="h-3.5 w-3.5" />
              {userData.role}
            </div>

            <div className="w-full mt-6 space-y-4 text-left">
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

        {/* Settings */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-slate-400" /> Notifications
              </h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">New Supply Tasks</p>
                  <p className="text-xs text-slate-500 mt-0.5">Receive alerts when new supply transport tasks are posted in your zone.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
