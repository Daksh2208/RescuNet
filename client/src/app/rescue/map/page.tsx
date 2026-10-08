"use client";

import { useEffect, useState } from "react";
import { 
  Map as MapIcon, 
  Layers, 
  Filter, 
  Crosshair, 
  AlertTriangle, 
  Home, 
  Truck, 
  Loader2, 
  Flame, 
  Waves, 
  Mountain, 
  CloudRain, 
  Zap,
  MapPin,
  Phone,
  User,
  ExternalLink,
  Navigation,
  Radio,
  Share2,
  X,
  Compass,
  CheckCircle2,
  ShieldAlert,
  Search,
  Users
} from "lucide-react";
import Link from "next/link";
import {
  APIProvider,
  Map as GoogleMap,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import api from "@/lib/api";

type IncidentPin = {
  id: string;
  title: string;
  description?: string | null;
  disasterType: "FLOOD" | "EARTHQUAKE" | "FIRE" | "CYCLONE" | "LANDSLIDE" | "OTHER";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: string;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: string;
  images?: { id: string; imageUrl: string }[];
  reportedBy?: { id: string; fullName: string; phone?: string | null } | null;
  assignments?: {
    id: string;
    status: string;
    rescueTeam: { id: string; fullName: string; phone?: string | null };
  }[];
};

type ShelterPin = {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  address: string;
  contactNumber?: string | null;
  capacity: number;
  occupied: number;
};

type RescueUnitPin = {
  id: string;
  fullName: string;
  phone?: string | null;
  rescueAssignments: {
    id: string;
    status: string;
    incident: {
      latitude: number;
      longitude: number;
      address: string;
    };
  }[];
};

type MapData = {
  incidents: IncidentPin[];
  shelters: ShelterPin[];
  rescueUnits: RescueUnitPin[];
};

const disasterIcons: Record<string, any> = {
  FLOOD: Waves,
  EARTHQUAKE: Mountain,
  FIRE: Flame,
  CYCLONE: CloudRain,
  LANDSLIDE: Mountain,
  OTHER: Zap,
};

const severityColors: Record<string, { bg: string; text: string; border: string; hex: string }> = {
  CRITICAL: { bg: "bg-red-50", text: "text-red-700", border: "border-red-300", hex: "#dc2626" },
  HIGH: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-300", hex: "#ea580c" },
  MEDIUM: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-300", hex: "#ca8a04" },
  LOW: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-300", hex: "#2563eb" },
};

export default function RescueMapPage() {
  const [data, setData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Map viewport state
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapZoom, setMapZoom] = useState(5);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Selected item states
  const [selectedIncident, setSelectedIncident] = useState<IncidentPin | null>(null);
  const [selectedShelter, setSelectedShelter] = useState<ShelterPin | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<RescueUnitPin | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{ type: string; id: string } | null>(null);

  // Layer & filter controls
  const [showIncidents, setShowIncidents] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showUnits, setShowUnits] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDisasterFilter, setSelectedDisasterFilter] = useState("ALL");
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState("ALL");

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/rescue/map/data");
        const mapData: MapData = res.data.data;
        setData(mapData);

        // Auto center on first valid incident or shelter
        if (mapData.incidents && mapData.incidents.length > 0) {
          const first = mapData.incidents.find(i => i.latitude !== 0 && i.longitude !== 0);
          if (first) {
            setMapCenter({ lat: first.latitude, lng: first.longitude });
            setMapZoom(12);
          }
        } else if (mapData.shelters && mapData.shelters.length > 0) {
          const first = mapData.shelters[0];
          setMapCenter({ lat: first.latitude, lng: first.longitude });
          setMapZoom(12);
        }
      } catch (err: any) {
        console.error("Failed to load map data:", err);
        setError(err.response?.data?.message || "Failed to load map data");
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setMapCenter(coords);
        setMapZoom(15);
      },
      () => alert("Unable to access current location. Please allow location permissions.")
    );
  };

  const resetMap = () => {
    if (data?.incidents && data.incidents.length > 0) {
      const first = data.incidents[0];
      setMapCenter({ lat: first.latitude, lng: first.longitude });
      setMapZoom(12);
    } else {
      setMapCenter({ lat: 20.5937, lng: 78.9629 });
      setMapZoom(5);
    }
    setSelectedIncident(null);
    setSelectedShelter(null);
    setSelectedUnit(null);
  };

  const incidents = (data?.incidents || []).filter((inc) => {
    const matchSearch = searchQuery === "" || 
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      inc.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = selectedDisasterFilter === "ALL" || inc.disasterType === selectedDisasterFilter;
    const matchSev = selectedSeverityFilter === "ALL" || inc.severity === selectedSeverityFilter;
    return matchSearch && matchType && matchSev;
  });

  const shelters = (data?.shelters || []).filter((sh) => {
    return searchQuery === "" || 
      sh.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      sh.address.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const rescueUnits = data?.rescueUnits || [];

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <div className="max-w-7xl mx-auto space-y-4 h-[calc(100vh-100px)] flex flex-col">
        {/* Tactical Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <MapIcon className="h-6 w-6 text-blue-600" />
              Tactical Command & Dispatch Map
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Live geospatial situational awareness for incident response, casualty tracking, and unit deployment
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="/rescue/missions"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Truck className="h-4 w-4" /> Unit Missions
            </Link>
            <Link 
              href="/rescue"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Command Center Layout */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-0">
          
          {/* Main Interactive Map Canvas */}
          <div className="flex-1 relative min-h-[420px] bg-slate-100 flex flex-col">
            
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
              streetViewControl={false}
              fullscreenControl={true}
              minZoom={3}
              maxZoom={20}
              style={{ width: "100%", height: "100%" }}
            >
              {/* Incident Markers */}
              {showIncidents && incidents.map((inc) => (
                <Marker
                  key={inc.id}
                  position={{ lat: inc.latitude, lng: inc.longitude }}
                  title={`${inc.title} (${inc.severity})`}
                  onClick={() => {
                    setSelectedIncident(inc);
                    setSelectedShelter(null);
                    setSelectedUnit(null);
                  }}
                />
              ))}

              {/* Shelter Markers */}
              {showShelters && shelters.map((sh) => (
                <Marker
                  key={sh.id}
                  position={{ lat: sh.latitude, lng: sh.longitude }}
                  title={`Shelter: ${sh.name}`}
                  onClick={() => {
                    setSelectedShelter(sh);
                    setSelectedIncident(null);
                    setSelectedUnit(null);
                  }}
                />
              ))}

              {/* Rescue Unit Markers */}
              {showUnits && rescueUnits.map((u) => {
                const assignedInc = u.rescueAssignments[0]?.incident;
                if (!assignedInc) return null;
                return (
                  <Marker
                    key={u.id}
                    position={{ lat: assignedInc.latitude, lng: assignedInc.longitude }}
                    title={`Unit: ${u.fullName}`}
                    onClick={() => {
                      setSelectedUnit(u);
                      setSelectedIncident(null);
                      setSelectedShelter(null);
                    }}
                  />
                );
              })}

              {/* User Location */}
              {userLocation && (
                <Marker position={userLocation} title="Your GPS Location" />
              )}

              {/* Interactive Incident InfoWindow */}
              {selectedIncident && (
                <InfoWindow
                  position={{ lat: selectedIncident.latitude, lng: selectedIncident.longitude }}
                  onCloseClick={() => setSelectedIncident(null)}
                >
                  <div className="min-w-[240px] max-w-[280px] p-2 space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {selectedIncident.disasterType}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${severityColors[selectedIncident.severity]?.bg} ${severityColors[selectedIncident.severity]?.text}`}>
                        {selectedIncident.severity}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{selectedIncident.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{selectedIncident.description || "No description provided."}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3 shrink-0 text-slate-400" /> {selectedIncident.address}
                    </p>
                    <div className="pt-2 border-t flex gap-1.5">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedIncident.latitude},${selectedIncident.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 px-2 rounded-lg text-center flex items-center justify-center gap-1"
                      >
                        <Navigation className="h-3 w-3" /> Directions
                      </a>
                      <button
                        onClick={() => {}}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold py-1.5 px-2 rounded-lg text-center"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}

              {/* Interactive Shelter InfoWindow */}
              {selectedShelter && (
                <InfoWindow
                  position={{ lat: selectedShelter.latitude, lng: selectedShelter.longitude }}
                  onCloseClick={() => setSelectedShelter(null)}
                >
                  <div className="min-w-[220px] p-2 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                      {selectedShelter.type} Shelter
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{selectedShelter.name}</h3>
                    <p className="text-xs text-slate-500">📍 {selectedShelter.address}</p>
                    <div className="text-xs font-semibold text-slate-700 pt-1 border-t flex justify-between">
                      <span>Occupancy: {selectedShelter.occupied} / {selectedShelter.capacity}</span>
                      <span className="text-blue-600">{Math.round((selectedShelter.occupied / (selectedShelter.capacity || 1)) * 100)}% Full</span>
                    </div>
                  </div>
                </InfoWindow>
              )}

              {/* Interactive Unit InfoWindow */}
              {selectedUnit && (
                <InfoWindow
                  position={{
                    lat: selectedUnit.rescueAssignments[0]?.incident.latitude || mapCenter.lat,
                    lng: selectedUnit.rescueAssignments[0]?.incident.longitude || mapCenter.lng,
                  }}
                  onCloseClick={() => setSelectedUnit(null)}
                >
                  <div className="min-w-[200px] p-2 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Deployed Unit
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{selectedUnit.fullName}</h3>
                    <p className="text-xs text-slate-500">Phone: {selectedUnit.phone || "N/A"}</p>
                    <p className="text-xs text-blue-600 font-medium">Assigned to field operation</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>

            {/* Tactical Live Counters Pill */}
            <div className="absolute top-4 left-4 bg-white/95 shadow-md px-3.5 py-2 rounded-xl backdrop-blur-sm border border-slate-200 z-10 flex items-center gap-3 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-1.5 text-red-600">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                {incidents.length} Incidents
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5 text-purple-600">
                <Home className="h-3.5 w-3.5" />
                {shelters.length} Shelters
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <Truck className="h-3.5 w-3.5" />
                {rescueUnits.length} Units
              </div>
            </div>

            {/* Map Action Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
              <button
                onClick={handleMyLocation}
                className="h-10 w-10 bg-white hover:bg-slate-50 shadow-md rounded-xl flex items-center justify-center border border-slate-200 transition-colors text-blue-600"
                title="My GPS Location"
              >
                <Compass className="h-5 w-5" />
              </button>
              <button
                onClick={resetMap}
                className="h-10 w-10 bg-white hover:bg-slate-50 shadow-md rounded-xl flex items-center justify-center border border-slate-200 transition-colors text-slate-700"
                title="Reset View Extent"
              >
                <Crosshair className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tactical Command Sidebar & Incident Detail Feed (Right) */}
          <div className="w-full md:w-[420px] bg-slate-50 border-l border-slate-200 flex flex-col shrink-0 overflow-hidden">
            
            {/* Search & Filter Header */}
            <div className="p-3.5 bg-white border-b border-slate-200 space-y-2.5 shrink-0">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search incident, location, or shelter..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <select 
                  value={selectedDisasterFilter}
                  onChange={(e) => setSelectedDisasterFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 border-none outline-none cursor-pointer"
                >
                  <option value="ALL">All Disasters</option>
                  <option value="FLOOD">Flood</option>
                  <option value="EARTHQUAKE">Earthquake</option>
                  <option value="FIRE">Fire</option>
                  <option value="CYCLONE">Cyclone</option>
                  <option value="LANDSLIDE">Landslide</option>
                  <option value="OTHER">Other</option>
                </select>

                <select 
                  value={selectedSeverityFilter}
                  onChange={(e) => setSelectedSeverityFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 border-none outline-none cursor-pointer"
                >
                  <option value="ALL">All Severities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>

                <div className="flex items-center gap-1 ml-auto text-[11px] font-bold">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showIncidents} 
                      onChange={(e) => setShowIncidents(e.target.checked)} 
                      className="rounded text-red-600"
                    />
                    <span>Hazards</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer ml-2">
                    <input 
                      type="checkbox" 
                      checked={showShelters} 
                      onChange={(e) => setShowShelters(e.target.checked)} 
                      className="rounded text-purple-600"
                    />
                    <span>Shelters</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Tactical Incident Feed / Inspector */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
              {loading ? (
                <div className="py-16 text-center text-slate-500">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                  <p className="text-xs font-semibold">Aggregating incident telemetry...</p>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center">
                  <AlertTriangle className="h-6 w-6 mx-auto mb-1 text-red-500" />
                  <p className="text-xs font-bold">{error}</p>
                </div>
              ) : incidents.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-bold text-slate-700">No matching active hazards</p>
                  <p className="text-xs text-slate-400 mt-1">Check filters or adjust search parameters.</p>
                </div>
              ) : (
                incidents.map((inc) => {
                  const Icon = disasterIcons[inc.disasterType] || Zap;
                  const isSelected = selectedIncident?.id === inc.id;
                  const sevStyle = severityColors[inc.severity] || severityColors.MEDIUM;

                  return (
                    <div
                      key={inc.id}
                      onClick={() => {
                        setSelectedIncident(inc);
                        setSelectedShelter(null);
                        setSelectedUnit(null);
                        setMapCenter({ lat: inc.latitude, lng: inc.longitude });
                        setMapZoom(15);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer bg-white shadow-sm space-y-2.5 ${
                        isSelected 
                          ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md" 
                          : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border ${sevStyle.border} ${sevStyle.bg} ${sevStyle.text}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs leading-tight line-clamp-1">{inc.title}</h4>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{inc.disasterType}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wider ${sevStyle.bg} ${sevStyle.text} ${sevStyle.border}`}>
                          {inc.severity}
                        </span>
                      </div>

                      {inc.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {inc.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1 truncate max-w-[220px]">
                          <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                          {inc.address}
                        </span>
                        <span className="text-[10px] font-bold text-blue-600 hover:underline">
                          View Brief →
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>

        {/* FULL TACTICAL INCIDENT BRIEFING MODAL */}
        {selectedIncident && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
              
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
                <div className="flex items-start gap-3">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border ${severityColors[selectedIncident.severity]?.bg} ${severityColors[selectedIncident.severity]?.text} ${severityColors[selectedIncident.severity]?.border}`}>
                    {(() => {
                      const Icon = disasterIcons[selectedIncident.disasterType] || Zap;
                      return <Icon className="h-5 w-5" />;
                    })()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                        {selectedIncident.disasterType}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${severityColors[selectedIncident.severity]?.bg} ${severityColors[selectedIncident.severity]?.text} ${severityColors[selectedIncident.severity]?.border}`}>
                        {selectedIncident.severity} PRIORITY
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                        STATUS: {selectedIncident.status}
                      </span>
                    </div>
                    <h2 className="text-lg font-extrabold text-slate-900">{selectedIncident.title}</h2>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedIncident(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 flex-1">
                {/* Location & GPS Info */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Incident Location Coordinates</span>
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                      {selectedIncident.address}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Latitude: <strong className="text-slate-700">{selectedIncident.latitude.toFixed(5)}</strong>, Longitude: <strong className="text-slate-700">{selectedIncident.longitude.toFixed(5)}</strong>
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedIncident.latitude},${selectedIncident.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm shrink-0 transition-colors"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Navigate in Maps
                  </a>
                </div>

                {/* Situation Description */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Tactical Situation Report</h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                    {selectedIncident.description || "No situation description submitted with this report."}
                  </div>
                </div>

                {/* Recon Photos Gallery if available */}
                {selectedIncident.images && selectedIncident.images.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Reconnaissance & Field Photos</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedIncident.images.map((img) => (
                        <a key={img.id} href={img.imageUrl} target="_blank" rel="noreferrer" className="group relative rounded-xl overflow-hidden border">
                          <img src={img.imageUrl} alt="Field photo" className="h-28 w-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                            <ExternalLink className="h-4 w-4" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reporter & Contact Info */}
                {selectedIncident.reportedBy && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{selectedIncident.reportedBy.fullName}</p>
                        <p className="text-[10px] text-slate-500">Citizen Reporter</p>
                      </div>
                    </div>
                    {selectedIncident.reportedBy.phone && (
                      <a
                        href={`tel:${selectedIncident.reportedBy.phone}`}
                        className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" /> {selectedIncident.reportedBy.phone}
                      </a>
                    )}
                  </div>
                )}

                {/* Assigned Units */}
                {selectedIncident.assignments && selectedIncident.assignments.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Assigned Rescue Units</h3>
                    <div className="space-y-2">
                      {selectedIncident.assignments.map((asgn) => (
                        <div key={asgn.id} className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-emerald-600" />
                            <span className="font-bold text-slate-900">{asgn.rescueTeam.fullName}</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 uppercase">{asgn.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex flex-wrap gap-2 justify-end">
                <Link
                  href="/rescue/comms"
                  className="px-3 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <Radio className="h-3.5 w-3.5 text-blue-600" /> Tactical Comms
                </Link>
                <Link
                  href="/rescue/dispatcher"
                  className="px-3 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <Users className="h-3.5 w-3.5 text-purple-600" /> Dispatch Volunteers
                </Link>
                <Link
                  href="/rescue/missions"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Truck className="h-3.5 w-3.5" /> Go to Mission Board
                </Link>
              </div>

            </div>
          </div>
        )}

      </div>
    </APIProvider>
  );
}
