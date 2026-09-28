"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  ShieldCheck,
  Ban,
  Clock,
  Loader2,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

type UserRole = "ADMIN" | "CITIZEN" | "RESCUE" | "VOLUNTEER";

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

type Tab = "pending" | "active" | "citizens";

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const [pendingUsers, setPendingUsers] = useState<AdminUser[]>([]);
  const [activePersonnel, setActivePersonnel] = useState<AdminUser[]>([]);
  const [citizens, setCitizens] = useState<AdminUser[]>([]);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [error, setError] = useState("");

  // =========================================================
  // FETCH DATA
  // =========================================================

  const fetchPendingUsers = async () => {
    try {
      const res = await api.get("/admin/users/pending");

      setPendingUsers(res.data.data || []);
    } catch (error: any) {
      console.error("Failed to fetch pending users:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load pending users"
      );
    }
  };

  const fetchActivePersonnel = async () => {
    try {
      const res = await api.get("/admin/users/active");

      setActivePersonnel(res.data.data || []);
    } catch (error: any) {
      console.error("Failed to fetch active personnel:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load active personnel"
      );
    }
  };

  const fetchCitizens = async () => {
    try {
      const res = await api.get("/admin/users/citizens");

      setCitizens(res.data.data || []);
    } catch (error: any) {
      console.error("Failed to fetch citizens:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load citizens"
      );
    }
  };

  // =========================================================
  // LOAD CURRENT TAB
  // =========================================================

  const loadTabData = async () => {
    setLoading(true);
    setError("");

    try {
      if (activeTab === "pending") {
        await fetchPendingUsers();
      }

      if (activeTab === "active") {
        await fetchActivePersonnel();
      }

      if (activeTab === "citizens") {
        await fetchCitizens();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  // =========================================================
  // APPROVE USER
  // =========================================================

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    setError("");

    try {
      await api.patch(`/admin/users/${userId}/approve`);

      // Remove from pending immediately
      setPendingUsers((prev) =>
        prev.filter((user) => user.id !== userId)
      );

      // Refresh active personnel
      await fetchActivePersonnel();
    } catch (error: any) {
      console.error("Failed to approve user:", error);

      setError(
        error.response?.data?.message ||
          "Failed to approve user"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // REJECT USER
  // =========================================================

  const handleReject = async (userId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this user?"
    );

    if (!confirmed) return;

    setActionLoading(userId);
    setError("");

    try {
      await api.patch(`/admin/users/${userId}/reject`);

      // Remove from pending list
      setPendingUsers((prev) =>
        prev.filter((user) => user.id !== userId)
      );
    } catch (error: any) {
      console.error("Failed to reject user:", error);

      setError(
        error.response?.data?.message ||
          "Failed to reject user"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // DEACTIVATE USER
  // =========================================================

  const handleDeactivate = async (userId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this account?"
    );

    if (!confirmed) return;

    setActionLoading(userId);
    setError("");

    try {
      await api.patch(
        `/admin/users/${userId}/deactivate`
      );

      // Refresh active personnel
      await fetchActivePersonnel();

      // Refresh citizens as well
      await fetchCitizens();
    } catch (error: any) {
      console.error("Failed to deactivate user:", error);

      setError(
        error.response?.data?.message ||
          "Failed to deactivate user"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // ACTIVATE USER
  // =========================================================

  const handleActivate = async (userId: string) => {
    setActionLoading(userId);
    setError("");

    try {
      await api.patch(
        `/admin/users/${userId}/activate`
      );

      await fetchActivePersonnel();
      await fetchCitizens();
    } catch (error: any) {
      console.error("Failed to activate user:", error);

      setError(
        error.response?.data?.message ||
          "Failed to activate user"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredUsers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      if (activeTab === "pending") return pendingUsers;
      if (activeTab === "active") return activePersonnel;
      return citizens;
    }

    const users =
      activeTab === "pending"
        ? pendingUsers
        : activeTab === "active"
          ? activePersonnel
          : citizens;

    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(search) ||
        user.id.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search)
    );
  }, [
    searchTerm,
    activeTab,
    pendingUsers,
    activePersonnel,
    citizens,
  ]);

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            User Management & Verification
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Approve Rescue Teams and Volunteer roles, or
            moderate Citizen access
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={loadTabData}
            disabled={loading}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
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

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <XCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* TABS + SEARCH */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50">

          <div className="flex gap-2 p-1 rounded-xl w-fit">

            {/* PENDING */}
            <button
              onClick={() => {
                setActiveTab("pending");
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "pending"
                  ? "bg-white text-purple-700 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Pending Verification ({pendingUsers.length})
            </button>

            {/* ACTIVE */}
            <button
              onClick={() => {
                setActiveTab("active");
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "active"
                  ? "bg-white text-purple-700 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Active Personnel
            </button>

            {/* CITIZENS */}
            <button
              onClick={() => {
                setActiveTab("citizens");
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "citizens"
                  ? "bg-white text-purple-700 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Citizens ({citizens.length})
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
              placeholder="Search user ID or name..."
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="divide-y divide-slate-100">

          {/* LOADING */}
          {loading && (
            <div className="p-12 flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-3" />
              <p className="text-sm font-medium">
                Loading users...
              </p>
            </div>
          )}

          {/* =================================================
              PENDING USERS
             ================================================= */}

          {!loading && activeTab === "pending" && (

            <>
              {filteredUsers.length === 0 ? (
                <EmptyState
                  title="No pending users"
                  description="There are currently no Rescue Team or Volunteer accounts waiting for verification."
                />
              ) : (
                filteredUsers.map((user) => (

                  <div
                    key={user.id}
                    className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >

                    <div className="flex items-start gap-4">

                      <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shrink-0">
                        <Users className="h-6 w-6" />
                      </div>

                      <div>

                        <div className="flex items-center gap-2 mb-1 flex-wrap">

                          <h3 className="font-bold text-slate-900 text-lg">
                            {user.fullName}
                          </h3>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              user.role === "RESCUE"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            Requested: {user.role}
                          </span>

                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 font-medium">

                          <span>
                            ID: {user.id}
                          </span>

                          <span className="hidden sm:inline text-slate-300">
                            •
                          </span>

                          <span>
                            {user.email}
                          </span>

                          <span className="hidden sm:inline text-slate-300">
                            •
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDate(user.createdAt)}
                          </span>

                        </div>

                        <p className="mt-2 text-xs font-medium text-slate-500">
                          Phone: {user.phone}
                        </p>

                        <div className="mt-2 text-xs font-semibold text-amber-600 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          Pending Admin Verification
                        </div>

                      </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-3 shrink-0">

                      <button
                        onClick={() =>
                          handleReject(user.id)
                        }
                        disabled={
                          actionLoading === user.id
                        }
                        className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors rounded-xl text-sm font-bold flex items-center gap-2 border border-slate-200 disabled:opacity-50"
                      >

                        {actionLoading === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Ban className="h-4 w-4" />
                        )}

                        Reject
                      </button>

                      <button
                        onClick={() =>
                          handleApprove(user.id)
                        }
                        disabled={
                          actionLoading === user.id
                        }
                        className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
                      >

                        {actionLoading === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ShieldCheck className="h-4 w-4" />
                        )}

                        Approve Role
                      </button>

                    </div>

                  </div>

                ))
              )}
            </>
          )}

          {/* =================================================
              ACTIVE PERSONNEL
             ================================================= */}

          {!loading && activeTab === "active" && (

            <div className="p-6">

              {filteredUsers.length === 0 ? (
                <EmptyState
                  title="No active personnel"
                  description="No verified Rescue Team or Volunteer accounts were found."
                />
              ) : (

                <div className="overflow-x-auto">

                  <table className="w-full text-left text-sm whitespace-nowrap">

                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">

                      <tr>
                        <th className="px-4 py-3 font-bold">
                          Personnel ID
                        </th>

                        <th className="px-4 py-3 font-bold">
                          Name
                        </th>

                        <th className="px-4 py-3 font-bold">
                          Role
                        </th>

                        <th className="px-4 py-3 font-bold">
                          Status
                        </th>

                        <th className="px-4 py-3 font-bold text-right">
                          Actions
                        </th>
                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {filteredUsers.map((user) => (

                        <tr
                          key={user.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >

                          <td className="px-4 py-4 font-mono font-medium text-slate-900">
                            {user.id.slice(0, 8)}...
                          </td>

                          <td className="px-4 py-4">

                            <div className="font-bold text-slate-700">
                              {user.fullName}
                            </div>

                            <div className="text-xs text-slate-400 mt-1">
                              {user.email}
                            </div>

                          </td>

                          <td className="px-4 py-4">

                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider border ${
                                user.role === "RESCUE"
                                  ? "bg-blue-100 text-blue-700 border-blue-200"
                                  : "bg-green-100 text-green-700 border-green-200"
                              }`}
                            >
                              {user.role === "RESCUE"
                                ? "Rescue Team"
                                : "Volunteer"}
                            </span>

                          </td>

                          <td className="px-4 py-4">

                            {user.isActive ? (
                              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                Active
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                                <span className="h-2 w-2 rounded-full bg-red-500" />
                                Inactive
                              </span>
                            )}

                          </td>

                          <td className="px-4 py-4 text-right">

                            <button
                              onClick={() =>
                                handleDeactivate(user.id)
                              }
                              disabled={
                                actionLoading === user.id
                              }
                              className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === user.id
                                ? "Processing..."
                                : "Deactivate"}
                            </button>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          )}

          {/* =================================================
              CITIZENS
             ================================================= */}

          {!loading && activeTab === "citizens" && (

            <div className="p-6">

              <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6">

                <h3 className="font-bold text-red-800 text-sm mb-1">
                  Citizen Moderation
                </h3>

                <p className="text-red-600 text-xs">
                  Deactivate citizen accounts that submit
                  false SOS calls or spam Community Aid
                  requests.
                </p>

              </div>

              {filteredUsers.length === 0 ? (
                <EmptyState
                  title="No citizens found"
                  description="There are currently no citizen accounts matching your search."
                />
              ) : (

                <div className="space-y-3">

                  {filteredUsers.map((user) => (

                    <div
                      key={user.id}
                      className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-200 rounded-xl"
                    >

                      <div className="flex items-start gap-4">

                        <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200 shrink-0">
                          <Users className="h-6 w-6" />
                        </div>

                        <div>

                          <h3 className="font-bold text-slate-900">
                            {user.fullName}
                          </h3>

                          <p className="text-xs text-slate-500 mt-1">
                            ID: {user.id}
                          </p>

                          <p className="text-xs text-slate-500">
                            {user.email} • {user.phone}
                          </p>

                          <div className="mt-2">

                            {user.isActive ? (
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle className="h-3.5 w-3.5" />
                                Active Account
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                                <XCircle className="h-3.5 w-3.5" />
                                Deactivated
                              </span>
                            )}

                          </div>

                        </div>

                      </div>

                      <div className="shrink-0">

                        {user.isActive ? (

                          <button
                            onClick={() =>
                              handleDeactivate(user.id)
                            }
                            disabled={
                              actionLoading === user.id
                            }
                            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
                          >

                            {actionLoading === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Ban className="h-4 w-4" />
                            )}

                            Deactivate
                          </button>

                        ) : (

                          <button
                            onClick={() =>
                              handleActivate(user.id)
                            }
                            disabled={
                              actionLoading === user.id
                            }
                            className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
                          >

                            {actionLoading === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}

                            Activate
                          </button>

                        )}

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

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
        <Users className="h-7 w-7 text-slate-400" />
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
