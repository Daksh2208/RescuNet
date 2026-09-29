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
              href="/admin/profile"
              className="text-slate-400 hover:text-purple-600"
            >
              <User className="h-6 w-6" />
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
              href="/admin/profile"
              className="text-slate-400 hover:text-purple-600 relative transition-colors"
              title="Notifications"
            >
              <Bell className="h-6 w-6" />
            </Link>

            {/* Profile */}
            <Link
              href="/admin/profile"
              className="flex items-center gap-3 pl-5 border-l border-slate-200"
            >
              <div className="h-9 w-9 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 font-bold text-sm">
                {loadingUser ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  initials
                )}
              </div>

              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">
                  {userData?.fullName || "Admin"}
                </p>

                <p className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider">
                  {userData?.role || "ADMIN"}
                </p>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-slate-400 hover:text-red-600 transition-colors"
              title="Sign out"
            >
              {loggingOut ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogOut className="h-5 w-5" />
              )}
            </button>
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