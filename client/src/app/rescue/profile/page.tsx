"use client";

import { 
  CalendarDays,
  Phone, 
  Mail, 
  MapPin, 
  Bell, 
  Shield, 
  LogOut, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle,
  Radio,
  Truck
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { setAccessToken } from "@/lib/token";

type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  isVerified?: boolean;
  isActive: boolean;
  createdAt: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoading(true);
        setError("");
        // Try /auth/me first, fallback to /user/me
        let profileData: UserProfile | null = null;
        try {
          const res = await api.get("/auth/me");
          profileData = res.data?.data || res.data?.user;
        } catch {
          const res2 = await api.get("/user/me");
          profileData = res2.data?.data || res2.data?.user;
        }

        if (profileData) {
          setUserData(profileData);
        } else {
          setError("User information could not be retrieved.");
        }
      } catch (err: any) {
        console.error("Failed to load user profile:", err);
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [router]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await api.post("/auth/logout").catch(() => {});
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
      <div className="flex flex-col items-center justify-center p-16">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">Loading unit credentials...</p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto my-8">
        <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800">Failed to load profile</h3>
        <p className="text-sm text-slate-500 mt-1">{error || "Session expired or profile not found."}</p>
        <button 
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 transition-colors"
        >
          Sign In Again
        </button>
      </div>
    );
  }

  const initials = userData.fullName
    ? userData.fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "RU";

  const memberSince = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Active Deployment";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-600" />
            Unit Profile & Credentials
          </h1>
          <p className="text-slate-500 text-sm mt-1">Operational configuration and tactical identity settings</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link 
            href="/rescue"
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center"
          >
            Back to Dashboard
          </Link>
          <button 
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-red-600 hover:bg-red-50 disabled:opacity-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            {loggingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 border border-blue-200 shadow-sm text-2xl font-extrabold">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{userData.fullName}</h2>
            <div className="flex items-center gap-1 mt-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
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
                  <MapPin className="h-3.5 w-3.5" />
                  Base Sector
                </span>
                <span className="text-xs font-semibold text-slate-700 text-right">
                  Command HQ Sector 4
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 gap-4">
                <span className="text-sm text-slate-500 flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Joined
                </span>
                <span className="text-xs font-semibold text-slate-700 text-right">
                  {memberSince}
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

        {/* Settings & Preferences */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" /> Dispatch & Operational Alert Settings
              </h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Urgent Mission Alerts</p>
                  <p className="text-xs text-slate-500 mt-0.5">Receive high-priority multi-disaster alerts directly to radio channel.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">Live Beacon Location Broadcast</p>
                  <p className="text-xs text-slate-500 mt-0.5">Share GPS location coordinates with Command Dispatch Map in real time.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">Civilian Volunteer Coordination Bridge</p>
                  <p className="text-xs text-slate-500 mt-0.5">Allow automatic broadcast of logistics tasks to verified volunteer network.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Radio className="h-5 w-5 text-emerald-600" /> Radio Network Status
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">Tactical Comms Link</p>
                <p className="text-xs text-slate-500">Connected to Global Dispatch Channel</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
