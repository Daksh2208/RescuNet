"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Network,
  AlertTriangle,
  Clock
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const navigation = [
    { name: "Global Overview", href: "/admin", icon: LayoutDashboard },
    { name: "User Management", href: "/admin/users", icon: User },
    { name: "Verify Incidents", href: "/admin/verify", icon: CheckSquare },
    { name: "Resource Ops", href: "/admin/resources", icon: Settings },
    { name: "Emergency Broadcast", href: "/admin/broadcast", icon: Radio },
    { name: "System Audit Log", href: "/admin/audit", icon: ScrollText },
    { name: "API Integrations", href: "/admin/integrations", icon: Network },
    { name: "Profile", href: "/admin/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 text-slate-900 fixed h-screen z-20 shadow-sm">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 group">
            <ShieldAlert className="h-8 w-8 text-purple-600 transition-transform group-hover:scale-110" />
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
                <Icon className={`h-5 w-5 ${isActive ? "text-purple-600" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 font-bold text-sm">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">System Admin</span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">HQ Override</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 text-slate-900 z-30 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-purple-600" />
            <span className="font-bold text-xl tracking-tight text-slate-900">
              ResQ<span className="text-purple-600">Net</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="text-slate-400 relative hover:text-slate-600"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-purple-500 rounded-full border-2 border-white"></span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-500 hover:text-slate-900"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            {isNotificationsOpen && (
              <div className="absolute top-12 right-0 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">System Alerts</h3>
                  <button className="text-xs font-bold text-purple-600 hover:text-purple-700">Mark all read</button>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  
                  {/* Alert 1 */}
                  <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative bg-purple-50/30">
                    <div className="absolute top-5 right-4 h-2 w-2 bg-purple-600 rounded-full"></div>
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="pr-4">
                        <p className="text-sm font-bold text-slate-900 mb-0.5">Critical SOS Detected</p>
                        <p className="text-xs text-slate-600 line-clamp-2">AI flagged a high-confidence structural collapse in Sector 4.</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1"><Clock className="h-3 w-3" /> Just now</p>
                      </div>
                    </div>
                  </div>

                  {/* Alert 2 */}
                  <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative bg-purple-50/30">
                    <div className="absolute top-5 right-4 h-2 w-2 bg-purple-600 rounded-full"></div>
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <Radio className="h-4 w-4" />
                      </div>
                      <div className="pr-4">
                        <p className="text-sm font-bold text-slate-900 mb-0.5">Comms Lost</p>
                        <p className="text-xs text-slate-600 line-clamp-2">Lost radio contact with Rescue Team Bravo near Riverdale.</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1"><Clock className="h-3 w-3" /> 2m ago</p>
                      </div>
                    </div>
                  </div>

                  {/* Alert 3 */}
                  <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer relative">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <ShieldAlert className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 mb-0.5">System Update</p>
                        <p className="text-xs text-slate-500 line-clamp-2">FEMA Inter-Agency Sync completed successfully.</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1"><Clock className="h-3 w-3" /> 1h ago</p>
                      </div>
                    </div>
                  </div>

                </div>
                <Link href="/admin/notifications" onClick={() => setIsNotificationsOpen(false)} className="block p-3 text-center border-t border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <span className="text-xs font-bold text-purple-600">View All Alerts</span>
                </Link>
              </div>
            )}
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    isActive
                      ? "bg-purple-50 text-purple-700 border border-purple-100"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-purple-600" : "text-slate-400"}`} />
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
            {navigation.find(n => n.href === pathname)?.name || "Command Center"}
          </h1>
          <div className="flex items-center gap-6 relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="text-slate-400 hover:text-purple-600 relative transition-colors"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0.5 h-2.5 w-2.5 bg-purple-600 rounded-full border-2 border-white"></span>
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute top-10 right-0 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">System Alerts</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">3 New</span>
                    <button className="text-xs font-bold text-purple-600 hover:text-purple-700">Mark all read</button>
                  </div>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  
                  {/* Alert 1 */}
                  <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative bg-purple-50/30">
                    <div className="absolute top-5 right-4 h-2 w-2 bg-purple-600 rounded-full"></div>
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="pr-4">
                        <p className="text-sm font-bold text-slate-900 mb-0.5">Critical SOS Detected</p>
                        <p className="text-xs text-slate-600 line-clamp-2">AI flagged a high-confidence structural collapse in Sector 4.</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1"><Clock className="h-3 w-3" /> Just now</p>
                      </div>
                    </div>
                  </div>

                  {/* Alert 2 */}
                  <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative bg-purple-50/30">
                    <div className="absolute top-5 right-4 h-2 w-2 bg-purple-600 rounded-full"></div>
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <Radio className="h-4 w-4" />
                      </div>
                      <div className="pr-4">
                        <p className="text-sm font-bold text-slate-900 mb-0.5">Comms Lost</p>
                        <p className="text-xs text-slate-600 line-clamp-2">Lost radio contact with Rescue Team Bravo near Riverdale.</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1"><Clock className="h-3 w-3" /> 2m ago</p>
                      </div>
                    </div>
                  </div>

                  {/* Alert 3 */}
                  <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer relative">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <ShieldAlert className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 mb-0.5">System Update</p>
                        <p className="text-xs text-slate-500 line-clamp-2">FEMA Inter-Agency Sync completed successfully.</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1"><Clock className="h-3 w-3" /> 1h ago</p>
                      </div>
                    </div>
                  </div>

                </div>
                <Link href="/admin/notifications" onClick={() => setIsNotificationsOpen(false)} className="block p-3 text-center border-t border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <span className="text-xs font-bold text-purple-600">View All Alerts</span>
                </Link>
              </div>
            )}
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
