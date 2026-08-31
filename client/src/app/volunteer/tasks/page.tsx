"use client";

import { HeartHandshake, Package, Truck, AlertTriangle, ArrowRight, CheckCircle2, MapPin, Clock, Navigation } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface TaskItem {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  location: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  claimedBy?: {
    id: string;
    fullName: string;
    phone: string;
  };
}

export default function VolunteerTasksPage() {
  const [activeTab, setActiveTab] = useState<"available" | "my-tasks">("available");
  const [availableTasks, setAvailableTasks] = useState<TaskItem[]>([]);
  const [myTasks, setMyTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const [availRes, myRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/tasks/my"),
      ]);
      setAvailableTasks(availRes.data.tasks || []);
      setMyTasks(myRes.data.tasks || []);
    } catch (err: any) {
      console.error("Failed to load tasks", err);
      toast.error(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleClaimTask = async (taskId: string) => {
    setClaimingId(taskId);
    try {
      await api.post(`/tasks/${taskId}/claim`);
      toast.success("Task claimed successfully!");
      fetchTasks();
    } catch (err: any) {
      console.error("Failed to claim task", err);
      toast.error(err.response?.data?.message || "Failed to claim task");
    } finally {
      setClaimingId(null);
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "MEDICAL_TRANSPORT":
        return Truck;
      case "DEBRIS_CLEARING":
        return AlertTriangle;
      default:
        return Package;
    }
  };

  const getTaskStyles = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return { color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
      case "HIGH":
        return { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
      default:
        return { color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" };
    }
  };

  const getDirectionsUrl = (task: TaskItem) => {
    if (task.latitude && task.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${task.latitude},${task.longitude}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(task.location)}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-green-600" />
            Relief Tasks
          </h1>
          <p className="text-slate-500 text-sm mt-1">Claim and manage your volunteer assignments with turn navigation</p>
        </div>
        <Link 
          href="/volunteer"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 flex overflow-x-auto">
          <button 
            onClick={() => setActiveTab("available")}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === "available" 
                ? "border-green-600 text-green-700" 
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Available Tasks ({availableTasks.length})
          </button>
          <button 
            onClick={() => setActiveTab("my-tasks")}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === "my-tasks" 
                ? "border-green-600 text-green-700" 
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            My Claimed Tasks ({myTasks.length})
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-medium">Loading tasks...</div>
          ) : activeTab === "available" ? (
            availableTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">No open relief tasks</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  There are currently no unclaimed tasks available. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableTasks.map((task) => {
                  const Icon = getTaskIcon(task.type);
                  const styles = getTaskStyles(task.priority);
                  const isClaiming = claimingId === task.id;

                  return (
                    <div key={task.id} className={`p-5 rounded-2xl border ${styles.border} ${styles.bg} flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className={`h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm ${styles.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 leading-tight">{task.title}</h3>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5">{task.type.replace('_', ' ')}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 flex-1">
                        <span className={`inline-flex text-[10px] font-bold px-2 py-1 bg-white rounded-md border ${styles.border} ${styles.color} uppercase tracking-wider`}>
                          {task.priority} PRIORITY
                        </span>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white/50 p-2 rounded-lg">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span className="truncate">{task.location}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200/50 flex gap-2 mt-auto items-center justify-between">
                        <a 
                          href={getDirectionsUrl(task)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white border border-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs hover:bg-slate-50 transition-colors flex items-center gap-1"
                        >
                          <Navigation className="h-3.5 w-3.5 text-blue-600" /> Navigate
                        </a>
                        <button 
                          onClick={() => handleClaimTask(task.id)}
                          disabled={isClaiming}
                          className="bg-green-600 text-white font-bold py-2 px-4 rounded-xl text-xs hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1 disabled:opacity-50"
                        >
                          {isClaiming ? "Claiming..." : <>Claim <ArrowRight className="h-3.5 w-3.5" /></>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            myTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">No active tasks</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  You haven't claimed any tasks yet. Browse the available tasks to start helping the community.
                </p>
                <button 
                  onClick={() => setActiveTab("available")}
                  className="mt-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-xl text-sm transition-colors"
                >
                  View Available Tasks
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTasks.map((task) => {
                  const Icon = getTaskIcon(task.type);

                  return (
                    <div key={task.id} className={`p-5 rounded-2xl border border-green-300 bg-green-50/50 flex flex-col gap-4 shadow-sm`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-green-600">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 leading-tight">{task.title}</h3>
                            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-md">
                              {task.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 flex-1">
                        <p className="text-sm text-slate-700 font-medium leading-relaxed">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white/70 p-2 rounded-lg">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span className="truncate">{task.location}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-green-200/60">
                        <a 
                          href={getDirectionsUrl(task)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Navigation className="h-3.5 w-3.5" /> Navigate to Location
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
