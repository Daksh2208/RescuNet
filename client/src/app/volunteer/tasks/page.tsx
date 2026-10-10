"use client";

import { 
  HeartHandshake, 
  Package, 
  Truck, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Navigation, 
  Map as MapIcon, 
  List, 
  Phone, 
  Copy, 
  Check, 
  RotateCcw, 
  FileText, 
  Locate, 
  AlertCircle, 
  Calendar, 
  ShieldCheck, 
  Loader2, 
  X,
  Compass
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import {
  APIProvider,
  Map as GoogleMap,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface TaskItem {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: "AVAILABLE" | "CLAIMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  claimedAt?: string | null;
  completedAt?: string | null;
  completionNotes?: string | null;
  contactPerson?: string | null;
  contactPhone?: string | null;
  createdAt: string;
  claimedBy?: {
    id: string;
    fullName: string;
    phone: string;
  } | null;
}

export default function VolunteerTasksPage() {
  const [activeTab, setActiveTab] = useState<"available" | "active" | "fulfilled">("available");
  const [viewMode, setViewMode] = useState<"cards" | "map">("cards");
  const [availableTasks, setAvailableTasks] = useState<TaskItem[]>([]);
  const [myTasks, setMyTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // User live location
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  // Map states
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapZoom, setMapZoom] = useState(12);
  const [selectedTaskForMap, setSelectedTaskForMap] = useState<TaskItem | null>(null);

  // Fulfillment Modal state
  const [fulfillModalTask, setFulfillModalTask] = useState<TaskItem | null>(null);
  const [completionNotes, setCompletionNotes] = useState("");
  const [verifiedCheck, setVerifiedCheck] = useState(false);
  const [submittingFulfill, setSubmittingFulfill] = useState(false);

  // Distance helper
  const calculateDistance = (lat1?: number | null, lon1?: number | null) => {
    if (!lat1 || !lon1 || !userLocation) return null;
    const R = 6371; // Earth radius in km
    const dLat = (lat1 - userLocation.lat) * (Math.PI / 180);
    const dLon = (lon1 - userLocation.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLocation.lat * (Math.PI / 180)) *
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const [availRes, myRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/tasks/my"),
      ]);
      const avail: TaskItem[] = availRes.data.tasks || [];
      const mine: TaskItem[] = myRes.data.tasks || [];
      setAvailableTasks(avail);
      setMyTasks(mine);

      // Auto center map on nearest or first task with lat/lng
      const firstValid = [...avail, ...mine].find((t) => t.latitude && t.longitude);
      if (firstValid && firstValid.latitude && firstValid.longitude) {
        setMapCenter({ lat: firstValid.latitude, lng: firstValid.longitude });
      }
    } catch (err: any) {
      console.error("Failed to load tasks", err);
      toast.error(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // Get user geolocation
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported on this device/browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setMapCenter(coords);
        setMapZoom(14);
        setLocating(false);
        toast.success("Current GPS position acquired!");
      },
      (err) => {
        console.warn("Location error:", err);
        setLocating(false);
        toast.error("Could not fetch GPS coordinates. Please allow location permissions.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    fetchTasks();
    detectLocation();
  }, []);

  // Filter tasks into active vs fulfilled
  const myActiveTasks = useMemo(() => {
    return myTasks.filter((t) => t.status === "CLAIMED" || t.status === "IN_PROGRESS");
  }, [myTasks]);

  const myFulfilledTasks = useMemo(() => {
    return myTasks.filter((t) => t.status === "COMPLETED");
  }, [myTasks]);

  // Actions
  const handleClaimTask = async (taskId: string) => {
    setProcessingId(taskId);
    try {
      await api.post(`/tasks/${taskId}/claim`);
      toast.success("Task claimed! Added to your active assignments.");
      await fetchTasks();
      setActiveTab("active");
    } catch (err: any) {
      console.error("Failed to claim task", err);
      toast.error(err.response?.data?.message || "Failed to claim task");
    } finally {
      setProcessingId(null);
    }
  };

  const handleStartTask = async (taskId: string) => {
    setProcessingId(taskId);
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: "IN_PROGRESS" });
      toast.success("Status updated to En Route / In Progress! Dispatcher notified.");
      await fetchTasks();
    } catch (err: any) {
      console.error("Failed to update status", err);
      toast.error(err.response?.data?.message || "Failed to start task");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReleaseTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to release this task? It will be placed back into the public pool for other volunteers.")) return;
    setProcessingId(taskId);
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: "AVAILABLE" });
      toast.success("Task released back to available relief pool.");
      await fetchTasks();
    } catch (err: any) {
      console.error("Failed to release task", err);
      toast.error(err.response?.data?.message || "Failed to release task");
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenFulfillModal = (task: TaskItem) => {
    setFulfillModalTask(task);
    setCompletionNotes("");
    setVerifiedCheck(false);
  };

  const handleSubmitFulfillment = async () => {
    if (!fulfillModalTask) return;
    if (!verifiedCheck) {
      toast.error("Please confirm that relief task/supplies have been verified on site.");
      return;
    }
    setSubmittingFulfill(true);
    try {
      await api.patch(`/tasks/${fulfillModalTask.id}/status`, {
        status: "COMPLETED",
        completionNotes: completionNotes.trim() || "Relief task completed and verified on site.",
      });
      toast.success("Mission fulfilled! Thank you for your humanitarian service.");
      setFulfillModalTask(null);
      await fetchTasks();
      setActiveTab("fulfilled");
    } catch (err: any) {
      console.error("Failed to complete task", err);
      toast.error(err.response?.data?.message || "Failed to mark task fulfilled");
    } finally {
      setSubmittingFulfill(false);
    }
  };

  const handleCopyCoords = (lat?: number | null, lng?: number | null) => {
    if (!lat || !lng) {
      toast.error("No coordinates specified for this location");
      return;
    }
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    toast.success(`Copied coordinates: ${lat}, ${lng}`);
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
        return { color: "text-red-700", bg: "bg-red-50", border: "border-red-200", badgeBg: "bg-red-100 text-red-800" };
      case "HIGH":
        return { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", badgeBg: "bg-amber-100 text-amber-800" };
      default:
        return { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", badgeBg: "bg-blue-100 text-blue-800" };
    }
  };

  const getDirectionsUrl = (task: TaskItem) => {
    if (task.latitude && task.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${task.latitude},${task.longitude}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(task.location)}`;
  };

  // Combine tasks to display on map
  const allMapTasks = useMemo(() => {
    return [...availableTasks, ...myTasks].filter((t) => t.latitude && t.longitude);
  }, [availableTasks, myTasks]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-green-100 text-green-700 rounded-xl">
                <HeartHandshake className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                  Disaster Volunteer Relief Tasks
                </h1>
                <p className="text-slate-500 text-sm">
                  Field logistics, location tracking, and mission fulfillment verification
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                onClick={() => setViewMode("cards")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "cards"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <List className="h-3.5 w-3.5" /> List View
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "map"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <MapIcon className="h-3.5 w-3.5" /> Map Radar
              </button>
            </div>

            <Link
              href="/volunteer"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Operational KPI & GPS Awareness Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
              {availableTasks.length}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Available</p>
              <p className="text-sm font-bold text-slate-800">Open Relief Tasks</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              {myActiveTasks.length}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">My Queue</p>
              <p className="text-sm font-bold text-slate-800">Active / En Route</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              {myFulfilledTasks.length}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed</p>
              <p className="text-sm font-bold text-slate-800">Fulfilled History</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Locate className="h-3 w-3 text-blue-500" /> GPS Status
              </p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {userLocation ? (
                  <span className="text-green-600">Fixed ({userLocation.lat.toFixed(2)}, {userLocation.lng.toFixed(2)})</span>
                ) : (
                  <span className="text-amber-600">Searching signal...</span>
                )}
              </p>
            </div>
            <button
              onClick={detectLocation}
              disabled={locating}
              className="text-[11px] font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors"
              title="Refresh GPS location"
            >
              {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Refresh"}
            </button>
          </div>
        </div>

        {/* View Mode: Tactical Map */}
        {viewMode === "map" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px] relative">
            <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-green-600 animate-spin" style={{ animationDuration: "12s" }} />
                <span className="text-sm font-bold text-slate-900">Live Relief Operations Radar</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block" /> Critical
                </span>
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block" /> Active
                </span>
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500 inline-block" /> Fulfilled
                </span>
                <button
                  onClick={detectLocation}
                  className="bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-bold transition-colors"
                >
                  Center on Me
                </button>
              </div>
            </div>

            <div className="flex-1 w-full h-full relative">
              <GoogleMap
                center={mapCenter}
                zoom={mapZoom}
                onCameraChanged={(ev) => {
                  setMapCenter(ev.detail.center);
                  setMapZoom(ev.detail.zoom);
                }}
                gestureHandling="greedy"
                zoomControl={true}
                mapTypeControl={true}
                fullscreenControl={true}
                minZoom={3}
                maxZoom={20}
                style={{ width: "100%", height: "100%" }}
              >
                {/* Volunteer current position */}
                {userLocation && (
                  <Marker
                    position={userLocation}
                    title="Your Current Location"
                  />
                )}

                {/* Task markers */}
                {allMapTasks.map((task) => (
                  <Marker
                    key={task.id}
                    position={{ lat: task.latitude!, lng: task.longitude! }}
                    title={task.title}
                    onClick={() => setSelectedTaskForMap(task)}
                  />
                ))}

                {/* InfoWindow for selected task on map */}
                {selectedTaskForMap && selectedTaskForMap.latitude && selectedTaskForMap.longitude && (
                  <InfoWindow
                    position={{ lat: selectedTaskForMap.latitude, lng: selectedTaskForMap.longitude }}
                    onCloseClick={() => setSelectedTaskForMap(null)}
                  >
                    <div className="p-3 max-w-[280px] space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 uppercase">
                          {selectedTaskForMap.priority}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800">
                          {selectedTaskForMap.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {selectedTaskForMap.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {selectedTaskForMap.description}
                      </p>

                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200/60 space-y-1">
                        <p className="flex items-center gap-1 font-semibold text-slate-700">
                          <MapPin className="h-3 w-3 shrink-0 text-red-500" />
                          <span className="truncate">{selectedTaskForMap.location}</span>
                        </p>
                        {calculateDistance(selectedTaskForMap.latitude, selectedTaskForMap.longitude) && (
                          <p className="text-blue-600 font-bold">
                            Distance: {calculateDistance(selectedTaskForMap.latitude, selectedTaskForMap.longitude)} from you
                          </p>
                        )}
                        {(selectedTaskForMap.contactPerson || selectedTaskForMap.contactPhone) && (
                          <p className="text-slate-600">
                            Rep: {selectedTaskForMap.contactPerson || "On-site Rep"}{" "}
                            {selectedTaskForMap.contactPhone && `(${selectedTaskForMap.contactPhone})`}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 flex flex-col gap-1.5">
                        <a
                          href={getDirectionsUrl(selectedTaskForMap)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5"
                        >
                          <Navigation className="h-3 w-3" /> Turn-by-Turn GPS
                        </a>

                        {selectedTaskForMap.status === "AVAILABLE" && (
                          <button
                            onClick={() => {
                              setSelectedTaskForMap(null);
                              handleClaimTask(selectedTaskForMap.id);
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs"
                          >
                            Claim this Task
                          </button>
                        )}

                        {(selectedTaskForMap.status === "CLAIMED" || selectedTaskForMap.status === "IN_PROGRESS") && (
                          <button
                            onClick={() => {
                              const t = selectedTaskForMap;
                              setSelectedTaskForMap(null);
                              handleOpenFulfillModal(t);
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" /> Mark Fulfilled
                          </button>
                        )}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
          </div>
        )}

        {/* Tab Navigation for Tasks (Visible in both or Card mode) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 flex overflow-x-auto bg-slate-50/50">
            <button
              onClick={() => setActiveTab("available")}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "available"
                  ? "border-green-600 text-green-700 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Package className="h-4 w-4" /> Available Tasks
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {availableTasks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("active")}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "active"
                  ? "border-green-600 text-green-700 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Clock className="h-4 w-4" /> My Active Tasks
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {myActiveTasks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("fulfilled")}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "fulfilled"
                  ? "border-green-600 text-green-700 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" /> Fulfilled Requests
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {myFulfilledTasks.length}
              </span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-16">
                <Loader2 className="h-8 w-8 text-green-600 animate-spin mx-auto mb-3" />
                <p className="text-slate-500 font-semibold text-sm">Synchronizing emergency tasks & GPS routes...</p>
              </div>
            ) : activeTab === "available" ? (
              availableTasks.length === 0 ? (
                <div className="text-center py-16">
                  <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900">No open relief tasks</h3>
                  <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                    All currently broadcasted relief tasks have been claimed. Thank you for standing by!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableTasks.map((task) => {
                    const Icon = getTaskIcon(task.type);
                    const styles = getTaskStyles(task.priority);
                    const isProcessing = processingId === task.id;
                    const distanceStr = calculateDistance(task.latitude, task.longitude);

                    return (
                      <div
                        key={task.id}
                        className={`p-5 rounded-2xl border ${styles.border} ${styles.bg} flex flex-col gap-4 shadow-sm hover:shadow-md transition-all`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className={`h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm ${styles.color}`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 leading-tight">{task.title}</h3>
                              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                {task.type.replace("_", " ")}
                              </p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${styles.border} ${styles.badgeBg} uppercase tracking-wider`}>
                            {task.priority}
                          </span>
                        </div>

                        <div className="space-y-3 flex-1">
                          <p className="text-sm text-slate-700 font-medium leading-relaxed">
                            {task.description}
                          </p>

                          {/* Location Card */}
                          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-200/60 space-y-2">
                            <div className="flex items-start gap-1.5 text-xs font-semibold text-slate-700">
                              <MapPin className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                              <div className="flex-1">
                                <span className="block leading-snug">{task.location}</span>
                                {distanceStr && (
                                  <span className="text-[11px] font-bold text-blue-600 inline-block mt-0.5">
                                    📍 Approx {distanceStr} away from you
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Coordinates and Copy */}
                            {task.latitude && task.longitude && (
                              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
                                <span>Lat: {task.latitude.toFixed(4)}, Lon: {task.longitude.toFixed(4)}</span>
                                <button
                                  onClick={() => handleCopyCoords(task.latitude, task.longitude)}
                                  className="text-slate-600 hover:text-slate-900 p-1 rounded hover:bg-slate-100 transition-colors"
                                  title="Copy coordinates"
                                >
                                  <Copy className="h-3 w-3" />
                                </button>
                              </div>
                            )}

                            {/* On-site contact info */}
                            {(task.contactPerson || task.contactPhone) && (
                              <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
                                <span className="truncate">Contact: {task.contactPerson || "Field Coordinator"}</span>
                                {task.contactPhone && (
                                  <a
                                    href={`tel:${task.contactPhone}`}
                                    className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                                  >
                                    <Phone className="h-3 w-3" /> Call
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="pt-3 border-t border-slate-200/50 flex gap-2 mt-auto items-center justify-between">
                          <a
                            href={getDirectionsUrl(task)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white border border-slate-200 text-slate-700 font-bold py-2.5 px-3 rounded-xl text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <Navigation className="h-3.5 w-3.5 text-blue-600" /> Navigate
                          </a>

                          <button
                            onClick={() => handleClaimTask(task.id)}
                            disabled={isProcessing}
                            className="bg-green-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                Claim Task <ArrowRight className="h-3.5 w-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : activeTab === "active" ? (
              myActiveTasks.length === 0 ? (
                <div className="text-center py-16">
                  <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900">No active assignments</h3>
                  <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                    You do not currently have any claimed or in-progress tasks. Browse available tasks to mobilize assistance.
                  </p>
                  <button
                    onClick={() => setActiveTab("available")}
                    className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl text-sm transition-colors shadow-sm"
                  >
                    View Available Tasks
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myActiveTasks.map((task) => {
                    const Icon = getTaskIcon(task.type);
                    const isProcessing = processingId === task.id;
                    const distanceStr = calculateDistance(task.latitude, task.longitude);
                    const isInProgress = task.status === "IN_PROGRESS";

                    return (
                      <div
                        key={task.id}
                        className={`p-5 rounded-2xl border ${
                          isInProgress
                            ? "border-blue-400 bg-blue-50/40 ring-2 ring-blue-200"
                            : "border-amber-300 bg-amber-50/30"
                        } flex flex-col gap-4 shadow-sm`}
                      >
                        {/* Header & Status */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-600">
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 leading-tight">{task.title}</h3>
                              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                {task.type.replace("_", " ")}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                              isInProgress
                                ? "bg-blue-600 text-white animate-pulse"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {isInProgress ? "EN ROUTE" : "CLAIMED"}
                          </span>
                        </div>

                        {/* Description */}
                        <div className="space-y-3 flex-1">
                          <p className="text-sm text-slate-700 font-medium leading-relaxed">
                            {task.description}
                          </p>

                          {/* Location Card */}
                          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2">
                            <div className="flex items-start gap-1.5 text-xs font-semibold text-slate-700">
                              <MapPin className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                              <div className="flex-1">
                                <span className="block leading-snug">{task.location}</span>
                                {distanceStr && (
                                  <span className="text-[11px] font-bold text-blue-600 inline-block mt-0.5">
                                    📍 Approx {distanceStr} away from you
                                  </span>
                                )}
                              </div>
                            </div>

                            {task.latitude && task.longitude && (
                              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
                                <span>Lat: {task.latitude.toFixed(4)}, Lon: {task.longitude.toFixed(4)}</span>
                                <button
                                  onClick={() => handleCopyCoords(task.latitude, task.longitude)}
                                  className="text-slate-600 hover:text-slate-900 p-1 rounded hover:bg-slate-100 transition-colors"
                                  title="Copy coordinates"
                                >
                                  <Copy className="h-3 w-3" />
                                </button>
                              </div>
                            )}

                            {(task.contactPerson || task.contactPhone) && (
                              <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
                                <span className="truncate">Rep: {task.contactPerson || "On-site Rep"}</span>
                                {task.contactPhone && (
                                  <a
                                    href={`tel:${task.contactPhone}`}
                                    className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                                  >
                                    <Phone className="h-3 w-3" /> {task.contactPhone}
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Progression Stepper */}
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-[11px] flex items-center justify-between text-slate-600 font-semibold">
                          <span className="flex items-center gap-1 text-green-700">
                            ✓ Claimed
                          </span>
                          <span className="text-slate-300">→</span>
                          <span className={`flex items-center gap-1 ${isInProgress ? "text-blue-700 font-bold" : "text-slate-400"}`}>
                            {isInProgress ? "● En Route" : "○ En Route"}
                          </span>
                          <span className="text-slate-300">→</span>
                          <span className="text-slate-400">○ Fulfilled</span>
                        </div>

                        {/* Tactical Actions */}
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          <div className="grid grid-cols-2 gap-2">
                            <a
                              href={getDirectionsUrl(task)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                            >
                              <Navigation className="h-3.5 w-3.5 text-blue-600" /> Navigate GPS
                            </a>

                            {!isInProgress ? (
                              <button
                                onClick={() => handleStartTask(task.id)}
                                disabled={isProcessing}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors shadow-xs disabled:opacity-50"
                              >
                                {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Mark En Route"}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenFulfillModal(task)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors shadow-xs"
                              >
                                <ShieldCheck className="h-3.5 w-3.5" /> Fulfill Task
                              </button>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            {!isInProgress && (
                              <button
                                onClick={() => handleOpenFulfillModal(task)}
                                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                              >
                                Complete directly
                              </button>
                            )}

                            <button
                              onClick={() => handleReleaseTask(task.id)}
                              disabled={isProcessing}
                              className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 ml-auto"
                            >
                              <RotateCcw className="h-3 w-3" /> Can't fulfill / Release
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              /* Fulfilled History */
              myFulfilledTasks.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900">No fulfilled tasks yet</h3>
                  <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                    Once you deliver supplies, transport patients, or complete field relief tasks, your verified completion records will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myFulfilledTasks.map((task) => {
                    const Icon = getTaskIcon(task.type);

                    return (
                      <div
                        key={task.id}
                        className="p-5 rounded-2xl border border-emerald-300 bg-emerald-50/40 flex flex-col gap-4 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-emerald-600">
                              <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 leading-tight">{task.title}</h3>
                              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                {task.type.replace("_", " ")}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-emerald-600 text-white flex items-center gap-1">
                            ✓ FULFILLED
                          </span>
                        </div>

                        <div className="space-y-3 flex-1">
                          <p className="text-sm text-slate-700 font-medium leading-relaxed">
                            {task.description}
                          </p>

                          <div className="bg-white/90 p-3 rounded-xl border border-emerald-200 space-y-2 text-xs">
                            <div className="flex items-start gap-1.5 text-slate-700 font-semibold">
                              <MapPin className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                              <span className="truncate">{task.location}</span>
                            </div>

                            {task.completedAt && (
                              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] pt-1 border-t border-slate-100">
                                <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                                <span>Fulfilled: {new Date(task.completedAt).toLocaleString()}</span>
                              </div>
                            )}
                          </div>

                          {/* Fulfillment Report Notes */}
                          {task.completionNotes && (
                            <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                                <FileText className="h-3.5 w-3.5" /> Field Resolution Report:
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                "{task.completionNotes}"
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs text-slate-500">
                          <span className="font-bold text-emerald-700">✓ Mission Closed & Logged</span>
                          <a
                            href={getDirectionsUrl(task)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-slate-900 font-semibold underline flex items-center gap-1"
                          >
                            <MapPin className="h-3 w-3" /> Location Ref
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

        {/* Fulfillment Modal */}
        {fulfillModalTask && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">
                      Fulfill Relief Task
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Submit field completion report and log verified assistance
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFulfillModalTask(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Task summary box */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-800">{fulfillModalTask.title}</p>
                <p className="text-slate-600 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" /> {fulfillModalTask.location}
                </p>
                {(fulfillModalTask.contactPerson || fulfillModalTask.contactPhone) && (
                  <p className="text-slate-500">
                    Recipient / Rep: {fulfillModalTask.contactPerson || "On-site Rep"} ({fulfillModalTask.contactPhone || "N/A"})
                  </p>
                )}
              </div>

              {/* Notes Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Completion & Field Resolution Notes
                </label>
                <textarea
                  rows={3}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="e.g. Delivered 25 food packets & water bottles to Shelter Ward 4. Handed over to coordinator Mr. Jackson."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none font-medium"
                />
              </div>

              {/* Verification Checkbox */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="verify-check"
                  checked={verifiedCheck}
                  onChange={(e) => setVerifiedCheck(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="verify-check" className="text-xs text-emerald-900 font-semibold cursor-pointer">
                  I confirm that all requested relief operations, supply delivery, or humanitarian assistance have been safely delivered and completed on site.
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setFulfillModalTask(null)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitFulfillment}
                  disabled={submittingFulfill || !verifiedCheck}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {submittingFulfill ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4" /> Submit Fulfillment Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </APIProvider>
  );
}
