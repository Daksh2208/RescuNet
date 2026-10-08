"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Send, AlertCircle, Package, Loader2, AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

type DispatchedTask = {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  location: string;
  createdAt: string;
  claimedBy?: {
    id: string;
    fullName: string;
    phone: string;
  } | null;
};

export default function VolunteerDispatcherPage() {
  const [tasks, setTasks] = useState<DispatchedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("SUPPLY_DELIVERY");
  const [priority, setPriority] = useState("MEDIUM");
  const [description, setDescription] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/rescue/dispatcher/tasks");
      setTasks(res.data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !description.trim()) {
      alert("Title, location, and instructions are required.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/tasks", {
        title: title.trim(),
        location: location.trim(),
        type,
        priority,
        description: description.trim(),
      });
      setTitle("");
      setLocation("");
      setDescription("");
      await fetchTasks();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to broadcast task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to cancel this task?")) return;
    try {
      await api.patch(`/rescue/dispatcher/tasks/${taskId}/cancel`);
      await fetchTasks();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to cancel task");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Volunteer Task Dispatcher
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create and broadcast operational tasks to the civilian volunteer network</p>
        </div>
        <Link 
          href="/rescue"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create Task Form (Left) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-blue-50/50">
              <h2 className="font-bold text-blue-900 flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" /> Create New Task
              </h2>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Task Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Transport Medical Kits" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Central High School" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
                  >
                    <option value="SUPPLY_DELIVERY">Supply Delivery</option>
                    <option value="DEBRIS_CLEARING">Debris Clearing</option>
                    <option value="MEDICAL_TRANSPORT">Medical Transport</option>
                    <option value="ANIMAL_FOSTER">Animal Foster</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Priority</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description / Instructions</label>
                <textarea 
                  rows={3} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed instructions for the volunteer..." 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  required
                />
              </div>
              
              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Broadcast Task
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Task Board (Right) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Broadcasted Tasks</h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                {tasks.length} Total
              </span>
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              {loading ? (
                <div className="py-12 text-center">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Loading broadcasted tasks...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center bg-red-50 text-red-700 rounded-xl">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-800 text-lg">No tasks broadcasted yet</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Use the form on the left to dispatch volunteer tasks into the network.
                  </p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="p-5 border border-slate-200 rounded-xl hover:shadow-sm transition-shadow flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        {task.priority === 'HIGH' || task.priority === 'CRITICAL' ? (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        ) : (
                          <Package className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{task.title}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{task.location}</p>
                        <p className="text-xs text-slate-600 mt-1">{task.description}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600">
                            {task.type.replace("_", " ")}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            task.priority === 'CRITICAL' || task.priority === 'HIGH'
                              ? 'bg-orange-100 text-orange-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start sm:items-end justify-center shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                      {task.status === "CLAIMED" ? (
                        <>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md mb-1">
                            CLAIMED
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            by {task.claimedBy?.fullName || "Volunteer"}
                          </span>
                        </>
                      ) : task.status === "CANCELLED" ? (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                          CANCELLED
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                          OPEN (BROADCASTING)
                        </span>
                      )}
                      {task.status !== "CANCELLED" && task.status !== "COMPLETED" && (
                        <button 
                          onClick={() => handleCancelTask(task.id)}
                          className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors mt-3"
                        >
                          Cancel Task
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
