"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Home,
  MapPin,
  Phone,
  Navigation,
  Search,
  Filter,
  Users,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Plus,
  ArrowRight,
  PawPrint,
  HeartPulse,
  Share2,
  ExternalLink,
  SlidersHorizontal,
  Compass,
  Building,
  UserCheck,
  Package,
  Layers,
  Map as MapIcon,
  X,
  Truck
} from "lucide-react";
import Link from "next/link";
import {
  APIProvider,
  Map as GoogleMap,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import api from "@/lib/api";
import toast from "react-hot-toast";

type Shelter = {
  id: string;
  name: string;
  type: "HUMAN" | "ANIMAL" | "VET";
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
  occupied: number;
  contactNumber: string;
  needs: string[];
  createdAt: string;
};

const shelterTypeConfig: Record<string, { label: string; icon: any; bg: string; text: string; border: string }> = {
  HUMAN: {
    label: "Civilian Evacuation Shelter",
    icon: Home,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  ANIMAL: {
    label: "Livestock & Pet Shelter",
    icon: PawPrint,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  VET: {
    label: "Veterinary & Triage Center",
    icon: HeartPulse,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
};

// Haversine formula to compute tactical distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  if (!lat1 || !lon1 || !lat2 || lon2 == null) return null;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

function RescueSheltersContent() {
  const searchParams = useSearchParams();
  const paramNearLat = searchParams.get("nearLat");
  const paramNearLng = searchParams.get("nearLng");
  const paramShelterId = searchParams.get("shelterId");

  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState<"ALL" | "AVAILABLE" | "FULL">("ALL");
  const [viewMode, setViewMode] = useState<"GRID" | "MAP">("GRID");
  const [sortByDistance, setSortByDistance] = useState(false);

  // User GPS position
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Modals & Selected items
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [transferShelter, setTransferShelter] = useState<Shelter | null>(null);
  const [transferCount, setTransferCount] = useState<number>(1);
  const [transferNotes, setTransferNotes] = useState<string>("");
  const [transferSubmitting, setTransferSubmitting] = useState(false);

  // Map state
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapZoom, setMapZoom] = useState(5);

  const fetchShelters = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);
      setError("");

      const res = await api.get("/shelters");
      const data: Shelter[] = res.data.data || [];
      setShelters(data);

      try {
        localStorage.setItem("rescue_shelters_cache", JSON.stringify(data));
      } catch (e) {
        // quota ignore
      }

      if (paramShelterId) {
        const target = data.find((s) => s.id === paramShelterId);
        if (target) {
          setSelectedShelter(target);
          setMapCenter({ lat: target.latitude, lng: target.longitude });
          setMapZoom(14);
        }
      } else if (data.length > 0) {
        setMapCenter({ lat: data[0].latitude, lng: data[0].longitude });
        setMapZoom(11);
      }
    } catch (err: any) {
      console.error("Failed to load shelters, checking cache:", err);
      try {
        const cached = localStorage.getItem("rescue_shelters_cache");
        if (cached) {
          setShelters(JSON.parse(cached));
          setError("Using cached shelter roster. Reconnecting to database...");
          return;
        }
      } catch (e) {
        // ignore
      }
      setError(err.response?.data?.message || "Failed to load evacuation shelter roster");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShelters();

    // Auto capture responder GPS for tactical routing
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(coords);
          if (paramNearLat && paramNearLng) {
            setSortByDistance(true);
          }
        },
        () => console.log("GPS location optional for shelter routing.")
      );
    }
  }, []);

  // Compute reference coords for distance calculation (incident or user GPS)
  const refCoords = useMemo(() => {
    if (paramNearLat && paramNearLng) {
      const lat = parseFloat(paramNearLat);
      const lng = parseFloat(paramNearLng);
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    }
    return userLocation;
  }, [paramNearLat, paramNearLng, userLocation]);

  // Filtered & Sorted Shelters
  const filteredShelters = useMemo(() => {
    let result = shelters.filter((sh) => {
      const matchSearch =
        searchQuery === "" ||
        sh.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sh.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sh.needs && sh.needs.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchType = selectedType === "ALL" || sh.type === selectedType;

      const remaining = sh.capacity - sh.occupied;
      let matchAvail = true;
      if (availabilityFilter === "AVAILABLE") {
        matchAvail = remaining > 0;
      } else if (availabilityFilter === "FULL") {
        matchAvail = remaining <= 0;
      }

      return matchSearch && matchType && matchAvail;
    });

    if (sortByDistance && refCoords) {
      result.sort((a, b) => {
        const distA = parseFloat(calculateDistanceKm(refCoords.lat, refCoords.lng, a.latitude, a.longitude) || "9999");
        const distB = parseFloat(calculateDistanceKm(refCoords.lat, refCoords.lng, b.latitude, b.longitude) || "9999");
        return distA - distB;
      });
    }

    return result;
  }, [shelters, searchQuery, selectedType, availabilityFilter, sortByDistance, refCoords]);

  // Overall Statistics
  const totalCapacity = shelters.reduce((acc, s) => acc + (s.capacity || 0), 0);
  const totalOccupied = shelters.reduce((acc, s) => acc + (s.occupied || 0), 0);
  const totalAvailableBeds = Math.max(0, totalCapacity - totalOccupied);
  const overallOccupancyPct = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
  const criticalSheltersCount = shelters.filter((s) => s.capacity > 0 && s.occupied >= s.capacity).length;

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferShelter) return;

    if (transferCount <= 0) {
      toast.error("Please specify a valid number of evacuees");
      return;
    }

    const remaining = transferShelter.capacity - transferShelter.occupied;
    if (transferCount > remaining) {
      toast.error(`Exceeds capacity. Only ${remaining} beds available at this shelter.`);
      return;
    }

    try {
      setTransferSubmitting(true);
      await api.post(`/shelters/${transferShelter.id}/transfer`, {
        evacueeCount: transferCount,
        notes: transferNotes || `Field evacuation transfer by Rescue Squad.`,
      });

      toast.success(`Successfully dispatched ${transferCount} evacuee(s) to ${transferShelter.name}`);
      setTransferShelter(null);
      setTransferCount(1);
      setTransferNotes("");
      await fetchShelters();
    } catch (err: any) {
      console.error("Transfer error:", err);
      toast.error(err.response?.data?.message || "Failed to complete transfer to shelter");
    } finally {
      setTransferSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Tactical Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Evacuation Shelters & Relief Hubs
              </h1>
              <p className="text-slate-500 text-xs">
                Real-time shelter capacity, casualty triage transfer, and live navigation for field rescue units
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => fetchShelters(true)}
            disabled={refreshing}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-blue-600 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Sync Capacity"}
          </button>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("GRID")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "GRID"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building className="h-3.5 w-3.5" /> Grid View
            </button>
            <button
              onClick={() => setViewMode("MAP")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "MAP"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MapIcon className="h-3.5 w-3.5" /> Radar Map
            </button>
          </div>

          <Link
            href="/rescue/missions"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Truck className="h-3.5 w-3.5" /> Back to Missions
          </Link>
        </div>
      </div>

      {/* Real-time System Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Shelters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Relief Shelters
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {shelters.length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Human, Pet & Vet Centers
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
            <Building className="h-6 w-6" />
          </div>
        </div>

        {/* Total Vacancies */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
              Available Vacancies
            </span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">
              {totalAvailableBeds}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Ready for immediate intake
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
            <UserCheck className="h-6 w-6" />
          </div>
        </div>

        {/* System Occupancy */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Occupancy
            </span>
            <span className="text-xs font-extrabold text-blue-600">
              {overallOccupancyPct}%
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{totalOccupied}</span>
            <span className="text-xs text-slate-400 font-bold">/ {totalCapacity} beds</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                overallOccupancyPct > 85 ? "bg-red-500" : overallOccupancyPct > 65 ? "bg-amber-500" : "bg-blue-600"
              }`}
              style={{ width: `${Math.min(100, overallOccupancyPct)}%` }}
            />
          </div>
        </div>

        {/* Overcrowded Shelters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider block">
              At Maximum Capacity
            </span>
            <span className="text-2xl font-black text-red-600 mt-1 block">
              {criticalSheltersCount}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Reroute evacuees elsewhere
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Tactical Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shelter by name, city, or need..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            {/* Shelter Type */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setSelectedType("ALL")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedType === "ALL" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setSelectedType("HUMAN")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedType === "HUMAN" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"
                }`}
              >
                Civilian
              </button>
              <button
                onClick={() => setSelectedType("ANIMAL")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedType === "ANIMAL" ? "bg-white text-amber-700 shadow-sm" : "text-slate-600"
                }`}
              >
                Animals & Pets
              </button>
              <button
                onClick={() => setSelectedType("VET")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedType === "VET" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600"
                }`}
              >
                Vet Triage
              </button>
            </div>

            {/* Vacancy Filter */}
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Has Available Vacancy</option>
              <option value="FULL">At Max Capacity (Full)</option>
            </select>

            {/* Sort by Distance from responder/incident GPS */}
            {refCoords && (
              <button
                onClick={() => setSortByDistance(!sortByDistance)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                  sortByDistance
                    ? "bg-blue-50 text-blue-700 border-blue-300"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
                title="Sort by nearest distance from incident or GPS"
              >
                <Compass className="h-3.5 w-3.5" />
                {sortByDistance ? "Nearest First" : "Default Order"}
              </button>
            )}
          </div>
        </div>

        {refCoords && sortByDistance && (
          <div className="text-[11px] text-blue-700 bg-blue-50/70 border border-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 shrink-0" />
            <span>
              Sorting shelters by straight-line distance from tactical coordinate ({refCoords.lat.toFixed(4)}, {refCoords.lng.toFixed(4)})
            </span>
          </div>
        )}
      </div>

      {/* Main Shelters Body */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
          <p className="text-sm font-bold text-slate-700">Connecting to Regional Shelter Grid...</p>
          <p className="text-xs text-slate-400 mt-0.5">Fetching live bed availability and triage capacities</p>
        </div>
      ) : error && shelters.length === 0 ? (
        <div className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
          <p className="text-sm font-bold text-red-700">{error}</p>
          <button
            onClick={() => fetchShelters(true)}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      ) : viewMode === "MAP" ? (
        /* INTERACTIVE GIS SHELTER MAP VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[600px] flex flex-col relative">
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
            <GoogleMap
              center={mapCenter}
              zoom={mapZoom}
              onCameraChanged={(ev) => {
                setMapCenter(ev.detail.center);
                setMapZoom(ev.detail.zoom);
              }}
              gestureHandling="greedy"
              disableDefaultUI={false}
              zoomControl={true}
              mapTypeControl={true}
              fullscreenControl={true}
              style={{ width: "100%", height: "100%" }}
            >
              {filteredShelters.map((sh) => {
                const remaining = sh.capacity - sh.occupied;
                const isFull = remaining <= 0;
                return (
                  <Marker
                    key={sh.id}
                    position={{ lat: sh.latitude, lng: sh.longitude }}
                    title={`${sh.name} (${sh.occupied}/${sh.capacity})`}
                    onClick={() => setSelectedShelter(sh)}
                  />
                );
              })}

              {userLocation && (
                <Marker position={userLocation} title="Your Current Location" />
              )}

              {selectedShelter && (
                <InfoWindow
                  position={{ lat: selectedShelter.latitude, lng: selectedShelter.longitude }}
                  onCloseClick={() => setSelectedShelter(null)}
                >
                  <div className="min-w-[240px] p-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {selectedShelter.type} Shelter
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        selectedShelter.occupied >= selectedShelter.capacity
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {selectedShelter.capacity - selectedShelter.occupied} Vacant
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{selectedShelter.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3 shrink-0 text-slate-400" /> {selectedShelter.address}
                    </p>
                    <div className="pt-2 border-t flex gap-1.5">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedShelter.latitude},${selectedShelter.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 px-2 rounded-lg text-center flex items-center justify-center gap-1"
                      >
                        <Navigation className="h-3 w-3" /> Directions
                      </a>
                      <button
                        onClick={() => setTransferShelter(selectedShelter)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 px-2 rounded-lg text-center flex items-center justify-center gap-1"
                      >
                        Transfer
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </APIProvider>
        </div>
      ) : (
        /* TACTICAL GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredShelters.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-400">
              <Building className="h-10 w-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold text-slate-700">No shelters match current tactical filters</p>
              <p className="text-xs text-slate-400 mt-1">Try broadening your search query or selecting All Types.</p>
            </div>
          ) : (
            filteredShelters.map((sh) => {
              const typeCfg = shelterTypeConfig[sh.type] || shelterTypeConfig.HUMAN;
              const TypeIcon = typeCfg.icon;
              const remaining = Math.max(0, sh.capacity - sh.occupied);
              const occupancyPct = sh.capacity > 0 ? Math.round((sh.occupied / sh.capacity) * 100) : 0;
              const isFull = remaining === 0;
              const distKm = refCoords
                ? calculateDistanceKm(refCoords.lat, refCoords.lng, sh.latitude, sh.longitude)
                : null;

              return (
                <div
                  key={sh.id}
                  className={`bg-white rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between overflow-hidden ${
                    isFull ? "border-slate-200 opacity-90" : "border-slate-200 hover:border-blue-300"
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-5 space-y-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${typeCfg.bg} ${typeCfg.text} ${typeCfg.border}`}>
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${typeCfg.text}`}>
                            {sh.type} SHELTER
                          </span>
                          <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-1">
                            {sh.name}
                          </h3>
                        </div>
                      </div>

                      {/* Availability Tag */}
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border shrink-0 ${
                          isFull
                            ? "bg-red-50 text-red-700 border-red-200"
                            : occupancyPct >= 80
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {isFull ? "FULL" : `${remaining} Vacancies`}
                      </span>
                    </div>

                    {/* Address & Distance */}
                    <div className="space-y-1">
                      <p className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{sh.address}</span>
                      </p>

                      {distKm && (
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-md">
                          <Compass className="h-3 w-3" />
                          <span>{distKm} km from operational sector</span>
                        </div>
                      )}
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-500">Live Intake</span>
                        <span className="text-slate-900 font-bold">
                          {sh.occupied} / {sh.capacity} ({occupancyPct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            occupancyPct >= 100
                              ? "bg-red-500"
                              : occupancyPct >= 80
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(100, occupancyPct)}%` }}
                        />
                      </div>
                    </div>

                    {/* Urgent Needs Tags if available */}
                    {sh.needs && sh.needs.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Critical Facility Needs:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {sh.needs.slice(0, 3).map((need, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {need}
                            </span>
                          ))}
                          {sh.needs.length > 3 && (
                            <span className="text-[10px] font-bold text-slate-400">
                              +{sh.needs.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tactical Action Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* Direct Call Shelter Contact */}
                    {sh.contactNumber ? (
                      <a
                        href={`tel:${sh.contactNumber}`}
                        className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1.5 shadow-sm"
                        title={`Call ${sh.contactNumber}`}
                      >
                        <Phone className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">Call Hub</span>
                      </a>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-1.5">
                      {/* GPS Route Navigation */}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${sh.latitude},${sh.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 bg-white hover:bg-slate-100 text-blue-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Navigation className="h-3.5 w-3.5 text-blue-600" />
                        <span>Navigate</span>
                      </a>

                      {/* Transfer Casualties / Evacuees Button */}
                      <button
                        onClick={() => setTransferShelter(sh)}
                        disabled={isFull}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm ${
                          isFull
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Transfer</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* EVACUEE TRANSFER / INTAKE MODAL */}
      {transferShelter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-blue-50/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Transfer Evacuees to Shelter
                  </h3>
                  <p className="text-xs text-blue-700 font-medium">
                    {transferShelter.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTransferShelter(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleTransferSubmit} className="p-6 space-y-4">
              {/* Capacity Status Pill */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Current Facility Capacity:</span>
                <span className="text-slate-900 font-bold">
                  {transferShelter.occupied} / {transferShelter.capacity} (
                  <strong className="text-emerald-600">
                    {transferShelter.capacity - transferShelter.occupied} Available
                  </strong>
                  )
                </span>
              </div>

              {/* Number of Persons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Number of Evacuees / Casualties to Transfer *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max={transferShelter.capacity - transferShelter.occupied}
                    value={transferCount}
                    onChange={(e) => setTransferCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                  <span className="text-xs text-slate-500 font-semibold shrink-0">Persons</span>
                </div>
              </div>

              {/* Tactical Notes / Mission Reference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Field Notes / Medical Triage Notes (Optional)
                </label>
                <textarea
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="e.g. Transferred 4 flood victims from Sector 7 rescue operation. 1 required first-aid treatment."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-medium"
                />
              </div>

              {/* Shelter Manager Alert Reminder */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>
                  Please call the shelter manager at <strong>{transferShelter.contactNumber || "N/A"}</strong> if casualties require immediate ICU or trauma beds.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setTransferShelter(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transferSubmitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {transferSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing Transfer...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Confirm Evacuee Intake
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

export default function RescueSheltersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-28 text-slate-500">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-3" />
          <p className="text-sm font-semibold tracking-wide uppercase">Initializing Regional Shelter Grid...</p>
        </div>
      }
    >
      <RescueSheltersContent />
    </Suspense>
  );
}
