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
} from "lucide-react";

import Link from "next/link";
import api from "@/lib/api";

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
    };
  }[];
}

export default function AdminVerifyIncidentsPage() {
  const [activeTab, setActiveTab] = useState<
    "unverified" | "verified"
  >("unverified");

  const [incidents, setIncidents] = useState<Incident[]>(
    []
  );

  const [verifiedIncidents, setVerifiedIncidents] =
    useState<Incident[]>([]);

  const [loading, setLoading] = useState(false);

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [error, setError] = useState("");

  // =====================================================
  // FETCH PENDING INCIDENTS
  // =====================================================

  const fetchPendingIncidents = async () => {
    try {
      const res = await api.get(
        "/admin/incidents/pending"
      );

      setIncidents(res.data.data || []);
    } catch (error: any) {
      console.error(
        "Failed to fetch pending incidents:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to fetch pending incidents"
      );
    }
  };

  // =====================================================
  // FETCH VERIFIED INCIDENTS
  // =====================================================

  const fetchVerifiedIncidents = async () => {
    try {
      const res = await api.get(
        "/admin/incidents/verified"
      );

      setVerifiedIncidents(res.data.data || []);
    } catch (error: any) {
      console.error(
        "Failed to fetch verified incidents:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to fetch verified incidents"
      );
    }
  };

  // =====================================================
  // LOAD CURRENT TAB
  // =====================================================

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      if (activeTab === "unverified") {
        await fetchPendingIncidents();
      } else {
        await fetchVerifiedIncidents();
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
      await api.patch(
        `/admin/incidents/${incidentId}/verify`
      );

      // Remove from pending immediately
      setIncidents((prev) =>
        prev.filter(
          (incident) => incident.id !== incidentId
        )
      );

      // Refresh verified list
      await fetchVerifiedIncidents();
    } catch (error: any) {
      console.error(
        "Failed to verify incident:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to verify incident"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // REJECT INCIDENT
  // =====================================================

  const handleReject = async (incidentId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this incident as spam?"
    );

    if (!confirmed) return;

    setActionLoading(incidentId);
    setError("");

    try {
      await api.patch(
        `/admin/incidents/${incidentId}/reject`
      );

      setIncidents((prev) =>
        prev.filter(
          (incident) => incident.id !== incidentId
        )
      );
    } catch (error: any) {
      console.error(
        "Failed to reject incident:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to reject incident"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredIncidents = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    const data =
      activeTab === "unverified"
        ? incidents
        : verifiedIncidents;

    if (!search) return data;

    return data.filter(
      (incident) =>
        incident.id
          .toLowerCase()
          .includes(search) ||
        incident.title
          .toLowerCase()
          .includes(search) ||
        incident.description
          .toLowerCase()
          .includes(search) ||
        incident.disasterType
          .toLowerCase()
          .includes(search) ||
        incident.address
          .toLowerCase()
          .includes(search) ||
        incident.reportedBy.fullName
          .toLowerCase()
          .includes(search)
    );
  }, [
    searchTerm,
    activeTab,
    incidents,
    verifiedIncidents,
  ]);

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // SEVERITY STYLE
  // =====================================================

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-100 text-red-700";

      case "HIGH":
        return "bg-orange-100 text-orange-700";

      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-green-100 text-green-700";
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusClass = (status: IncidentStatus) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 text-green-700";

      case "ASSIGNED":
        return "bg-blue-100 text-blue-700";

      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-700";

      case "RESOLVED":
        return "bg-emerald-100 text-emerald-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">

            <CheckSquare className="h-6 w-6 text-purple-600" />

            Global Incident Moderation

          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Review and verify Citizen SOS reports before
            assigning Rescue Teams
          </p>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={loadData}
            disabled={loading}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 disabled:opacity-50"
          >

            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""
                }`}
            />

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

          <XCircle className="h-4 w-4" />

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
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "unverified"
                  ? "bg-white text-purple-700 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              Unverified Queue ({incidents.length})
            </button>

            <button
              onClick={() => {
                setActiveTab("verified");
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "verified"
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
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Search incidents..."
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />

          </div>

        </div>

        {/* CONTENT */}

        <div className="divide-y divide-slate-100">

          {loading && (
            <div className="p-12 flex flex-col items-center justify-center text-slate-500">

              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-3" />

              <p className="text-sm font-medium">
                Loading incidents...
              </p>

            </div>
          )}

          {/* =================================================
              UNVERIFIED
             ================================================= */}

          {!loading &&
            activeTab === "unverified" && (

              filteredIncidents.length === 0 ? (

                <EmptyState
                  title="No unverified incidents"
                  description="There are currently no pending Citizen SOS reports."
                />

              ) : (

                filteredIncidents.map(
                  (incident) => (

                    <div
                      key={incident.id}
                      className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6"
                    >

                      <div className="flex-1 space-y-3">

                        {/* BADGES */}

                        <div className="flex items-center gap-2 flex-wrap">

                          <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                            {incident.id.slice(0, 8)}
                          </span>

                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${getSeverityClass(
                              incident.severity
                            )}`}
                          >
                            {incident.severity}
                          </span>

                          <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-md uppercase tracking-wider">
                            {incident.disasterType}
                          </span>

                        </div>

                        {/* TITLE */}

                        <div>

                          <h3 className="font-bold text-slate-900 text-lg">
                            {incident.title}
                          </h3>

                          <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                            {incident.description}
                          </p>

                        </div>

                        {/* LOCATION / REPORTER */}

                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">

                          <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">

                            <MapPin className="h-3.5 w-3.5 text-slate-400" />

                            {incident.address}

                          </span>

                          <span>
                            Reported by:{" "}
                            {incident.reportedBy.fullName}
                          </span>

                          <span>
                            {formatDate(
                              incident.createdAt
                            )}
                          </span>

                        </div>

                        {/* AI ANALYSIS */}

                        {incident.aiAnalysis && (
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">

                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                              AI Priority
                            </div>

                            <div className="flex items-center gap-2">

                              <span
                                className={`text-sm font-black ${getSeverityClass(
                                  incident.aiAnalysis
                                    .priority
                                )
                                  .replace(
                                    "bg-",
                                    "text-"
                                  )}`}
                              >
                                {
                                  incident.aiAnalysis
                                    .priority
                                }
                              </span>

                              <span className="text-xs text-slate-500">
                                AI analysis available
                              </span>

                            </div>

                            <p className="text-xs text-slate-600 mt-1">
                              {
                                incident.aiAnalysis
                                  .summary
                              }
                            </p>

                          </div>
                        )}

                      </div>

                      {/* ACTIONS */}

                      <div className="w-full md:w-64 shrink-0 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center mb-1">

                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Current Status
                          </div>

                          <div className="text-sm font-black text-orange-600">
                            PENDING REVIEW
                          </div>

                        </div>

                        <button
                          onClick={() =>
                            handleVerify(
                              incident.id
                            )
                          }
                          disabled={
                            actionLoading ===
                            incident.id
                          }
                          className="w-full px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                        >

                          {actionLoading ===
                            incident.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ShieldCheck className="h-4 w-4" />
                          )}

                          Verify Incident

                        </button>

                        <button
                          onClick={() =>
                            handleReject(
                              incident.id
                            )
                          }
                          disabled={
                            actionLoading ===
                            incident.id
                          }
                          className="w-full px-4 py-2 bg-white text-red-600 hover:bg-red-50 transition-colors rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-red-200 shadow-sm disabled:opacity-50"
                        >

                          <XCircle className="h-4 w-4" />

                          Reject (Spam)

                        </button>

                      </div>

                    </div>

                  )
                )

              )
            )}

          {/* =================================================
              VERIFIED
             ================================================= */}

          {!loading &&
            activeTab === "verified" && (

              filteredIncidents.length === 0 ? (

                <EmptyState
                  title="No verified incidents"
                  description="No verified or currently active incidents were found."
                />

              ) : (

                filteredIncidents.map(
                  (incident) => (

                    <div
                      key={incident.id}
                      className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row items-center justify-between gap-6"
                    >

                      <div className="flex-1 space-y-3">

                        <div className="flex items-center gap-2 flex-wrap">

                          <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                            {incident.id.slice(0, 8)}
                          </span>

                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${getSeverityClass(
                              incident.severity
                            )}`}
                          >
                            {incident.severity}
                          </span>

                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${getStatusClass(
                              incident.status
                            )}`}
                          >
                            {incident.status}
                          </span>

                        </div>

                        <div>

                          <h3 className="font-bold text-slate-900 text-lg">
                            {incident.title}
                          </h3>

                          <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                            {incident.description}
                          </p>

                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">

                          <span className="flex items-center gap-1">

                            <MapPin className="h-3.5 w-3.5" />

                            {incident.address}

                          </span>

                          <span>
                            Reported by:{" "}
                            {incident.reportedBy.fullName}
                          </span>

                        </div>

                        {incident.assignments &&
                          incident.assignments.length >
                          0 && (

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">

                              <div className="text-xs font-bold text-blue-700 mb-1">
                                Rescue Assignment
                              </div>

                              {incident.assignments.map(
                                (assignment) => (

                                  <div
                                    key={
                                      assignment.id
                                    }
                                    className="text-xs text-blue-900"
                                  >
                                    {assignment.rescueTeam
                                      .fullName}{" "}
                                    •{" "}
                                    {
                                      assignment.status
                                    }
                                  </div>

                                )
                              )}

                            </div>
                          )}

                      </div>

                      <div className="flex items-center gap-4 border-l border-slate-200 pl-6">

                        <div className="text-right">

                          <div className="flex items-center justify-end gap-1 text-green-600 mb-1">

                            <CheckCircle2 className="h-4 w-4" />

                            <span className="text-sm font-bold">
                              {incident.status ===
                                "VERIFIED"
                                ? "Verified"
                                : incident.status ===
                                  "ASSIGNED"
                                  ? "Dispatched"
                                  : "In Progress"}
                            </span>

                          </div>

                          <p className="text-xs text-slate-500">

                            {incident.verifiedBy
                              ? `Verified by ${incident.verifiedBy.fullName}`
                              : "Verified"}

                          </p>

                        </div>

                      </div>

                    </div>

                  )
                )

              )
            )}

        </div>
      </div>
    </div>
  );
}

// =========================================================
// EMPTY STATE
// =========================================================

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

      <h3 className="font-bold text-slate-800">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
        {description}
      </p>

    </div>
  );
}

