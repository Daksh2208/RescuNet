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
  PawPrint, 
  FileText, 
  Loader2,
  AlertTriangle,
  Mountain,
  CloudRain,
  Zap,
  X
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

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
  CRITICAL: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  HIGH: { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  MEDIUM: { color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  LOW: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
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
      await fetchMissions();
      if (selectedMission?.id === id) {
        setSelectedMission(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to accept mission");
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      setActionLoading(id);
      await api.patch(`/rescue/missions/${id}/complete`);
      await fetchMissions();
      if (selectedMission?.id === id) {
        setSelectedMission(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to complete mission");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-600" />
            Rescue Missions
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track your unit's current dispatch assignments</p>
        </div>
        <Link 
          href="/rescue"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-3">
          <div className="flex gap-2 bg-slate-50 p-1 rounded-xl w-fit">
            <button 
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === "active" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Active Assignments ({activeMissions.length})
            </button>
            <button 
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === "completed" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Completed ({completedMissions.length})
            </button>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-3" />
              <p className="text-sm text-slate-500">Loading missions...</p>
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
                <h3 className="text-lg font-bold text-slate-900">No active missions</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  When new dispatch assignments are issued to your unit, they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeMissions.map((mission) => {
                  const style = severityStyles[mission.incident.severity] || severityStyles.MEDIUM;
                  const Icon = disasterIcons[mission.incident.disasterType] || Zap;
                  const isPending = mission.status === "PENDING";

                  return (
                    <div key={mission.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                      
                      {/* Left Column: Icon & Priority */}
                      <div className="flex flex-col items-center justify-center gap-3 md:w-32 md:border-r border-slate-100 md:pr-6 shrink-0">
                        <div className={`h-14 w-14 rounded-full flex items-center justify-center ${style.bg} ${style.color}`}>
                          <Icon className="h-7 w-7" />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md border tracking-wider ${style.border} ${style.color} ${style.bg}`}>
                          {mission.incident.severity}
                        </span>
                      </div>

                      {/* Middle Column: Details */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                              {mission.status}
                            </span>
                            <h3 className="font-bold text-lg text-slate-900">{mission.incident.title}</h3>
                          </div>
                          <p className="text-sm font-medium text-slate-600">
                            {mission.incident.disasterType.replace("_", " ")} — Assigned by {mission.assignedBy.fullName}
                          </p>
                          {mission.incident.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {mission.incident.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                            <span className="truncate">{mission.incident.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                            <span>Assigned: {new Date(mission.assignedAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Actions */}
                      <div className="flex flex-row md:flex-col gap-2 shrink-0 md:w-36 justify-center">
                        <button 
                          onClick={() => setSelectedMission(mission)}
                          className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <FileText className="h-4 w-4 text-slate-400" /> Details
                        </button>
                        {isPending ? (
                          <button 
                            onClick={() => handleAccept(mission.id)}
                            disabled={actionLoading === mission.id}
                            className="flex-1 bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
                          >
                            {actionLoading === mission.id ? "Accepting..." : "Accept"}
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleComplete(mission.id)}
                            disabled={actionLoading === mission.id}
                            className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                          >
                            {actionLoading === mission.id ? "Completing..." : "Complete"}
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
                  Missions you complete will appear here for your logs and after-action reporting.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedMissions.map((mission) => {
                  const style = severityStyles[mission.incident.severity] || severityStyles.MEDIUM;
                  const Icon = disasterIcons[mission.incident.disasterType] || Zap;

                  return (
                    <div key={mission.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center justify-center gap-3 md:w-32 md:border-r border-slate-100 md:pr-6 shrink-0">
                        <div className={`h-14 w-14 rounded-full flex items-center justify-center ${style.bg} ${style.color}`}>
                          <Icon className="h-7 w-7" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 rounded-md border tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200">
                          COMPLETED
                        </span>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{mission.incident.title}</h3>
                          <p className="text-sm font-medium text-slate-600">
                            {mission.incident.disasterType.replace("_", " ")} — Completed on {mission.completedAt ? new Date(mission.completedAt).toLocaleString() : "N/A"}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                            <span className="truncate">{mission.incident.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                            <span>Assigned by: {mission.assignedBy.fullName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col gap-2 shrink-0 md:w-36 justify-center">
                        <button 
                          onClick={() => setSelectedMission(mission)}
                          className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <FileText className="h-4 w-4 text-slate-400" /> Details
                        </button>
                        <Link
                          href={`/rescue/reports`}
                          className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 font-bold py-2 px-4 rounded-lg text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5 text-center"
                        >
                          File Report
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

      {/* Details Modal */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">Mission Details</h3>
              <button 
                onClick={() => setSelectedMission(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Incident</span>
                <h4 className="font-bold text-slate-900 text-base">{selectedMission.incident.title}</h4>
                <p className="text-sm text-slate-600 mt-1">{selectedMission.incident.description || "No additional description."}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block">Disaster Type</span>
                  <span className="font-bold text-slate-800">{selectedMission.incident.disasterType}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Severity</span>
                  <span className="font-bold text-slate-800">{selectedMission.incident.severity}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Status</span>
                  <span className="font-bold text-slate-800">{selectedMission.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Assigned By</span>
                  <span className="font-bold text-slate-800">{selectedMission.assignedBy.fullName}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Location Address</span>
                <p className="text-sm font-medium text-slate-800 mt-0.5">{selectedMission.incident.address}</p>
                <p className="text-xs text-slate-400">Lat: {selectedMission.incident.latitude}, Lng: {selectedMission.incident.longitude}</p>
              </div>

              {selectedMission.incident.images && selectedMission.incident.images.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Attached Photos</span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedMission.incident.images.map((img) => (
                      <img 
                        key={img.id} 
                        src={img.imageUrl} 
                        alt="Incident photo" 
                        className="rounded-lg object-cover h-28 w-full border"
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
                  className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-xl text-sm hover:bg-emerald-700"
                >
                  Accept Mission
                </button>
              )}
              {selectedMission.status === "ACCEPTED" && (
                <button 
                  onClick={() => handleComplete(selectedMission.id)}
                  className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-xl text-sm hover:bg-blue-700"
                >
                  Mark Complete
                </button>
              )}
              <button 
                onClick={() => setSelectedMission(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200"
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
