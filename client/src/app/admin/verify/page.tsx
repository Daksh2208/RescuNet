"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckSquare,
  Search,
  ShieldCheck,
  XCircle,
  MapPin,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Clock,
  Truck,
  Phone,
  User,
  Send,
  X,
  AlertTriangle,
  Flame,
  Waves,
  Mountain,
  CloudRain,
  Zap,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";

type IncidentStatus =
  | "PENDING"
  | "VERIFIED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED";

interface Incident {
  id: string;
  title: string;
  description: string;
  disasterType: string;
  severity: string;
  status: IncidentStatus;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: string;
  updatedAt?: string;
  reportedBy: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
  verifiedBy?: {
    id: string;
    fullName: string;
  } | null;
  aiAnalysis?: {
    priority: string;
    summary: string;
    recommendation: string;
    aiResponse: string;
  } | null;
  assignments?: {
    id: string;
    status: string;
    assignedAt: string;
    acceptedAt?: string | null;
    completedAt?: string | null;
    rescueTeam: {
      id: string;
      fullName: string;
      phone: string;
      email?: string;
    };
  }[];
}

interface RescueTeam {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  activeMissionsCount: number;
}

const disasterIcons: Record<string, any> = {
  FLOOD: Waves,
  EARTHQUAKE: Mountain,
  FIRE: Flame,
  CYCLONE: CloudRain,
  LANDSLIDE: Mountain,
  OTHER: Zap,
};

