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
  Zap,
  Phone,
  Navigation,
  ExternalLink,
  ShieldAlert,
  User,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";

type Mission = {
  id: string;
  status: string;
  assignedAt: string;
  acceptedAt?: string | null;
  incident: {
    id: string;
    title: string;
    description?: string | null;
    disasterType: string;
    severity: string;
    status: string;
    latitude: number;
    longitude: number;
    address: string;
    createdAt: string;
    reportedBy?: {
      id: string;
      fullName: string;
      phone?: string | null;
      email?: string | null;
    } | null;
    images?: { id: string; imageUrl: string }[];
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

const severityStyles: Record<string, { color: string; bg: string; border: string; badge: string }> = {
  CRITICAL: { color: "text-red-700", bg: "bg-red-50/70", border: "border-red-200", badge: "bg-red-600 text-white" },
  HIGH: { color: "text-orange-700", bg: "bg-orange-50/70", border: "border-orange-200", badge: "bg-orange-600 text-white" },
  MEDIUM: { color: "text-amber-700", bg: "bg-amber-50/70", border: "border-amber-200", badge: "bg-amber-600 text-white" },
  LOW: { color: "text-blue-700", bg: "bg-blue-50/70", border: "border-blue-200", badge: "bg-blue-600 text-white" },
};

export default function RescueDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchDashboard = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);
      setError("");

      const response = await api.get("/rescue/dashboard");
      setData(response.data.data);
      if (isManual) toast.success("Telemetry updated");
    } catch (err: any) {
      console.error("Failed to fetch dashboard:", err);
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleAcceptMission = async (missionId: string) => {
    try {
      setActionLoading(missionId);
      await api.patch(`/rescue/missions/${missionId}/accept`);
      toast.success("Mission Accepted! Status set to IN PROGRESS.");
      await fetchDashboard();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to accept mission");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteMission = async (missionId: string) => {
    if (!confirm("Are you sure you want to mark this mission as RESOLVED / COMPLETED?")) return;
    try {
      setActionLoading(missionId);
      await api.patch(`/rescue/missions/${missionId}/complete`);
      toast.success("Mission marked COMPLETED and civilian saved!");
      await fetchDashboard();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to complete mission");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-slate-500">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-3" />
        <p className="text-sm font-semibold tracking-wide uppercase">Connecting to Tactical Dispatch Node...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-xl mx-auto my-12">
        <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-lg">Failed to load Tactical Command</h3>
        <p className="text-sm text-slate-500 mt-1 mb-4">{error}</p>
        <button
          onClick={() => fetchDashboard(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm inline-flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Retry Connection
        </button>
      </div>
    );
  }

  const activeMissions = data?.activeMissions || [];

  return (
    <div className="space-y-6">
      {/* Tactical Status Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-blue-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
            <Radio className="h-6 w-6 text-blue-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                Rescue Squad On Duty
              </span>
              <span className="text-xs text-slate-300">Live GPS & Dispatch Active</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Incident Command System: Tactical Field Operations
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/10"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/rescue/missions"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5"
          >
            <Truck className="h-3.5 w-3.5" />
            Missions Board ({activeMissions.length})
          </Link>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
            {data?.activeMissionCount || 0}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Assigned to You</p>
            <p className="text-base font-bold text-slate-900">Active Missions</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            {data?.completedMissionCount || 0}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Resolved</p>
            <p className="text-base font-bold text-slate-900">Completed</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            {data?.totalActiveIncidents || 0}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">City-Wide</p>
            <p className="text-base font-bold text-slate-900">Total Hazards</p>
          </div>
        </div>

        <Link
          href="/rescue/map"
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl shadow-sm flex items-center justify-between transition group"
        >
          <div>
            <p className="text-xs text-indigo-200 font-semibold uppercase tracking-wider">GIS Radar</p>
            <p className="text-base font-bold">Tactical Map</p>
          </div>
          <MapPin className="h-6 w-6 text-indigo-300 group-hover:scale-110 transition-transform" />
        </Link>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          href="/rescue/map"
          className="bg-white hover:bg-slate-50/80 rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Global Tactical Map</h3>
              <p className="text-xs text-slate-500">Live GPS routing & disaster zones</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
        </Link>

        <Link 
          href="/rescue/comms"
          className="bg-white hover:bg-slate-50/80 rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Tactical Comms Radio</h3>
              <p className="text-xs text-slate-500">Coordinate with Command Center</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
        </Link>

        <Link 
          href="/rescue/protocols"
          className="bg-white hover:bg-slate-50/80 rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Standard SOP Protocols</h3>
              <p className="text-xs text-slate-500">Human triage & extraction guides</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* ACTIVE ASSIGNED MISSIONS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              Active Assigned Missions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dispatched incidents requiring your unit's immediate response and extraction
            </p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full">
            {activeMissions.length} Active Unit Dispatch
          </span>
        </div>

        <div className="p-6">
          {activeMissions.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900">All Clear — No Pending Dispatches</h3>
              <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                Your unit is on standby. When Admin Command Center assigns a verified disaster incident, complete caller & GPS routing details will appear here immediately.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {activeMissions.map((mission) => {
                const inc = mission.incident;
                const style = severityStyles[inc.severity] || severityStyles.MEDIUM;
                const Icon = disasterIcons[inc.disasterType] || Zap;
                const isPending = mission.status === "PENDING";
                const isAccepted = mission.status === "ACCEPTED" || inc.status === "IN_PROGRESS";

                return (
                  <div
                    key={mission.id}
                    className={`rounded-2xl border ${style.border} ${style.bg} p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition`}
                  >
                    {/* Mission Header */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm ${style.color} shrink-0 border ${style.border}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-white text-slate-800 border uppercase tracking-wider">
                                {inc.disasterType.replace("_", " ")}
                              </span>
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${style.badge} uppercase tracking-wider`}>
                                {inc.severity} Threat
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                {isPending ? 'DISPATCHED (PENDING ACCEPT)' : 'MISSION IN PROGRESS'}
                              </span>
                            </div>
                            <h3 className="font-extrabold text-slate-900 text-base mt-1 leading-tight">
                              {inc.title}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Problem Description */}
                      {inc.description && (
                        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed mt-3">
                          <strong className="text-slate-900 block mb-0.5">Disaster Nature & Details:</strong>
                          {inc.description}
                        </div>
                      )}
                    </div>

                    {/* Who is in trouble (Citizen Caller Details) */}
                    <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Citizen in Distress / Caller</span>
                        <span className="text-[10px] text-slate-400">Dispatch: {new Date(mission.assignedAt).toLocaleTimeString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs leading-tight">
                              {inc.reportedBy?.fullName || "Anonymous Citizen"}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              Disaster Reporter
                            </p>
                          </div>
                        </div>

                        {inc.reportedBy?.phone ? (
                          <a
                            href={`tel:${inc.reportedBy.phone}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            Call {inc.reportedBy.phone}
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No phone provided</span>
                        )}
                      </div>
                    </div>

                    {/* Location & GPS Direct Navigation Box */}
                    <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                            {inc.address}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            GPS: <span className="font-mono font-medium text-slate-700">{inc.latitude.toFixed(5)}, {inc.longitude.toFixed(5)}</span>
                          </p>
                        </div>
                      </div>

                      {/* Navigation Link Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${inc.latitude},${inc.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition shadow-2xs text-center"
                        >
                          <Navigation className="h-3.5 w-3.5" />
                          Google Maps Navigation
                        </a>

                        <Link
                          href={`/rescue/map?lat=${inc.latitude}&lng=${inc.longitude}&incidentId=${inc.id}`}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition text-center border border-slate-200"
                        >
                          <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                          Tactical Radar
                        </Link>
                      </div>
                    </div>

                    {/* Mission Action Buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      {isPending && (
                        <button
                          onClick={() => handleAcceptMission(mission.id)}
                          disabled={actionLoading === mission.id}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {actionLoading === mission.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          Accept Mission (Deploy)
                        </button>
                      )}

                      <button
                        onClick={() => handleCompleteMission(mission.id)}
                        disabled={actionLoading === mission.id}
                        className={`${isPending ? 'flex-1' : 'w-full'} bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50`}
                      >
                        {actionLoading === mission.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        Mark Mission Resolved / Rescued
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
