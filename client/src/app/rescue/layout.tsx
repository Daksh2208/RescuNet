"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Truck, 
  Map, 
  MessageSquare, 
  User, 
  Menu, 
  X, 
  ShieldAlert,
  Bell
} from "lucide-react";

export default function RescueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/rescue", icon: LayoutDashboard },
    { name: "Active Missions", href: "/rescue/missions", icon: Truck },
    { name: "Dispatch Map", href: "/rescue/map", icon: Map },
    { name: "Team Comms", href: "/rescue/comms", icon: MessageSquare },
    { name: "Profile", href: "/rescue/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-20">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 group">
            <ShieldAlert className="h-8 w-8 text-blue-600 transition-transform group-hover:scale-110" />
            <span className="font-bold text-2xl tracking-tight text-slate-900">
              ResQ<span className="text-blue-600">Net</span>
            </span>
          </Link>
          <div className="mt-2 px-1">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-md">
              Rescue Team
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              RT
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">Unit Alpha-1</span>
              <span className="text-xs text-slate-500">Rescue Squad</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-30">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl tracking-tight text-slate-900">
              ResQ<span className="text-blue-600">Net</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <button className="text-slate-600 relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-blue-600 rounded-full border border-white"></span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-600"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen bg-slate-50">
        {/* Desktop Topbar */}
        <header className="hidden md:flex h-20 bg-white border-b border-slate-200 items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            {navigation.find(n => n.href === pathname)?.name || "Dashboard"}
          </h1>
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-600 relative transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0.5 h-2.5 w-2.5 bg-blue-600 rounded-full border-2 border-white"></span>
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
