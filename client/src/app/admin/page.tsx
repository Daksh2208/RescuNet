"use client";

import {
  ShieldAlert,
  ArrowRight,
  Activity,
  Users,
  Warehouse,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Package,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

type Incident = {
  id: string;
  title: string;
  disasterType: string;
  severity: string;
  status: string;
  address: string;
  createdAt: string;
};

type User = {
  id: string;
  fullName: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
};

type Resource = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  locationName: string;
};

type Shelter = {
  id: string;
  name: string;
  capacity: number;
  occupied: number;
  address: string;
};

export default function AdminDashboard() {
  const [pendingIncidents, setPendingIncidents] = useState<Incident[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [activePersonnel, setActivePersonnel] = useState<User[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);

  const [verifiedIncidents, setVerifiedIncidents] = useState<Incident[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          incidentsResponse,
          verifiedIncidentsResponse,
          pendingUsersResponse,
          activePersonnelResponse,
          resourcesResponse,
          sheltersResponse,
        ] = await Promise.all([
          api.get("/admin/incidents/pending"),
          api.get("/admin/incidents/verified"),
          api.get("/admin/users/pending"),
          api.get("/admin/users/active"),
          api.get("/admin/resources"),
          api.get("/admin/resources/shelters"),
        ]);

        setPendingIncidents(
          incidentsResponse.data.data || []
        );

        setVerifiedIncidents(
          verifiedIncidentsResponse.data.data || []
        );

        setPendingUsers(
          pendingUsersResponse.data.data || []
        );

        setActivePersonnel(
          activePersonnelResponse.data.data || []
        );

        setResources(
          resourcesResponse.data.data || []
        );

        setShelters(
          sheltersResponse.data.data || []
        );
      } catch (err: any) {
        console.error("Failed to load dashboard:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totalResourceUnits = resources.reduce(
    (total, resource) => total + resource.quantity,
    0
  );

  const systemStats = [
    {
      label: "Pending SOS Reports",
      value: pendingIncidents.length,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Active / Dispatched",
      value: verifiedIncidents.length,
      icon: CheckCircle2,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Active Personnel",
      value: activePersonnel.length,
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Managed Shelters",
      value: shelters.length,
      icon: Warehouse,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const formatTime = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">

      {/* Header Status */}
      <div className="bg-purple-900 border-l-4 border-purple-400 p-4 rounded-r-xl shadow-md text-white">
        <div className="flex items-start">
          <ShieldAlert className="h-6 w-6 text-purple-300 mt-0.5 shrink-0" />

          <div className="ml-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-100">
              ResQNet Command Center
            </h3>

            <p className="mt-1 text-sm text-purple-200">
              Monitor incidents, personnel verification, shelters,
              and disaster-response resources from the central
              administration dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
            >
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>

                <h4 className="text-2xl font-bold text-slate-900">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stat.value
                  )}
                </h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Link
          href="/admin/verify"
          className="group bg-purple-600 rounded-2xl p-6 text-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-white" />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-1">
                Verify Incidents
              </h2>

              <p className="text-purple-200 text-sm">
                Review and verify reported disaster incidents
              </p>
            </div>
          </div>

          <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/broadcast"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Emergency Broadcast
              </h2>

              <p className="text-slate-500 text-sm">
                Send emergency notifications to selected users
              </p>
            </div>
          </div>

          <ArrowRight className="h-6 w-6 text-red-600 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Pending Incidents */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Pending Incidents
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Incidents awaiting administrator verification
            </p>
          </div>

          <Link
            href="/admin/verify"
            className="text-sm font-medium text-purple-600 hover:text-purple-700"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          </div>
        ) : pendingIncidents.length === 0 ? (
          <div className="p-10 text-center">
            <CheckCircle2 className="h-10 w-10 mx-auto text-green-500 mb-3" />

            <p className="font-medium text-slate-900">
              No pending incidents
            </p>

            <p className="text-sm text-slate-500 mt-1">
              All reported incidents have been reviewed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">
                    Incident
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Type
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Severity
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Location
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Reported
                  </th>

                  <th className="px-6 py-3 font-medium text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {pendingIncidents.slice(0, 5).map((incident) => (
                  <tr
                    key={incident.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">
                        {incident.title}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {incident.id}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 font-medium text-xs border border-red-100">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {incident.disasterType}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-700">
                        {incident.severity}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600 max-w-[220px] truncate">
                      {incident.address}
                    </td>

                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {formatTime(incident.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href="/admin/verify"
                        className="text-purple-600 hover:text-purple-800 font-medium bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors inline-block"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resource Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Resource Inventory
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Current managed resource units
              </p>
            </div>

            <Package className="h-6 w-6 text-purple-600" />
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {loading ? "—" : totalResourceUnits}
          </p>

          <Link
            href="/admin/resources"
            className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 mt-3"
          >
            Manage resources
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Shelter Network
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Registered emergency shelters
              </p>
            </div>

            <Warehouse className="h-6 w-6 text-blue-600" />
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {loading ? "—" : shelters.length}
          </p>

          <Link
            href="/admin/resources"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 mt-3"
          >
            Manage shelters
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}