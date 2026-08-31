"use client";

import { 
  HeartHandshake, 
  ArrowRight,
  PawPrint,
  CheckCircle2,
  Package,
  Home
} from "lucide-react";
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
}

export default function VolunteerDashboard() {
  const [openTasks, setOpenTasks] = useState<TaskItem[]>([]);
  const [myTasksCount, setMyTasksCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [availRes, myRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/tasks/my"),
      ]);
      setOpenTasks(availRes.data.tasks || []);
      setMyTasksCount((myRes.data.tasks || []).length);
    } catch (err: any) {
      console.error("Failed to load volunteer dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleClaimTask = async (taskId: string) => {
    setClaimingId(taskId);
    try {
      await api.post(`/tasks/${taskId}/claim`);
      toast.success("Task claimed successfully!");
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to claim task");
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-xl shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <HeartHandshake className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-bold text-green-800 uppercase tracking-wider">
              Volunteer Hub Active
            </h3>
            <div className="mt-1 text-sm text-green-700">
              <p>
                Thank you for supporting Multi-Disaster relief efforts! Please browse the open tasks below to assist with both human shelter logistics and animal foster placement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/volunteer/tasks"
          className="group bg-green-600 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
            <HeartHandshake className="w-32 h-32" />
          </div>
          <div>
            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-1 leading-tight">My Active Tasks</h2>
            <p className="text-green-100 text-sm mt-2">You have {myTasksCount} tasks in progress</p>
          </div>
        </Link>

        <Link 
          href="/volunteer/shelters"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600">
              <Home className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1 leading-tight">Shelter Needs</h2>
            <p className="text-slate-500 text-sm mt-2">Assist at Human & Animal shelters</p>
          </div>
          <div className="flex items-center text-blue-600 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
            View Shelters <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link 
          href="/volunteer/foster"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="h-12 w-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 text-orange-600">
              <PawPrint className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1 leading-tight">Foster Animals</h2>
            <p className="text-slate-500 text-sm mt-2">Provide temporary homes for rescued pets</p>
          </div>
          <div className="flex items-center text-orange-600 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
            View Requests <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>
      </div>

      {/* Task Board */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Open Relief Tasks</h2>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
            {openTasks.length} Available
          </span>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-slate-500 font-medium">Loading open tasks...</div>
          ) : openTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-500 font-medium">
              No open tasks available right now. Check back later!
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {openTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm text-green-600">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{task.title}</h3>
                        <p className="text-xs font-medium text-slate-500">{task.type}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-white rounded-md border border-slate-200 text-slate-700">
                      {task.priority}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-slate-700 font-medium">
                      {task.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/50 flex gap-3 mt-auto">
                    <button 
                      onClick={() => handleClaimTask(task.id)}
                      disabled={claimingId === task.id}
                      className="w-full bg-green-600 text-white font-medium py-2 rounded-lg text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {claimingId === task.id ? "Claiming..." : "Claim Task"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