export default function AdminVerifyIncidentsPage() {
  const [activeTab, setActiveTab] = useState<"unverified" | "verified">("unverified");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [verifiedIncidents, setVerifiedIncidents] = useState<Incident[]>([]);
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Dispatch Modal State
  const [dispatchModalIncident, setDispatchModalIncident] = useState<Incident | null>(null);
  const [selectedRescueTeamId, setSelectedRescueTeamId] = useState("");
  const [dispatching, setDispatching] = useState(false);

  // =====================================================
  // FETCH INCIDENTS & RESCUE TEAMS
  // =====================================================

  const fetchPendingIncidents = async () => {
    try {
      const res = await api.get("/admin/incidents/pending");
      setIncidents(res.data.data || []);
    } catch (error: any) {
      console.error("Failed to fetch pending incidents:", error);
      setError(error.response?.data?.message || "Failed to fetch pending incidents");
    }
  };

  const fetchVerifiedIncidents = async () => {
    try {
      const res = await api.get("/admin/incidents/verified");
      setVerifiedIncidents(res.data.data || []);
    } catch (error: any) {
      console.error("Failed to fetch verified incidents:", error);
      setError(error.response?.data?.message || "Failed to fetch verified incidents");
    }
  };

  const fetchRescueTeams = async () => {
    try {
      const res = await api.get("/admin/incidents/rescue-teams");
      setRescueTeams(res.data.data || []);
      if (res.data.data && res.data.data.length > 0 && !selectedRescueTeamId) {
        setSelectedRescueTeamId(res.data.data[0].id);
      }
    } catch (err) {
      console.error("Failed to load rescue teams:", err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "unverified") {
        await Promise.all([fetchPendingIncidents(), fetchRescueTeams()]);
      } else {
        await Promise.all([fetchVerifiedIncidents(), fetchRescueTeams()]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // =====================================================
  // VERIFY INCIDENT
  // =====================================================

  const handleVerify = async (incidentId: string) => {
    setActionLoading(incidentId);
    setError("");

    try {
      await api.patch(`/admin/incidents/${incidentId}/verify`);
      toast.success("Incident verified successfully!");
      setIncidents((prev) => prev.filter((incident) => incident.id !== incidentId));
      await fetchVerifiedIncidents();
    } catch (error: any) {
      console.error("Failed to verify incident:", error);
      setError(error.response?.data?.message || "Failed to verify incident");
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // REJECT INCIDENT
  // =====================================================

  const handleReject = async (incidentId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this incident as invalid or spam?"
    );
    if (!confirmed) return;

    setActionLoading(incidentId);
    setError("");

    try {
      await api.patch(`/admin/incidents/${incidentId}/reject`);
      toast.success("Incident rejected.");
      setIncidents((prev) => prev.filter((incident) => incident.id !== incidentId));
    } catch (error: any) {
      console.error("Failed to reject incident:", error);
      setError(error.response?.data?.message || "Failed to reject incident");
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // DISPATCH RESCUE TEAM
  // =====================================================

  const handleOpenDispatchModal = (incident: Incident) => {
    setDispatchModalIncident(incident);
    if (rescueTeams.length > 0 && !selectedRescueTeamId) {
      setSelectedRescueTeamId(rescueTeams[0].id);
    }
  };

  const handleConfirmDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModalIncident || !selectedRescueTeamId) {
      alert("Please select a rescue team to dispatch.");
      return;
    }

    try {
      setDispatching(true);
      await api.post(`/admin/incidents/${dispatchModalIncident.id}/assign`, {
        rescueTeamId: selectedRescueTeamId,
      });

      toast.success(`Mission dispatched to Rescue Officer!`);
      setDispatchModalIncident(null);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to dispatch rescue team");
    } finally {
      setDispatching(false);
    }
  };

  // =====================================================
  // SEARCH FILTER
  // =====================================================

  const filteredIncidents = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    const data = activeTab === "unverified" ? incidents : verifiedIncidents;

    if (!search) return data;

    return data.filter(
      (incident) =>
        incident.id.toLowerCase().includes(search) ||
        incident.title.toLowerCase().includes(search) ||
        incident.description.toLowerCase().includes(search) ||
        incident.disasterType.toLowerCase().includes(search) ||
        incident.address.toLowerCase().includes(search) ||
        incident.reportedBy.fullName.toLowerCase().includes(search)
    );
  }, [searchTerm, activeTab, incidents, verifiedIncidents]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-100 text-red-700 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getStatusClass = (status: IncidentStatus) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 text-green-700 border-green-200";
      case "ASSIGNED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "RESOLVED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-purple-600" />
            Command Center: Incident Moderation & Dispatch
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review Citizen SOS reports, verify operational threat level, and dispatch designated Rescue Squads
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <Link
            href="/admin"
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0 flex items-center justify-center"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <XCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* TABS */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50">
          <div className="flex gap-2 p-1 rounded-xl w-fit">
            <button
              onClick={() => {
                setActiveTab("unverified");
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "unverified"
                  ? "bg-white text-purple-700 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Unverified SOS Queue ({incidents.length})
            </button>

            <button
              onClick={() => {
                setActiveTab("verified");
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "verified"
                  ? "bg-white text-purple-700 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Verified / Dispatched ({verifiedIncidents.length})
            </button>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search incident, type, location..."
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="divide-y divide-slate-100">
          {loading && (
            <div className="p-12 flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-3" />
              <p className="text-sm font-medium">Loading operational incidents...</p>
            </div>
          )}

          {/* UNVERIFIED QUEUE */}
          {!loading && activeTab === "unverified" && (
            filteredIncidents.length === 0 ? (
              <EmptyState
                title="No pending unverified SOS reports"
                description="All citizen disaster requests have been reviewed and forwarded."
              />
            ) : (
              filteredIncidents.map((incident) => {
                const Icon = disasterIcons[incident.disasterType] || Zap;

                return (
                  <div
                    key={incident.id}
                    className="p-6 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row gap-6"
                  >
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                          {incident.id.slice(0, 8)}
                        </span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider border ${getSeverityClass(incident.severity)}`}>
                          {incident.severity}
                        </span>
                        <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <Icon className="h-3.5 w-3.5" />
                          {incident.disasterType}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{incident.title}</h3>
                        <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                          {incident.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {incident.address}
                        </span>
                        <span>Reported by: <strong className="text-slate-700">{incident.reportedBy.fullName}</strong></span>
                        <span>{formatDate(incident.createdAt)}</span>
                      </div>

                      {incident.aiAnalysis && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            AI Threat Analysis
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-extrabold ${getSeverityClass(incident.aiAnalysis.priority)} px-2 py-0.5 rounded`}>
                              PRIORITY: {incident.aiAnalysis.priority}
                            </span>
                            <span className="text-xs text-slate-600 font-medium">
                              {incident.aiAnalysis.summary}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="w-full md:w-64 shrink-0 flex flex-col gap-2.5 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center mb-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Review Status
                        </div>
                        <div className="text-xs font-bold text-orange-600 mt-0.5">
                          PENDING VERIFICATION
                        </div>
                      </div>

                      <button
                        onClick={() => handleVerify(incident.id)}
                        disabled={actionLoading === incident.id}
                        className="w-full px-4 py-2.5 bg-purple-600 text-white hover:bg-purple-700 transition-colors rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                      >
                        {actionLoading === incident.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ShieldCheck className="h-4 w-4" />
                        )}
                        Verify Incident
                      </button>

                      <button
                        onClick={() => handleOpenDispatchModal(incident)}
                        className="w-full px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Truck className="h-4 w-4" />
                        Verify & Dispatch Team
                      </button>

                      <button
                        onClick={() => handleReject(incident.id)}
                        disabled={actionLoading === incident.id}
                        className="w-full px-4 py-2 bg-white text-red-600 hover:bg-red-50 transition-colors rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-red-200 shadow-sm disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject (Spam)
                      </button>
                    </div>
                  </div>
                );
              })
            )
          )}

          {/* VERIFIED QUEUE */}
          {!loading && activeTab === "verified" && (
            filteredIncidents.length === 0 ? (
              <EmptyState
                title="No verified incidents"
                description="No verified or currently active disaster missions were found."
              />
            ) : (
              filteredIncidents.map((incident) => {
                const Icon = disasterIcons[incident.disasterType] || Zap;
                const isAssigned = incident.assignments && incident.assignments.length > 0;

                return (
                  <div
                    key={incident.id}
                    className="p-6 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
                  >
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                          {incident.id.slice(0, 8)}
                        </span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider border ${getSeverityClass(incident.severity)}`}>
                          {incident.severity}
                        </span>
                        <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <Icon className="h-3.5 w-3.5" />
                          {incident.disasterType}
                        </span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider border ${getStatusClass(incident.status)}`}>
                          {incident.status}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{incident.title}</h3>
                        <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                          {incident.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${incident.latitude},${incident.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded-md border border-blue-100"
                        >
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {incident.address} <ExternalLink className="h-3 w-3 ml-0.5" />
                        </a>
                        <span>Reported by: <strong className="text-slate-700">{incident.reportedBy.fullName}</strong></span>
                        {incident.verifiedBy && (
                          <span className="text-purple-700">Verified by: {incident.verifiedBy.fullName}</span>
                        )}
                      </div>

                      {/* Dispatched Rescue Teams Card */}
                      {isAssigned ? (
                        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-2">
                          <div className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                            <Truck className="h-4 w-4 text-blue-600" /> Dispatched Rescue Officers & Status
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {incident.assignments!.map((assignment) => (
                              <div key={assignment.id} className="bg-white p-2.5 rounded-lg border border-blue-100 flex items-center justify-between text-xs">
                                <div>
                                  <p className="font-bold text-slate-900">{assignment.rescueTeam.fullName}</p>
                                  <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                                    <Phone className="h-3 w-3" /> {assignment.rescueTeam.phone || "No phone listed"}
                                  </p>
                                </div>
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                                  assignment.status === 'COMPLETED' 
                                    ? 'bg-emerald-100 text-emerald-700' 
                                    : assignment.status === 'ACCEPTED' 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {assignment.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-semibold flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                          <span>Incident verified. Needs Rescue Team deployment!</span>
                        </div>
                      )}
                    </div>

                    {/* Dispatch Button & Controls */}
                    <div className="w-full md:w-56 shrink-0 flex flex-col gap-2.5 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                      <button
                        onClick={() => handleOpenDispatchModal(incident)}
                        className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                      >
                        <Truck className="h-4 w-4" />
                        {isAssigned ? "Dispatch Additional Unit" : "Dispatch Rescue Team"}
                      </button>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${incident.latitude},${incident.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MapPin className="h-3.5 w-3.5 text-blue-600" /> View on Map
                      </a>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>

      {/* DISPATCH RESCUE TEAM MODAL */}
      {dispatchModalIncident && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Dispatch Rescue Unit</h3>
                  <p className="text-xs text-slate-500">Incident Command Emergency Dispatch</p>
                </div>
              </div>
              <button 
                onClick={() => setDispatchModalIncident(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tactical Incident Card Brief */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 uppercase">
                  {dispatchModalIncident.disasterType}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getSeverityClass(dispatchModalIncident.severity)}`}>
                  {dispatchModalIncident.severity}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{dispatchModalIncident.title}</h4>
              <p className="text-xs text-slate-600 line-clamp-2">{dispatchModalIncident.description}</p>
              <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1 border-t border-slate-200/60">
                <MapPin className="h-3 w-3 shrink-0 text-slate-400" /> {dispatchModalIncident.address}
              </div>
            </div>

            {/* Select Rescue Squad Form */}
            <form onSubmit={handleConfirmDispatch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Certified Rescue Officer / Squad
                </label>
                {rescueTeams.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                    No active rescue officers registered in the system. Verify Rescue users under User Management.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {rescueTeams.map((team) => {
                      const isSelected = selectedRescueTeamId === team.id;
                      return (
                        <div
                          key={team.id}
                          onClick={() => setSelectedRescueTeamId(team.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-purple-50 border-purple-500 ring-2 ring-purple-500/20"
                              : "bg-white border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              isSelected ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-700"
                            }`}>
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-xs">{team.fullName}</p>
                              <p className="text-[11px] text-slate-500">{team.phone || team.email}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            team.activeMissionsCount === 0 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-orange-100 text-orange-700"
                          }`}>
                            {team.activeMissionsCount} Active {team.activeMissionsCount === 1 ? "Mission" : "Missions"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setDispatchModalIncident(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dispatching || !selectedRescueTeamId || rescueTeams.length === 0}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
                >
                  {dispatching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Dispatching...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Dispatch Mission Now
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-12 text-center">
      <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <CheckSquare className="h-7 w-7 text-slate-400" />
      </div>
      <h3 className="font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">{description}</p>
    </div>
  );
}
