"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  CheckSquare,
  Settings,
  Radio,
  User,
  Menu,
  X,
  ShieldAlert,
  Bell,
  ScrollText,
  LogOut,
  Loader2,
} from "lucide-react";

import api from "@/lib/api";
import { setAccessToken } from "@/lib/token";

type UserData = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigation = [
    {
      name: "Global Overview",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: User,
    },
    {
      name: "Verify Incidents",
      href: "/admin/verify",
      icon: CheckSquare,
    },
    {
      name: "Resource Ops",
      href: "/admin/resources",
      icon: Settings,
    },
    {
      name: "Emergency Broadcast",
      href: "/admin/broadcast",
      icon: Radio,
    },
    {
      name: "System Audit Log",
      href: "/admin/audit",
      icon: ScrollText,
    },
    {
      name: "Profile",
      href: "/admin/profile",
      icon: User,
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");

        setUserData(response.data.data);
      } catch (error) {
        console.error("Failed to load admin profile:", error);

        setAccessToken("");

        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userRole");
        }

        router.push("/login");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setAccessToken("");

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");
      }

      router.push("/login");
    }
  };

  const initials =
    userData?.fullName
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  const currentPage =
    navigation.find((item) => item.href === pathname)?.name ||
    "Command Center";

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-4" />
        <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
          Verifying Command Clearance...
        </p>
      </div>
    );
  }

  if (userData && userData.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Restricted Command Center</h1>
        <p className="text-slate-400 max-w-md text-sm mb-6">
          You are authenticated as <span className="text-purple-400 font-semibold">{userData.fullName}</span> with role <span className="font-mono bg-slate-800 text-amber-400 px-2 py-0.5 rounded text-xs">{userData.role}</span>. Administrator clearance is required to access the dispatch command room.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {userData.role === "RESCUE" && (
            <Link
              href="/rescue"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition"
            >
              Go to Rescue Team Portal
            </Link>
          )}
          {userData.role === "VOLUNTEER" && (
            <Link
              href="/volunteer"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm transition"
            >
              Go to Volunteer Portal
            </Link>
          )}
          {userData.role === "CITIZEN" && (
            <Link
              href="/citizen"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition"
            >
              Go to Citizen Portal
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition border border-slate-700"
          >
            Switch Account / Login as Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 text-slate-900 fixed h-screen z-20 shadow-sm">

        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 group">
            <ShieldAlert className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />

            <span className="font-bold text-2xl tracking-tight text-slate-900">
              ResQ<span className="text-purple-600">Net</span>
            </span>
          </Link>

          <div className="mt-2 px-1">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
              Command Center
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive
                    ? "bg-purple-50 text-purple-700 border border-purple-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive
                      ? "text-purple-600"
                      : "text-slate-400"
                  }`}
                />

                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Real Admin Profile */}
        <div className="p-4 border-t border-slate-200">
          <Link
            href="/admin/profile"
            className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 font-bold text-sm">
              {loadingUser ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                initials
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 truncate">
                {userData?.fullName || "Loading..."}
              </span>

              <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider">
                {userData?.role || "ADMIN"}
              </span>
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 text-slate-900 z-30 shadow-sm">

        <div className="flex items-center justify-between p-4">

          <Link href="/" className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-purple-600" />

            <span className="font-bold text-xl tracking-tight text-slate-900">
              ResQ<span className="text-purple-600">Net</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">

            <Link
              href="/admin/notifications"
              className="text-slate-400 hover:text-purple-600"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6" />
            </Link>

            <button
              onClick={() =>
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }
              className="text-slate-500 hover:text-slate-900"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="border-t border-slate-200 bg-white absolute w-full left-0 px-4 py-4 space-y-2 shadow-lg">

            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    isActive
                      ? "bg-purple-50 text-purple-700 border border-purple-100"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isActive
                        ? "text-purple-600"
                        : "text-slate-400"
                    }`}
                  />

                  {item.name}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium"
            >
              {loggingOut ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogOut className="h-5 w-5" />
              )}

              {loggingOut ? "Signing Out..." : "Sign Out"}
            </button>
          </nav>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen bg-slate-50">

        {/* Desktop Topbar */}
        <header className="hidden md:flex h-20 bg-white border-b border-slate-200 items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            {currentPage}
          </h1>

          <div className="flex items-center gap-5">

            {/* Notifications */}
            <Link
              href="/admin/notifications"
              className="text-slate-400 hover:text-purple-600 relative transition-colors"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 pt-24 md:pt-8 w-full max-w-7xl mx-auto">
          {children}
        </main>

      </div>
    </div>
  );
}