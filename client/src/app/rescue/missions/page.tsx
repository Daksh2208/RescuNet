"use client";

import { useEffect, useState } from "react";
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Waves, 
  Users, 
  FileText, 
  Loader2, 
  AlertTriangle, 
  Mountain, 
  CloudRain, 
  Zap, 
  X,
  Phone,
  Navigation,
  ExternalLink,
  ShieldAlert,
  User,
  ClipboardType
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";

type Mission = {
  id: string;
  status: string;
  assignedAt: string;
  acceptedAt?: string | null;
  completedAt?: string | null;
  incident: {
    id: string;
    title: string;
    description: string;
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
      phone?: string;
      email?: string;
    };
    images?: { id: string; imageUrl: string }[];
  };
  assignedBy: {
    id: string;
    fullName: string;
  };
  rescueTeam?: {
    id: string;
    fullName: string;
    phone: string;
  };
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
  CRITICAL: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  HIGH: { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  MEDIUM: { color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" },
  LOW: { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
};

export default function RescueMissionsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError("");
      const [activeRes, completedRes] = await Promise.all([
        api.get("/rescue/missions"),
        api.get("/rescue/missions/completed"),
      ]);
      setActiveMissions(activeRes.data.data || []);
      setCompletedMissions(completedRes.data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch missions:", err);
      setError(err.response?.data?.message || "Failed to load missions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      setActionLoading(id);
      await api.patch(`/rescue/missions/${id}/accept`);
      toast.success("Mission accepted. Status set to EN ROUTE / IN PROGRESS.");
      await fetchMissions();
      if (selectedMission?.id === id) {
        setSelectedMission(null);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to accept mission");
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      setActionLoading(id);
      await api.patch(`/rescue/missions/${id}/complete`);
      toast.success("Mission marked as COMPLETED. Ready to file After-Action Report.");
      await fetchMissions();
      if (selectedMission?.id === id) {
        setSelectedMission(null);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to complete mission");
    } finally {
      setActionLoading(null);
    }
  };

  const getNavigationUrl = (mission: Mission) => {
    if (mission.incident.latitude && mission.incident.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${mission.incident.latitude},${mission.incident.longitude}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mission.incident.address)}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-600" />
            Tactical Missions Queue
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Missions dispatched from Admin Command Center with real-time navigation and civilian caller triage
          </p>
        </div>
        <Link 
          href="/rescue"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-3 bg-slate-50/50">
          <div className="flex gap-2 p-1 rounded-xl w-fit">
            <button 
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "active" ? "bg-white text-blue-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Active Dispatches ({activeMissions.length})
            </button>
            <button 
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "completed" ? "bg-white text-blue-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Completed Operations ({completedMissions.length})
            </button>
          </div>
        </div>

        <div className="p-6 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-3" />
              <p className="text-sm text-slate-500 font-medium">Connecting to Command Dispatch Feed...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800">Failed to load missions</h3>
              <p className="text-sm text-slate-500 mt-1">{error}</p>
            </div>
          ) : activeTab === "active" ? (
            activeMissions.length === 0 ? (
              <div className="text-center py-12">
                <Truck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">No active dispatches</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  When Admin Command dispatches an incident to your squad, it will immediately alert and appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeMissions.map((mission) => {
                  const style = severityStyles[mission.incident.severity] || severityStyles.MEDIUM;
                  const Icon = disasterIcons[mission.incident.disasterType] || Zap;
                  const isPending = mission.status === "PENDING";

                  return (
                    <div 
                      key={mission.id} 
                      className={`p-5 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-all ${
                        isPending ? "bg-amber-50/40 border-amber-200" : "bg-white border-slate-200"
                      }`}
                    >
                      {/* Left Icon & Priority */}
                      <div className="flex flex-col items-center justify-center gap-2.5 md:w-32 md:border-r border-slate-100 md:pr-6 shrink-0">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm ${style.bg} ${style.color}`}>
                          <Icon className="h-7 w-7" />
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border tracking-wider uppercase ${style.border} ${style.color} ${style.bg}`}>
                          {mission.incident.severity}
                        </span>
                      </div>

                      {/* Middle Details */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                              isPending 
                                ? "bg-amber-100 text-amber-800 animate-pulse" 
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {isPending ? "NEW DISPATCH • PENDING ACCEPTANCE" : "MISSION IN PROGRESS"}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg text-slate-900">{mission.incident.title}</h3>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {mission.incident.disasterType} • Dispatched by <strong className="text-slate-700">{mission.assignedBy.fullName}</strong> (Incident Command)
                          </p>
                          {mission.incident.description && (
                            <p className="text-xs text-slate-700 mt-2 bg-white/80 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                              {mission.incident.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                          <a 
                            href={getNavigationUrl(mission)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-blue-600 hover:underline bg-blue-50/70 p-2 rounded-lg border border-blue-100 truncate"
                          >
                            <MapPin className="h-4 w-4 shrink-0 text-blue-600" />
                            <span className="truncate">{mission.incident.address}</span>
                          </a>

                          {mission.incident.reportedBy && (
                            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                              <span className="truncate">Caller: <strong className="text-slate-800">{mission.incident.reportedBy.fullName}</strong></span>
                              {mission.incident.reportedBy.phone && (
                                <a 
                                  href={`tel:${mission.incident.reportedBy.phone}`}
                                  className="text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 shrink-0 ml-1"
                                >
                                  <Phone className="h-3 w-3" /> Call
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Actions */}
                      <div className="flex flex-row md:flex-col gap-2 shrink-0 md:w-40 justify-center">
                        <a
                          href={getNavigationUrl(mission)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-2.5 px-3 rounded-xl text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Navigation className="h-3.5 w-3.5 text-blue-600" /> GPS Route
                        </a>

                        <button 
                          onClick={() => setSelectedMission(mission)}
                          className="flex-1 bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2.5 px-3 rounded-xl text-xs hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <FileText className="h-3.5 w-3.5 text-slate-400" /> Briefing
                        </button>

                        {isPending ? (
                          <button 
                            onClick={() => handleAccept(mission.id)}
                            disabled={actionLoading === mission.id}
                            className="flex-1 bg-emerald-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-1"
                          >
                            {actionLoading === mission.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" /> Accept
                              </>
                            )}
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleComplete(mission.id)}
                            disabled={actionLoading === mission.id}
                            className="flex-1 bg-blue-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-1"
                          >
                            {actionLoading === mission.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" /> Mark Complete
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            completedMissions.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">No completed missions</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  Missions you successfully extract and resolve will appear here for after-action reporting.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedMissions.map((mission) => {
                  const style = severityStyles[mission.incident.severity] || severityStyles.MEDIUM;
                  const Icon = disasterIcons[mission.incident.disasterType] || Zap;

                  return (
                    <div key={mission.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center justify-center gap-2.5 md:w-32 md:border-r border-slate-100 md:pr-6 shrink-0">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${style.bg} ${style.color}`}>
                          <Icon className="h-7 w-7" />
                        </div>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md border tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200">
                          RESOLVED
                        </span>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{mission.incident.title}</h3>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {mission.incident.disasterType} — Completed on {mission.completedAt ? new Date(mission.completedAt).toLocaleString() : "N/A"}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            <span className="truncate">{mission.incident.address}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            <span>Command Dispatcher: {mission.assignedBy.fullName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col gap-2 shrink-0 md:w-36 justify-center">
                        <button 
                          onClick={() => setSelectedMission(mission)}
                          className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <FileText className="h-3.5 w-3.5 text-slate-400" /> Briefing
                        </button>
                        <Link
                          href={`/rescue/reports?missionId=${mission.id}`}
                          className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 font-bold py-2 px-3 rounded-xl text-xs hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5 text-center"
                        >
                          <ClipboardType className="h-3.5 w-3.5 text-blue-600" />
                          File AAR
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>

      {/* FULL TACTICAL MISSION BRIEFING MODAL */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-lg text-slate-900">Tactical Mission Briefing</h3>
              </div>
              <button 
                onClick={() => setSelectedMission(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Incident Title</span>
                <h4 className="font-bold text-slate-900 text-base mt-0.5">{selectedMission.incident.title}</h4>
                <p className="text-slate-700 mt-1 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-medium">
                  {selectedMission.incident.description || "No situation description provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Disaster Type</span>
                  <span className="font-bold text-slate-800 text-xs">{selectedMission.incident.disasterType}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Severity</span>
                  <span className="font-bold text-red-600 text-xs">{selectedMission.incident.severity}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Current Status</span>
                  <span className="font-bold text-blue-700 text-xs">{selectedMission.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Dispatched By</span>
                  <span className="font-bold text-slate-800 text-xs">{selectedMission.assignedBy.fullName}</span>
                </div>
              </div>

              {selectedMission.incident.reportedBy && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Citizen Caller Contact</span>
                    <p className="font-bold text-slate-900">{selectedMission.incident.reportedBy.fullName}</p>
                    <p className="text-slate-600 text-[11px]">{selectedMission.incident.reportedBy.phone || "No phone listed"}</p>
                  </div>
                  {selectedMission.incident.reportedBy.phone && (
                    <a
                      href={`tel:${selectedMission.incident.reportedBy.phone}`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm"
                    >
                      <Phone className="h-3.5 w-3.5" /> Call Caller
                    </a>
                  )}
                </div>
              )}

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-800 uppercase block">Target Coordinates</span>
                  <p className="font-bold text-slate-900">{selectedMission.incident.address}</p>
                  <p className="text-slate-500 text-[10px]">
                    Lat: {selectedMission.incident.latitude}, Lng: {selectedMission.incident.longitude}
                  </p>
                </div>
                <a
                  href={getNavigationUrl(selectedMission)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm shrink-0"
                >
                  <Navigation className="h-3.5 w-3.5" /> Direct Route
                </a>
              </div>

              {selectedMission.incident.images && selectedMission.incident.images.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Attached Recon Photos</span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedMission.incident.images.map((img) => (
                      <img 
                        key={img.id} 
                        src={img.imageUrl} 
                        alt="Incident photo" 
                        className="rounded-lg object-cover h-24 w-full border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-3 border-t">
              {selectedMission.status === "PENDING" && (
                <button 
                  onClick={() => handleAccept(selectedMission.id)}
                  className="flex-1 bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Accept Mission Dispatch
                </button>
              )}
              {selectedMission.status === "ACCEPTED" && (
                <button 
                  onClick={() => handleComplete(selectedMission.id)}
                  className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Mark Mission Complete
                </button>
              )}
              <button 
                onClick={() => setSelectedMission(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
