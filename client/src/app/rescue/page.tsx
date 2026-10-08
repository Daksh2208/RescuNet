"use client";

import { useEffect, useState } from "react";
import { 
  Truck, 
  MapPin, 
  ArrowRight,
  Clock,
  Radio,
  Flame,
  Waves,
  PawPrint,
  Users,
  Loader2,
  AlertTriangle,
  Mountain,
  CloudRain,
  Zap
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

type Mission = {
  id: string;
  status: string;
  assignedAt: string;
  incident: {
    id: string;
    title: string;
    disasterType: string;
    severity: string;
    status: string;
    latitude: number;
    longitude: number;
    address: string;
    createdAt: string;
  };
  assignedBy: {
    id: string;
    fullName: string;
  };
};

type DashboardData = {
  activeMissions: Mission[];
  activeMissionCount: number;
  completedMissionCount: number;
  totalActiveIncidents: number;
  recentNotifications: any[];
};

const disasterIcons: Record<string, any> = {
  FLOOD: Waves,
  EARTHQUAKE: Mountain,
  FIRE: Flame,
  CYCLONE: CloudRain,
  LANDSLIDE: Mountain,
  OTHER: Zap,
};

const severityStyles: Record<string, { color: string; bg: string; border: string }> = {
  CRITICAL: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  HIGH: { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  MEDIUM: { color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  LOW: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
};

export default function RescueDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await api.get("/rescue/dashboard");
        setData(response.data.data);
      } catch (err: any) {
        console.error("Failed to fetch dashboard:", err);
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleCompleteMission = async (missionId: string) => {
    try {
      await api.patch(`/rescue/missions/${missionId}/complete`);
      // Refresh dashboard
      const response = await api.get("/rescue/dashboard");
      setData(response.data.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to complete mission");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800">Failed to load dashboard</h3>
        <p className="text-sm text-slate-500 mt-1">{error}</p>
      </div>
    );
  }

  const activeMissions = data?.activeMissions || [];

  return (
    <div className="space-y-6">
      {/* Active AI Alert Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Radio className="h-6 w-6 text-blue-600 animate-pulse" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider">
              AI Command Dispatch Update
            </h3>
            <div className="mt-1 text-sm text-blue-700">
              <p>
                <strong>Status:</strong> {data?.totalActiveIncidents || 0} active incidents in the system.{" "}
                {data?.activeMissionCount || 0} missions assigned to your unit. {data?.completedMissionCount || 0} missions completed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/rescue/comms"
          className="group bg-blue-600 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
            <Truck className="w-32 h-32" />
          </div>
          <div>
            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
              <Radio className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-1 leading-tight">Update Status</h2>
            <p className="text-blue-100 text-sm mt-2">Broadcast location to Command</p>
          </div>
        </Link>

        <Link 
          href="/rescue/map"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
              <MapPin className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1 leading-tight">Global Map</h2>
            <p className="text-slate-500 text-sm mt-2">Live routing for active disaster zones</p>
          </div>
          <div className="flex items-center text-indigo-600 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
            Open Map <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link 
          href="/rescue/protocols"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="flex gap-2 mb-4">
              <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Users className="h-6 w-6" />
              </div>
              <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <PawPrint className="h-6 w-6" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1 leading-tight">Rescue Protocols</h2>
            <p className="text-slate-500 text-sm mt-2">Human & Animal extraction guides</p>
          </div>
          <div className="flex items-center text-emerald-600 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
            View Protocols <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>
      </div>

      {/* Active Missions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Current Assigned Missions</h2>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
            {activeMissions.length} Active
          </span>
        </div>
        <div className="p-6">
          {activeMissions.length === 0 ? (
            <div className="text-center py-8">
              <Truck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900">No active missions</h3>
              <p className="text-slate-500 text-sm mt-1">
                New assignments from Command will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeMissions.map((mission) => {
                const style = severityStyles[mission.incident.severity] || severityStyles.MEDIUM;
                const Icon = disasterIcons[mission.incident.disasterType] || Zap;

                return (
                  <div key={mission.id} className={`p-5 rounded-xl border ${style.border} ${style.bg} flex flex-col gap-4`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm ${style.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{mission.incident.title}</h3>
                          <p className="text-xs font-medium text-slate-500">{mission.incident.disasterType.replace("_", " ")}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 bg-white rounded-md border ${style.border} ${style.color}`}>
                        {mission.incident.severity}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Users className="h-4 w-4 text-slate-400" />
                        <strong>Assigned by:</strong> {mission.assignedBy.fullName}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <strong>Location:</strong> {mission.incident.address}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <strong>Dispatch:</strong> {new Date(mission.assignedAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200/50 flex gap-3 mt-auto">
                      {mission.status === "PENDING" && (
                        <button 
                          onClick={async () => {
                            try {
                              await api.patch(`/rescue/missions/${mission.id}/accept`);
                              const response = await api.get("/rescue/dashboard");
                              setData(response.data.data);
                            } catch (err: any) {
                              alert(err.response?.data?.message || "Failed to accept mission");
                            }
                          }}
                          className="flex-1 bg-emerald-600 text-white font-medium py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors"
                        >
                          Accept Mission
                        </button>
                      )}
                      <button 
                        onClick={() => handleCompleteMission(mission.id)}
                        className="flex-1 bg-blue-600 text-white font-medium py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
