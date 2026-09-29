"use client";

import {
  ScrollText,
  Search,
  Filter,
  ShieldCheck,
  Loader2,
  AlertTriangle,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import api from "@/lib/api";

type AuditLog = {
  id: string;
  action: string;
  details: string;
  ipAddress: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  admin: {
    id: string;
    fullName: string;
    email: string;
  };
};

export default function AdminAuditLogPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [search, setSearch] = useState("");

  const [actionFilter, setActionFilter] =
    useState("ALL");

  const [showFilters, setShowFilters] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/admin/audit-logs"
        );

        setAuditLogs(response.data.data);
      } catch (error) {
        console.error(
          "Failed to fetch audit logs:",
          error
        );

        setError(
          "Unable to load audit logs. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  const actionTypes = useMemo(() => {
    const actions = auditLogs.map(
      (log) => log.action
    );

    return Array.from(new Set(actions));
  }, [auditLogs]);

  const filteredLogs = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return auditLogs.filter((log) => {
      const matchesSearch =
        !searchValue ||
        log.id.toLowerCase().includes(searchValue) ||
        log.action
          .toLowerCase()
          .includes(searchValue) ||
        log.details
          .toLowerCase()
          .includes(searchValue) ||
        log.admin.fullName
          .toLowerCase()
          .includes(searchValue) ||
        log.admin.email
          .toLowerCase()
          .includes(searchValue);

      const matchesAction =
        actionFilter === "ALL" ||
        log.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [auditLogs, search, actionFilter]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);

    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ScrollText className="h-6 w-6 text-purple-600" />
            System Audit Log
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Record of administrative actions and system state changes.
          </p>
        </div>

        <Link
          href="/admin"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0 flex items-center justify-center"
        >
          Back to Dashboard
        </Link>

      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row justify-between gap-4 bg-slate-50">

          {/* Status */}
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />

            <span className="text-sm font-bold text-green-700">
              Audit Logging Active
            </span>

            <span className="text-xs text-slate-400">
              • {auditLogs.length}{" "}
              {auditLogs.length === 1
                ? "event"
                : "events"}
            </span>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-2">

            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search logs..."
                className="w-full sm:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            <button
              onClick={() =>
                setShowFilters(
                  (current) => !current
                )
              }
              className={`px-4 py-2 bg-white border rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                showFilters ||
                actionFilter !== "ALL"
                  ? "border-purple-300 text-purple-700 bg-purple-50"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Filter className="h-4 w-4" />

              Filter

              {actionFilter !== "ALL" && (
                <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  1
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="p-4 border-b border-slate-100 bg-white">

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">

              <label className="text-sm font-bold text-slate-700">
                Action Type
              </label>

              <select
                value={actionFilter}
                onChange={(e) =>
                  setActionFilter(e.target.value)
                }
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="ALL">
                  All Actions
                </option>

                {actionTypes.map((action) => (
                  <option
                    key={action}
                    value={action}
                  >
                    {action}
                  </option>
                ))}
              </select>

              {actionFilter !== "ALL" && (
                <button
                  onClick={() =>
                    setActionFilter("ALL")
                  }
                  className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                >
                  Clear filter
                </button>
              )}

            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="p-16 flex flex-col items-center justify-center">

            <Loader2 className="h-8 w-8 text-purple-600 animate-spin mb-3" />

            <p className="text-sm text-slate-500">
              Loading audit logs...
            </p>

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="p-12 text-center">

            <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />

            <h3 className="font-bold text-slate-800">
              Failed to load audit logs
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {error}
            </p>

          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredLogs.length === 0 && (
            <div className="p-16 text-center">

              <ScrollText className="h-12 w-12 text-slate-300 mx-auto mb-3" />

              <h3 className="font-bold text-slate-700">
                No audit logs found
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {search ||
                actionFilter !== "ALL"
                  ? "Try changing your search or filter."
                  : "Administrative actions will appear here."}
              </p>

            </div>
          )}

        {/* Table */}
        {!loading &&
          !error &&
          filteredLogs.length > 0 && (
            <div className="overflow-x-auto">

              <table className="w-full text-left text-sm whitespace-nowrap">

                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">

                  <tr>
                    <th className="px-6 py-3 font-bold">
                      Event ID
                    </th>

                    <th className="px-6 py-3 font-bold">
                      Timestamp
                    </th>

                    <th className="px-6 py-3 font-bold">
                      Administrator
                    </th>

                    <th className="px-6 py-3 font-bold">
                      Action Type
                    </th>

                    <th className="px-6 py-3 font-bold">
                      Details
                    </th>

                    <th className="px-6 py-3 font-bold">
                      IP Address
                    </th>
                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >

                      {/* ID */}
                      <td className="px-6 py-4 font-mono font-medium text-slate-900">
                        {log.id}
                      </td>

                      {/* Timestamp */}
                      <td className="px-6 py-4 text-slate-600">
                        {formatTimestamp(
                          log.createdAt
                        )}
                      </td>

                      {/* Admin */}
                      <td className="px-6 py-4">

                        <div className="flex flex-col">

                          <span className="font-bold text-slate-900">
                            {log.admin.fullName}
                          </span>

                          <span className="text-xs text-slate-500">
                            {log.admin.email}
                          </span>

                        </div>

                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">

                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-bold text-xs border border-purple-100">
                          {log.action}
                        </span>

                      </td>

                      {/* Details */}
                      <td className="px-6 py-4 text-slate-600 whitespace-normal min-w-[350px] max-w-[500px]">
                        {log.details}
                      </td>

                      {/* IP */}
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">
                        {log.ipAddress || "—"}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

      </div>
    </div>
  );
}